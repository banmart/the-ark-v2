import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PULSEX_SUBGRAPH_URL = 'https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex';
const ARK_TOKEN_ADDRESS = '0xF4a370e64DD4673BAA250C5435100FA98661Db4C'.toLowerCase();
const WPLS_ADDRESS = '0xA1077a294dDE1B09bB078844df40758a5D0f9a27'.toLowerCase();

// WPLS/DAI pair for PLS price reference
const WPLS_DAI_PAIR = '0xe56043671df55de5cdf8459710433c10324de0ae'.toLowerCase();

// Extended cache
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 60000;

interface PairData {
  id: string;
  reserve0: string;
  reserve1: string;
  reserveUSD: string;
  volumeUSD: string;
  token0: { id: string; symbol: string; name: string };
  token1: { id: string; symbol: string; name: string };
  token0Price: string;
  token1Price: string;
}

// Fetch pairs by token address as primary method
async function fetchByTokenAddress(): Promise<{ arkPair: PairData | null; plsPrice: number }> {
  const query = `{
    pairs0: pairs(first: 5, where: { token0: "${ARK_TOKEN_ADDRESS}" }, orderBy: reserveUSD, orderDirection: desc) {
      id
      reserve0
      reserve1
      reserveUSD
      volumeUSD
      token0 { id symbol name }
      token1 { id symbol name }
      token0Price
      token1Price
    }
    pairs1: pairs(first: 5, where: { token1: "${ARK_TOKEN_ADDRESS}" }, orderBy: reserveUSD, orderDirection: desc) {
      id
      reserve0
      reserve1
      reserveUSD
      volumeUSD
      token0 { id symbol name }
      token1 { id symbol name }
      token0Price
      token1Price
    }
    plsPair: pair(id: "${WPLS_DAI_PAIR}") {
      token0 { id symbol }
      token1 { id symbol }
      token0Price
      token1Price
    }
  }`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(PULSEX_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    }

    console.log('Query response:', JSON.stringify({
      pairs0Count: result.data?.pairs0?.length || 0,
      pairs1Count: result.data?.pairs1?.length || 0,
      hasPLSPair: !!result.data?.plsPair
    }));

    let plsPrice = 0.00003;
    if (result.data?.plsPair) {
      const pair = result.data.plsPair;
      const isToken0DAI = pair.token0.symbol === 'DAI' || pair.token0.symbol === 'USDC';
      plsPrice = isToken0DAI 
        ? parseFloat(pair.token0Price)
        : parseFloat(pair.token1Price);
      if (plsPrice <= 0 || isNaN(plsPrice)) plsPrice = 0.00003;
      console.log('PLS price:', plsPrice);
    }

    const allPairs: PairData[] = [
      ...(result.data?.pairs0 || []),
      ...(result.data?.pairs1 || [])
    ];

    console.log('Found ARK pairs:', allPairs.map(p => ({ id: p.id, reserveUSD: p.reserveUSD })));

    let arkPair: PairData | null = null;
    if (allPairs.length > 0) {
      arkPair = allPairs.reduce((best, current) => {
        const bestLiq = parseFloat(best.reserveUSD) || 0;
        const currentLiq = parseFloat(current.reserveUSD) || 0;
        return currentLiq > bestLiq ? current : best;
      }, allPairs[0]);
      console.log('Selected pair:', arkPair.id, 'with liquidity:', arkPair.reserveUSD);
    }

    return { arkPair, plsPrice };
  } catch (error) {
    console.error('Error fetching by token address:', error);
    return { arkPair: null, plsPrice: 0.00003 };
  }
}

function processGraphQLData(pair: PairData, plsUsdPrice: number) {
  const isToken0ARK = pair.token0.id.toLowerCase() === ARK_TOKEN_ADDRESS;

  const token0Symbol = (pair.token0.symbol || '').toUpperCase();
  const token1Symbol = (pair.token1.symbol || '').toUpperCase();
  const counterSymbol = isToken0ARK ? token1Symbol : token0Symbol;
  const counterIsStable = ['DAI', 'USDC', 'USDT'].includes(counterSymbol);

  const arkPriceInCounter = isToken0ARK
    ? parseFloat(pair.token0Price)
    : parseFloat(pair.token1Price);

  const arkReserve = parseFloat(isToken0ARK ? pair.reserve0 : pair.reserve1);
  const counterReserve = parseFloat(isToken0ARK ? pair.reserve1 : pair.reserve0);

  let arkPriceUSD: number;
  if (counterIsStable) {
    arkPriceUSD = arkPriceInCounter;
  } else if (counterSymbol === 'WPLS' || counterSymbol === 'PLS') {
    arkPriceUSD = arkPriceInCounter * plsUsdPrice;
  } else {
    const totalLiquidityUSD = parseFloat(pair.reserveUSD) || 0;
    arkPriceUSD = arkReserve > 0 ? (totalLiquidityUSD / 2) / arkReserve : 0;
  }

  const arkPricePLS = plsUsdPrice > 0 ? arkPriceUSD / plsUsdPrice : 0;
  const liquidityUSD = pair.reserveUSD ? parseFloat(pair.reserveUSD) : 0;

  console.log('Processed data:', {
    isToken0ARK,
    counterSymbol,
    arkPriceInCounter,
    arkPriceUSD,
    liquidityUSD
  });

  return {
    arkPriceUSD,
    arkPricePLS,
    plsUsdPrice,
    volume24hUSD: 0,
    liquidityUSD,
    priceChange24h: 0,
    reserves: {
      arkReserve,
      plsReserve: counterReserve,
      token0: pair.token0,
      token1: pair.token1,
    },
    volumeHistory: [],
    totalVolumeUSD: parseFloat(pair.volumeUSD) || 0,
    pairAddress: pair.id,
    timestamp: Date.now(),
    source: 'PulseX Subgraph',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (cache && (Date.now() - cache.timestamp) < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ ...cache.data, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching ARK data from PulseX subgraph...');

    const { arkPair, plsPrice } = await fetchByTokenAddress();
    
    if (!arkPair) {
      console.warn('No ARK pair found in subgraph');
      const errorPayload = {
        arkPriceUSD: 0,
        arkPricePLS: 0,
        plsUsdPrice: plsPrice,
        volume24hUSD: 0,
        liquidityUSD: 0,
        priceChange24h: 0,
        totalVolumeUSD: 0,
        reserves: null,
        volumeHistory: [],
        timestamp: Date.now(),
        source: 'PulseX Subgraph',
        error: 'ARK pair not indexed yet - the token may be new',
      };
      return new Response(JSON.stringify(errorPayload), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processedData = processGraphQLData(arkPair, plsPrice);
    cache = { data: processedData, timestamp: Date.now() };

    console.log('Success! ARK price:', processedData.arkPriceUSD.toFixed(8));

    return new Response(JSON.stringify({ ...processedData, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    if (cache) {
      return new Response(JSON.stringify({ ...cache.data, cached: true, stale: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
