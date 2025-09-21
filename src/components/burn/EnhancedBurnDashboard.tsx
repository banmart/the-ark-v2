import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCcw, TrendingUp, TrendingDown, Flame, DollarSign, BarChart3, Target } from 'lucide-react';
import { useEnhancedBurnAnalytics } from '@/hooks/useEnhancedBurnAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const formatNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

const formatUSD = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const BurnAddressBreakdown: React.FC<{ data: any }> = ({ data }) => {
  const total = data.totalNullBurns + data.totalDeadBurns + data.totalBurnAddressBurns;
  
  if (total === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            Burn Address Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No burn data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          Burn Address Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Null Address (0x000...000)</span>
              <span className="text-white">{formatNumber(data.totalNullBurns)} ARK</span>
            </div>
            <Progress value={(data.totalNullBurns / total) * 100} className="h-2 bg-gray-700" />
            <p className="text-xs text-gray-400 mt-1">
              {((data.totalNullBurns / total) * 100).toFixed(1)}% of total burns
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Dead Address (0x000...dEaD)</span>
              <span className="text-white">{formatNumber(data.totalDeadBurns)} ARK</span>
            </div>
            <Progress value={(data.totalDeadBurns / total) * 100} className="h-2 bg-gray-700" />
            <p className="text-xs text-gray-400 mt-1">
              {((data.totalDeadBurns / total) * 100).toFixed(1)}% of total burns
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Burn Address (0x000...369)</span>
              <span className="text-white">{formatNumber(data.totalBurnAddressBurns)} ARK</span>
            </div>
            <Progress value={(data.totalBurnAddressBurns / total) * 100} className="h-2 bg-gray-700" />
            <p className="text-xs text-gray-400 mt-1">
              {((data.totalBurnAddressBurns / total) * 100).toFixed(1)}% of total burns
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PoolRankingCard: React.FC<{ 
  title: string; 
  pools: any[]; 
  getValue: (pool: any) => number;
  formatValue: (value: number) => string;
  icon: React.ReactNode;
}> = ({ title, pools, getValue, formatValue, icon }) => (
  <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {pools.slice(0, 5).map((pool, index) => (
          <div key={pool.poolAddress} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              <span className="text-sm text-white">{pool.poolName}</span>
            </div>
            <span className="text-white font-medium">{formatValue(getValue(pool))}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const EnhancedBurnDashboard: React.FC = () => {
  const {
    poolMetrics,
    aggregatedData,
    loading,
    error,
    lastUpdated,
    exportLoading,
    refreshData,
    downloadCSV,
    burnAddressStats,
    topPerformers,
    stats
  } = useEnhancedBurnAnalytics();

  const [activeTab, setActiveTab] = useState('overview');

  const handleExportCSV = async () => {
    try {
      await downloadCSV();
      toast.success('CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  if (loading && !aggregatedData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-500/10 border-red-500/20">
        <AlertDescription className="text-red-200">
          Error loading burn analytics: {error}
          <Button 
            onClick={refreshData} 
            variant="outline" 
            size="sm" 
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enhanced Burn Analytics</h1>
          <p className="text-gray-400">
            Comprehensive ARK token burn tracking across all trading pairs
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            disabled={exportLoading}
            variant="outline"
            size="sm"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-white/90">Total Burned (24h)</p>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(aggregatedData?.totalBurnedAllPools || 0)}
                </p>
                <p className="text-sm text-white/70">ARK tokens</p>
              </div>
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-white/90">Volume (24h USD)</p>
                <p className="text-3xl font-bold text-white">
                  {formatUSD(aggregatedData?.totalVolumeUSD || 0)}
                </p>
                <p className="text-sm text-white/70">Trading volume</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-white/90">Burn Efficiency</p>
                <p className="text-3xl font-bold text-white">
                  {(aggregatedData?.overallEfficiency || 0).toFixed(2)}%
                </p>
                <p className="text-sm text-white/70">Burn/swap ratio</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-white/90">Burn per $1M USD</p>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(aggregatedData?.overallBurnPerMillionUSD || 0)}
                </p>
                <p className="text-sm text-white/70">ARK tokens</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-white/90">Active Pools</p>
                <p className="text-3xl font-bold text-white">
                  {stats.activePools}/{stats.totalPools}
                </p>
                <p className="text-sm text-white/70">Pools with burns</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/50 border border-white/10">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
            Overview
          </TabsTrigger>
          <TabsTrigger value="rankings" className="text-white data-[state=active]:bg-white/20">
            Rankings
          </TabsTrigger>
          <TabsTrigger value="distribution" className="text-white data-[state=active]:bg-white/20">
            Distribution
          </TabsTrigger>
          <TabsTrigger value="pools" className="text-white data-[state=active]:bg-white/20">
            Pool Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BurnAddressBreakdown data={burnAddressStats} />
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Burn Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {aggregatedData?.recentBurnEvents.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                       <div>
                         <p className="text-sm text-white">{event.poolName}</p>
                         <p className="text-xs text-white">
                           {formatNumber(event.burnAmount)} ARK burned
                         </p>
                       </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            event.burnType === 'burn' ? 'border-orange-400 text-orange-400' :
                            event.burnType === 'dead' ? 'border-red-400 text-red-400' :
                            'border-gray-400 text-gray-400'
                          }`}
                        >
                          {event.burnType}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PoolRankingCard
              title="Top by Burn Amount"
              pools={topPerformers.byBurnAmount}
              getValue={(pool) => pool.totalBurned24h}
              formatValue={formatNumber}
              icon={<Flame className="h-5 w-5 text-orange-400" />}
            />
            
            <PoolRankingCard
              title="Top by Efficiency"
              pools={topPerformers.byEfficiency}
              getValue={(pool) => pool.burnEfficiency}
              formatValue={(val) => `${val.toFixed(2)}%`}
              icon={<Target className="h-5 w-5 text-blue-400" />}
            />
            
            <PoolRankingCard
              title="Top by Volume"
              pools={topPerformers.byVolume}
              getValue={(pool) => pool.totalVolumeUSD24h}
              formatValue={formatUSD}
              icon={<DollarSign className="h-5 w-5 text-green-400" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Burn Address Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-white/5 rounded">
                    <p className="text-2xl font-bold text-orange-400">
                      {formatNumber(burnAddressStats.totalBurnAddressBurns)}
                    </p>
                    <p className="text-sm text-gray-400">Burn Address (0x000...369)</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded">
                    <p className="text-2xl font-bold text-red-400">
                      {formatNumber(burnAddressStats.totalDeadBurns)}
                    </p>
                    <p className="text-sm text-gray-400">Dead Address (0x000...dEaD)</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded">
                    <p className="text-2xl font-bold text-gray-400">
                      {formatNumber(burnAddressStats.totalNullBurns)}
                    </p>
                    <p className="text-sm text-gray-400">Null Address (0x000...000)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Confidence Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {poolMetrics.map((pool) => (
                     <div key={pool.poolAddress} className="flex justify-between items-center">
                       <span className="text-sm text-white">{pool.poolName}</span>
                       <Badge
                        variant="outline"
                        className={`text-xs ${
                          pool.volumeAnalytics.confidenceLevel === 'high' ? 'border-green-400 text-green-400' :
                          pool.volumeAnalytics.confidenceLevel === 'medium' ? 'border-yellow-400 text-yellow-400' :
                          'border-red-400 text-red-400'
                        }`}
                      >
                        {pool.volumeAnalytics.confidenceLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pools" className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 p-2">Pool</th>
                  <th className="text-right text-gray-400 p-2">Burned (24h)</th>
                  <th className="text-right text-gray-400 p-2">Volume USD</th>
                  <th className="text-right text-gray-400 p-2">Efficiency</th>
                  <th className="text-right text-gray-400 p-2">Burn/$1M</th>
                  <th className="text-right text-gray-400 p-2">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {poolMetrics.map((pool) => (
                  <tr key={pool.poolAddress} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-2 text-white">{pool.poolName}</td>
                    <td className="p-2 text-right text-white">{formatNumber(pool.totalBurned24h)}</td>
                    <td className="p-2 text-right text-white">{formatUSD(pool.totalVolumeUSD24h)}</td>
                    <td className="p-2 text-right text-white">{pool.burnEfficiency.toFixed(2)}%</td>
                    <td className="p-2 text-right text-white">{formatNumber(pool.burnPerMillionUSD)}</td>
                    <td className="p-2 text-right">
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          pool.volumeAnalytics.confidenceLevel === 'high' ? 'border-green-400 text-green-400' :
                          pool.volumeAnalytics.confidenceLevel === 'medium' ? 'border-yellow-400 text-yellow-400' :
                          'border-red-400 text-red-400'
                        }`}
                      >
                        {pool.volumeAnalytics.confidenceLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedBurnDashboard;