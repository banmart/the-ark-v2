-- Cache table for ARK token metrics
CREATE TABLE IF NOT EXISTS public.ark_token_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type text NOT NULL UNIQUE, -- 'market', 'blockchain', 'locker', 'price_history'
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ark_cache_type_expires ON public.ark_token_cache(data_type, expires_at);

-- Enable RLS
ALTER TABLE public.ark_token_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access (since this is public blockchain data)
CREATE POLICY "Allow public read access to cache" ON public.ark_token_cache 
  FOR SELECT 
  USING (true);

-- Allow service role to insert/update
CREATE POLICY "Allow service insert cache" ON public.ark_token_cache 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow service update cache" ON public.ark_token_cache 
  FOR UPDATE 
  USING (true);

-- Function to upsert cache data
CREATE OR REPLACE FUNCTION public.upsert_ark_cache(
  p_data_type text,
  p_data jsonb,
  p_ttl_minutes integer DEFAULT 15
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ark_token_cache (data_type, data, expires_at, updated_at)
  VALUES (
    p_data_type,
    p_data,
    now() + (p_ttl_minutes || ' minutes')::interval,
    now()
  )
  ON CONFLICT (data_type)
  DO UPDATE SET
    data = EXCLUDED.data,
    expires_at = EXCLUDED.expires_at,
    updated_at = EXCLUDED.updated_at;
END;
$$;