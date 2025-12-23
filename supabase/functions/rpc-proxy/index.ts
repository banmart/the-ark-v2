import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPEEDYNODES_RPC = "https://api.speedynodes.net/http/pulsechain-http?apikey=17666dccac3cdb9d244b413bab8cf3204a25461f";

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds for blockchain data
const LONG_CACHE_TTL = 30000; // 30 seconds for static data like chainId

// Methods that are safe to cache (read-only)
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

// Methods that need longer caching (rarely change)
const LONG_CACHE_METHODS = ['eth_chainId'];

function getCacheKey(body: any): string | null {
  if (Array.isArray(body)) return null; // Don't cache batch requests
  if (!body.method || !CACHEABLE_METHODS.includes(body.method)) return null;
  return JSON.stringify({ method: body.method, params: body.params });
}

function getCacheTTL(method: string): number {
  return LONG_CACHE_METHODS.includes(method) ? LONG_CACHE_TTL : CACHE_TTL;
}

// Clean up old cache entries periodically
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > LONG_CACHE_TTL * 2) {
      cache.delete(key);
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const cacheKey = getCacheKey(body);
    
    // Check cache for single requests
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

    const response = await fetch(SPEEDYNODES_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Cache the response for cacheable single requests
    if (cacheKey && data.result !== undefined && !data.error) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log(`RPC Proxy: Cached ${body.method}`);
    }
    
    // Cleanup old cache entries occasionally
    if (Math.random() < 0.1) {
      cleanupCache();
    }
    
    console.log(`RPC Proxy: Response received for ${body.method || 'batch'}`);

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('RPC Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
