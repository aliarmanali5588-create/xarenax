-- Create cancel_tournament function with automatic refunds
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
  -- 1. Get the Entry Fee for this match
  SELECT entry_fee INTO entry_fee_amount FROM public.tournaments WHERE id = match_id;

  -- 2. Loop through all participants of this match
  FOR user_rec IN (SELECT user_id FROM public.participants WHERE tournament_id = match_id AND payment_status = 'paid') 
  LOOP
    -- A. Refund Money to Wallet
    UPDATE public.profiles 
    SET wallet_balance = wallet_balance + entry_fee_amount 
    WHERE id = user_rec.user_id;

    -- B. Record Refund Transaction
    INSERT INTO public.transactions (user_id, amount, type, status, description)
    VALUES (user_rec.user_id, entry_fee_amount, 'refund', 'success', 'Refund for cancelled tournament');

    -- C. Send Apology Notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (user_rec.user_id, '❌ Match Cancelled', 'The tournament has been cancelled by Admin. Your ₹' || entry_fee_amount || ' entry fee has been refunded to your wallet.', 'system');
  END LOOP;

  -- 3. Update Tournament Status
  UPDATE public.tournaments SET status = 'cancelled' WHERE id = match_id;
  
  -- 4. Clear Participants (keeps data clean)
  DELETE FROM public.participants WHERE tournament_id = match_id;
END;
$$;