-- Remove unused tables in dependency order to avoid foreign key constraint errors
DROP TABLE IF EXISTS public.transaction_logs;
DROP TABLE IF EXISTS public.transaction_jobs;  
DROP TABLE IF EXISTS public.testbot_wallets;