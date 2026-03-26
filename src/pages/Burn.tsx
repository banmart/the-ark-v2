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
      <div className="absolute inset-[-8px] rounded-full bg-white/5 blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />
      
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Background circle */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
        />
        {/* Progress arc */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke="white" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
          strokeDasharray={strokeDasharray} 
          strokeDashoffset={strokeDashoffset} 
          className="transition-all duration-1000 ease-out" 
          strokeLinecap="round" 
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm md:text-lg font-black text-white font-mono uppercase tracking-tighter">
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
    <Card className="relative group overflow-hidden liquid-glass rounded-2xl">
      {/* Outer glow ring on hover */}
      <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-ark-gold-500/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
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
    <Card className="relative group overflow-hidden liquid-glass rounded-2xl">
      {/* Outer glow ring on hover */}
      <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-ark-gold-500/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
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
      <PremiumBackground />

      {/* Navigation */}
      <div className="relative z-20">
        <Navigation handleConnectWallet={handleConnectWallet} isConnecting={isConnecting} isConnected={isConnected} account={account} />
      </div>

      <div className="relative z-10 pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Premium Hero Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">
                <Flame className="w-4 h-4 text-ark-gold-400 animate-pulse" />
                <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">Sacred Combustion</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
                STATUTE OF COMBUSTION
              </h1>
              
              <div className="flex justify-center lg:justify-start mb-10">
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 font-mono leading-relaxed uppercase tracking-tighter">
                The immutable deflationary engine. Every transaction feeds the sacrificial pyre, securing the sanctity of the Covenant.
              </p>
            
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
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-white/[0.02] rounded-2xl blur-xl opacity-50" />
            <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex flex-col space-y-8 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 font-sans">
                    {timeframes.find(t => t.value === selectedTimeframe)?.label} REVELATIONS
                  </h3>
                  <div className="w-12 h-px bg-white/20 mx-auto lg:mx-0" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Burns</p>
                    <p className="text-xl font-black text-white font-mono">{timeframeStats.totalBurns}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Purified</p>
                    <p className="text-xl font-black text-white font-mono">{formatNumber(timeframeStats.totalAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Keepers</p>
                    <p className="text-xl font-black text-white font-mono">{timeframeStats.uniqueWallets}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Avg Pulse</p>
                    <p className="text-xl font-black text-white font-mono">{formatNumber(timeframeStats.avgBurnSize)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Early Unlock and LP Burned Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Early Unlock Card */}
            {/* Early Unlock Card */}
            <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <AlertTriangle className="w-4 h-4 text-white/60" />
                </div>
                <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Early Excision</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-white font-mono">
                    {burnHistory?.filter(b => b.type === 'penalty').reduce((sum, b) => sum + b.amount, 0) ? 
                      formatNumber(burnHistory.filter(b => b.type === 'penalty').reduce((sum, b) => sum + b.amount, 0)) : '0'}
                  </p>
                  <span className="text-[10px] text-white/20 font-mono">ARK</span>
                </div>
                <p className="text-[9px] text-white/20 font-mono">Penalty Extraction</p>
              </div>
            </div>

            {/* LP Burned Card */}
            <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <Droplets className="w-4 h-4 text-white/60" />
                </div>
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Sealed Liquidity</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-white font-mono">
                    {contractData?.liquidityData?.lpTokensBurned ? formatNumber(Number(contractData.liquidityData.lpTokensBurned)) : '0'}
                  </p>
                  <span className="text-[10px] text-white/20 font-mono">LP</span>
                </div>
                <p className="text-[9px] text-white/20 font-mono">Permanent Sanctity</p>
              </div>
            </div>
          </div>

          {/* Premium Main Burn Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Total Sacrificed', value: burnMetrics ? formatNumber(burnMetrics.totalBurned) : '0', unit: 'ARK' },
              { label: 'Combustion Rate', value: burnMetrics ? burnMetrics.burnRate.toFixed(1) : '0', unit: '/hr' },
              { label: 'Pyre Efficiency', value: burnMetrics ? burnMetrics.efficiency.toFixed(1) : '0', unit: '%' },
              { label: 'Active Spirits', value: timeframeStats.uniqueWallets.toString(), unit: 'KEEPERS' },
              { label: 'Covenant Purity', value: burnPercentage.toFixed(3), unit: '%' }
            ].map((stat, index) => (
              <div key={stat.label} className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-black text-white font-mono tracking-tighter">
                      {stat.value}
                    </p>
                    <span className="text-[10px] text-white/20 font-mono">{stat.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Burn Progress Circle */}
            <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 md:p-8">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 font-sans">
                SUPPLY REDUCTION
              </h3>
              <div className="flex justify-center mb-8">
                <CircularProgress percentage={burnPercentage} size={140} color="white" />
              </div>
              <div className="text-center">
                <div className="w-12 h-px bg-white/10 mx-auto mb-4" />
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  {arkData ? formatNumber(Number(arkData.totalSupply) - (burnMetrics?.totalBurned || 0)) : '---'} ARK REMAINING
                </p>
              </div>
            </div>

            {/* Recent Burns Chart */}
            <div className="lg:col-span-2">
              <LineChart data={convertedBurnHistory} />
            </div>
          </div>

          {/* Recent Activity and Burn Mechanics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Burn Revelations Section */}
            <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 md:p-8">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 font-sans">
                <Activity className="w-5 h-5 text-white/40" />
                LIVE REVELATIONS
              </h3>
              <div className="backdrop-blur-xl bg-white/[0.01] rounded-2xl p-4 max-h-[500px] overflow-y-auto border border-white/[0.05] scrollbar-none">
                <div className="space-y-4">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.slice(0, 10).map((notification) => (
                      <div 
                        key={notification.id} 
                        className="relative liquid-glass rounded-xl p-4 border border-white/[0.05] transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            notification.type === 'penalty' 
                              ? 'border-red-500/30 text-red-400 bg-red-500/5' 
                              : 'border-white/20 text-white/60 bg-white/5'
                          }`}>
                            {notification.type === 'penalty' ? 'EXCISION' : 'COMBUSTION'}
                          </span>
                          <span className="text-[10px] text-white/20 font-mono">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="text-sm font-mono tracking-tight mb-3">
                          <span className="text-white font-black">
                            {formatNumber(notification.amount)} ARK
                          </span>
                          <span className="text-white/40"> consumed by </span>
                          <button 
                            onClick={() => {
                              const originalBurn = burnHistory.find(b => b.txHash === notification.txHash);
                              const fullAddress = originalBurn?.wallet || notification.txHash;
                              window.open(`https://otter.pulsechain.com/address/${fullAddress}`, '_blank');
                            }}
                            className="text-white/60 hover:text-white transition-colors underline decoration-white/20"
                          >
                            {notification.wallet}
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => window.open(`https://otter.pulsechain.com/tx/${notification.txHash}`, '_blank')}
                          className="text-[9px] text-white/20 hover:text-white/40 transition-colors flex items-center gap-1 uppercase tracking-widest"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Verify on Ledger
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 opacity-20">
                      <Activity className="w-8 h-8 mx-auto mb-4" />
                      <p className="text-[10px] font-mono tracking-widest uppercase">Waiting for Revelations...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Premium Burn Mechanics Info */}
            <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 md:p-8">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 font-sans">
                <Info className="w-5 h-5 text-white/40" />
                THE STATUTES
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Combustion Protocol', desc: '1% of every transaction is purified by fire', val: '1%' },
                  { title: 'Liquidity Covenant', desc: '4% is sealed within the Eternal Pool', val: '4%' },
                  { title: 'Sacrificial Penalties', desc: '50% of breach penalties are consumed', val: '50%' }
                ].map((mechanic) => (
                  <div key={mechanic.title} className="group/statute">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tighter group-hover/statute:text-white transition-colors">
                          {mechanic.title}
                        </h4>
                        <p className="text-xs text-white/40 font-mono italic">{mechanic.desc}</p>
                      </div>
                      <span className="text-xs font-black text-white/60 font-mono">{mechanic.val}</span>
                    </div>
                    <div className="w-full h-px bg-white/10 group-hover/statute:bg-white/20 transition-colors" />
                  </div>
                ))}
              </div>
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
