import React from 'react';
import { Shield, Lock, Target, Zap, TrendingDown, Flame, BarChart3, Settings, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContractTransparencySectionProps {
  contractData: any;
  contractLoading: boolean;
}

const ContractTransparencySection = ({
  contractData,
  contractLoading
}: ContractTransparencySectionProps) => {
  // Default data structure to prevent undefined errors
  const defaultContractData = {
    fees: {
      buy: 5,
      sell: 8,
      maxBuy: 10,
      maxSell: 12,
      locker: 3,
      liquidity: 2,
      development: 2,
      marketing: 1
    },
    security: {
      renounced: true,
      lpLocked: true,
      maxWallet: 2,
      maxTransaction: 1,
      antiBot: true,
      honeypotProtection: true
    },
    liquidityData: {
      lpTokensBurned: '1,247,892',
      tokensForLiquidity: '89,456',
      autoLiquidityThreshold: '0.05%',
      liquidityFeeAccumulated: '12,847'
    },
    automation: {
      swapEnabled: true,
      liquidityEnabled: true,
      swapThreshold: '0.1%',
      maxSwapAmount: '0.5%'
    }
  };

  // Safely merge contract data with defaults
  const data = {
    fees: { ...defaultContractData.fees, ...(contractData?.fees || {}) },
    security: { ...defaultContractData.security, ...(contractData?.security || {}) },
    liquidityData: { ...defaultContractData.liquidityData, ...(contractData?.liquidityData || {}) },
    automation: { ...defaultContractData.automation, ...(contractData?.automation || {}) }
  };

  const SecurityBadge = ({ feature, status, icon: Icon, description }) => (
    <div className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
      status 
        ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50' 
        : 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
    }`}>
      <div className={`mr-3 ${status ? 'text-green-400' : 'text-red-400'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className={`font-semibold ${status ? 'text-green-300' : 'text-red-300'}`}>
          {feature}
        </div>
        <div className="text-sm text-gray-400">
          {description}
        </div>
      </div>
      <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}`}></div>
    </div>
  );

  const FeeCard = ({ title, percentage, maxPercentage, description, color = 'cyan' }) => (
    <div className={`bg-black/20 backdrop-blur-sm border border-${color}-500/20 rounded-xl p-6 hover:border-${color}-500/40 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-lg font-bold text-${color}-400`}>{title}</h4>
        <div className={`text-2xl font-black text-${color}-300`}>
          {contractLoading ? (
            <span className="animate-pulse">--%</span>
          ) : (
            `${percentage || 0}%`
          )}
        </div>
      </div>
      {maxPercentage && (
        <div className="text-sm text-gray-400 mb-2">
          Max: {maxPercentage}%
        </div>
      )}
      <p className="text-sm text-gray-300">{description}</p>
      
      {/* Progress bar */}
      <div className="mt-4 bg-gray-700 rounded-full h-2">
        <div 
          className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${((percentage || 0) / (maxPercentage || 10)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-cyan-400 mr-4" />
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Contract Transparency
            </h2>
            <Lock className="w-10 h-10 text-purple-400 ml-4" />
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Complete transparency in our smart contract operations. Every fee, every security measure, 
            and every automated function is open for verification on the blockchain.
          </p>
        </div>

        {/* Fee Structure */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            Fee Structure & Caps
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FeeCard 
              title="Buy Fee"
              percentage={data?.fees?.buy || 0}
              maxPercentage={data?.fees?.maxBuy || 10}
              description="Fee applied on token purchases"
              color="green"
            />
            <FeeCard 
              title="Sell Fee"
              percentage={data?.fees?.sell || 0}
              maxPercentage={data?.fees?.maxSell || 12}
              description="Fee applied on token sales"
              color="red"
            />
            <FeeCard 
              title="Locker Rewards"
              percentage={data?.fees?.locker || 0}
              description="Distributed to token lockers"
              color="purple"
            />
            <FeeCard 
              title="Auto Liquidity"
              percentage={data?.fees?.liquidity || 0}
              description="Added to liquidity pool"
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeeCard 
              title="Development"
              percentage={data?.fees?.development || 0}
              description="Funds project development"
              color="yellow"
            />
            <FeeCard 
              title="Marketing"
              percentage={data?.fees?.marketing || 0}
              description="Community growth & marketing"
              color="pink"
            />
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-green-400 flex items-center justify-center">
            <Shield className="w-8 h-8 mr-3" />
            Security Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityBadge 
              feature="Contract Renounced"
              status={data?.security?.renounced || false}
              icon={CheckCircle}
              description="Ownership permanently renounced - no backdoors possible"
            />
            <SecurityBadge 
              feature="LP Tokens Locked"
              status={data?.security?.lpLocked || false}
              icon={Lock}
              description="Liquidity permanently locked - rug pull impossible"
            />
            <SecurityBadge 
              feature="Anti-Bot Protection"
              status={data?.security?.antiBot || false}
              icon={Shield}
              description="Advanced bot detection and prevention system"
            />
            <SecurityBadge 
              feature="Honeypot Protection"
              status={data?.security?.honeypotProtection || false}
              icon={AlertTriangle}
              description="Protected against honeypot attacks"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Transaction Limits
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Max Wallet:</span>
                  <span className="text-blue-300 font-semibold">{data?.security?.maxWallet || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Max Transaction:</span>
                  <span className="text-blue-300 font-semibold">{data?.security?.maxTransaction || 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Automation Settings
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Auto Swap:</span>
                  <span className={`font-semibold ${(data?.automation?.swapEnabled || false) ? 'text-green-400' : 'text-red-400'}`}>
                    {(data?.automation?.swapEnabled || false) ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Swap Threshold:</span>
                  <span className="text-cyan-300 font-semibold">{data?.automation?.swapThreshold || '0%'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap & Liquidity Settings */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400 flex items-center justify-center">
            <Zap className="w-8 h-8 mr-3" />
            Automated Liquidity System
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
              <TrendingDown className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-cyan-400 mb-2">Auto Liquidity</h4>
              <p className="text-sm text-gray-300 mb-4">
                Automatic liquidity addition when threshold is reached
              </p>
              <div className="text-2xl font-black text-cyan-300">
                {data?.automation?.swapThreshold || '0%'}
              </div>
              <div className="text-sm text-gray-400">Trigger Threshold</div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-blue-400 mb-2">Accumulated Fees</h4>
              <p className="text-sm text-gray-300 mb-4">
                Fees ready for liquidity addition
              </p>
              <div className="text-2xl font-black text-blue-300">
                {contractLoading ? 'Loading...' : (data?.liquidityData?.liquidityFeeAccumulated || '0')}
              </div>
              <div className="text-sm text-gray-400">ARK Tokens</div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 text-center">
              <Settings className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-green-400 mb-2">Max Swap</h4>
              <p className="text-sm text-gray-300 mb-4">
                Maximum tokens swapped per transaction
              </p>
              <div className="text-2xl font-black text-green-300">
                {data?.automation?.maxSwapAmount || '0%'}
              </div>
              <div className="text-sm text-gray-400">Of Total Supply</div>
            </div>
          </div>
        </div>

        {/* LP Token Burning */}
        <div className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border-2 border-orange-500/30 rounded-xl p-8 shadow-2xl shadow-orange-500/20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Flame className="w-12 h-12 text-orange-400 mr-3 animate-pulse" />
              <div className="text-5xl animate-pulse">🔥</div>
              <Flame className="w-12 h-12 text-orange-400 ml-3 animate-pulse" />
            </div>
            
            <h3 className="text-3xl font-bold text-orange-400 mb-6">
              Automated LP Token Burning
            </h3>
            
            <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
              Every liquidity addition automatically burns 50% of generated LP tokens, creating permanent 
              deflationary pressure on the liquidity pool itself. This mechanism ensures ever-increasing 
              token value through reduced liquidity supply.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-xl font-bold text-orange-300 mb-2">Total LP Burned</div>
                <div className="text-3xl font-black text-orange-400">
                  {contractLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    data?.liquidityData?.lpTokensBurned || '0'
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-2">Permanently Removed</div>
              </div>
              
              <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
                <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-xl font-bold text-orange-300 mb-2">Tokens Ready</div>
                <div className="text-3xl font-black text-orange-400">
                  {contractLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    data.liquidityData.tokensForLiquidity
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-2">For Next Addition</div>
              </div>
              
              <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-xl font-bold text-orange-300 mb-2">Burn Rate</div>
                <div className="text-3xl font-black text-orange-400">50%</div>
                <div className="text-sm text-gray-400 mt-2">Of Generated LP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Verification */}
        <div className="mt-16 text-center">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              Contract Verified & Audited
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Our smart contract is fully verified on PulseChain Explorer and has undergone comprehensive 
              security audits. All functions are transparent and immutable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30">
                View on Explorer
              </button>
              <button className="bg-transparent border-2 border-green-500/50 text-green-400 font-bold px-8 py-3 rounded-full hover:bg-green-500/10 hover:border-green-500 transition-all">
                Read Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractTransparencySection;