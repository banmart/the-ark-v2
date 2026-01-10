import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Public PulseChain RPC endpoints (no auth required)
const RPC_ENDPOINTS = [
  "https://rpc.pulsechain.com",
  "https://rpc-pulsechain.g4mm4.io",
  "https://pulsechain.publicnode.com",
];

// Track which endpoint is working
let currentEndpointIndex = 0;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60000; // 1 minute

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('cf-connecting-ip') || 
         'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  record.count++;
  return record.count > RATE_LIMIT;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds for blockchain data
const LONG_CACHE_TTL = 30000; // 30 seconds for static data

const CACHEABLE_METHODS = [
  'eth_chainId',
  'eth_blockNumber',
  'eth_getBalance',
  'eth_getCode',
  'eth_call',
  'eth_getTransactionReceipt',
  'eth_getLogs',
  'eth_getBlockByNumber',
];

const LONG_CACHE_METHODS = ['eth_chainId'];

function getCacheKey(body: any): string | null {
  if (Array.isArray(body)) return null;
  if (!body.method || !CACHEABLE_METHODS.includes(body.method)) return null;
  return JSON.stringify({ method: body.method, params: body.params });
}

function getCacheTTL(method: string): number {
  return LONG_CACHE_METHODS.includes(method) ? LONG_CACHE_TTL : CACHE_TTL;
}

function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > LONG_CACHE_TTL * 2) {
      cache.delete(key);
    }
  }
  // Also cleanup old rate limit entries
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  
  // Check rate limit
  if (isRateLimited(clientIP)) {
    console.log(`RPC Proxy: Rate limited ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const cacheKey = getCacheKey(body);
    
    if (cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < getCacheTTL(body.method)) {
        console.log(`RPC Proxy: Cache HIT for ${body.method}`);
        return new Response(JSON.stringify({ ...cached.data, id: body.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    console.log(`RPC Proxy: Forwarding ${body.method || 'batch'} request`);

    // Try endpoints with failover
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
      const endpointIndex = (currentEndpointIndex + attempt) % RPC_ENDPOINTS.length;
      const endpoint = RPC_ENDPOINTS[endpointIndex];
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Check for RPC-level errors
        if (data.error) {
          console.log(`RPC Proxy: RPC error from ${endpoint}:`, data.error);
          throw new Error(data.error.message || 'RPC error');
        }
        
        // Success - update preferred endpoint
        if (endpointIndex !== currentEndpointIndex) {
          currentEndpointIndex = endpointIndex;
          console.log(`RPC Proxy: Switched to endpoint ${endpoint}`);
        }
        
        if (cacheKey && data.result !== undefined) {
          cache.set(cacheKey, { data, timestamp: Date.now() });
        }
        
        if (Math.random() < 0.1) cleanupCache();
        
        console.log(`RPC Proxy: Response received for ${body.method || 'batch'}`);

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        lastError = err as Error;
        console.log(`RPC Proxy: Endpoint ${endpoint} failed: ${err.message}`);
        continue;
      }
    }
    
    // All endpoints failed
    throw lastError || new Error('All RPC endpoints failed');
    
  } catch (error) {
    console.error('RPC Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
