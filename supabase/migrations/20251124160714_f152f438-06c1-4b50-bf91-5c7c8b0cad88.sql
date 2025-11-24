-- Fraud Detection Functions for UTR Submissions

-- 1. Check for duplicate UTR numbers
CREATE OR REPLACE FUNCTION public.check_duplicate_utr(p_utr_number TEXT)
RETURNS BOOLEAN
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

-- 2. Check for rapid submissions from same user
CREATE OR REPLACE FUNCTION public.check_rapid_submissions(p_user_id UUID)
RETURNS INTEGER
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

-- 3. Main Fraud Detection Function
CREATE OR REPLACE FUNCTION public.detect_utr_fraud(
  p_user_id UUID,
  p_utr_number TEXT,
  p_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fraud_score INTEGER := 0;
  fraud_flags TEXT[] := '{}';
  is_duplicate BOOLEAN;
  rapid_count INTEGER;
  recent_amount NUMERIC;
BEGIN
  -- Check for duplicate UTR
  is_duplicate := public.check_duplicate_utr(p_utr_number);
  IF is_duplicate THEN
    fraud_score := fraud_score + 50;
    fraud_flags := array_append(fraud_flags, 'duplicate_utr');
  END IF;
  
  -- Check for rapid submissions (more than 3 in 10 minutes)
  rapid_count := public.check_rapid_submissions(p_user_id);
  IF rapid_count >= 3 THEN
    fraud_score := fraud_score + 30;
    fraud_flags := array_append(fraud_flags, 'rapid_submission');
  END IF;
  
  -- Check for unusual amount patterns (same amount submitted multiple times)
  SELECT COUNT(*) INTO rapid_count
  FROM public.utr_submissions
  WHERE user_id = p_user_id 
  AND amount = p_amount
  AND created_at > NOW() - INTERVAL '1 hour';
  
  IF rapid_count >= 2 THEN
    fraud_score := fraud_score + 20;
    fraud_flags := array_append(fraud_flags, 'repeated_amount');
  END IF;
  
  -- Check for very large amounts (> 10000)
  IF p_amount > 10000 THEN
    fraud_score := fraud_score + 15;
    fraud_flags := array_append(fraud_flags, 'large_amount');
  END IF;
  
  -- Check if user has had rejected submissions recently
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