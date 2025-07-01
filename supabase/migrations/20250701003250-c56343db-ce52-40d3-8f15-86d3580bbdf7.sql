
-- Remove the existing automated-rewards cron job
SELECT cron.unschedule('automated-rewards-hourly');

-- Create new cron jobs with different schedules
-- Automated Rewards every 4 hours
SELECT cron.schedule(
  'automated-rewards-4h',
  '0 */4 * * *', -- Run every 4 hours
  $$
  SELECT
    net.http_post(
        url:='https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/automated-rewards',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWlsZ2FjYm1oZHRkeG5xamR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTM1MTksImV4cCI6MjA2NjQ2OTUxOX0.UZeO_YzLki7jWoXTYGoV0LIn4V_rifgkY5Vam1sArTw"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '", "trigger": "cron", "operation": "distribute_rewards"}')::jsonb
    ) as request_id;
  $$
);

-- Manual Swap and Liquify every 6 hours
SELECT cron.schedule(
  'manual-swap-liquify-6h',
  '0 */6 * * *', -- Run every 6 hours
  $$
  SELECT
    net.http_post(
        url:='https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/automated-rewards',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWlsZ2FjYm1oZHRkeG5xamR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTM1MTksImV4cCI6MjA2NjQ2OTUxOX0.UZeO_YzLki7jWoXTYGoV0LIn4V_rifgkY5Vam1sArTw"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '", "trigger": "cron", "operation": "swap_and_liquify"}')::jsonb
    ) as request_id;
  $$
);

-- Manual Burn LP every 8 hours
SELECT cron.schedule(
  'manual-burn-lp-8h',
  '0 */8 * * *', -- Run every 8 hours
  $$
  SELECT
    net.http_post(
        url:='https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/automated-rewards',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWlsZ2FjYm1oZHRkeG5xamR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTM1MTksImV4cCI6MjA2NjQ2OTUxOX0.UZeO_YzLki7jWoXTYGoV0LIn4V_rifgkY5Vam1sArTw"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '", "trigger": "cron", "operation": "burn_lp"}')::jsonb
    ) as request_id;
  $$
);
