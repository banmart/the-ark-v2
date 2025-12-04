import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { BurnProjection } from '../../hooks/useBurnAnalytics';
import { CONTRACT_CONSTANTS } from '../../utils/constants';
import { Calculator, TrendingUp, Zap } from 'lucide-react';

interface VolumeImpactCalculatorProps {
  currentVolume: number;
  burnProjections: BurnProjection[];
  currentEfficiency: number;
}

const VolumeImpactCalculator = ({ 
  currentVolume, 
  burnProjections, 
  currentEfficiency 
}: VolumeImpactCalculatorProps) => {
  const [customVolume, setCustomVolume] = useState(currentVolume);
  const [efficiencyAdjustment, setEfficiencyAdjustment] = useState(100); // Percentage of current efficiency

  // Calculate burn metrics for custom volume
  const burnCalculation = useMemo(() => {
    const burnRatePercentage = CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER;
    const theoreticalBurn = customVolume * burnRatePercentage;
    const adjustedEfficiency = (currentEfficiency / 100) * (efficiencyAdjustment / 100);
    const actualBurn = theoreticalBurn * adjustedEfficiency;
    
    return {
      theoretical: theoreticalBurn,
      actual: actualBurn,
      efficiency: adjustedEfficiency * 100,
      difference: actualBurn - (currentVolume * burnRatePercentage * (currentEfficiency / 100))
    };
  }, [customVolume, currentEfficiency, efficiencyAdjustment, currentVolume]);

  const getImpactColor = (difference: number) => {
    if (difference > 0) return 'from-green-400 to-emerald-400';
    if (difference < 0) return 'from-red-400 to-orange-400';
    return 'text-white/40';
  };

  const getImpactGlowColor = (difference: number) => {
    if (difference > 0) return 'rgba(34,197,94,0.3)';
    if (difference < 0) return 'rgba(239,68,68,0.3)';
    return 'transparent';
  };

  const getImpactText = (difference: number) => {
    if (Math.abs(difference) < 1) return 'No significant change';
    if (difference > 0) return `+${difference.toLocaleString()} more burned`;
    return `${Math.abs(difference).toLocaleString()} less burned`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Premium Calculator Input */}
      <div className="relative group">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-teal-500/10 to-cyan-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-[-2px] rounded bg-cyan-500/30 blur-sm" />
                <Calculator className="relative h-5 w-5 text-cyan-400" />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Volume Impact Calculator
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Premium Volume Input */}
            <div className="space-y-2">
              <Label htmlFor="volume" className="text-white/70">Daily Trading Volume ($)</Label>
              <div className="relative group/input">
                <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-cyan-500/20 via-transparent to-cyan-500/20 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 blur-sm" />
                <Input
                  id="volume"
                  type="number"
                  value={customVolume}
                  onChange={(e) => setCustomVolume(Number(e.target.value) || 0)}
                  placeholder="Enter volume in USD"
                  className="relative text-lg backdrop-blur-xl bg-white/[0.02] border-white/[0.08] focus:border-cyan-500/30 transition-colors"
                />
              </div>
              <div className="flex justify-between text-sm text-white/40">
                <span>Current: ${currentVolume.toLocaleString()}</span>
                <span className={customVolume > currentVolume ? 'text-green-400' : customVolume < currentVolume ? 'text-red-400' : ''}>
                  {customVolume > currentVolume ? '+' : ''}
                  {((customVolume / currentVolume - 1) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Premium Efficiency Adjustment */}
            <div className="space-y-4">
              <Label className="text-white/70">Efficiency Factor ({efficiencyAdjustment}% of current)</Label>
              <div className="relative py-2">
                <Slider
                  value={[efficiencyAdjustment]}
                  onValueChange={(value) => setEfficiencyAdjustment(value[0])}
                  max={150}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>50% (Poor)</span>
                <span className="text-cyan-400">100% (Current)</span>
                <span>150% (Optimal)</span>
              </div>
            </div>

            {/* Premium Quick Presets */}
            <div className="space-y-2">
              <Label className="text-white/70">Quick Scenarios</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '2x Volume', multiplier: 2 },
                  { label: '5x Volume', multiplier: 5 },
                  { label: '10x Volume', multiplier: 10 },
                  { label: 'Reset', multiplier: 1 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setCustomVolume(currentVolume * preset.multiplier)}
                    className="relative group/btn px-3 py-2 text-sm rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="absolute inset-[-1px] rounded-lg bg-cyan-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm" />
                    <span className="relative text-white/70 group-hover/btn:text-cyan-400 transition-colors">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Results Display */}
      <div className="relative group">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-[-2px] rounded bg-orange-500/30 blur-sm" />
                <TrendingUp className="relative h-5 w-5 text-orange-400" />
              </div>
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Burn Impact Results
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Premium Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group/metric">
                <div className="absolute inset-[-1px] rounded-lg bg-teal-500/10 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative text-center p-4 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-sm text-white/50">Theoretical Burn</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    {burnCalculation.theoretical.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40">ARK tokens</div>
                </div>
              </div>
              <div className="relative group/metric">
                <div className="absolute inset-[-1px] rounded-lg bg-orange-500/10 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative text-center p-4 rounded-lg backdrop-blur-xl bg-orange-500/5 border border-orange-500/10">
                  <div className="text-sm text-white/50">Actual Burn</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {burnCalculation.actual.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40">ARK tokens</div>
                </div>
              </div>
            </div>

            {/* Premium Efficiency Display */}
            <div className="relative group/eff">
              <div className="absolute inset-[-1px] rounded-lg bg-cyan-500/10 opacity-0 group-hover/eff:opacity-100 transition-opacity duration-300 blur-sm" />
              <div className="relative text-center p-4 rounded-lg backdrop-blur-xl bg-cyan-500/5 border border-cyan-500/10">
                <div className="text-sm text-white/50">Burn Efficiency</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  {burnCalculation.efficiency.toFixed(1)}%
                </div>
                <div className="mt-2">
                  <Badge 
                    variant={burnCalculation.efficiency >= 70 ? 'default' : 'destructive'}
                    className={`${burnCalculation.efficiency >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
                  >
                    {burnCalculation.efficiency >= 90 ? 'Excellent' : 
                     burnCalculation.efficiency >= 70 ? 'Good' : 
                     burnCalculation.efficiency >= 50 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Premium Impact Comparison */}
            <div className="space-y-3">
              <Label className="text-white/70">Impact vs Current</Label>
              <div 
                className="relative p-4 rounded-lg backdrop-blur-xl border transition-all duration-300"
                style={{ 
                  backgroundColor: getImpactGlowColor(burnCalculation.difference),
                  borderColor: burnCalculation.difference > 0 ? 'rgba(34,197,94,0.2)' : burnCalculation.difference < 0 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'
                }}
              >
                <div className={`text-lg font-semibold ${burnCalculation.difference !== 0 ? `bg-gradient-to-r ${getImpactColor(burnCalculation.difference)} bg-clip-text text-transparent` : 'text-white/40'}`}>
                  {getImpactText(burnCalculation.difference)}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  Compared to current volume and efficiency
                </div>
              </div>
            </div>

            {/* Premium Time Projections */}
            <div className="space-y-2">
              <Label className="text-white/70 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Time Projections
              </Label>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[
                  { label: 'Weekly', value: (burnCalculation.actual * 7).toLocaleString() },
                  { label: 'Monthly', value: (burnCalculation.actual * 30).toLocaleString() },
                  { label: 'Yearly', value: (burnCalculation.actual * 365 / 1000000).toFixed(2) + 'M' }
                ].map((projection) => (
                  <div 
                    key={projection.label}
                    className="text-center p-3 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors duration-300"
                  >
                    <div className="text-white/40 text-xs">{projection.label}</div>
                    <div className="font-semibold bg-gradient-to-r from-amber-400 to-gold-400 bg-clip-text text-transparent">
                      {projection.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolumeImpactCalculator;
