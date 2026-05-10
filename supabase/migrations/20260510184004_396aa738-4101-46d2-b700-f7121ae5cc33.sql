-- ============================================================
-- 1. PROFILES: prevent users from modifying financial/admin fields
-- ============================================================
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admin updates
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Allow trusted SECURITY DEFINER functions that opt-in via session flag
  IF current_setting('app.bypass_profile_protection', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF NEW.wallet_balance   IS DISTINCT FROM OLD.wallet_balance   OR
     NEW.bonus_balance    IS DISTINCT FROM OLD.bonus_balance    OR
     NEW.total_deposited  IS DISTINCT FROM OLD.total_deposited  OR
     NEW.total_winnings   IS DISTINCT FROM OLD.total_winnings   OR
     NEW.is_banned        IS DISTINCT FROM OLD.is_banned        OR
     NEW.signup_ip        IS DISTINCT FROM OLD.signup_ip        OR
     NEW.device_id        IS DISTINCT FROM OLD.device_id        OR
     NEW.referral_code    IS DISTINCT FROM OLD.referral_code    OR
     NEW.referred_by      IS DISTINCT FROM OLD.referred_by      OR
     NEW.id               IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Not allowed to modify protected profile fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_sensitive_fields_trg ON public.profiles;
CREATE TRIGGER protect_profile_sensitive_fields_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_sensitive_fields();

-- ============================================================
-- 2. TRANSACTIONS: only admins / SECURITY DEFINER funcs can insert
-- ============================================================
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;
-- (Admin ALL policy and user SELECT policy remain)

-- ============================================================
-- 3. NOTIFICATIONS: scope INSERT to self (admins/system bypass via existing policies / SECURITY DEFINER)
-- ============================================================
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications for themselves"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 4. UTR_SUBMISSIONS: force safe defaults on user inserts
-- ============================================================
CREATE OR REPLACE FUNCTION public.enforce_utr_safe_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Force safe values regardless of what client supplied
  NEW.status              := 'pending';
  NEW.verification_status := 'pending';
  NEW.processed_by        := NULL;
  NEW.processed_at        := NULL;
  NEW.admin_notes         := NULL;
  -- Keep fraud signals server-controlled; client cannot pre-set "clean" values
  NEW.fraud_score         := 0;
  NEW.fraud_flags         := '{}'::text[];
  NEW.is_suspicious       := false;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_utr_safe_defaults_trg ON public.utr_submissions;
CREATE TRIGGER enforce_utr_safe_defaults_trg
BEFORE INSERT ON public.utr_submissions
FOR EACH ROW EXECUTE FUNCTION public.enforce_utr_safe_defaults();

-- Run fraud detection AFTER insert and patch the row (admin still sees scores)
CREATE OR REPLACE FUNCTION public.score_utr_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fr jsonb;
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  fr := public.detect_utr_fraud(NEW.user_id, NEW.utr_number, NEW.amount);
  UPDATE public.utr_submissions
     SET fraud_score   = COALESCE((fr->>'fraud_score')::int, 0),
         fraud_flags   = COALESCE(ARRAY(SELECT jsonb_array_elements_text(fr->'fraud_flags')), '{}'::text[]),
         is_suspicious = COALESCE((fr->>'is_suspicious')::boolean, false)
   WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS score_utr_after_insert_trg ON public.utr_submissions;
CREATE TRIGGER score_utr_after_insert_trg
AFTER INSERT ON public.utr_submissions
FOR EACH ROW EXECUTE FUNCTION public.score_utr_after_insert();

-- ============================================================
-- 5. PARTICIPANTS: remove user UPDATE policy (kills/rank/prize/payment_status are admin-only)
-- ============================================================
DROP POLICY IF EXISTS "Users can update their own participant record" ON public.participants;

-- ============================================================
-- 6. Trusted withdrawal flow
-- ============================================================
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_amount numeric,
  p_payment_method_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_balance numeric;
  v_request_id uuid;
  v_has_method boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_amount IS NULL OR p_amount < 50 OR p_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid withdrawal amount';
  END IF;

  -- Confirm payment method belongs to user and has at least one channel
  SELECT (
    (COALESCE(NULLIF(TRIM(upi_id_1), ''), NULLIF(TRIM(upi_id_2), '')) IS NOT NULL)
    OR (NULLIF(TRIM(bank_account_no),'') IS NOT NULL AND NULLIF(TRIM(bank_ifsc),'') IS NOT NULL)
  )
  INTO v_has_method
  FROM public.user_payment_methods
  WHERE id = p_payment_method_id AND user_id = v_user_id;

  IF v_has_method IS NULL THEN
    RAISE EXCEPTION 'Payment method not found';
  END IF;
  IF NOT v_has_method THEN
    RAISE EXCEPTION 'Add a UPI ID or bank account before requesting a withdrawal';
  END IF;

  SELECT wallet_balance INTO v_balance
    FROM public.profiles WHERE id = v_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;
  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  INSERT INTO public.withdrawal_requests (user_id, amount, payment_method_id, status)
  VALUES (v_user_id, p_amount, p_payment_method_id, 'pending')
  RETURNING id INTO v_request_id;

  PERFORM set_config('app.bypass_profile_protection', 'on', true);
  UPDATE public.profiles
     SET wallet_balance = wallet_balance - p_amount
   WHERE id = v_user_id;
  PERFORM set_config('app.bypass_profile_protection', 'off', true);

  INSERT INTO public.transactions (user_id, amount, type, status, description)
  VALUES (v_user_id, p_amount, 'withdrawal', 'pending', 'Withdrawal request submitted');

  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    v_user_id,
    '💸 Withdrawal Request Submitted',
    'Your withdrawal request of ₹' || p_amount || ' has been submitted and is being processed. You''ll receive the money within 24-48 hours.',
    'payment'
  );

  RETURN v_request_id;
