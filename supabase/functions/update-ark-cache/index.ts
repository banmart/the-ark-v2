import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import { ethers } from 'https://esm.sh/ethers@6.14.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Contract addresses and ABIs
const ARK_TOKEN_ADDRESS = '0x5f49421c0f74873bc02d0a912f171a030008f2c9';
const LOCKER_ADDRESS = '0x8a8a0f0fb44f44854e0fac749c6e2a67c8c19e66';
const PULSEX_ROUTER_ADDRESS = '0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02';
const PULSEX_PAIR_ADDRESS = '0x6753560538ecA67617A9Ce605178F788bE7E524E';

const ARK_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const LOCKER_ABI = [
  'function totalLockedTokens() view returns (uint256)',
  'function totalRewardsDistributed() view returns (uint256)',
  'function getActiveLockerCount() view returns (uint256)',
  'function rewardPool() view returns (uint256)',
  'function totalProtocolWeight() view returns (uint256)',
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
    const [
      totalSupply,
      decimals,
      burnedTokens,
      totalLocked,
      totalRewards,
      activeLockers,
      rewardPool,
      totalWeight,
      emergencyMode,
      paused,
      reserves,
      token0,
    ] = await Promise.all([
      arkContract.totalSupply(),
      arkContract.decimals(),
      arkContract.balanceOf('0x0000000000000000000000000000000000000000'),
      lockerContract.totalLockedTokens(),
      lockerContract.totalRewardsDistributed(),
      lockerContract.getActiveLockerCount(),
      lockerContract.rewardPool(),
      lockerContract.totalProtocolWeight(),
      lockerContract.emergencyMode(),
      lockerContract.paused(),
      pairContract.getReserves(),
      pairContract.token0(),
    ]);

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
      totalProtocolWeight: Number(totalWeight),
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
