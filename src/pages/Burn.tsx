import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Activity, Users, TrendingUp, Zap, AlertTriangle, Info } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useARKTokenData } from '../hooks/useARKTokenData';
import { CONTRACT_CONSTANTS } from '../utils/constants';
import { useBurnAnalytics, BurnTransaction as BurnAnalyticsTransaction } from '../hooks/useBurnAnalytics';
import { useWalletContext } from '../components/providers/WalletProvider';

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
}

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "hsl(var(--video-cyan))" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-primary">{percentage.toFixed(3)}%</span>
      </div>
    </div>
  );
};

const BurnMeter = ({ value, max, label, color = "hsl(var(--video-cyan))" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/70">{label}</span>
          <span className="text-sm font-mono text-white">{formatNumber(value)}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-500 ease-out"
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
    const x = (i / 19) * 300;
    const y = 80 - (d.amount / maxValue) * 60;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-video-cyan">Recent Burn Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <svg width="300" height="80" className="w-full">
          <polyline
            fill="none"
            stroke="hsl(var(--video-cyan))"
            strokeWidth="2"
            points={points}
            className="drop-shadow-sm"
          />
          {data.slice(0, 20).reverse().map((d, i) => {
            const x = (i / 19) * 300;
            const y = 80 - (d.amount / maxValue) * 60;
            return (
              <circle
                key={d.id}
                cx={x}
                cy={y}
                r="3"
                fill="hsl(var(--video-cyan))"
                className="animate-pulse"
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
  const { burnMetrics, burnHistory, burnProjections, loading: burnLoading } = useBurnAnalytics(
    arkData?.volume24h ? Number(arkData.volume24h) : 0
  );
  const { isConnected, account, isConnecting, handleConnectWallet } = useWalletContext();
  
  // Convert burn analytics data to our local format
  const convertedBurnHistory: BurnTransaction[] = burnHistory.map(burn => ({
    id: burn.txHash,
    wallet: `${burn.txHash.slice(0, 6)}...${burn.txHash.slice(-4)}`, // Generate wallet-like display from hash
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
        message: `🔥 ${burn.wallet} burned ${burn.amount.toLocaleString()} ARK!`,
        timestamp: burn.timestamp,
        wallet: burn.wallet,
        amount: burn.amount
      }));
      setRecentNotifications(notifications);
    }
  }, [convertedBurnHistory]);

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
    
    return {
      totalBurns: data.length,
      totalAmount,
      uniqueWallets,
      avgBurnSize
    };
  };

  const timeframeStats = getTimeframeStats();
  const burnPercentage = burnMetrics && arkData?.totalSupply 
    ? (burnMetrics.totalBurned / Number(arkData.totalSupply)) * 100 
    : 0;

  const loading = arkLoading || burnLoading;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Quantum Field Background */}
      <div className="fixed inset-0 z-0">
        {/* Base quantum gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-video-cyan/20 via-black to-black"></div>
        
        {/* Animated quantum grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="pulse-grid bg-grid bg-grid-size animate-pulse"></div>
        </div>
        
        {/* Floating quantum orbs */}
        <div className="floating-orb orb1 bg-gradient-radial from-video-cyan/20 to-transparent blur-3xl"></div>
        <div className="floating-orb orb2 bg-gradient-radial from-video-blue/20 to-transparent blur-3xl"></div>
        <div className="floating-orb orb3 bg-gradient-radial from-video-gold/20 to-transparent blur-3xl"></div>
        
        {/* Breathing Gradient Bursts */}
        <div className="gradient-burst burst1 bg-gradient-radial from-video-cyan/10 to-transparent animate-pulse"></div>
        <div className="gradient-burst burst2 bg-gradient-radial from-video-blue/10 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="gradient-burst burst3 bg-gradient-radial from-video-gold/10 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="gradient-burst burst4 bg-gradient-radial from-video-cyan/10 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="gradient-burst burst5 bg-gradient-radial from-video-blue/10 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="gradient-burst burst6 bg-gradient-radial from-video-gold/10 to-transparent animate-pulse" style={{animationDelay: '2.5s'}}></div>
        
        {/* Scanning lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-video-cyan/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-video-gold/50 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation */}
      <div className="relative z-20">
        <Navigation 
          handleConnectWallet={handleConnectWallet}
          isConnecting={isConnecting}
          isConnected={isConnected}
          account={account}
        />
      </div>

      <div className="relative z-10 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-video-cyan to-video-blue bg-clip-text text-transparent michroma-regular">
                🔥 ARK Burn Tracker
              </h1>
              <p className="text-muted-foreground mt-2">Real-time token burn activity monitoring via PulseChain</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Timeframe:</span>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-32 bg-card/50 border-video-cyan/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Badge variant="outline" className={`${isConnected ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isConnected ? 'Connected to PulseChain' : 'Connecting...'}
              </Badge>
            </div>
          </div>

          {/* Timeframe Stats Banner */}
          <Card className="mb-6 bg-black/40 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {timeframes.find(t => t.value === selectedTimeframe)?.label} Overview
                  </h3>
                  <p className="text-sm text-white/70">
                    Showing data for the selected timeframe
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Burns</p>
                    <p className="text-lg font-bold text-video-cyan">{timeframeStats.totalBurns}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount Burned</p>
                    <p className="text-lg font-bold text-video-gold">{formatNumber(timeframeStats.totalAmount)} ARK</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unique Wallets</p>
                    <p className="text-lg font-bold text-video-blue">{timeframeStats.uniqueWallets}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Burn Size</p>
                    <p className="text-lg font-bold text-primary">{formatNumber(timeframeStats.avgBurnSize)} ARK</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Burned</p>
                    <p className="text-2xl font-bold text-video-cyan">
                      {burnMetrics ? formatNumber(burnMetrics.totalBurned) : '0'} ARK
                    </p>
                  </div>
                  <Flame className="w-8 h-8 text-video-cyan" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Burn Rate</p>
                    <p className="text-2xl font-bold text-video-gold">
                      {burnMetrics ? burnMetrics.burnRate.toFixed(1) : '0'}/hr
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-video-gold animate-pulse" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Burn Efficiency</p>
                    <p className="text-2xl font-bold text-video-blue">
                      {burnMetrics ? burnMetrics.efficiency.toFixed(1) : '0'}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-video-blue" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Burners</p>
                    <p className="text-2xl font-bold text-video-cyan">
                      {timeframeStats.uniqueWallets}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-video-cyan" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Supply Burned</p>
                    <p className="text-2xl font-bold text-video-cyan">
                      {burnPercentage.toFixed(3)}%
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-video-cyan" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Burn Progress Circle */}
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-video-cyan">Supply Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <CircularProgress 
                    percentage={burnPercentage} 
                    size={140}
                    color="hsl(var(--video-cyan))"
                  />
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    {arkData ? formatNumber(Number(arkData.totalSupply) - (burnMetrics?.totalBurned || 0)) : 'Loading...'} ARK remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Burns Chart */}
            <div className="lg:col-span-2">
              <LineChart data={convertedBurnHistory} />
            </div>
          </div>

          {/* Meters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BurnMeter 
              value={burnMetrics?.totalBurned || 0} 
              max={50000000} 
              label="Total Burned" 
              color="hsl(var(--video-cyan))"
            />
            <BurnMeter 
              value={(burnMetrics?.burnRate || 0) * 60} 
              max={600} 
              label="Burns per Hour" 
              color="hsl(var(--video-gold))"
            />
            <BurnMeter 
              value={timeframeStats.uniqueWallets} 
              max={100} 
              label="Active Burners" 
              color="hsl(var(--video-blue))"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-video-gold flex items-center gap-2">
                  <Activity className="w-5 h-5 animate-pulse" />
                  Live Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto border border-white/5">
                  <div className="space-y-2 text-sm">
                    {recentNotifications.slice(0, 10).map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                        <span className="text-white truncate">{notification.message}</span>
                        <span className="text-xs text-white/60 ml-2 flex-shrink-0">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                    {recentNotifications.length === 0 && (
                      <p className="text-white/50 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Burn Mechanics Info */}
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-video-cyan flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Burn Mechanics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-video-gold mb-2">Transaction Burns</h4>
                      <p className="text-sm text-white/70 mb-2">2% of every transaction is automatically burned</p>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-video-gold h-2 rounded-full animate-pulse" style={{width: '20%'}} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-video-blue mb-2">Liquidity Burns</h4>
                      <p className="text-sm text-white/70 mb-2">3% goes to liquidity, LP tokens burned</p>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-video-blue h-2 rounded-full animate-pulse" style={{width: '30%', animationDelay: '0.5s'}} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-video-cyan mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Early Unlock Penalties
                      </h4>
                      <p className="text-sm text-white/70 mb-2">50% of penalties burned, 50% to lockers</p>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-video-cyan h-2 rounded-full animate-pulse" style={{width: '50%', animationDelay: '1s'}} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
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