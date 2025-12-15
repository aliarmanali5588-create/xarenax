-- ============================================
-- ARENAX COMPLETE DATABASE MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CREATE ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- Profiles Table
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    ign TEXT,
    bgmi_id TEXT CHECK (bgmi_id ~ '^\d+$'), -- Only numeric values allowed
    wallet_balance NUMERIC NOT NULL DEFAULT 0,
    bonus_balance NUMERIC NOT NULL DEFAULT 0,
    total_deposited NUMERIC NOT NULL DEFAULT 0,
    total_winnings NUMERIC NOT NULL DEFAULT 0,
    referral_code TEXT NOT NULL,
    referred_by UUID,
    is_banned BOOLEAN NOT NULL DEFAULT false,
    signup_ip TEXT,
    last_ip TEXT,
    device_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Roles Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Tournaments Table
CREATE TABLE public.tournaments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    map TEXT NOT NULL,
    match_type TEXT NOT NULL,
    game_mode TEXT DEFAULT 'classic',
    entry_fee NUMERIC NOT NULL,
    prize_pool NUMERIC NOT NULL,
    per_kill_prize NUMERIC NOT NULL DEFAULT 0,
    max_slots INTEGER NOT NULL,
    current_slots INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'upcoming',
    tags TEXT[] DEFAULT '{}',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tournament Secrets Table
CREATE TABLE public.tournament_secrets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL,
    room_id TEXT NOT NULL,
    room_password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Participants Table
CREATE TABLE public.participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL,
    user_id UUID NOT NULL,
    pubg_id TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    kills INTEGER DEFAULT 0,
    rank INTEGER,
    prize_amount NUMERIC DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transactions Table
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- UTR Submissions Table
CREATE TABLE public.utr_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    utr_number TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    screenshot_url TEXT,
    fraud_score INTEGER DEFAULT 0,
    is_suspicious BOOLEAN DEFAULT false,
    fraud_flags TEXT[] DEFAULT '{}',
    verification_status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Withdrawal Requests Table
