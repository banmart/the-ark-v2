import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useBurnAnalytics } from '../../hooks/useBurnAnalytics';
import { useARKTokenData } from '../../hooks/useARKTokenData';
import { Flame, TrendingUp, Calculator, Activity, RefreshCw, Sparkles } from 'lucide-react';
import BurnRateChart from './BurnRateChart';
import BurnEfficiencyGauge from './BurnEfficiencyGauge';
import TransactionImpactChart from './TransactionImpactChart';
import VolumeImpactCalculator from './VolumeImpactCalculator';

const BurnProtocolAnalytics = () => {
  const { data: tokenData } = useARKTokenData();
  const volume24h = typeof tokenData?.volume24h === 'number' ? tokenData.volume24h : 0;
  
  const {
    burnMetrics,
    burnHistory,
    burnProjections,
    burnTrend,
    loading,
    error,
    refetch
  } = useBurnAnalytics(volume24h);

  const [selectedTab, setSelectedTab] = useState('overview');

  if (loading && !burnMetrics) {
    return (
      <div className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 opacity-60 blur-sm animate-pulse" />
          <div className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-8">
            <div className="flex items-center justify-center space-x-3">
              <RefreshCw className="animate-spin h-5 w-5 text-cyan-400" />
              <span className="text-white/70">Loading burn analytics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 opacity-60 blur-sm" />
        <div className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load burn analytics</p>
            <Button onClick={refetch} variant="outline" className="border-white/[0.1] hover:border-cyan-500/30 hover:bg-white/[0.02]">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!burnMetrics) {
    return (
      <div className="relative group">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10 opacity-60 blur-sm" />
        <div className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-8">
          <div className="text-center">
            <p className="text-white/50">No burn data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative group">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-orange-500/20 via-cyan-500/10 to-orange-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <div className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-[-4px] rounded-lg bg-orange-500/30 blur-md opacity-60 animate-pulse" />
                <div className="relative p-2 rounded-lg backdrop-blur-xl bg-orange-500/10 border border-orange-500/20">
                  <Flame className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-gold-400 bg-clip-text text-transparent">
                  Burn Protocol Analytics
                </h2>
                <p className="text-white/50">Real-time burn mechanism analysis and projections</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-[-2px] rounded-full bg-green-500/30 blur-sm animate-pulse" />
                <Badge variant="secondary" className="relative flex items-center space-x-1 backdrop-blur-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  <Activity className="h-3 w-3" />
                  <span>Live</span>
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refetch}
                disabled={loading}
                className="hover:bg-white/[0.05] border border-transparent hover:border-white/[0.1]"
              >
                <RefreshCw className={`h-4 w-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Daily Burn', value: burnMetrics.dailyBurnAmount.toLocaleString(), unit: 'ARK tokens', color: 'orange', borderColor: 'border-orange-500/20' },
          { label: 'Burn Rate', value: burnMetrics.burnRate.toFixed(2), unit: 'tokens/hour', color: 'cyan', borderColor: 'border-cyan-500/20' },
          { label: 'Efficiency', value: burnMetrics.efficiency.toFixed(1) + '%', unit: 'vs theoretical', color: 'green', borderColor: 'border-green-500/20' },
          { label: 'Total Burned', value: (burnMetrics.totalBurned / 1000000).toFixed(2) + 'M', unit: 'ARK tokens', color: 'amber', borderColor: 'border-amber-500/20' }
        ].map((metric, index) => (
          <div key={metric.label} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`absolute inset-[-1px] rounded-xl bg-gradient-to-r from-${metric.color}-500/20 via-transparent to-${metric.color}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
            <Card className={`relative backdrop-blur-2xl bg-white/[0.02] ${metric.borderColor} hover:border-white/[0.15] transition-all duration-300 hover:translate-y-[-2px]`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/50">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-300 bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
                <p className="text-xs text-white/40 mt-1">{metric.unit}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Premium Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10 opacity-60 blur-sm" />
          <TabsList className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/[0.05] data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="impact" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/[0.05] data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <Activity className="h-4 w-4" />
              <span>Transaction Impact</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/[0.05] data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculator</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BurnRateChart data={burnHistory} />
            <BurnEfficiencyGauge 
              efficiency={burnMetrics.efficiency}
              trend={burnTrend}
            />
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <TransactionImpactChart 
            burnHistory={burnHistory}
            burnProjections={burnProjections}
          />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <VolumeImpactCalculator 
            currentVolume={volume24h}
            burnProjections={burnProjections}
            currentEfficiency={burnMetrics.efficiency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BurnProtocolAnalytics;
