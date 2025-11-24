-- Create table for UTR submissions
CREATE TABLE IF NOT EXISTS public.utr_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  utr_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  admin_notes TEXT
);

-- Enable RLS
ALTER TABLE public.utr_submissions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own UTR submissions
CREATE POLICY "Users can submit UTR"
ON public.utr_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own UTR submissions
CREATE POLICY "Users can view own UTR"
ON public.utr_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all UTR submissions
CREATE POLICY "Admins manage all UTR"
ON public.utr_submissions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));