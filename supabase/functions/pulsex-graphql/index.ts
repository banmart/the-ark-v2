import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PULSEX_SUBGRAPH_URL = 'https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex';
const ARK_TOKEN_ADDRESS = '0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67'.toLowerCase();
const WPLS_ADDRESS = '0xA1077a294dDE1B09bB078844df40758a5D0f9a27'.toLowerCase();

// Known pair addresses from the app config (may not be indexed by the subgraph)
const ARK_PLS_PAIR = '0x5f49421c0f74873bc02d0a912f171a030008f2c9'.toLowerCase();
const ARK_DAI_PAIR = '0x03f0bdb4f14e76a35a39ef0ffd87c8bb6d451366'.toLowerCase();

// In-memory cache
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 30000; // 30 seconds

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

interface GraphQLResponse {
  data?: {
    pairs?: PairData[];
    pair?: PairData;
  };
  errors?: Array<{ message: string }>;
}

async function fetchPairById(pairId: string): Promise<PairData | null> {
  const query = `{
    pair(id: "${pairId}") {
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
  }`;

  try {
    const response = await fetch(PULSEX_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result: GraphQLResponse = await response.json();

    if (result.errors) {
      console.error('GraphQL errors fetching pair by id:', { pairId, errors: result.errors });
      return null;
    }

    return result.data?.pair ?? null;
  } catch (error) {
    console.error('Error fetching pair by id:', { pairId, error });
    return null;
  }
}

// Search for pairs containing ARK token
async function findARKPairs(): Promise<PairData | null> {
  // First try the known pair ids (fast + most reliable if indexed)
  console.log('Trying known ARK pair ids...');
  const [knownPls, knownDai] = await Promise.all([
    fetchPairById(ARK_PLS_PAIR),
    fetchPairById(ARK_DAI_PAIR),
  ]);

  const knownPairs = [knownPls, knownDai].filter(Boolean) as PairData[];
  const verifiedKnown = knownPairs.find(
    (p) =>
      p.token0.id.toLowerCase() === ARK_TOKEN_ADDRESS ||
      p.token1.id.toLowerCase() === ARK_TOKEN_ADDRESS,
  );

  if (verifiedKnown) {
    console.log('Found known ARK pair:', verifiedKnown.id);
    return verifiedKnown;
  }

  // Query for pairs where ARK is token0 or token1
  const query = `{
    pairs(
      where: {
        or: [
          { token0: "${ARK_TOKEN_ADDRESS}" },
          { token1: "${ARK_TOKEN_ADDRESS}" }
        ]
      }
      first: 10
      orderBy: reserveUSD
      orderDirection: desc
    ) {
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
  }`;

  console.log('Searching for ARK pairs in PulseX subgraph...');

  try {
    const response = await fetch(PULSEX_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors searching pairs:', result.errors);
      // Try alternative query without 'or' operator
      return await findARKPairsAlternative();
    }

    if (result.data?.pairs && result.data.pairs.length > 0) {
      console.log(`Found ${result.data.pairs.length} ARK pairs`);
      // Prefer pair with WPLS, otherwise use highest liquidity
      const wplsPair = result.data.pairs.find(
        (p: PairData) =>
          p.token0.id.toLowerCase() === WPLS_ADDRESS ||
          p.token1.id.toLowerCase() === WPLS_ADDRESS,
      );
      return wplsPair || result.data.pairs[0];
    }

    return await findARKPairsAlternative();
  } catch (error) {
    console.error('Error searching for ARK pairs:', error);
    return await findARKPairsAlternative();
  }
}

// Alternative query without 'or' operator
async function findARKPairsAlternative(): Promise<PairData | null> {
  console.log('Trying alternative query for ARK pairs...');
  
  // Query token0 = ARK
  const query0 = `{
    pairs(where: { token0: "${ARK_TOKEN_ADDRESS}" }, first: 5, orderBy: reserveUSD, orderDirection: desc) {
      id reserve0 reserve1 reserveUSD volumeUSD
      token0 { id symbol name }
      token1 { id symbol name }
      token0Price token1Price
    }
  }`;
  
  // Query token1 = ARK
  const query1 = `{
    pairs(where: { token1: "${ARK_TOKEN_ADDRESS}" }, first: 5, orderBy: reserveUSD, orderDirection: desc) {
      id reserve0 reserve1 reserveUSD volumeUSD
      token0 { id symbol name }
      token1 { id symbol name }
      token0Price token1Price
    }
  }`;

  try {
    const [res0, res1] = await Promise.all([
      fetch(PULSEX_SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query0 }),
      }),
      fetch(PULSEX_SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query1 }),
      }),
    ]);

    const [data0, data1] = await Promise.all([res0.json(), res1.json()]);
    
    const pairs0 = data0.data?.pairs || [];
    const pairs1 = data1.data?.pairs || [];
    const allPairs = [...pairs0, ...pairs1];
    
    console.log(`Alternative query found ${allPairs.length} pairs (${pairs0.length} as token0, ${pairs1.length} as token1)`);

    if (allPairs.length > 0) {
      // Prefer pair with WPLS
      const wplsPair = allPairs.find((p: PairData) => 
        p.token0.id.toLowerCase() === WPLS_ADDRESS || 
        p.token1.id.toLowerCase() === WPLS_ADDRESS
      );
      if (wplsPair) {
        console.log('Found WPLS pair:', wplsPair.id);
        return wplsPair;
      }
      // Return highest liquidity pair
      allPairs.sort((a, b) => parseFloat(b.reserveUSD) - parseFloat(a.reserveUSD));
      console.log('Using highest liquidity pair:', allPairs[0].id);
      return allPairs[0];
    }

    return null;
  } catch (error) {
    console.error('Alternative query error:', error);
    return null;
  }
}

