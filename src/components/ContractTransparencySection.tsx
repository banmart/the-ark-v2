import React from 'react';
import { Shield, Lock, Target, Zap } from 'lucide-react';

interface ContractTransparencySectionProps {
  contractData: any;
  contractLoading: boolean;
}

const ContractTransparencySection = ({ contractData, contractLoading }: ContractTransparencySectionProps) => {
  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
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
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">Fee Structure & Hard Caps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🔥</div>
                <div>
                  <h4 className="font-bold text-red-400">Burn Fee</h4>
                  <p className="text-sm text-gray-400">Deflationary pressure</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-300">
                  {contractLoading ? '...' : `${contractData.currentFees.burn}%`}
                </div>
                <div className="text-sm text-gray-400">
                  Cap: {contractLoading ? '...' : `${contractData.maxFees.burn}%`}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🫂</div>
                <div>
                  <h4 className="font-bold text-blue-400">Reflection Fee</h4>
                  <p className="text-sm text-gray-400">Holder rewards</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-300">
                  {contractLoading ? '...' : `${contractData.currentFees.reflection}%`}
                </div>
                <div className="text-sm text-gray-400">
                  Cap: {contractLoading ? '...' : `${contractData.maxFees.reflection}%`}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">💧</div>
                <div>
                  <h4 className="font-bold text-purple-400">Liquidity Fee</h4>
                  <p className="text-sm text-gray-400">Auto-liquidity</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-300">
                  {contractLoading ? '...' : `${contractData.currentFees.liquidity}%`}
                </div>
                <div className="text-sm text-gray-400">
                  Cap: {contractLoading ? '...' : `${contractData.maxFees.liquidity}%`}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-bold text-green-400">Locker Fee</h4>
                  <p className="text-sm text-gray-400">Vault rewards</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-300">
                  {contractLoading ? '...' : `${contractData.currentFees.locker}%`}
                </div>
                <div className="text-sm text-gray-400">
                  Cap: {contractLoading ? '...' : `${contractData.maxFees.locker}%`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">Security Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-400" />
                <h4 className="text-xl font-bold text-green-400">Contract Protection</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  ReentrancyGuard: Prevents recursive attacks
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Renounced: No admin keys or control
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Ownable: Controlled access management
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  SafeMath: Overflow protection built-in
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-purple-400" />
                <h4 className="text-xl font-bold text-purple-400">Fee Constraints</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Maximum total fees: {contractLoading ? 'Loading...' : `${contractData.maxFees.total}%`}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Hardcoded fee caps prevent abuse
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Immutable router for security
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Excluded address limits (max 50)
                </li>
              </ul>
            </div>
          </div>
        </div>

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
    </section>
  );
};

export default ContractTransparencySection;