END;
$$;

REVOKE ALL ON FUNCTION public.request_withdrawal(numeric, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(numeric, uuid) TO authenticated;

-- ============================================================
-- 7. Trusted tournament-join flow
-- ============================================================
CREATE OR REPLACE FUNCTION public.join_tournament(
  p_tournament_id uuid,
  p_pubg_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_entry_fee numeric;
  v_tournament_title text;
  v_status text;
  v_max int;
  v_current int;
  v_balance numeric;
  v_existing uuid;
  v_participant_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_pubg_id IS NULL OR length(trim(p_pubg_id)) = 0 THEN
    RAISE EXCEPTION 'BGMI ID required';
  END IF;

  SELECT entry_fee, title, status, max_slots, current_slots
    INTO v_entry_fee, v_tournament_title, v_status, v_max, v_current
    FROM public.tournaments WHERE id = p_tournament_id;

  IF v_entry_fee IS NULL THEN
    RAISE EXCEPTION 'Tournament not found';
  END IF;
  IF v_status NOT IN ('upcoming', 'open') THEN
    RAISE EXCEPTION 'Tournament is not open for registration';
  END IF;
  IF v_current >= v_max THEN
    RAISE EXCEPTION 'Tournament is full';
  END IF;

  SELECT id INTO v_existing FROM public.participants
   WHERE tournament_id = p_tournament_id AND user_id = v_user_id;
  IF v_existing IS NOT NULL THEN
    RAISE EXCEPTION 'Already joined';
  END IF;

  SELECT wallet_balance INTO v_balance
    FROM public.profiles WHERE id = v_user_id FOR UPDATE;
  IF v_balance < v_entry_fee THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  PERFORM set_config('app.bypass_profile_protection', 'on', true);
  UPDATE public.profiles
     SET wallet_balance = wallet_balance - v_entry_fee,
         bgmi_id = COALESCE(NULLIF(bgmi_id, ''), trim(p_pubg_id))
   WHERE id = v_user_id;
  PERFORM set_config('app.bypass_profile_protection', 'off', true);

  INSERT INTO public.participants (tournament_id, user_id, pubg_id, payment_status)
  VALUES (p_tournament_id, v_user_id, trim(p_pubg_id), 'paid')
  RETURNING id INTO v_participant_id;

  INSERT INTO public.transactions (user_id, amount, type, status, description)
  VALUES (v_user_id, -v_entry_fee, 'entry_fee', 'success', 'Entry fee for ' || v_tournament_title);

  RETURN v_participant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.join_tournament(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_tournament(uuid, text) TO authenticated;