CREATE TABLE public.withdrawal_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    payment_method_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    processed_by UUID,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Payment Methods Table
CREATE TABLE public.user_payment_methods (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    upi_id_1 TEXT,
    upi_id_2 TEXT,
    bank_account_no TEXT,
    bank_ifsc TEXT,
    bank_name TEXT,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- UPI Payment Methods (Admin Configured)
CREATE TABLE public.upi_payment_methods (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    upi_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    qr_code_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications Table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification Preferences Table
CREATE TABLE public.notification_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    enable_match_notifications BOOLEAN DEFAULT true,
    enable_payment_notifications BOOLEAN DEFAULT true,
    enable_prize_notifications BOOLEAN DEFAULT true,
    enable_system_notifications BOOLEAN DEFAULT true,
    enable_affiliate_notifications BOOLEAN DEFAULT true,
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '08:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Push Subscriptions Table
CREATE TABLE public.push_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    subscription_data JSONB NOT NULL,
    device_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Support Tickets Table
CREATE TABLE public.support_tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT DEFAULT 'normal',
    admin_notes TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Platform Settings Table
CREATE TABLE public.platform_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utr_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upi_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: CREATE FUNCTIONS
-- ============================================

-- Has Role Function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Is Super Admin Function
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_email = 'ashadislam333@gmail.com';
$$;

-- Update Updated At Column Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- User Is Tournament Participant Function
CREATE OR REPLACE FUNCTION public.user_is_tournament_participant(p_tournament_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.participants
    WHERE tournament_id = p_tournament_id
      AND user_id = p_user_id
  )
$$;

-- Create User Profile Function
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id uuid, 
  p_username text, 
  p_ign text, 
  p_bgmi_id text, 
  p_device_id text, 
  p_signup_ip text, 
  p_referral_code text, 
  p_referred_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_user_id) INTO profile_exists;
  
  IF profile_exists THEN
    RETURN;
  END IF;

  INSERT INTO public.profiles (
    id, username, ign, bgmi_id, device_id, signup_ip, last_ip,
    wallet_balance, bonus_balance, referral_code, referred_by
  ) VALUES (
    p_user_id, p_username, p_ign, p_bgmi_id, p_device_id, p_signup_ip, p_signup_ip,
    0, 0, p_referral_code, p_referred_by
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Credit Referral Bonus Function
CREATE OR REPLACE FUNCTION public.credit_referral_bonus(referrer_id uuid, new_user_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET bonus_balance = bonus_balance + 10
  WHERE id = referrer_id;
  
  INSERT INTO public.transactions (user_id, amount, type, status, description)
  VALUES (referrer_id, 10, 'referral_signup_bonus', 'success', 'Referral signup bonus from ' || new_user_name);
  
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (referrer_id, '🎉 New Referral Signup!', 'Great news! ' || new_user_name || ' just signed up using your referral code. You earned ₹10 bonus!', 'affiliate');
END;
$$;

-- Handle Referral Signup Function
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id uuid;
  referrer_bonus_count integer;
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    referrer_id := NEW.referred_by;
    
    SELECT COUNT(*) INTO referrer_bonus_count
    FROM public.transactions
    WHERE user_id = referrer_id 
    AND type = 'referral_signup_bonus';
    
    IF referrer_bonus_count = 0 THEN
      UPDATE public.profiles
      SET bonus_balance = bonus_balance + 10
      WHERE id = referrer_id;
      
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (referrer_id, 10, 'referral_signup_bonus', 'success', 'Referral signup bonus from ' || COALESCE(NEW.username, 'new user'));
      
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (referrer_id, '🎉 New Referral Signup!', 'Great news! ' || COALESCE(NEW.username, 'A new user') || ' just signed up using your referral code. You earned ₹10 bonus!', 'affiliate');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Handle Referral Win Commission Function
CREATE OR REPLACE FUNCTION public.handle_referral_win_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  winner_profile RECORD;
  referrer_id uuid;
  commission_amount numeric;
BEGIN
  IF NEW.rank = 1 AND (OLD.rank IS NULL OR OLD.rank != 1) THEN
    SELECT * INTO winner_profile
    FROM public.profiles
    WHERE id = NEW.user_id;
    
    IF winner_profile.referred_by IS NOT NULL THEN
      referrer_id := winner_profile.referred_by;
      commission_amount := NEW.prize_amount * 0.10;
      
      UPDATE public.profiles
      SET wallet_balance = wallet_balance + commission_amount
      WHERE id = referrer_id;
      
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (referrer_id, commission_amount, 'referral_win_bonus', 'success', '10% referral commission from ' || COALESCE(winner_profile.username, 'referred user') || ' winning ₹' || NEW.prize_amount);
      
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (referrer_id, '💰 Referral Win Commission!', 'Awesome! ' || COALESCE(winner_profile.username, 'Your referred user') || ' just won ₹' || NEW.prize_amount || '! You earned ₹' || commission_amount || ' commission (10%)!', 'affiliate');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Handle New User Welcome Function
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    NEW.id,
    'Welcome to ArenaX! 🚀 Here''s how to Start',
    'Ready to dominate? Follow these steps:
1. Go to Wallet & Deposit money.
2. Browse Tournaments & click Join.
3. Get Room ID 15 mins before match.
4. Win & Withdraw instantly!

Check the ''How it Works'' page for more details.',
    'system'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.notifications 
    WHERE user_id = NEW.id 
    AND type = 'system' 
    AND title LIKE 'Welcome to ArenaX%'
  );
  
  RETURN NEW;
END;
$$;

-- Update Tournament Slots Function
CREATE OR REPLACE FUNCTION public.update_tournament_slots()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tournaments
    SET current_slots = current_slots + 1,
        status = CASE 
          WHEN current_slots + 1 >= max_slots THEN 'full'
          ELSE status
        END
    WHERE id = NEW.tournament_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tournaments
    SET current_slots = current_slots - 1,
        status = CASE 
          WHEN status = 'full' AND current_slots - 1 < max_slots THEN 'open'
          ELSE status
        END
    WHERE id = OLD.tournament_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Cancel Tournament Function
CREATE OR REPLACE FUNCTION public.cancel_tournament(match_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  entry_fee_amount numeric;
  user_rec record;
BEGIN
  SELECT entry_fee INTO entry_fee_amount FROM public.tournaments WHERE id = match_id;

  FOR user_rec IN (SELECT user_id FROM public.participants WHERE tournament_id = match_id AND payment_status = 'paid') 
  LOOP
    UPDATE public.profiles 
    SET wallet_balance = wallet_balance + entry_fee_amount 
    WHERE id = user_rec.user_id;

    INSERT INTO public.transactions (user_id, amount, type, status, description)
    VALUES (user_rec.user_id, entry_fee_amount, 'refund', 'success', 'Refund for cancelled tournament');

    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (user_rec.user_id, '❌ Match Cancelled', 'The tournament has been cancelled by Admin. Your ₹' || entry_fee_amount || ' entry fee has been refunded to your wallet.', 'system');
  END LOOP;

  UPDATE public.tournaments SET status = 'cancelled' WHERE id = match_id;
  DELETE FROM public.participants WHERE tournament_id = match_id;
END;
$$;

-- Check Duplicate UTR Function
CREATE OR REPLACE FUNCTION public.check_duplicate_utr(p_utr_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.utr_submissions 
    WHERE utr_number = p_utr_number 
    AND status != 'rejected'
  );
END;
$$;

-- Check Rapid Submissions Function
CREATE OR REPLACE FUNCTION public.check_rapid_submissions(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.utr_submissions 
    WHERE user_id = p_user_id 
    AND created_at > NOW() - INTERVAL '10 minutes'
  );
END;
$$;

-- Detect UTR Fraud Function
CREATE OR REPLACE FUNCTION public.detect_utr_fraud(p_user_id uuid, p_utr_number text, p_amount numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fraud_score INTEGER := 0;
  fraud_flags TEXT[] := '{}';
  is_duplicate BOOLEAN;
  rapid_count INTEGER;
BEGIN
  is_duplicate := public.check_duplicate_utr(p_utr_number);
  IF is_duplicate THEN
    fraud_score := fraud_score + 50;
    fraud_flags := array_append(fraud_flags, 'duplicate_utr');
  END IF;
  
  rapid_count := public.check_rapid_submissions(p_user_id);
  IF rapid_count >= 3 THEN
    fraud_score := fraud_score + 30;
    fraud_flags := array_append(fraud_flags, 'rapid_submission');
  END IF;
  
  SELECT COUNT(*) INTO rapid_count
  FROM public.utr_submissions
  WHERE user_id = p_user_id 
  AND amount = p_amount
  AND created_at > NOW() - INTERVAL '1 hour';
  
  IF rapid_count >= 2 THEN
    fraud_score := fraud_score + 20;
    fraud_flags := array_append(fraud_flags, 'repeated_amount');
  END IF;
  
  IF p_amount > 10000 THEN
    fraud_score := fraud_score + 15;
    fraud_flags := array_append(fraud_flags, 'large_amount');
  END IF;
  
  SELECT COUNT(*) INTO rapid_count
  FROM public.utr_submissions
  WHERE user_id = p_user_id 
  AND status = 'rejected'
  AND created_at > NOW() - INTERVAL '24 hours';
  
  IF rapid_count >= 2 THEN
    fraud_score := fraud_score + 25;
    fraud_flags := array_append(fraud_flags, 'multiple_rejections');
  END IF;
  
  RETURN jsonb_build_object(
    'fraud_score', fraud_score,
    'fraud_flags', fraud_flags,
    'is_suspicious', fraud_score >= 40
  );
END;
$$;

-- Is Referral Valid Function
CREATE OR REPLACE FUNCTION public.is_referral_valid(code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE referral_code = UPPER(TRIM(code))
  );
END;
$$;

-- Get Referrer ID Function
CREATE OR REPLACE FUNCTION public.get_referrer_id(code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_uuid uuid;
BEGIN
  SELECT id INTO referrer_uuid
  FROM public.profiles 
  WHERE referral_code = UPPER(TRIM(code));
  
  RETURN referrer_uuid;
END;
$$;

-- Get Affiliate Stats Function
CREATE OR REPLACE FUNCTION public.get_affiliate_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_signups integer;
  active_depositors integer;
  matches_played integer;
  total_earnings numeric;
BEGIN
  SELECT COUNT(*) INTO total_signups
  FROM profiles WHERE referred_by = p_user_id;
  
  SELECT COUNT(DISTINCT p.id) INTO active_depositors
  FROM profiles p
  WHERE p.referred_by = p_user_id AND p.total_deposited > 0;
  
  SELECT COUNT(*) INTO matches_played
  FROM participants pt
  INNER JOIN profiles p ON pt.user_id = p.id
  WHERE p.referred_by = p_user_id;
  
  SELECT COALESCE(SUM(amount), 0) INTO total_earnings
  FROM transactions
  WHERE user_id = p_user_id
  AND type IN ('referral_signup_bonus', 'referral_win_bonus');
  
  RETURN jsonb_build_object(
    'total_signups', total_signups,
    'active_depositors', active_depositors,
    'matches_played', matches_played,
    'total_earnings', total_earnings
  );
END;
$$;

-- Check Duplicate Accounts Function
CREATE OR REPLACE FUNCTION public.check_duplicate_accounts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  account_count integer;
  is_admin_device boolean;
BEGIN
  SELECT COUNT(*) INTO account_count
  FROM public.profiles
  WHERE (signup_ip = NEW.signup_ip AND NEW.signup_ip IS NOT NULL)
     OR (device_id = NEW.device_id AND NEW.device_id IS NOT NULL);

  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p
    INNER JOIN auth.users u ON p.id = u.id
    WHERE (p.signup_ip = NEW.signup_ip OR p.device_id = NEW.device_id)
    AND u.email = 'ashadislam333@gmail.com'
  ) INTO is_admin_device;

  IF is_admin_device THEN
    RETURN NEW;
  ELSE
    IF account_count >= 2 THEN
      RAISE EXCEPTION 'Maximum account limit (2) reached for this device.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Prevent Locked Payment Update Function
CREATE OR REPLACE FUNCTION public.prevent_locked_payment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_locked = true AND NEW.is_locked = true THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      NEW.upi_id_1 := OLD.upi_id_1;
      NEW.upi_id_2 := OLD.upi_id_2;
      NEW.bank_account_no := OLD.bank_account_no;
      NEW.bank_ifsc := OLD.bank_ifsc;
      NEW.bank_name := OLD.bank_name;
    END IF;
  END IF;
  
  IF NEW.is_locked = true AND OLD.is_locked = false THEN
    NEW.locked_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Handle Razorpay Success Function
CREATE OR REPLACE FUNCTION public.handle_razorpay_success(p_amount numeric, p_order_id text, p_payment_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  curr_user_id uuid;
BEGIN
  curr_user_id := auth.uid();
  
  IF curr_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  UPDATE public.profiles 
  SET wallet_balance = wallet_balance + p_amount,
      total_deposited = COALESCE(total_deposited, 0) + p_amount
  WHERE id = curr_user_id;

  INSERT INTO public.transactions (
    user_id, amount, type, status, razorpay_order_id, razorpay_payment_id, description
  ) VALUES (
    curr_user_id, p_amount, 'deposit', 'success', p_order_id, p_payment_id, 'Wallet Deposit via Razorpay'
  );

  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    curr_user_id,
    '💰 Deposit Successful!',
    'Your wallet has been credited with ₹' || p_amount || '. Happy Gaming!',
    'system'
  );
END;
$$;

-- Process New Referral Function
CREATE OR REPLACE FUNCTION public.process_new_referral(new_user_id uuid, code_used text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id uuid;
  rows_updated integer;
BEGIN
  SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = code_used;

  IF referrer_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET referred_by = referrer_id 
    WHERE id = new_user_id AND referred_by IS NULL;

    GET DIAGNOSTICS rows_updated = ROW_COUNT;

    IF rows_updated > 0 THEN
      UPDATE public.profiles SET bonus_balance = bonus_balance + 10 WHERE id = referrer_id;

      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (referrer_id, 10, 'referral_signup_bonus', 'success', 'Bonus for referring a new user');

      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (referrer_id, '🎉 New Referral Signup!', 'Great news! A new user just signed up using your referral code. You earned ₹10 bonus!', 'affiliate');
    END IF;
  END IF;
END;
$$;

-- ============================================
-- STEP 5: CREATE TRIGGERS
-- ============================================

-- Tournament Slots Trigger
CREATE TRIGGER update_tournament_slots_trigger
AFTER INSERT OR DELETE ON public.participants
FOR EACH ROW EXECUTE FUNCTION public.update_tournament_slots();

-- Referral Win Commission Trigger
CREATE TRIGGER handle_referral_win_commission_trigger
AFTER UPDATE ON public.participants
FOR EACH ROW EXECUTE FUNCTION public.handle_referral_win_commission();

-- Referral Signup Trigger
CREATE TRIGGER handle_referral_signup_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_referral_signup();

-- Welcome Notification Trigger
CREATE TRIGGER handle_new_user_welcome_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_welcome();

-- Duplicate Accounts Check Trigger
CREATE TRIGGER check_duplicate_accounts_trigger
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.check_duplicate_accounts();

-- Prevent Locked Payment Update Trigger
CREATE TRIGGER prevent_locked_payment_update_trigger
BEFORE UPDATE ON public.user_payment_methods
FOR EACH ROW EXECUTE FUNCTION public.prevent_locked_payment_update();

-- ============================================
-- STEP 6: CREATE RLS POLICIES
-- ============================================

-- PROFILES POLICIES
CREATE POLICY "Anyone can lookup referral codes" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_read_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- USER ROLES POLICIES
CREATE POLICY "Users can view their own role only" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own role" ON public.user_roles FOR INSERT WITH CHECK ((auth.uid() = user_id) AND (role = 'user'::app_role));
CREATE POLICY "Only super admin can insert roles" ON public.user_roles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'ashadislam333@gmail.com'));
CREATE POLICY "Only super admin can update roles" ON public.user_roles FOR UPDATE USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'ashadislam333@gmail.com'));
CREATE POLICY "Only super admin can delete roles" ON public.user_roles FOR DELETE USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'ashadislam333@gmail.com'));

