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
    
    const totalFees = burnFee + reflectionFee + liquidityFee + lockerFee;
    
    return {
      volume,
      volumeChange,
      fees: {
        burn: burnFee,
        reflection: reflectionFee,
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
    <Card className="p-6 bg-gradient-to-br from-background/50 to-muted/30 border-border/50 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Input */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Fee Calculator</h3>
          </div>

          <div className="space-y-4">
            {/* Volume Input */}
            <div>
              <Label htmlFor="volume">Daily Trading Volume (ARK)</Label>
              <Input
                id="volume"
                type="number"
                value={customVolume}
                onChange={(e) => setCustomVolume(e.target.value)}
                placeholder="Enter volume amount"
                className="mt-2"
              />
              {calculations.volumeChange !== 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${calculations.volumeChange > 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={`text-sm ${calculations.volumeChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calculations.volumeChange > 0 ? '+' : ''}{calculations.volumeChange.toFixed(1)}% vs current volume
                  </span>
                </div>
              )}
            </div>

            {/* Preset Buttons */}
            <div>
              <Label>Quick Scenarios</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {presetVolumes.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomVolume((currentVolume * preset.multiplier).toString())}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomVolume(currentVolume.toString())}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Projected Fees</h3>
          </div>

          <div className="space-y-4">
            {/* Daily Fees Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-muted-foreground">Burn</p>
                <p className="font-semibold text-red-400">{formatAmount(calculations.fees.burn)} ARK</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-muted-foreground">Reflection</p>
                <p className="font-semibold text-blue-400">{formatAmount(calculations.fees.reflection)} ARK</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-muted-foreground">Liquidity</p>
                <p className="font-semibold text-green-400">{formatAmount(calculations.fees.liquidity)} ARK</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-muted-foreground">Locker</p>
                <p className="font-semibold text-purple-400">{formatAmount(calculations.fees.locker)} ARK</p>
              </div>
            </div>

            {/* Total Daily */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Daily Fees</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {formatAmount(calculations.fees.total)} ARK
                </Badge>
              </div>
            </div>

            {/* Projections */}
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium text-muted-foreground">Projections</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-muted-foreground">Weekly</p>
                  <p className="font-semibold">{formatAmount(calculations.projections.weekly)} ARK</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Monthly</p>
                  <p className="font-semibold">{formatAmount(calculations.projections.monthly)} ARK</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Yearly</p>
                  <p className="font-semibold">{formatAmount(calculations.projections.yearly)} ARK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeeCalculator;