import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { BurnProjection } from '../../hooks/useBurnAnalytics';
import { CONTRACT_CONSTANTS } from '../../utils/constants';
import { Calculator, TrendingUp } from 'lucide-react';

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
    if (difference > 0) return 'text-green-500';
    if (difference < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getImpactText = (difference: number) => {
    if (Math.abs(difference) < 1) return 'No significant change';
    if (difference > 0) return `+${difference.toLocaleString()} more burned`;
    return `${Math.abs(difference).toLocaleString()} less burned`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculator Input */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-video-cyan" />
            <span>Volume Impact Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Volume Input */}
          <div className="space-y-2">
            <Label htmlFor="volume">Daily Trading Volume ($)</Label>
            <Input
              id="volume"
              type="number"
              value={customVolume}
              onChange={(e) => setCustomVolume(Number(e.target.value) || 0)}
              placeholder="Enter volume in USD"
              className="text-lg"
            />
            <div className="flex justify-between text-sm text-white/70">
              <span>Current: ${currentVolume.toLocaleString()}</span>
              <span>
                {customVolume > currentVolume ? '+' : ''}
                {((customVolume / currentVolume - 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Efficiency Adjustment */}
          <div className="space-y-4">
            <Label>Efficiency Factor ({efficiencyAdjustment}% of current)</Label>
            <Slider
              value={[efficiencyAdjustment]}
              onValueChange={(value) => setEfficiencyAdjustment(value[0])}
              max={150}
              min={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-white/70">
              <span>50% (Poor)</span>
              <span>100% (Current)</span>
              <span>150% (Optimal)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label>Quick Scenarios</Label>
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
                  className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span>Burn Impact Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary/20 rounded-lg">
              <div className="text-sm text-white/70">Theoretical Burn</div>
              <div className="text-xl font-bold text-white">
                {burnCalculation.theoretical.toLocaleString()}
              </div>
              <div className="text-xs text-white/70">ARK tokens</div>
            </div>
            <div className="text-center p-4 bg-destructive/20 rounded-lg">
              <div className="text-sm text-white/70">Actual Burn</div>
              <div className="text-xl font-bold text-destructive">
                {burnCalculation.actual.toLocaleString()}
              </div>
              <div className="text-xs text-white/70">ARK tokens</div>
            </div>
          </div>

          {/* Efficiency Display */}
          <div className="text-center p-4 bg-video-cyan/20 rounded-lg">
            <div className="text-sm text-white/70">Burn Efficiency</div>
            <div className="text-2xl font-bold text-video-cyan">
              {burnCalculation.efficiency.toFixed(1)}%
            </div>
            <Badge variant={burnCalculation.efficiency >= 70 ? 'default' : 'destructive'}>
              {burnCalculation.efficiency >= 90 ? 'Excellent' : 
               burnCalculation.efficiency >= 70 ? 'Good' : 
               burnCalculation.efficiency >= 50 ? 'Fair' : 'Poor'}
            </Badge>
          </div>

          {/* Impact Comparison */}
          <div className="space-y-3">
            <Label>Impact vs Current</Label>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className={`text-lg font-semibold ${getImpactColor(burnCalculation.difference)}`}>
                {getImpactText(burnCalculation.difference)}
              </div>
              <div className="text-sm text-white/70 mt-1">
                Compared to current volume and efficiency
              </div>
            </div>
          </div>

          {/* Time Projections */}
          <div className="space-y-2">
            <Label>Time Projections</Label>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="text-white/70">Weekly</div>
                <div className="font-semibold text-white">
                  {(burnCalculation.actual * 7).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/70">Monthly</div>
                <div className="font-semibold text-white">
                  {(burnCalculation.actual * 30).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/70">Yearly</div>
                <div className="font-semibold text-white">
                  {(burnCalculation.actual * 365 / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolumeImpactCalculator;