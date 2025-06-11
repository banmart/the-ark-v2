
import React from 'react';

interface SwapSectionProps {
  fromAmount: string;
  toAmount: string;
  plsBalance: string;
  arkBalance: string;
  swapLoading: boolean;
  slippage: number;
  canSwap: boolean;
  isConnected: boolean;
  setFromAmount: (amount: string) => void;
  handleSwap: () => void;
}

const SwapSection = ({ 
  fromAmount, 
  toAmount, 
  plsBalance, 
  arkBalance, 
  swapLoading, 
  slippage, 
  canSwap, 
  isConnected, 
  setFromAmount, 
  handleSwap 
}: SwapSectionProps) => {
  return (
    <section id="swap" className="relative z-10 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Swap PLS for ARK
        </h2>
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* From Token */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">From</span>
                <span className="text-sm text-gray-400">Balance: {parseFloat(plsBalance).toFixed(4)} PLS</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="0.0" 
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none" 
                />
                <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                  <span className="font-semibold">PLS</span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <button className="p-3 glass-card hover:glass-strong rounded-full transition-all rotate-0 hover:rotate-180 duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">To</span>
                <span className="text-sm text-gray-400">Balance: {parseFloat(arkBalance).toFixed(2)} ARK</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="0.0" 
                  value={toAmount}
                  className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none" 
                  readOnly 
                />
                <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
                  <div className="w-6 h-6 bg-cyan-400 rounded-full"></div>
                  <span className="font-semibold">ARK</span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <button 
              onClick={handleSwap}
              disabled={!canSwap || swapLoading}
              className="w-full bg-cyan-500 text-black font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform text-lg"
            >
              {swapLoading ? 'Swapping...' : !isConnected ? 'Connect Wallet First' : !canSwap ? 'Enter Amount' : 'Swap Tokens'}
            </button>

            {/* Swap Info */}
            <div className="glass-card rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Rate</span>
                <span>1 PLS = 100 ARK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage</span>
                <span>{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network Fee</span>
                <span>~$0.01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapSection;
