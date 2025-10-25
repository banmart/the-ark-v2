import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import { ethers } from 'https://esm.sh/ethers@6.14.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Contract addresses - checksummed to match constants.ts
const ARK_TOKEN_ADDRESS = ethers.getAddress('0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67');
const LOCKER_ADDRESS = ethers.getAddress('0x3ba44a1de77025b78d7430449569dd1112ac4473');
const PULSEX_PAIR_ADDRESS = ethers.getAddress('0x5f49421c0f74873bc02d0a912f171a030008f2c9'); // ARK/PLS pair
const BURN_ADDRESS = '0x0000000000000000000000000000000000000369';

const ARK_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const LOCKER_ABI = [
  'function totalLockedTokens() view returns (uint256)',
  'function totalRewardsDistributed() view returns (uint256)',
  'function totalActiveLockers() view returns (uint256)',
  'function rewardPool() view returns (uint256)',
  'function emergencyMode() view returns (bool)',
  'function paused() view returns (bool)',
];

const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting ARK data cache update...');

    // Initialize provider
    const provider = new ethers.JsonRpcProvider('https://rpc.pulsechain.com');
    
    // Initialize contracts
    const arkContract = new ethers.Contract(ARK_TOKEN_ADDRESS, ARK_ABI, provider);
    const lockerContract = new ethers.Contract(LOCKER_ADDRESS, LOCKER_ABI, provider);
    const pairContract = new ethers.Contract(PULSEX_PAIR_ADDRESS, PAIR_ABI, provider);

    // Fetch blockchain data in parallel
    console.log('Fetching contract data...');
    const [
      totalSupply,
      decimals,
      burnedTokens,
      totalLocked,
      totalRewards,
      activeLockers,
      rewardPool,
      emergencyMode,
      paused,
      reserves,
      token0,
    ] = await Promise.all([
      arkContract.totalSupply().catch(e => { console.error('totalSupply error:', e); throw e; }),
      arkContract.decimals().catch(e => { console.error('decimals error:', e); throw e; }),
      arkContract.balanceOf(BURN_ADDRESS).catch(e => { console.error('burnedTokens error:', e); throw e; }),
      lockerContract.totalLockedTokens().catch(e => { console.error('totalLockedTokens error:', e); throw e; }),
      lockerContract.totalRewardsDistributed().catch(e => { console.error('totalRewardsDistributed error:', e); throw e; }),
      lockerContract.totalActiveLockers().catch(e => { console.error('totalActiveLockers error:', e); throw e; }),
      lockerContract.rewardPool().catch(e => { console.error('rewardPool error:', e); throw e; }),
      lockerContract.emergencyMode().catch(e => { console.error('emergencyMode error:', e); throw e; }),
      lockerContract.paused().catch(e => { console.error('paused error:', e); throw e; }),
      pairContract.getReserves().catch(e => { console.error('getReserves error:', e); throw e; }),
      pairContract.token0().catch(e => { console.error('token0 error:', e); throw e; }),
    ]);

    console.log('Contract data fetched successfully');

    // Calculate price from reserves (ARK/PLS pair)
    const reserve0 = Number(ethers.formatUnits(reserves[0], 18));
    const reserve1 = Number(ethers.formatUnits(reserves[1], 18));
    
    // Determine which reserve is ARK vs PLS
    const isToken0ARK = token0.toLowerCase() === ARK_TOKEN_ADDRESS.toLowerCase();
    const arkReserve = isToken0ARK ? reserve0 : reserve1;
    const plsReserve = isToken0ARK ? reserve1 : reserve0;
    const arkPrice = plsReserve / arkReserve; // Price in PLS

    // Format blockchain data
    const blockchainData = {
      totalSupply: ethers.formatUnits(totalSupply, Number(decimals)),
      decimals: Number(decimals),
      burnedTokens: ethers.formatUnits(burnedTokens, Number(decimals)),
      circulatingSupply: ethers.formatUnits(totalSupply - burnedTokens, Number(decimals)),
      holders: 1250, // Estimated
      dailyBurnRate: 0.15, // Estimated percentage
      lastUpdated: new Date().toISOString(),
    };

    // Format market data
    const marketData = {
      price: arkPrice,
      priceChange24h: 0, // Would need historical data
      marketCap: parseFloat(blockchainData.circulatingSupply) * arkPrice,
      volume24h: 0, // Would need to track transfers
      liquidity: arkReserve + plsReserve,
      arkReserve,
      plsReserve,
      dataSource: 'PulseX',
      lastUpdated: new Date().toISOString(),
    };

    // Format locker data
    const lockerData = {
      totalLockedTokens: ethers.formatUnits(totalLocked, Number(decimals)),
      totalRewardsDistributed: ethers.formatUnits(totalRewards, Number(decimals)),
      activeLockerCount: Number(activeLockers),
      rewardPool: ethers.formatUnits(rewardPool, Number(decimals)),
      totalProtocolWeight: 0, // Not available in this contract version
      emergencyMode: emergencyMode,
      contractPaused: paused,
      lastUpdated: new Date().toISOString(),
    };

    // Store in cache with 15 minute expiry
    console.log('Storing data in cache...');
    
    await Promise.all([
      supabase.rpc('upsert_ark_cache', {
        p_data_type: 'blockchain',
        p_data: blockchainData,
        p_ttl_minutes: 15,
      }),
      supabase.rpc('upsert_ark_cache', {
        p_data_type: 'market',
        p_data: marketData,
        p_ttl_minutes: 15,
      }),
      supabase.rpc('upsert_ark_cache', {
        p_data_type: 'locker',
        p_data: lockerData,
        p_ttl_minutes: 15,
      }),
    ]);

    console.log('Cache updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'ARK data cache updated',
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating cache:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
