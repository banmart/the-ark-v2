import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PULSEX_SUBGRAPH_URL = 'https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex';
const ARK_TOKEN_ADDRESS = '0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67'.toLowerCase();
const ARK_PLS_PAIR_ADDRESS = '0x5f49421c0f74873bc02d0a912f171a030008f2c9'.toLowerCase();
const WPLS_ADDRESS = '0xA1077a294dDE1B09bB078844df40758a5D0f9a27'.toLowerCase();

// In-memory cache
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 30000; // 30 seconds

interface GraphQLResponse {
  data?: {
    token?: {
      derivedETH: string;
      tradeVolumeUSD: string;
      totalLiquidity: string;
      txCount: string;
    };
    pair?: {
      reserve0: string;
      reserve1: string;
      reserveUSD: string;
      volumeUSD: string;
      token0: { id: string; symbol: string };
      token1: { id: string; symbol: string };
      token0Price: string;
      token1Price: string;
    };
    bundle?: {
      ethPrice: string;
    };
    pairDayDatas?: Array<{
      date: number;
      dailyVolumeUSD: string;
      reserveUSD: string;
    }>;
    tokenDayDatas?: Array<{
      date: number;
      priceUSD: string;
      dailyVolumeUSD: string;
    }>;
  };
  errors?: Array<{ message: string }>;
}

async function querySubgraph(): Promise<GraphQLResponse> {
  const query = `{
    token(id: "${ARK_TOKEN_ADDRESS}") {
      derivedETH
      tradeVolumeUSD
      totalLiquidity
      txCount
    }
    pair(id: "${ARK_PLS_PAIR_ADDRESS}") {
      reserve0
      reserve1
      reserveUSD
      volumeUSD
      token0 { id symbol }
      token1 { id symbol }
      token0Price
      token1Price
    }
    bundle(id: "1") {
      ethPrice
    }
    pairDayDatas(
      where: { pair: "${ARK_PLS_PAIR_ADDRESS}" }
      orderBy: date
      orderDirection: desc
      first: 30
    ) {
      date
      dailyVolumeUSD
      reserveUSD
    }
    tokenDayDatas(
      where: { token: "${ARK_TOKEN_ADDRESS}" }
      orderBy: date
      orderDirection: desc
      first: 30
    ) {
      date
      priceUSD
      dailyVolumeUSD
    }
  }`;

  console.log('Querying PulseX subgraph...');
  
  const response = await fetch(PULSEX_SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors && result.errors.length > 0) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
  }

  return result;
}

function processGraphQLData(response: GraphQLResponse) {
  const { token, pair, bundle, pairDayDatas, tokenDayDatas } = response.data || {};
  
  // Get PLS price in USD (ethPrice in PulseChain context is PLS price)
  const plsUsdPrice = bundle?.ethPrice ? parseFloat(bundle.ethPrice) : 0;
  
  // Calculate ARK price
  let arkPriceUSD = 0;
  let arkPricePLS = 0;
  
  if (token?.derivedETH && plsUsdPrice > 0) {
    arkPricePLS = parseFloat(token.derivedETH);
    arkPriceUSD = arkPricePLS * plsUsdPrice;
  } else if (pair) {
    // Fallback: calculate from pair reserves
    const isToken0ARK = pair.token0.id.toLowerCase() === ARK_TOKEN_ADDRESS;
    if (isToken0ARK) {
      arkPricePLS = parseFloat(pair.token1Price); // PLS per ARK
    } else {
      arkPricePLS = parseFloat(pair.token0Price);
    }
    arkPriceUSD = arkPricePLS * plsUsdPrice;
  }
  
  // Get 24h volume from pair day data
  let volume24hUSD = 0;
  if (pairDayDatas && pairDayDatas.length > 0) {
    // Most recent day's volume
    volume24hUSD = parseFloat(pairDayDatas[0].dailyVolumeUSD);
  }
  
  // Get liquidity
  const liquidityUSD = pair?.reserveUSD ? parseFloat(pair.reserveUSD) : 0;
  
  // Calculate 24h price change from token day data
  let priceChange24h = 0;
  if (tokenDayDatas && tokenDayDatas.length >= 2) {
    const todayPrice = parseFloat(tokenDayDatas[0].priceUSD);
    const yesterdayPrice = parseFloat(tokenDayDatas[1].priceUSD);
    if (yesterdayPrice > 0) {
      priceChange24h = ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100;
    }
  }
  
  // Build historical price data for charts
  const priceHistory = (tokenDayDatas || []).map(day => ({
    date: day.date,
    priceUSD: parseFloat(day.priceUSD),
    volumeUSD: parseFloat(day.dailyVolumeUSD),
  })).reverse(); // Oldest first for charts
  
  const volumeHistory = (pairDayDatas || []).map(day => ({
    date: day.date,
    volumeUSD: parseFloat(day.dailyVolumeUSD),
    liquidityUSD: parseFloat(day.reserveUSD),
  })).reverse();

  return {
    // Current prices
    arkPriceUSD,
    arkPricePLS,
    plsUsdPrice,
    
    // Market data
    volume24hUSD,
    liquidityUSD,
    priceChange24h,
    
    // Token stats
    totalVolumeUSD: token?.tradeVolumeUSD ? parseFloat(token.tradeVolumeUSD) : 0,
    totalLiquidity: token?.totalLiquidity ? parseFloat(token.totalLiquidity) : 0,
    txCount: token?.txCount ? parseInt(token.txCount) : 0,
    
    // Pair reserves
    reserves: pair ? {
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0: pair.token0,
      token1: pair.token1,
    } : null,
    
    // Historical data
    priceHistory,
    volumeHistory,
    
    // Metadata
    timestamp: Date.now(),
    source: 'PulseX Subgraph',
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache first
    if (cache && (Date.now() - cache.timestamp) < CACHE_TTL_MS) {
      console.log('Returning cached PulseX data');
      return new Response(JSON.stringify({
        ...cache.data,
        cached: true,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Query the subgraph
    const graphqlResponse = await querySubgraph();
    const processedData = processGraphQLData(graphqlResponse);
    
    // Update cache
    cache = {
      data: processedData,
      timestamp: Date.now(),
    };

    console.log('PulseX data fetched successfully:', {
      arkPriceUSD: processedData.arkPriceUSD.toFixed(8),
      plsUsdPrice: processedData.plsUsdPrice.toFixed(8),
      volume24hUSD: processedData.volume24hUSD.toFixed(2),
      liquidityUSD: processedData.liquidityUSD.toFixed(2),
    });

    return new Response(JSON.stringify({
      ...processedData,
      cached: false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PulseX GraphQL error:', error);
    
    // Return cached data on error if available
    if (cache) {
      console.log('Returning stale cache due to error');
      return new Response(JSON.stringify({
        ...cache.data,
        cached: true,
        stale: true,
        error: error.message,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to fetch PulseX data',
      message: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
