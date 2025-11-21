-- ============================================
-- ArenaX Complete Database Schema
-- ============================================

-- 1. Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- 2. Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  wallet_balance DECIMAL(10, 2) DEFAULT 0 NOT NULL CHECK (wallet_balance >= 0),
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.profiles(id),
  is_banned BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create user_roles table (CRITICAL: Roles in separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- 5. Create user_payment_methods table with locking mechanism
CREATE TABLE public.user_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  upi_id_1 TEXT,
  upi_id_2 TEXT,
  bank_account_no TEXT,
  bank_ifsc TEXT,
  bank_name TEXT,
  is_locked BOOLEAN DEFAULT false NOT NULL,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  map TEXT NOT NULL CHECK (map IN ('Erangel', 'Livik', 'Miramar', 'Sanhok')),
  match_type TEXT NOT NULL CHECK (match_type IN ('Solo', 'Duo', 'Squad')),
  entry_fee DECIMAL(10, 2) NOT NULL CHECK (entry_fee >= 0),
  prize_pool DECIMAL(10, 2) NOT NULL CHECK (prize_pool >= 0),
  per_kill_prize DECIMAL(10, 2) DEFAULT 0 NOT NULL CHECK (per_kill_prize >= 0),
  max_slots INTEGER NOT NULL CHECK (max_slots > 0),
  current_slots INTEGER DEFAULT 0 NOT NULL CHECK (current_slots >= 0),
  start_time TIMESTAMPTZ NOT NULL,
  room_id TEXT,
  room_password TEXT,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'full', 'live', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CHECK (current_slots <= max_slots)
);

-- 7. Create participants table
CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pubg_id TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  kills INTEGER DEFAULT 0 CHECK (kills >= 0),
  rank INTEGER CHECK (rank > 0),
  prize_amount DECIMAL(10, 2) DEFAULT 0 CHECK (prize_amount >= 0),
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(tournament_id, user_id)
);

-- 8. Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'entry_fee', 'winning', 'referral_bonus', 'refund')),
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 9. Create withdrawal_requests table
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 110 AND amount <= 10000),
  payment_method_id UUID REFERENCES public.user_payment_methods(id) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_start_time ON public.tournaments(start_time);
CREATE INDEX idx_participants_tournament_id ON public.participants(tournament_id);
CREATE INDEX idx_participants_user_id ON public.participants(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile (not wallet or ban status)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    wallet_balance = (SELECT wallet_balance FROM public.profiles WHERE id = auth.uid()) AND
    is_banned = (SELECT is_banned FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES POLICIES
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- USER_PAYMENT_METHODS POLICIES
CREATE POLICY "Users can view their own payment methods"
  ON public.user_payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON public.user_payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT is_locked);

CREATE POLICY "Users can update their own unlocked payment methods"
  ON public.user_payment_methods FOR UPDATE
  USING (auth.uid() = user_id AND NOT is_locked)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment methods"
  ON public.user_payment_methods FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payment methods (including lock status)"
  ON public.user_payment_methods FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- TOURNAMENTS POLICIES
CREATE POLICY "Anyone can view open tournaments"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Admins can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tournaments"
  ON public.tournaments FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tournaments"
  ON public.tournaments FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- PARTICIPANTS POLICIES
CREATE POLICY "Users can view participants of tournaments they joined"
  ON public.participants FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.participants p
      WHERE p.tournament_id = participants.tournament_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join tournaments"
  ON public.participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant record"
  ON public.participants FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all participants"
  ON public.participants FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- TRANSACTIONS POLICIES
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all transactions"
  ON public.transactions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- WITHDRAWAL_REQUESTS POLICIES
CREATE POLICY "Users can view their own withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON public.withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update withdrawal requests"
  ON public.withdrawal_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- HELPER FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_payment_methods_updated_at
  BEFORE UPDATE ON public.user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_code TEXT;
BEGIN
  -- Generate unique referral code
  generated_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  -- Insert profile
  INSERT INTO public.profiles (id, username, full_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generated_code
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to prevent locked payment method updates
CREATE OR REPLACE FUNCTION public.prevent_locked_payment_update()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Trigger to enforce payment method locking
CREATE TRIGGER enforce_payment_lock
  BEFORE UPDATE ON public.user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_locked_payment_update();

-- Function to update tournament slots
CREATE OR REPLACE FUNCTION public.update_tournament_slots()
RETURNS TRIGGER
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

-- Trigger to auto-update tournament slots
CREATE TRIGGER update_slots_on_participant_change
  AFTER INSERT OR DELETE ON public.participants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tournament_slots();