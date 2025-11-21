-- Fix security warning: Set search_path for prevent_locked_payment_update function

CREATE OR REPLACE FUNCTION public.prevent_locked_payment_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_locked = true AND NEW.is_locked = true THEN
    -- Only allow admin to update locked fields
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      -- Prevent changes to payment details when locked
      NEW.upi_id_1 := OLD.upi_id_1;
      NEW.upi_id_2 := OLD.upi_id_2;
      NEW.bank_account_no := OLD.bank_account_no;
      NEW.bank_ifsc := OLD.bank_ifsc;
      NEW.bank_name := OLD.bank_name;
    END IF;
  END IF;
  
  -- Set locked_at when locking
  IF NEW.is_locked = true AND OLD.is_locked = false THEN
    NEW.locked_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;