-- TOURNAMENTS POLICIES
CREATE POLICY "Anyone can view open tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Admins can create tournaments" ON public.tournaments FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tournaments" ON public.tournaments FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tournaments" ON public.tournaments FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- TOURNAMENT SECRETS POLICIES
CREATE POLICY "Admins full access" ON public.tournament_secrets FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Paid participants can view tournament secrets" ON public.tournament_secrets FOR SELECT USING (EXISTS (SELECT 1 FROM participants WHERE tournament_id = tournament_secrets.tournament_id AND user_id = auth.uid() AND payment_status = 'paid'));

-- PARTICIPANTS POLICIES
CREATE POLICY "Users can view own participant records" ON public.participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view participants in their tournaments" ON public.participants FOR SELECT USING (user_is_tournament_participant(tournament_id, auth.uid()));
CREATE POLICY "Users can join tournaments" ON public.participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own participant record" ON public.participants FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all participants" ON public.participants FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all participants" ON public.participants FOR ALL USING (has_role(auth.uid(), 'admin'));

-- TRANSACTIONS POLICIES
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all transactions" ON public.transactions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- UTR SUBMISSIONS POLICIES
CREATE POLICY "Users can view own UTR" ON public.utr_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit UTR" ON public.utr_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all UTR" ON public.utr_submissions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- WITHDRAWAL REQUESTS POLICIES
CREATE POLICY "Users access own withdrawals" ON public.withdrawal_requests FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins access all" ON public.withdrawal_requests FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- USER PAYMENT METHODS POLICIES
CREATE POLICY "payment_read_own" ON public.user_payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payment_insert_own" ON public.user_payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payment_update_own" ON public.user_payment_methods FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payment_delete_own" ON public.user_payment_methods FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "payment_admin_all" ON public.user_payment_methods FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- UPI PAYMENT METHODS POLICIES
CREATE POLICY "Users can view active UPI methods" ON public.upi_payment_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage UPI methods" ON public.upi_payment_methods FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (has_role(auth.uid(), 'admin'));

