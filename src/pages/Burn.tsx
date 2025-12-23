import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Activity, Users, TrendingUp, Zap, AlertTriangle, Info, ExternalLink, Droplets, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PremiumBackground from '../components/layout/PremiumBackground';
import { useARKTokenData } from '../hooks/useARKTokenData';
import { CONTRACT_CONSTANTS } from '../utils/constants';
import { useBurnAnalytics, BurnTransaction as BurnAnalyticsTransaction } from '../hooks/useBurnAnalytics';
import { useWalletContext } from '../components/providers/WalletProvider';
import { useLockerData } from '../hooks/useLockerData';
import { useContractData } from '../hooks/useContractData';

// Format number utility function
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

interface BurnTransaction {
  id: string;
  wallet: string;
  amount: number;
  timestamp: Date;
  txHash: string;
  blockNumber?: number;
}

interface BurnNotification {
  id: string;
  message: string;
  timestamp: Date;
  wallet: string;
  amount: number;
  txHash: string;
  type: string;
}

const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "hsl(var(--video-cyan))"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center group">
      {/* Outer glow ring */}
      <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
      
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Background circle with glass effect */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke="hsl(var(--border))" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
          className="opacity-30" 
        />
        {/* Progress arc with glow */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="transparent" 
          strokeDasharray={strokeDasharray} 
          strokeDashoffset={strokeDashoffset} 
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" 
          strokeLinecap="round" 
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          {percentage.toFixed(3)}%
        </span>
      </div>
    </div>
  );
};

