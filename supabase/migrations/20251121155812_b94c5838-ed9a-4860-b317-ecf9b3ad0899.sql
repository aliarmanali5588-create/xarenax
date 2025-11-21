-- Create function to send welcome notification to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert welcome notification for the new user
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to ArenaX! 🚀 Here''s how to Start',
    'Ready to dominate? Follow these steps:
1. Go to Wallet & Deposit money.
2. Browse Tournaments & click Join.
3. Get Room ID 15 mins before match.
4. Win & Withdraw instantly!

Check the ''How it Works'' page for more details.',
    'system'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to execute welcome function after profile creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome();