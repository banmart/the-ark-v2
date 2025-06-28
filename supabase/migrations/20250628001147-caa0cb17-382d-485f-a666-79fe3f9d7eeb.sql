
-- Enable required extensions for cron jobs and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the automated rewards cron job that runs every hour
SELECT cron.schedule(
  'automated-rewards-hourly',
  '0 * * * *', -- Run at the top of every hour
  $$
  SELECT
    net.http_post(
        url:='https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/automated-rewards',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWlsZ2FjYm1oZHRkeG5xamR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTM1MTksImV4cCI6MjA2NjQ2OTUxOX0.UZeO_YzLki7jWoXTYGoV0LIn4V_rifgkY5Vam1sArTw"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '", "trigger": "cron"}')::jsonb
    ) as request_id;
  $$
);

-- Create a table to track automation execution logs
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  operation TEXT NOT NULL,
  status TEXT NOT NULL,
  transaction_hash TEXT,
  gas_used BIGINT,
  error_message TEXT,
  details JSONB
);

-- Add RLS policy for automation logs (readable by everyone, but only system can insert)
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view automation logs" 
  ON public.automation_logs FOR SELECT 
  USING (true);

CREATE POLICY "System can insert automation logs" 
  ON public.automation_logs FOR INSERT 
  WITH CHECK (true);