const BurnMeter = ({
  value,
  max,
  label,
  color = "hsl(var(--video-cyan))"
}) => {
  const percentage = Math.min(value / max * 100, 100);
  return (
    <Card className="relative group overflow-hidden backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
      {/* Outer glow ring */}
      <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <CardContent className="p-3 md:p-4 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs md:text-sm text-white/70">{label}</span>
          <span className="text-xs md:text-sm font-mono text-white">{formatNumber(value)}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
          <div 
            className="h-2 md:h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(34,211,238,0.5)]" 
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${color}, ${color}aa)`
            }} 
          />
        </div>
        <div className="text-xs text-white/50 mt-1">
          {percentage.toFixed(1)}% of {formatNumber(max)}
        </div>
      </CardContent>
    </Card>
  );
};

const LineChart = ({ data }: { data: BurnTransaction[] }) => {
  const maxValue = Math.max(...data.map(d => d.amount), 1);
  const points = data.slice(0, 20).reverse().map((d, i) => {
    const x = i / 19 * 300;
    const y = 80 - d.amount / maxValue * 60;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <Card className="relative group overflow-hidden backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
      {/* Outer glow ring */}
      <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Recent Burn Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <svg width="300" height="80" className="w-full">
          <defs>
            <linearGradient id="chartLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--video-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--video-gold))" />
            </linearGradient>
          </defs>
          <polyline 
            fill="none" 
            stroke="url(#chartLineGradient)" 
            strokeWidth="2" 
            points={points} 
            className="drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" 
          />
          {data.slice(0, 20).reverse().map((d, i) => {
            const x = i / 19 * 300;
            const y = 80 - d.amount / maxValue * 60;
            return (
              <circle 
                key={d.id} 
                cx={x} 
                cy={y} 
                r="4" 
                fill="hsl(var(--video-cyan))" 
                className="animate-pulse drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" 
              />
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
};

const Burn = () => {
  const { data: arkData, loading: arkLoading } = useARKTokenData();
  const { burnMetrics, burnHistory, burnProjections, loading: burnLoading } = useBurnAnalytics(arkData?.volume24h ? Number(arkData.volume24h) : 0);
  const { isConnected, account, isConnecting, handleConnectWallet } = useWalletContext();
  const { protocolStats: lockerStats } = useLockerData();
  const { data: contractData } = useContractData();

  // Convert burn analytics data to our local format
  const convertedBurnHistory: BurnTransaction[] = burnHistory.map(burn => ({
    id: burn.txHash,
    wallet: burn.wallet ? `${burn.wallet.slice(0, 6)}...${burn.wallet.slice(-4)}` : `${burn.txHash.slice(0, 6)}...${burn.txHash.slice(-4)}`,
    amount: burn.amount,
    timestamp: new Date(burn.timestamp),
    txHash: burn.txHash,
    blockNumber: 0
  }));

  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [recentNotifications, setRecentNotifications] = useState<BurnNotification[]>([]);

  const timeframes = [
    { value: '5m', label: '5 Minutes', minutes: 5 },
    { value: '15m', label: '15 Minutes', minutes: 15 },
    { value: '1h', label: '1 Hour', minutes: 60 },
    { value: '4h', label: '4 Hours', minutes: 240 },
    { value: '24h', label: '24 Hours', minutes: 1440 },
    { value: '7d', label: '7 Days', minutes: 10080 },
    { value: 'all', label: 'All Time', minutes: Infinity }
  ];

  // Generate notifications from burn history
  useEffect(() => {
    if (convertedBurnHistory.length > 0) {
      const notifications = convertedBurnHistory.slice(0, 10).map(burn => ({
        id: burn.txHash,
        message: `🔥 ${burn.wallet} burned ${formatNumber(burn.amount)} ARK`,
        timestamp: burn.timestamp,
        wallet: burn.wallet,
        amount: burn.amount,
        txHash: burn.txHash,
        type: (burnHistory.find(b => b.txHash === burn.txHash)?.type) || 'transaction'
      }));
      setRecentNotifications(notifications);
    }
  }, [convertedBurnHistory, burnHistory]);

  const getFilteredData = () => {
    if (selectedTimeframe === 'all') return convertedBurnHistory;
    const timeframe = timeframes.find(t => t.value === selectedTimeframe);
    const cutoffTime = new Date(Date.now() - (timeframe?.minutes || 1440) * 60 * 1000);
    return convertedBurnHistory.filter(burn => burn.timestamp >= cutoffTime);
  };

  const filteredData = getFilteredData();

  const getTimeframeStats = () => {
    const data = filteredData;
    const totalAmount = data.reduce((sum, burn) => sum + burn.amount, 0);
    const uniqueWallets = new Set(data.map(burn => burn.wallet)).size;
    const avgBurnSize = data.length > 0 ? totalAmount / data.length : 0;
    return { totalBurns: data.length, totalAmount, uniqueWallets, avgBurnSize };
  };

  const timeframeStats = getTimeframeStats();
  const burnPercentage = burnMetrics && arkData?.totalSupply ? burnMetrics.totalBurned / Number(arkData.totalSupply) * 100 : 0;
  const loading = arkLoading || burnLoading;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Background */}
      <PremiumBackground variant="burn" particleCount={20} />

      {/* Navigation */}
      <div className="relative z-20">
        <Navigation handleConnectWallet={handleConnectWallet} isConnecting={isConnecting} isConnected={isConnected} account={account} />
      </div>

      <div className="relative z-10 pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Premium Hero Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6 md:mb-8">
            <div className="text-center lg:text-left">
              {/* Status badge with glow */}
              <div className="inline-flex items-center mb-4">
                <div className="relative group">
                  <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-orange-500/40 via-cyan-500/40 to-orange-500/40 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                  <div className="relative px-4 py-2 rounded-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="text-sm text-white/80 font-medium">[BURN PROTOCOL ACTIVE]</span>
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold michroma-regular mb-2">
                <span className="bg-gradient-to-r from-cyan-400 via-orange-400 to-gold-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.4)]">
                  🔥 ARK Burn Tracker
                </span>
              </h1>
              <p className="text-white/60 mt-2 text-sm md:text-base">[REAL-TIME TOKEN BURN MONITORING VIA PULSECHAIN]</p>
            </div>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              {/* Premium Timeframe Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60 hidden sm:block">Timeframe:</span>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-full sm:w-32 backdrop-blur-xl bg-white/[0.03] border-white/[0.08] hover:border-cyan-500/30 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-black/90 border-white/[0.08]">
                    {timeframes.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Premium connection badge */}
              <div className="relative group">
                <div className={`absolute inset-[-1px] rounded-full blur-sm opacity-60 ${isConnected ? 'bg-green-500/30' : 'bg-red-500/30'}`} />
                <Badge 
                  variant="outline" 
                  className={`relative ${isConnected ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'} backdrop-blur-xl bg-white/[0.02] text-xs sm:text-sm`}
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-red-400'}`} />
                  <span className="hidden sm:inline">{isConnected ? 'Connected to PulseChain' : 'Connecting...'}</span>
                  <span className="sm:hidden">{isConnected ? 'Connected' : 'Connecting...'}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Premium Timeframe Stats Banner */}
          <div className="relative group mb-4 md:mb-6">
            <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-orange-500/10 to-teal-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="text-center lg:text-left">
                    <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                      {timeframes.find(t => t.value === selectedTimeframe)?.label} Overview
                    </h3>
                    <p className="text-xs md:text-sm text-white/50">
                      Showing data for the selected timeframe
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-center">
                    <div className="p-3 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
                      <p className="text-xs text-white/50">Total Burns</p>
                      <p className="text-sm md:text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">{timeframeStats.totalBurns}</p>
                    </div>
                    <div className="p-3 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
                      <p className="text-xs text-white/50">Amount Burned</p>
                      <p className="text-sm md:text-lg font-bold bg-gradient-to-r from-gold-400 to-amber-300 bg-clip-text text-transparent">{formatNumber(timeframeStats.totalAmount)} ARK</p>
                    </div>
                    <div className="p-3 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
                      <p className="text-xs text-white/50">Unique Wallets</p>
                      <p className="text-sm md:text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{timeframeStats.uniqueWallets}</p>
                    </div>
                    <div className="p-3 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
                      <p className="text-xs text-white/50">Avg Burn Size</p>
                      <p className="text-sm md:text-lg font-bold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">{formatNumber(timeframeStats.avgBurnSize)} ARK</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Early Unlock and LP Burned Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Early Unlock Card */}
            <div className="relative group">
              <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-red-500/30 via-red-500/10 to-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08] hover:border-red-500/20 transition-all duration-300">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="relative group/icon">
                      <div className="absolute inset-[-4px] rounded-lg bg-red-500/20 blur-md opacity-60" />
                      <div className="relative p-2 backdrop-blur-xl bg-red-500/10 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm text-white/50">Early Unlock</p>
                    <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                      {burnHistory?.filter(b => b.type === 'penalty').reduce((sum, b) => sum + b.amount, 0) ? 
                        formatNumber(burnHistory.filter(b => b.type === 'penalty').reduce((sum, b) => sum + b.amount, 0)) : '0'} ARK
                    </p>
                    <p className="text-xs text-white/40">Penalty Burns</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LP Burned Card */}
            <div className="relative group">
              <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-blue-500/30 via-blue-500/10 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08] hover:border-blue-500/20 transition-all duration-300">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="relative group/icon">
                      <div className="absolute inset-[-4px] rounded-lg bg-blue-500/20 blur-md opacity-60" />
                      <div className="relative p-2 backdrop-blur-xl bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Droplets className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm text-white/50">LP Burned</p>
                    <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                      {contractData?.liquidityData?.lpTokensBurned ? formatNumber(Number(contractData.liquidityData.lpTokensBurned)) : '0'} LP
                    </p>
                    <p className="text-xs text-white/40">Liquidity Removed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Premium Main Burn Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
            {[
              { label: 'Total Burned', value: burnMetrics ? formatNumber(burnMetrics.totalBurned) + ' ARK' : '0 ARK', icon: Flame, color: 'cyan' },
              { label: 'Burn Rate', value: burnMetrics ? burnMetrics.burnRate.toFixed(1) + '/hr' : '0/hr', icon: Activity, color: 'gold' },
              { label: 'Burn Efficiency', value: burnMetrics ? burnMetrics.efficiency.toFixed(1) + '%' : '0%', icon: TrendingUp, color: 'blue' },
              { label: 'Active Burners', value: timeframeStats.uniqueWallets.toString(), icon: Users, color: 'teal' },
              { label: 'Supply Burned', value: burnPercentage.toFixed(3) + '%', icon: Zap, color: 'orange' }
            ].map((stat, index) => (
              <div key={stat.label} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`absolute inset-[-1px] rounded-xl bg-gradient-to-r from-${stat.color}-500/20 via-transparent to-${stat.color}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
                <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:translate-y-[-2px]">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-xs md:text-sm">{stat.label}</p>
                        <p className={`text-lg md:text-2xl font-bold bg-gradient-to-r from-${stat.color === 'gold' ? 'amber' : stat.color}-400 to-${stat.color === 'gold' ? 'amber' : stat.color}-300 bg-clip-text text-transparent`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className="relative">
                        <div className={`absolute inset-[-4px] rounded-lg bg-${stat.color === 'gold' ? 'amber' : stat.color}-500/20 blur-md opacity-60`} />
                        <stat.icon className={`relative w-6 h-6 md:w-8 md:h-8 text-${stat.color === 'gold' ? 'amber' : stat.color}-400 ${stat.label === 'Burn Rate' ? 'animate-pulse' : ''}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Burn Progress Circle */}
            <div className="relative group">
              <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Supply Reduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <CircularProgress percentage={burnPercentage} size={typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 140} color="hsl(var(--video-cyan))" />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-white/50">
                      {arkData ? formatNumber(Number(arkData.totalSupply) - (burnMetrics?.totalBurned || 0)) : 'Loading...'} ARK remaining
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Burns Chart */}
            <div className="lg:col-span-2">
              <LineChart data={convertedBurnHistory} />
            </div>
          </div>

          {/* Recent Activity and Burn Mechanics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Premium Live Updates */}
            <div className="relative group">
              <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-gold-500/20 via-orange-500/10 to-gold-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-[-2px] rounded bg-gold-500/30 blur-sm animate-pulse" />
                      <Activity className="relative w-5 h-5 text-amber-400" />
                    </div>
                    <span className="bg-gradient-to-r from-amber-400 to-gold-400 bg-clip-text text-transparent">Live Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="backdrop-blur-xl bg-white/[0.01] rounded-lg p-3 md:p-4 max-h-96 overflow-y-auto border border-white/[0.05] scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
                    <div className="space-y-3">
                      {recentNotifications.slice(0, 10).map((notification, index) => (
                        <div 
                          key={notification.id} 
                          className="relative group/item p-3 backdrop-blur-xl bg-white/[0.02] rounded-lg border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className={`relative text-xs px-2 py-1 rounded-full font-medium ${
                                notification.type === 'penalty' 
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {notification.type === 'penalty' ? '⚠️ PENALTY' : '🔥 BURN'}
                              </span>
                              <span className="text-xs text-white/40 flex-shrink-0">
                                {notification.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-white mb-2">
                            <span className="font-medium bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                              {formatNumber(notification.amount)} ARK
                            </span>
                            <span className="text-white/50"> burned by </span>
                            <button 
                              onClick={() => {
                                const originalBurn = burnHistory.find(b => b.txHash === notification.txHash);
                                const fullAddress = originalBurn?.wallet || notification.txHash;
                                window.open(`https://otter.pulsechain.com/address/${fullAddress}`, '_blank');
                              }}
                              className="text-amber-400 hover:text-amber-300 transition-colors underline decoration-dotted"
                              title="View wallet on PulseChain explorer"
                            >
                              {notification.wallet}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <button 
                              onClick={() => window.open(`https://otter.pulsechain.com/tx/${notification.txHash}`, '_blank')}
                              className="text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1"
                              title="View transaction on PulseChain explorer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Transaction
                            </button>
                          </div>
                        </div>
                      ))}
                      {recentNotifications.length === 0 && (
                        <div className="text-center py-8">
                          <div className="relative inline-block mb-2">
                            <div className="absolute inset-[-4px] rounded-lg bg-white/5 blur-md" />
                            <Activity className="relative w-8 h-8 text-white/20" />
                          </div>
                          <p className="text-white/40 text-sm">No recent burn activity</p>
                          <p className="text-white/20 text-xs mt-1">Live transactions will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Burn Mechanics Info */}
            <div className="relative group">
              <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-[-2px] rounded bg-cyan-500/30 blur-sm" />
                      <Info className="relative w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Burn Mechanics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Transaction Burns', desc: '2% of every transaction is automatically burned', color: 'gold', width: '20%' },
                      { title: 'Liquidity Burns', desc: '3% goes to liquidity, LP tokens burned', color: 'blue', width: '30%' },
                      { title: 'Early Unlock Penalties', desc: '50% of penalties burned, 50% to lockers', color: 'cyan', width: '50%', icon: AlertTriangle }
                    ].map((mechanic, index) => (
                      <div key={mechanic.title} className="relative group/mechanic">
                        <div className={`absolute inset-[-1px] rounded-lg bg-${mechanic.color === 'gold' ? 'amber' : mechanic.color}-500/10 opacity-0 group-hover/mechanic:opacity-100 transition-opacity duration-300 blur-sm`} />
                        <Card className="relative backdrop-blur-xl bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                          <CardContent className="p-4">
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 bg-gradient-to-r from-${mechanic.color === 'gold' ? 'amber' : mechanic.color}-400 to-${mechanic.color === 'gold' ? 'amber' : mechanic.color}-300 bg-clip-text text-transparent`}>
                              {mechanic.icon && <mechanic.icon className="w-4 h-4 text-cyan-400" />}
                              {mechanic.title}
                            </h4>
                            <p className="text-sm text-white/50 mb-2">{mechanic.desc}</p>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full animate-pulse bg-${mechanic.color === 'gold' ? 'amber' : mechanic.color}-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]`}
                                style={{ width: mechanic.width, animationDelay: `${index * 0.5}s` }} 
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Burn;
