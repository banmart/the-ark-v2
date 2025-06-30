
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

// Gas optimization constants
const GAS_LIMITS = {
  distribute_rewards: 500000,
  swap_and_liquify: 800000,
  burn_lp: 400000
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const OPERATION_DELAY = 2000; // 2 seconds between operations

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 Automated rewards system triggered');
    
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
    
    // Perform health checks
    const healthCheck = await performHealthChecks(contract, provider, signer);
    if (!healthCheck.success) {
      await logExecution(supabase, 'health_check', 'failed', null, 0, healthCheck.error);
      return new Response(
        JSON.stringify({ success: false, message: healthCheck.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`💰 Signer balance: ${ethers.formatEther(healthCheck.balance)} PLS`);

    const results = [];

    // Execute operations with proper error handling and optimization
    const operations = [
      { name: 'distribute_rewards', func: 'distributeLockerRewards', gasLimit: GAS_LIMITS.distribute_rewards },
      { name: 'swap_and_liquify', func: 'manualSwapAndLiquify', gasLimit: GAS_LIMITS.swap_and_liquify },
      { name: 'burn_lp', func: 'manualBurnLP', gasLimit: GAS_LIMITS.burn_lp }
    ];

    for (const operation of operations) {
      const result = await executeOperationWithRetry(
        contract, 
        operation, 
        provider, 
        supabase,
        MAX_RETRIES
      );
      results.push(result);
      
      // Small delay between operations to prevent nonce conflicts
      if (operation !== operations[operations.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, OPERATION_DELAY));
      }
    }

    // Log overall execution summary
    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status === 'failed').length;
    
    await logExecution(supabase, 'automation_cycle', 'completed', null, 0, null, {
      total_operations: results.length,
      successful: successCount,
      failed: failCount,
      results: results
    });

    console.log(`🎉 Automation cycle completed: ${successCount} successful, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Automation cycle completed',
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

// Enhanced health check function
async function performHealthChecks(contract: any, provider: any, signer: any) {
  try {
    // Check if contract is paused
    const isPaused = await contract.paused();
    if (isPaused) {
      return { success: false, error: 'Contract is paused, skipping automation' };
    }

    // Check signer balance
    const signerBalance = await provider.getBalance(signer.address);
    const minBalance = ethers.parseEther('0.02'); // Increased minimum for safety
    
    if (signerBalance < minBalance) {
      return { 
        success: false, 
        error: `Insufficient balance: ${ethers.formatEther(signerBalance)} PLS (minimum: 0.02 PLS)` 
      };
    }

    // Check network connectivity
    const blockNumber = await provider.getBlockNumber();
    if (!blockNumber || blockNumber < 1) {
      return { success: false, error: 'Network connectivity issue' };
    }

    return { success: true, balance: signerBalance };
  } catch (error) {
    return { success: false, error: `Health check failed: ${error.message}` };
  }
}

// Enhanced operation execution with retry logic
async function executeOperationWithRetry(
  contract: any, 
  operation: any, 
  provider: any, 
  supabase: any, 
  maxRetries: number
) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🎯 Executing ${operation.name} (attempt ${attempt}/${maxRetries})...`);
      
      // Get optimized gas parameters
      const gasParams = await getOptimizedGasParams(provider, operation.gasLimit);
      
      // Execute the transaction
      const tx = await contract[operation.func](gasParams);
      console.log(`📝 ${operation.name} tx sent: ${tx.hash}`);
      
      // Wait for transaction confirmation with timeout
      const receipt = await waitForTransactionWithTimeout(tx, 60000); // 60 second timeout
      
      if (receipt.status === 1) {
        // Transaction successful
        await logExecution(supabase, operation.name, 'success', 
          tx.hash, receipt.gasUsed, null);
        
        console.log(`✅ ${operation.name} completed successfully`);
        return {
          operation: operation.name,
          status: 'success',
          txHash: tx.hash,
          gasUsed: receipt.gasUsed.toString(),
          attempt
        };
      } else {
        // Transaction failed
        const error = `Transaction failed with status: ${receipt.status}`;
        await logExecution(supabase, operation.name, 'failed', 
          tx.hash, receipt.gasUsed, error);
        
        return {
          operation: operation.name,
          status: 'failed',
          txHash: tx.hash,
          error,
          attempt
        };
      }
      
    } catch (error) {
      lastError = error;
      console.error(`❌ ${operation.name} failed (attempt ${attempt}):`, error.message);
      
      // Parse contract-specific errors
      const parsedError = parseContractError(error);
      
      // Don't retry if it's a non-recoverable error
      if (isNonRecoverableError(error)) {
        await logExecution(supabase, operation.name, 'failed', null, 0, parsedError);
        return {
          operation: operation.name,
          status: 'failed',
          error: parsedError,
          attempt,
          nonRecoverable: true
        };
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries exhausted
  const finalError = parseContractError(lastError);
  await logExecution(supabase, operation.name, 'failed', null, 0, finalError);
  
  return {
    operation: operation.name,
    status: 'failed',
    error: finalError,
    attempt: maxRetries,
    retriesExhausted: true
  };
}

// Get optimized gas parameters
async function getOptimizedGasParams(provider: any, baseGasLimit: number) {
  try {
    const feeData = await provider.getFeeData();
    const gasPrice = await provider.getGasPrice();
    
    // Use EIP-1559 if available, otherwise use legacy
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      return {
        gasLimit: Math.floor(baseGasLimit * 1.2), // 20% safety margin
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      };
    } else {
      return {
        gasLimit: Math.floor(baseGasLimit * 1.2),
        gasPrice: gasPrice
      };
    }
  } catch (error) {
    console.warn('Failed to get optimized gas params, using defaults:', error.message);
    return {
      gasLimit: Math.floor(baseGasLimit * 1.2),
      gasPrice: ethers.parseUnits('20', 'gwei')
    };
  }
}

// Wait for transaction with timeout
async function waitForTransactionWithTimeout(tx: any, timeout: number) {
  return Promise.race([
    tx.wait(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Transaction timeout')), timeout)
    )
  ]);
}

// Parse contract-specific errors
function parseContractError(error: any): string {
  if (!error) return 'Unknown error';
  
  const message = error.message || error.toString();
  
  // Common contract error patterns
  if (message.includes('execution reverted')) {
    if (message.includes('Pausable: paused')) return 'Contract is paused';
    if (message.includes('Ownable: caller is not the owner')) return 'Unauthorized: not contract owner';
    if (message.includes('insufficient funds')) return 'Insufficient contract funds';
    if (message.includes('transfer amount exceeds balance')) return 'Insufficient token balance';
    return `Contract execution reverted: ${message}`;
  }
  
  if (message.includes('insufficient funds')) return 'Insufficient gas funds';
  if (message.includes('nonce too low')) return 'Transaction nonce conflict';
  if (message.includes('replacement transaction underpriced')) return 'Gas price too low';
  if (message.includes('network error')) return 'Network connectivity issue';
  
  return message.length > 200 ? message.substring(0, 200) + '...' : message;
}

// Check if error is non-recoverable
function isNonRecoverableError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || error.toString();
  
  // Non-recoverable error patterns
  const nonRecoverablePatterns = [
    'Contract is paused',
    'Ownable: caller is not the owner',
    'Invalid private key',
    'Invalid contract address'
  ];
  
  return nonRecoverablePatterns.some(pattern => message.includes(pattern));
}

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
