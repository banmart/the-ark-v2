import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, TrendingUp, Flame, Activity, Zap, Users, AlertCircle } from 'lucide-react';
import { usePerPoolBurnAnalytics } from '../../hooks/usePerPoolBurnAnalytics';
import PoolBurnCard from './PoolBurnCard';
import PoolBurnEventsTable from './PoolBurnEventsTable';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const COLORS = ['#00d4ff', '#ffd700', '#00b4d8', '#90e0ef', '#caf0f8', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

const PoolBurnDashboard: React.FC = () => {
  const {
    poolMetrics,
    aggregatedData,
    selectedPoolEvents,
    topPerformingPools,
    totalBurnAmount,
    totalVolume,
    averageEfficiency,
    recentActivity,
    loading,
    error,
    lastUpdated,
    fetchPoolEvents,
    refreshData,
    clearCache
  } = usePerPoolBurnAnalytics();

  const [selectedPool, setSelectedPool] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  const handlePoolSelect = (poolAddress: string) => {
    setSelectedPool(poolAddress);
    fetchPoolEvents(poolAddress);
    setActiveTab('pool-details');
  };

  // Prepare chart data
  const poolComparisonData = poolMetrics.map(pool => ({
    name: pool.poolName.replace('ARK/', ''),
    burned: pool.totalBurned24h,
    volume: pool.totalSwapVolume24h,
    efficiency: pool.burnEfficiency
  }));

  const efficiencyData = topPerformingPools.map(pool => ({
    name: pool.poolName.replace('ARK/', ''),
    value: pool.burnEfficiency
  }));

  if (error) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border border-red-500/20">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Per-Pool Burn Analytics</h2>
          <p className="text-muted-foreground">
            Real-time burn tracking across ARK trading pairs
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={clearCache}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-video-cyan/30 text-video-cyan hover:bg-video-cyan/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Total Burned (24h)</p>
                <p className="text-xl font-bold text-video-cyan">
                  {formatNumber(totalBurnAmount)} ARK
                </p>
              </div>
              <Flame className="w-8 h-8 text-video-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Total Volume (24h)</p>
                <p className="text-xl font-bold text-video-gold">
                  {formatNumber(totalVolume)} ARK
                </p>
              </div>
              <Activity className="w-8 h-8 text-video-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Avg Efficiency</p>
                <p className="text-xl font-bold text-video-blue">
                  {averageEfficiency.toFixed(2)}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-video-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Active Pools</p>
                <p className="text-xl font-bold text-white">
                  {poolMetrics.filter(p => p.totalBurned24h > 0).length}/{poolMetrics.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pools">Pool Comparison</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="pool-details">Pool Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Top Performing Pools */}
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-video-cyan" />
                <span>Top Performing Pools (by Efficiency)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topPerformingPools.slice(0, 6).map((pool) => (
                  <PoolBurnCard
                    key={pool.poolAddress}
                    pool={pool}
                    onClick={() => handlePoolSelect(pool.poolAddress)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pool Burn Comparison Chart */}
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Burn Amount by Pool (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={poolComparisonData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#fff', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '1px solid rgba(0,212,255,0.3)' 
                      }}
                      formatter={(value: number) => [formatNumber(value) + ' ARK', 'Burned']}
                    />
                    <Bar dataKey="burned" fill="#00d4ff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Efficiency Distribution */}
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Burn Efficiency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={efficiencyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {efficiencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Efficiency']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pool Comparison Tab */}
        <TabsContent value="pools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {poolMetrics.map((pool) => (
              <PoolBurnCard
                key={pool.poolAddress}
                pool={pool}
                onClick={() => handlePoolSelect(pool.poolAddress)}
                isSelected={selectedPool === pool.poolAddress}
              />
            ))}
          </div>
        </TabsContent>

        {/* Recent Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <PoolBurnEventsTable 
            events={recentActivity}
            title="Recent Burn Events (All Pools)"
            showPoolColumn={true}
          />
        </TabsContent>

        {/* Pool Details Tab */}
        <TabsContent value="pool-details" className="space-y-6">
          {selectedPool ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {poolMetrics.find(p => p.poolAddress === selectedPool)?.poolName || 'Pool Details'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Detailed burn activity for this trading pair
                  </p>
                </div>
                <Badge variant="outline" className="text-video-cyan border-video-cyan/30">
                  {selectedPoolEvents.length} events
                </Badge>
              </div>
              
              <PoolBurnEventsTable 
                events={selectedPoolEvents}
                title={`${poolMetrics.find(p => p.poolAddress === selectedPool)?.poolName} Burn Events`}
                showPoolColumn={false}
              />
            </>
          ) : (
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a pool from the "Pool Comparison" tab to view detailed burn events
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PoolBurnDashboard;