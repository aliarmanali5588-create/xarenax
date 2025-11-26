-- Create table for multiple UPI payment methods
CREATE TABLE IF NOT EXISTS public.upi_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upi_id TEXT NOT NULL,
  qr_code_url TEXT,
  display_name TEXT NOT NULL, -- "UPI 1", "UPI 2", etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.upi_payment_methods ENABLE ROW LEVEL SECURITY;

-- Admins can manage all UPI methods
CREATE POLICY "Admins can manage UPI methods"
ON public.upi_payment_methods
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can view active UPI methods
CREATE POLICY "Users can view active UPI methods"
ON public.upi_payment_methods
FOR SELECT
TO authenticated
USING (is_active = true);

-- Add updated_at trigger
CREATE TRIGGER update_upi_payment_methods_updated_at
BEFORE UPDATE ON public.upi_payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();