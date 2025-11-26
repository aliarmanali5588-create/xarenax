-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload QR codes
CREATE POLICY "Admins can upload QR codes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'qr-codes' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to update QR codes
CREATE POLICY "Admins can update QR codes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'qr-codes' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to delete QR codes
CREATE POLICY "Admins can delete QR codes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'qr-codes' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow public to view QR codes
CREATE POLICY "Anyone can view QR codes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'qr-codes');