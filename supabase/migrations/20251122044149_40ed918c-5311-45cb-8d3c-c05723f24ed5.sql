-- Create trigger on auth.users to call handle_new_user function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger on profiles to call handle_referral_signup function
DROP TRIGGER IF EXISTS on_profile_created_referral ON public.profiles;
CREATE TRIGGER on_profile_created_referral
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_signup();

-- Create trigger on participants to call handle_referral_win_commission function
DROP TRIGGER IF EXISTS on_participant_win ON public.participants;
CREATE TRIGGER on_participant_win
  AFTER UPDATE ON public.participants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_win_commission();

-- Also add trigger for duplicate account check
DROP TRIGGER IF EXISTS check_duplicate_accounts_trigger ON public.profiles;
CREATE TRIGGER check_duplicate_accounts_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_duplicate_accounts();

-- Add trigger for updating timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tournaments_updated_at ON public.tournaments;
CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_invitations_updated_at ON public.admin_invitations;
CREATE TRIGGER update_admin_invitations_updated_at
  BEFORE UPDATE ON public.admin_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for tournament slots management
DROP TRIGGER IF EXISTS update_slots_on_participant_change ON public.participants;
CREATE TRIGGER update_slots_on_participant_change
  AFTER INSERT OR DELETE ON public.participants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tournament_slots();

-- Add trigger for payment method locking
DROP TRIGGER IF EXISTS prevent_locked_payment_update_trigger ON public.user_payment_methods;
CREATE TRIGGER prevent_locked_payment_update_trigger
  BEFORE UPDATE ON public.user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_locked_payment_update();

-- Add trigger for welcome notification
DROP TRIGGER IF EXISTS send_welcome_notification ON public.profiles;
CREATE TRIGGER send_welcome_notification
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome();