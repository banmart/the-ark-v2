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
        

        {/* Fee Structure with Caps */}
        

        {/* Security Features */}
        

        {/* Swap & Liquidity Settings */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">Automated Liquidity System</h3>
          
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