-- NOTIFICATION PREFERENCES POLICIES
CREATE POLICY "Users can view their own notification preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notification preferences" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notification preferences" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all notification preferences" ON public.notification_preferences FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- PUSH SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view their own push subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own push subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own push subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all push subscriptions" ON public.push_subscriptions FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- SUPPORT TICKETS POLICIES
CREATE POLICY "Anyone can submit support tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON public.support_tickets FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tickets" ON public.support_tickets FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- PLATFORM SETTINGS POLICIES
CREATE POLICY "Admins can manage all settings" ON public.platform_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view public razorpay key" ON public.platform_settings FOR SELECT USING ((auth.uid() IS NOT NULL) AND (setting_key = 'razorpay_key_id'));

-- ============================================
-- STEP 7: CREATE STORAGE BUCKETS
-- ============================================

-- Payment Proofs Bucket (Private)
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);

-- QR Codes Bucket (Public)
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true);

-- Storage Policies for payment-proofs
CREATE POLICY "Users can upload payment proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own payment proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can view all payment proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Storage Policies for qr-codes
CREATE POLICY "Anyone can view QR codes" ON storage.objects FOR SELECT USING (bucket_id = 'qr-codes');
CREATE POLICY "Admins can upload QR codes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qr-codes' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete QR codes" ON storage.objects FOR DELETE USING (bucket_id = 'qr-codes' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- ============================================
-- STEP 8: INSERT SUPER ADMIN ROLE
-- After user signs up with email: ashadislam333@gmail.com
-- Run this to make them admin:
-- ============================================
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'ashadislam333@gmail.com'
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
