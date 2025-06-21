import React from 'react';
import { Shield, Lock, Target, Zap } from 'lucide-react';
interface ContractTransparencySectionProps {
  contractData: any;
  contractLoading: boolean;
}
const ContractTransparencySection = ({
  contractData,
  contractLoading
}: ContractTransparencySectionProps) => {
  return <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            🔍 Contract Transparency 🔍
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Full transparency with hardcoded security measures, fee caps, and automated mechanisms that protect every ARK holder.
          </p>
        </div>

        {/* Fee Structure with Caps */}
        

        {/* Security Features */}
        

        {/* Swap & Liquidity Settings */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">Automated Liquidity System</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 text-center">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="font-bold text-cyan-400 mb-2">Swap Threshold</h4>
              <div className="text-2xl font-bold mb-2">
                {contractLoading ? 'Loading...' : `${contractData.swapSettings.threshold} ARK`}
              </div>
              <p className="text-sm text-gray-400">0.1% of total supply</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="font-bold text-yellow-400 mb-2">Max Swap Amount</h4>
              <div className="text-2xl font-bold mb-2">
                {contractLoading ? 'Loading...' : `${contractData.swapSettings.maxAmount} ARK`}
              </div>
              <p className="text-sm text-gray-400">0.2% of total supply</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="font-bold text-purple-400 mb-2">Slippage Protection</h4>
              <div className="text-2xl font-bold mb-2">
                {contractLoading ? 'Loading...' : `${contractData.swapSettings.slippageTolerance}%`}
              </div>
              <p className="text-sm text-gray-400">Maximum 5% allowed</p>
            </div>
          </div>
        </div>

        {/* LP Token Burning */}
        <div className="glass-card rounded-xl p-8 border-2 border-orange-500/30">
          <div className="text-center">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Automated LP Token Burning</h3>
            <p className="text-gray-300 mb-6">
              Every liquidity addition automatically burns 50% of generated LP tokens, creating permanent deflationary pressure on the liquidity pool itself.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-300 mb-2">Total LP Burned</div>
                <div className="text-3xl font-black text-orange-400">
                  {contractLoading ? 'Loading...' : `${contractData.liquidityData.lpTokensBurned}`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-300 mb-2">Tokens Ready</div>
                <div className="text-3xl font-black text-orange-400">
                  {contractLoading ? 'Loading...' : `${contractData.liquidityData.tokensForLiquidity}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContractTransparencySection;