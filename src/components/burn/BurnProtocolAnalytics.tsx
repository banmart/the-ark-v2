import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useBurnAnalytics } from '../../hooks/useBurnAnalytics';
import { useARKTokenData } from '../../hooks/useARKTokenData';
import { Flame, TrendingUp, Calculator, Activity, RefreshCw } from 'lucide-react';
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
        <div className="glass-card rounded-xl p-8">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="animate-spin h-5 w-5 text-video-cyan" />
            <span className="text-white">Loading burn analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load burn analytics</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!burnMetrics) {
    return (
      <div className="glass-card rounded-xl p-8">
        <div className="text-center">
          <p className="text-white/70">No burn data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <Flame className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Burn Protocol Analytics</h2>
              <p className="text-white/70">Real-time burn mechanism analysis and projections</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Activity className="h-3 w-3" />
              <span>Live</span>
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Daily Burn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {burnMetrics.dailyBurnAmount.toLocaleString()}
            </div>
            <p className="text-xs text-white/70 mt-1">ARK tokens</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-video-cyan/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Burn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-cyan">
              {burnMetrics.burnRate.toFixed(2)}
            </div>
            <p className="text-xs text-white/70 mt-1">tokens/hour</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {burnMetrics.efficiency.toFixed(1)}%
            </div>
            <p className="text-xs text-white/70 mt-1">vs theoretical</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Total Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {(burnMetrics.totalBurned / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-white/70 mt-1">ARK tokens</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="glass-card">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Transaction Impact</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Calculator</span>
          </TabsTrigger>
        </TabsList>

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