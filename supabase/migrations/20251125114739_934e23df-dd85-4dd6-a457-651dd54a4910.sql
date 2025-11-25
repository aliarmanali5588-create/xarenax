-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Add screenshot_url column to utr_submissions
ALTER TABLE public.utr_submissions
ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- RLS Policies for payment-proofs bucket

-- Users can upload their own payment screenshots
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own payment screenshots
CREATE POLICY "Users can view their own payment screenshots"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all payment screenshots
CREATE POLICY "Admins can view all payment screenshots"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-proofs'
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can delete payment screenshots
CREATE POLICY "Admins can delete payment screenshots"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payment-proofs'
  AND public.has_role(auth.uid(), 'admin')
);