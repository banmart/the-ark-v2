import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONTRACT_CONSTANTS } from '../../utils/constants';

interface FeeCalculatorProps {
  currentVolume: number;
  feeMetrics: any;
}

const FeeCalculator = ({ currentVolume, feeMetrics }: FeeCalculatorProps) => {
  const [customVolume, setCustomVolume] = useState(currentVolume.toString());

  const calculations = useMemo(() => {
    const volume = parseFloat(customVolume) || 0;
    const volumeChange = ((volume - currentVolume) / currentVolume) * 100;
    
    // Calculate theoretical fees based on volume (as percentages)
    const burnFee = volume * (CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER);
    const daoFee = volume * (CONTRACT_CONSTANTS.DAO_FEE / CONTRACT_CONSTANTS.DIVIDER);
    const liquidityFee = volume * (CONTRACT_CONSTANTS.LIQUIDITY_FEE / CONTRACT_CONSTANTS.DIVIDER);
    const lockerFee = volume * (CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER);
    
    const totalFees = burnFee + daoFee + liquidityFee + lockerFee;
    
    return {
      volume,
      volumeChange,
      fees: {
        burn: burnFee,
        dao: daoFee,
        liquidity: liquidityFee,
        locker: lockerFee,
        total: totalFees
      },
      projections: {
        weekly: totalFees * 7,
        monthly: totalFees * 30,
        yearly: totalFees * 365
      }
    };
  }, [customVolume, currentVolume]);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toFixed(2);
  };

  const presetVolumes = [
    { label: '2x Volume', multiplier: 2 },
    { label: '5x Volume', multiplier: 5 },
    { label: '10x Volume', multiplier: 10 }
  ];

  return (
    <div className="relative p-8 liquid-glass rounded-3xl border border-white/10 overflow-hidden group shadow-2xl">
      {/* Top edge highlight highlight */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Calculator Input */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
              <Calculator className="w-5 h-5 text-white/60" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter font-sans">Statute Calculator</h3>
          </div>

          <div className="space-y-6">
            {/* Volume Input */}
            <div>
              <Label htmlFor="volume" className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-3 block">Daily Trading Volume (ARK)</Label>
              <div className="relative">
                <Input
                  id="volume"
                  type="number"
                  value={customVolume}
                  onChange={(e) => setCustomVolume(e.target.value)}
                  placeholder="Enter volume amount"
                  className="bg-white/[0.03] border-white/10 text-white font-mono h-12 focus:border-ark-gold-500/50 focus:ring-0 rounded-xl"
                />
              </div>
              {calculations.volumeChange !== 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp className={`w-3 h-3 ${calculations.volumeChange > 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${calculations.volumeChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {calculations.volumeChange > 0 ? '+' : ''}{calculations.volumeChange.toFixed(1)}% vs Current Law
                  </span>
                </div>
              )}
            </div>

            {/* Preset Buttons */}
            <div>
              <Label className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-3 block">Statute Scenarios</Label>
              <div className="flex flex-wrap gap-2">
                {presetVolumes.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomVolume((currentVolume * preset.multiplier).toString())}
                    className="bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-mono text-[10px] uppercase tracking-wider rounded-lg"
                  >
                    {preset.label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomVolume(currentVolume.toString())}
                  className="bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-mono text-[10px] uppercase tracking-wider rounded-lg"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
              <Zap className="w-5 h-5 text-white/60" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter font-sans">Covenant Projections</h3>
          </div>

          <div className="space-y-6">
            {/* Daily Fees Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mb-1">Sacred Burn</p>
                <p className="font-bold text-white font-mono text-sm">{formatAmount(calculations.fees.burn)} <span className="text-[10px] text-white/20">ARK</span></p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mb-1">Council Fund</p>
                <p className="font-bold text-white font-mono text-sm">{formatAmount(calculations.fees.dao)} <span className="text-[10px] text-white/20">ARK</span></p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mb-1">Eternal Liq.</p>
                <p className="font-bold text-white font-mono text-sm">{formatAmount(calculations.fees.liquidity)} <span className="text-[10px] text-white/20">ARK</span></p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mb-1">Vault Rewards</p>
                <p className="font-bold text-white font-mono text-sm">{formatAmount(calculations.fees.locker)} <span className="text-[10px] text-white/20">ARK</span></p>
              </div>
            </div>

            {/* Total Daily */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex justify-between items-center group/total">
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Total Daily Sacrifice</span>
              <span className="text-xl font-black text-white font-mono tracking-tighter group-hover:text-ark-gold-400 transition-colors">
                {formatAmount(calculations.fees.total)} <span className="text-xs text-white/20">ARK</span>
              </span>
            </div>

            {/* Projections */}
            <div className="space-y-4 pt-2">
              <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Temporal Projections</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/[0.01] border border-white/5 text-center">
                  <p className="text-[9px] text-white/20 font-mono uppercase tracking-wider mb-1">Weekly</p>
                  <p className="font-bold text-white/80 font-mono text-xs">{formatAmount(calculations.projections.weekly)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <p className="text-[9px] text-white/20 font-mono uppercase tracking-wider mb-1">Monthly</p>
                  <p className="font-bold text-white/80 font-mono text-xs">{formatAmount(calculations.projections.monthly)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <p className="text-[9px] text-white/20 font-mono uppercase tracking-wider mb-1">Yearly</p>
                  <p className="font-bold text-white/80 font-mono text-xs">{formatAmount(calculations.projections.yearly)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeCalculator;