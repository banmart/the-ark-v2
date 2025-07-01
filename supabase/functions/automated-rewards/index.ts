
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ARK Token Contract ABI (relevant functions only)
const ARK_TOKEN_ABI = [
  "function distributeLockerRewards() external",
  "function manualSwapAndLiquify() external", 
  "function manualBurnLP() external",
  "function balanceOf(address) view returns (uint256)",
  "function getTokensForLiquidity() view returns (uint256)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)"
];

const CONTRACT_ADDRESS = "0xACC15eF8fa2e702d0138c3662A9E7d696f40F021";
const PULSECHAIN_RPC = "https://rpc.pulsechain.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 Automated system triggered');
    
    // Parse request body to get operation type
    const body = await req.json();
    const operation = body.operation || 'all'; // Default to all operations if not specified
    
    console.log(`🎯 Operation requested: ${operation}`);
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the automation private key
    const privateKey = Deno.env.get('AUTOMATION_PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('AUTOMATION_PRIVATE_KEY not found in environment');
    }

    // Import ethers dynamically
    const { ethers } = await import('https://esm.sh/ethers@6.7.1');
    
    // Set up provider and signer
    const provider = new ethers.JsonRpcProvider(PULSECHAIN_RPC);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ARK_TOKEN_ABI, signer);

    console.log('📊 Checking contract status...');
    
    // Check if contract is paused
    const isPaused = await contract.paused();
    if (isPaused) {
      await logExecution(supabase, 'status_check', 'skipped', null, 0, 'Contract is paused');
      return new Response(
        JSON.stringify({ success: true, message: 'Contract is paused, skipping automation' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check signer balance
    const signerBalance = await provider.getBalance(signer.address);
    const minBalance = ethers.parseEther('0.01'); // Minimum 0.01 PLS for gas
    
    if (signerBalance < minBalance) {
      await logExecution(supabase, 'balance_check', 'failed', null, 0, 
        `Insufficient balance: ${ethers.formatEther(signerBalance)} PLS`);
      throw new Error('Insufficient balance for gas fees');
    }

    console.log(`💰 Signer balance: ${ethers.formatEther(signerBalance)} PLS`);

    const results = [];

    // Execute operations based on the requested operation
    if (operation === 'distribute_rewards' || operation === 'all') {
      try {
        console.log('🎯 Distributing locker rewards...');
        const rewardsTx = await contract.distributeLockerRewards({
          gasLimit: 500000,
          maxFeePerGas: ethers.parseUnits('20', 'gwei'),
          maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei')
        });
        
        console.log(`📝 Rewards tx sent: ${rewardsTx.hash}`);
        const rewardsReceipt = await rewardsTx.wait();
        
        await logExecution(supabase, 'distribute_rewards', 'success', 
          rewardsTx.hash, rewardsReceipt.gasUsed, null);
        
        results.push({
          operation: 'distribute_rewards',
          status: 'success',
          txHash: rewardsTx.hash,
          gasUsed: rewardsReceipt.gasUsed.toString()
        });
        
        console.log('✅ Locker rewards distributed successfully');
      } catch (error) {
        console.error('❌ Failed to distribute rewards:', error);
        await logExecution(supabase, 'distribute_rewards', 'failed', null, 0, error.message);
        results.push({
          operation: 'distribute_rewards',
          status: 'failed',
          error: error.message
        });
      }
    }

    // Small delay between operations
    if (results.length > 0 && (operation === 'swap_and_liquify' || operation === 'burn_lp' || operation === 'all')) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation === 'swap_and_liquify' || operation === 'all') {
      try {
        console.log('🔄 Executing swap and liquify...');
        const swapTx = await contract.manualSwapAndLiquify({
          gasLimit: 800000,
          maxFeePerGas: ethers.parseUnits('20', 'gwei'),
          maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei')
        });
        
        console.log(`📝 Swap tx sent: ${swapTx.hash}`);
        const swapReceipt = await swapTx.wait();
        
        await logExecution(supabase, 'swap_and_liquify', 'success', 
          swapTx.hash, swapReceipt.gasUsed, null);
        
        results.push({
          operation: 'swap_and_liquify',
          status: 'success',
          txHash: swapTx.hash,
          gasUsed: swapReceipt.gasUsed.toString()
        });
        
        console.log('✅ Swap and liquify completed successfully');
      } catch (error) {
        console.error('❌ Failed to swap and liquify:', error);
        await logExecution(supabase, 'swap_and_liquify', 'failed', null, 0, error.message);
        results.push({
          operation: 'swap_and_liquify',
          status: 'failed',
          error: error.message
        });
      }
    }

    // Small delay between operations
    if (results.length > 0 && (operation === 'burn_lp' || operation === 'all')) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation === 'burn_lp' || operation === 'all') {
      try {
        console.log('🔥 Executing LP burn...');
        const burnTx = await contract.manualBurnLP({
          gasLimit: 400000,
          maxFeePerGas: ethers.parseUnits('20', 'gwei'),
          maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei')
        });
        
        console.log(`📝 Burn tx sent: ${burnTx.hash}`);
        const burnReceipt = await burnTx.wait();
        
        await logExecution(supabase, 'burn_lp', 'success', 
          burnTx.hash, burnReceipt.gasUsed, null);
        
        results.push({
          operation: 'burn_lp',
          status: 'success',
          txHash: burnTx.hash,
          gasUsed: burnReceipt.gasUsed.toString()
        });
        
        console.log('✅ LP burn completed successfully');
      } catch (error) {
        console.error('❌ Failed to burn LP:', error);
        await logExecution(supabase, 'burn_lp', 'failed', null, 0, error.message);
        results.push({
          operation: 'burn_lp',
          status: 'failed',
          error: error.message
        });
      }
    }

    // Log overall execution summary
    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status === 'failed').length;
    
    await logExecution(supabase, `${operation}_cycle`, 'completed', null, 0, null, {
      total_operations: results.length,
      successful: successCount,
      failed: failCount,
      results: results,
      operation_type: operation
    });

    console.log(`🎉 ${operation} cycle completed: ${successCount} successful, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${operation} cycle completed`,
        results: results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failCount
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Critical error in automation:', error);
    
    // Try to log the error if Supabase is available
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      await logExecution(supabase, 'automation_cycle', 'critical_error', null, 0, error.message);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to log execution details
async function logExecution(
  supabase: any,
  operation: string,
  status: string,
  transactionHash: string | null,
  gasUsed: number | bigint,
  errorMessage: string | null,
  details: any = null
) {
  try {
    const { error } = await supabase
      .from('automation_logs')
      .insert({
        operation,
        status,
        transaction_hash: transactionHash,
        gas_used: gasUsed ? Number(gasUsed) : null,
        error_message: errorMessage,
        details
      });

    if (error) {
      console.error('Failed to log execution:', error);
    }
  } catch (error) {
    console.error('Error in logExecution:', error);
  }
}