// Fetch PLS/USD price
async function fetchPLSPrice(): Promise<number> {
  const WPLS_DAI_PAIR = '0xe56043671df55de5cdf8459710433c10324de0ae'.toLowerCase();
  
  const query = `{
    pair(id: "${WPLS_DAI_PAIR}") {
      token0 { id symbol }
      token1 { id symbol }
      token0Price
      token1Price
    }
  }`;

  try {
    const response = await fetch(PULSEX_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.data?.pair) {
      const pair = result.data.pair;
      const isToken0DAI = pair.token0.symbol === 'DAI' || pair.token0.symbol === 'USDC';
      const plsPrice = isToken0DAI 
        ? parseFloat(pair.token0Price)
        : parseFloat(pair.token1Price);
      
      console.log('PLS price from DAI pair:', plsPrice);
      return plsPrice > 0 ? plsPrice : 0.00003;
    }
  } catch (error) {
    console.error('Error fetching PLS price:', error);
  }
  
  return 0.00003;
}

function processGraphQLData(pair: PairData, plsUsdPrice: number) {
  const isToken0ARK = pair.token0.id.toLowerCase() === ARK_TOKEN_ADDRESS;

  const token0Symbol = (pair.token0.symbol || '').toUpperCase();
  const token1Symbol = (pair.token1.symbol || '').toUpperCase();

  const counterTokenId = (isToken0ARK ? pair.token1.id : pair.token0.id).toLowerCase();
  const counterSymbol = isToken0ARK ? token1Symbol : token0Symbol;

  const counterIsStable = ['DAI', 'USDC', 'USDT'].includes(counterSymbol);

  const arkPriceInCounter = isToken0ARK
    ? parseFloat(pair.token0Price)
    : parseFloat(pair.token1Price);

  // Reserves
  const arkReserve = parseFloat(isToken0ARK ? pair.reserve0 : pair.reserve1);
  const counterReserve = parseFloat(isToken0ARK ? pair.reserve1 : pair.reserve0);

  // Prices
  const arkPriceUSD = counterIsStable ? arkPriceInCounter : arkPriceInCounter * plsUsdPrice;
  const arkPricePLS = plsUsdPrice > 0 ? arkPriceUSD / plsUsdPrice : 0;

  const liquidityUSD = pair.reserveUSD ? parseFloat(pair.reserveUSD) : 0;

  // Note: volume/day data isn't available in this simplified query.
  return {
    arkPriceUSD,
    arkPricePLS,
    plsUsdPrice,
    volume24hUSD: 0,
    liquidityUSD,
    priceChange24h: 0,
    reserves: {
      arkReserve,
      // Kept as `plsReserve` for backwards compatibility with the frontend type.
      // For stable pairs, this represents the counter token reserve.
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
    // Check cache
    if (cache && (Date.now() - cache.timestamp) < CACHE_TTL_MS) {
      console.log('Returning cached PulseX data');
      return new Response(JSON.stringify({ ...cache.data, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch data
    const [plsPrice, arkPair] = await Promise.all([
      fetchPLSPrice(),
      findARKPairs(),
    ]);
    
    if (!arkPair) {
      console.warn('No ARK pairs found in PulseX subgraph; returning graceful error payload');
      return new Response(
        JSON.stringify({
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
          error: 'No ARK pairs found in PulseX subgraph',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const processedData = processGraphQLData(arkPair, plsPrice);
    
    cache = { data: processedData, timestamp: Date.now() };

    console.log('PulseX data fetched successfully:', {
      arkPriceUSD: processedData.arkPriceUSD.toFixed(8),
      arkPricePLS: processedData.arkPricePLS.toFixed(8),
      plsUsdPrice: processedData.plsUsdPrice.toFixed(8),
      liquidityUSD: processedData.liquidityUSD.toFixed(2),
      pairAddress: processedData.pairAddress,
    });

    return new Response(JSON.stringify({ ...processedData, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PulseX GraphQL error:', error);
    
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
