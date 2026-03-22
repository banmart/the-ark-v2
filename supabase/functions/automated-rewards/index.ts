
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ARK Token Contract ABI (relevant functions only)
const ARK_TOKEN_ABI = [
  "function distributeLockerRewards() external",
  "function sendDAORewards() external",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function owner() view returns (address)",
  "function swapThreshold() view returns (uint256)"
];

const CONTRACT_ADDRESS = "0xF4a370e64DD4673BAA250C5435100FA98661Db4C";
const PULSECHAIN_RPC = "https://api.speedynodes.net/http/pulsechain-http?apikey=17666dccac3cdb9d244b413bab8cf3204a25461f";

// Network conditions and retry configuration
const NETWORK_CONFIG = {
  MAX_RETRIES: 3,
  BASE_DELAY: 2000, // 2 seconds
  MAX_DELAY: 30000, // 30 seconds
  GAS_MULTIPLIER: 1.2,
  CONFIRMATION_BLOCKS: 2,
  TRANSACTION_TIMEOUT: 300000, // 5 minutes
};

// Operation-specific configurations
const OPERATION_CONFIG = {
  distribute_rewards: {
    gasLimit: 500000,
    priority: 1,
    requiresLP: false,
    economicThreshold: 0 // Always execute
  },
  swap_and_liquify: {
    gasLimit: 800000,
    priority: 2,
    requiresLP: false,
    economicThreshold: 1000 // Minimum tokens to make it worthwhile
  },
  burn_lp: {
    gasLimit: 400000,
    priority: 3,
    requiresLP: true,
    economicThreshold: 100 // Minimum LP tokens to burn
  }
};

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

    // Get network conditions and optimize gas
    const networkConditions = await getNetworkConditions(provider, ethers);
    console.log('🌐 Network conditions:', networkConditions);

    // Initialize transaction manager
    const txManager = new TransactionManager(signer, provider, ethers, supabase);

    const results = [];

    // Determine operations to execute based on priority and conditions
    const operationsToExecute = await planOperations(operation, contract, ethers, networkConditions);
    console.log(`📋 Planned operations: ${operationsToExecute.map(op => op.name).join(', ')}`);

    // Execute operations in optimized sequence
    for (const op of operationsToExecute) {
      console.log(`🚀 Executing ${op.name}...`);
      
      const startTime = Date.now();
      const result = await executeOperationWithRetry(op, txManager, contract, ethers, supabase);
      const executionTime = Date.now() - startTime;
      
      result.executionTime = executionTime;
      results.push(result);
      
      console.log(`${result.status === 'success' ? '✅' : '❌'} ${op.name} completed in ${executionTime}ms`);
      
      // Intelligent delay between operations based on network conditions
      if (operationsToExecute.indexOf(op) < operationsToExecute.length - 1) {
        const delay = calculateOptimalDelay(networkConditions, result.status);
        console.log(`⏳ Waiting ${delay}ms before next operation...`);
        await new Promise(resolve => setTimeout(resolve, delay));
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

// Advanced Transaction Manager Class
class TransactionManager {
  constructor(signer, provider, ethers, supabase) {
    this.signer = signer;
    this.provider = provider;
    this.ethers = ethers;
    this.supabase = supabase;
    this.nonce = null;
  }

  async getCurrentNonce() {
    if (this.nonce === null) {
      this.nonce = await this.provider.getTransactionCount(this.signer.address, 'pending');
    }
    return this.nonce;
  }

  async executeWithRetry(operation, gasConfig, maxRetries = NETWORK_CONFIG.MAX_RETRIES) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt + 1}/${maxRetries} for ${operation.name}`);
        
        const nonce = await this.getCurrentNonce();
        const tx = await operation.execute({
          ...gasConfig,
          nonce,
          gasLimit: Math.floor(gasConfig.gasLimit * NETWORK_CONFIG.GAS_MULTIPLIER)
        });
        
        console.log(`📝 Transaction sent: ${tx.hash} (nonce: ${nonce})`);
        
        // Wait for confirmation with timeout
        const receipt = await Promise.race([
          tx.wait(NETWORK_CONFIG.CONFIRMATION_BLOCKS),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction timeout')), NETWORK_CONFIG.TRANSACTION_TIMEOUT)
          )
        ]);
        
        this.nonce++; // Increment nonce for next transaction
        return { tx, receipt };
        
      } catch (error) {
        lastError = error;
        console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
        
        // Handle specific error types
        if (error.message.includes('nonce too low')) {
          console.log('🔧 Refreshing nonce due to nonce error');
          this.nonce = await this.provider.getTransactionCount(this.signer.address, 'pending');
        } else if (error.message.includes('gas too low') || error.message.includes('out of gas')) {
          gasConfig.gasLimit = Math.floor(gasConfig.gasLimit * 1.5);
          console.log(`⛽ Increasing gas limit to ${gasConfig.gasLimit}`);
        } else if (error.message.includes('insufficient funds')) {
          throw error; // Don't retry insufficient funds
        }
        
        // Exponential backoff
        if (attempt < maxRetries - 1) {
          const delay = Math.min(NETWORK_CONFIG.BASE_DELAY * Math.pow(2, attempt), NETWORK_CONFIG.MAX_DELAY);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

// Network condition analyzer
async function getNetworkConditions(provider, ethers) {
  try {
    const [gasPrice, blockNumber, block] = await Promise.all([
      provider.getFeeData(),
      provider.getBlockNumber(),
      provider.getBlock('latest')
    ]);
    
    return {
      gasPrice: gasPrice.gasPrice,
      maxFeePerGas: gasPrice.maxFeePerGas || ethers.parseUnits('50', 'gwei'),
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei'),
      blockNumber,
      baseFeePerGas: block?.baseFeePerGas || ethers.parseUnits('1', 'gwei'),
      congestionLevel: calculateCongestionLevel(gasPrice.gasPrice, ethers)
    };
  } catch (error) {
    console.warn('Failed to get network conditions, using defaults:', error);
    return {
      gasPrice: ethers.parseUnits('20', 'gwei'),
      maxFeePerGas: ethers.parseUnits('50', 'gwei'),
      maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
      congestionLevel: 'medium'
    };
  }
}

function calculateCongestionLevel(gasPrice, ethers) {
  const gasPriceGwei = parseFloat(ethers.formatUnits(gasPrice, 'gwei'));
  if (gasPriceGwei < 10) return 'low';
  if (gasPriceGwei < 30) return 'medium';
  return 'high';
}

// Operation planning with economic validation
async function planOperations(operation, contract, ethers, networkConditions) {
  const operations = [];
  
  if (operation === 'distribute_rewards' || operation === 'all') {
    operations.push({
      name: 'distribute_rewards',
      config: OPERATION_CONFIG.distribute_rewards,
      execute: (gasConfig) => contract.distributeLockerRewards(gasConfig)
    });
  }
  
  if (operation === 'swap_and_liquify' || operation === 'all') {
    // Check if there are enough tokens to make swap worthwhile
    const tokensForLiquidity = await contract.getTokensForLiquidity();
    const threshold = ethers.parseEther(OPERATION_CONFIG.swap_and_liquify.economicThreshold.toString());
    
    if (tokensForLiquidity >= threshold) {
      operations.push({
        name: 'swap_and_liquify',
        config: OPERATION_CONFIG.swap_and_liquify,
        execute: (gasConfig) => contract.manualSwapAndLiquify(gasConfig)
      });
    } else {
      console.log(`⏭️ Skipping swap_and_liquify: insufficient tokens (${ethers.formatEther(tokensForLiquidity)} < ${OPERATION_CONFIG.swap_and_liquify.economicThreshold})`);
    }
  }
  
  if (operation === 'burn_lp' || operation === 'all') {
    // Check if there are enough LP tokens to make burn worthwhile
    try {
      const lpBalance = await contract.lpTokenBalance();
      const threshold = ethers.parseEther(OPERATION_CONFIG.burn_lp.economicThreshold.toString());
      
      if (lpBalance >= threshold) {
        operations.push({
          name: 'burn_lp',
          config: OPERATION_CONFIG.burn_lp,
          execute: (gasConfig) => contract.manualBurnLP(gasConfig)
        });
      } else {
        console.log(`⏭️ Skipping burn_lp: insufficient LP tokens (${ethers.formatEther(lpBalance)} < ${OPERATION_CONFIG.burn_lp.economicThreshold})`);
      }
    } catch (error) {
      console.warn('Could not check LP balance, proceeding with burn operation:', error);
      operations.push({
        name: 'burn_lp',
        config: OPERATION_CONFIG.burn_lp,
        execute: (gasConfig) => contract.manualBurnLP(gasConfig)
      });
    }
  }
  
  // Sort by priority
  return operations.sort((a, b) => a.config.priority - b.config.priority);
}

// Execute operation with comprehensive retry logic
async function executeOperationWithRetry(operation, txManager, contract, ethers, supabase) {
  try {
    const gasConfig = {
      gasLimit: operation.config.gasLimit,
      maxFeePerGas: ethers.parseUnits('50', 'gwei'),
      maxPriorityFeePerGas: ethers.parseUnits('5', 'gwei')
    };
    
    const { tx, receipt } = await txManager.executeWithRetry(operation, gasConfig);
    
    await logExecution(supabase, operation.name, 'success', tx.hash, receipt.gasUsed, null, {
      gasPrice: ethers.formatUnits(receipt.gasPrice || gasConfig.maxFeePerGas, 'gwei'),
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice ? ethers.formatUnits(receipt.effectiveGasPrice, 'gwei') : 'unknown'
    });
    
    return {
      operation: operation.name,
      status: 'success',
      txHash: tx.hash,
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: ethers.formatUnits(receipt.gasPrice || gasConfig.maxFeePerGas, 'gwei')
    };
    
  } catch (error) {
    console.error(`💥 Failed to execute ${operation.name}:`, error);
    
    await logExecution(supabase, operation.name, 'failed', null, 0, error.message, {
      errorCode: error.code,
      errorData: error.data,
      gasConfig: {
        gasLimit: operation.config.gasLimit,
        maxFeePerGas: '50',
        maxPriorityFeePerGas: '5'
      }
    });
    
    return {
      operation: operation.name,
      status: 'failed',
      error: error.message,
      errorCode: error.code
    };
  }
}

// Calculate optimal delay between operations
function calculateOptimalDelay(networkConditions, lastOperationStatus) {
  let baseDelay = 3000; // 3 seconds base delay
  
  // Adjust based on network congestion
  switch (networkConditions.congestionLevel) {
    case 'high':
      baseDelay *= 3;
      break;
    case 'medium':
      baseDelay *= 1.5;
      break;
    case 'low':
      baseDelay *= 0.5;
      break;
  }
  
  // Add extra delay if last operation failed
  if (lastOperationStatus === 'failed') {
    baseDelay *= 2;
  }
  
  return Math.max(1000, Math.min(baseDelay, 15000)); // Between 1-15 seconds
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
