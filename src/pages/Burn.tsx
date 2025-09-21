import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Activity, Users, TrendingUp, Zap, AlertTriangle, Info, ExternalLink, Droplets, BarChart3, Target } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useARKTokenData } from '../hooks/useARKTokenData';
import { CONTRACT_CONSTANTS } from '../utils/constants';
import { useBurnAnalytics, BurnTransaction as BurnAnalyticsTransaction } from '../hooks/useBurnAnalytics';
import { useWalletContext } from '../components/providers/WalletProvider';
import { useLockerData } from '../hooks/useLockerData';
import { useContractData } from '../hooks/useContractData';
import { BurnAccordionSection } from '../components/burn/BurnAccordionSection';
import LazyPoolBurnDashboard from '../components/burn/LazyPoolBurnDashboard';
import LazyBurnProtocolAnalytics from '../components/burn/LazyBurnProtocolAnalytics';

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
        <span className="text-sm md:text-lg font-bold text-primary">{percentage.toFixed(3)}%</span>
      </div>
    </div>
  );
};

const LineChart = ({ data }: { data: BurnTransaction[] }) => {
  const maxValue = Math.max(...data.map(d => d.amount), 1);
  const points = data.slice(0, 20).reverse().map((d, i) => {
    const x = i / 19 * 300;
    const y = 80 - d.amount / maxValue * 60;
    return `${x},${y}`;
  }).join(' ');
  
  const chartKey = `chart-${data.length}-${maxValue}`;

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-video-cyan">Recent Burn Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-20 md:h-24 relative">
          <svg key={chartKey} width="100%" height="100%" viewBox="0 0 300 80" className="overflow-visible">
            <defs>
              <linearGradient id={`burnGradient-${chartKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--video-cyan))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--video-cyan))" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <polyline fill="none" stroke={`url(#burnGradient-${chartKey})`} strokeWidth="2" points={points} className="drop-shadow-sm" />
            {data.slice(0, 20).reverse().map((d, i) => {
              const x = i / 19 * 300;
              const y = 80 - d.amount / maxValue * 60;
              return <circle key={`${chartKey}-${d.id}-${i}`} cx={x} cy={y} r="3" fill="hsl(var(--video-cyan))" className="drop-shadow-sm hover:r-4 transition-all cursor-pointer" />;
            })}
          </svg>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-white/60">
          <span>Oldest</span>
          <span className="text-video-cyan font-medium">{data.length} burns</span>
          <span>Latest</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Burn: React.FC = () => {
  const { 
    burnHistory, 
    loading: burnLoading, 
    error: burnError, 
    refetch: refetchBurnData 
  } = useBurnAnalytics();
  
  const { 
    data: arkTokenData, 
    loading: tokenLoading, 
    error: tokenError 
  } = useARKTokenData();
  
  const {
    isConnected,
    account,
    isConnecting,
    handleConnectWallet
  } = useWalletContext();
  
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
    const totalBurns = data.length;
    const totalAmount = data.reduce((sum, burn) => sum + burn.amount, 0);
    const uniqueWallets = new Set(data.map(burn => burn.wallet)).size;
    const avgBurnSize = totalBurns > 0 ? totalAmount / totalBurns : 0;

    return {
      totalBurns,
      totalAmount,
      uniqueWallets,
      avgBurnSize
    };
  };

  const timeframeStats = getTimeframeStats();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-video-purple/20 via-black to-video-cyan/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]" />
        <div className="pulse-grid absolute inset-0 opacity-30" />
      </div>

      {/* Navigation */}
      <div className="relative z-10">
        <Navigation 
          handleConnectWallet={handleConnectWallet}
          isConnecting={isConnecting}
          isConnected={isConnected}
          account={account}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                🔥 Burn Tracker
              </h1>
              <p className="text-white/70 text-lg">
                Real-time ARK token burn analytics and statistics
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40 bg-black/30 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {timeframes.map(tf => (
                    <SelectItem 
                      key={tf.value} 
                      value={tf.value}
                      className="text-white hover:bg-white/10"
                    >
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeframe Stats Banner */}
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-white/60 mb-1">Total Burns</p>
                  <p className="text-2xl font-bold text-video-cyan">{timeframeStats.totalBurns}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Amount Burned</p>
                  <p className="text-2xl font-bold text-video-red">{formatNumber(timeframeStats.totalAmount)} ARK</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Unique Wallets</p>
                  <p className="text-2xl font-bold text-video-purple">{timeframeStats.uniqueWallets}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Avg Burn Size</p>
                  <p className="text-2xl font-bold text-video-gold">{formatNumber(timeframeStats.avgBurnSize)} ARK</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accordion-based sections for better performance */}
          <div className="space-y-6">
            {/* Overview Metrics - Always visible */}
            <BurnAccordionSection
              title="Burn Overview"
              description="Key burn metrics and real-time statistics"
              icon={<Flame className="w-5 h-5 text-video-red" />}
              defaultOpen={true}
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mb-6">
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <Flame className="w-4 h-4 md:w-5 md:h-5 text-video-red animate-pulse" />
                      <h3 className="text-xs md:text-sm font-medium text-white/80">Total Burned</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg md:text-2xl font-bold text-video-red">
                        {contractData?.burnedTokens ? formatNumber(parseFloat(contractData.burnedTokens)) : '0'} ARK
                      </p>
                      <p className="text-xs text-white/60">
                        {contractData?.burnedTokens && arkTokenData?.price 
                          ? `$${formatNumber(parseFloat(contractData.burnedTokens) * (Number(arkTokenData.price) || 0))}`
                          : '$0'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <Activity className="w-4 h-4 md:w-5 md:h-5 text-video-cyan animate-pulse" />
                      <h3 className="text-xs md:text-sm font-medium text-white/80">Burn Rate</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg md:text-2xl font-bold text-video-cyan">
                        {(timeframeStats.totalBurns / (timeframes.find(t => t.value === selectedTimeframe)?.minutes || 1440) * 60).toFixed(2)}
                      </p>
                      <p className="text-xs text-white/60">burns/hour</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-video-gold animate-pulse" />
                      <h3 className="text-xs md:text-sm font-medium text-white/80">Burn Efficiency</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg md:text-2xl font-bold text-video-gold">
                        {timeframeStats.totalAmount > 0 ? (timeframeStats.totalAmount / timeframeStats.totalBurns).toFixed(0) : '0'}
                      </p>
                      <p className="text-xs text-white/60">ARK/burn</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-video-purple animate-pulse" />
                      <h3 className="text-xs md:text-sm font-medium text-white/80">Active Burners</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg md:text-2xl font-bold text-video-purple">{timeframeStats.uniqueWallets}</p>
                      <p className="text-xs text-white/60">wallets</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-video-green animate-pulse" />
                      <h3 className="text-xs md:text-sm font-medium text-white/80">Supply Burned</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg md:text-2xl font-bold text-video-green">
                        {contractData?.burnedTokens && arkTokenData?.totalSupply 
                          ? ((parseFloat(contractData.burnedTokens) / Number(arkTokenData.totalSupply || 1)) * 100).toFixed(3)
                          : '0'
                        }%
                      </p>
                      <p className="text-xs text-white/60">of total supply</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-video-cyan">Supply Reduction</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <CircularProgress 
                      percentage={contractData?.burnedTokens && arkTokenData?.totalSupply 
                        ? (parseFloat(contractData.burnedTokens) / Number(arkTokenData.totalSupply || 1)) * 100 
                        : 0
                      } 
                      size={120}
                      color="hsl(var(--video-cyan))"
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-video-cyan">Burn Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-white/80">
                      <p className="text-sm leading-relaxed">
                        <strong className="text-video-cyan">{formatNumber(parseFloat(contractData?.burnedTokens || '0'))}</strong> ARK 
                        tokens have been permanently removed from circulation.
                      </p>
                      <p className="text-sm leading-relaxed">
                        This represents <strong className="text-video-gold">
                          {contractData?.burnedTokens && arkTokenData?.totalSupply 
                            ? ((parseFloat(contractData.burnedTokens) / Number(arkTokenData.totalSupply || 1)) * 100).toFixed(3)
                            : '0'
                          }%
                        </strong> of the total supply.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <LineChart data={convertedBurnHistory} />
              </div>
            </BurnAccordionSection>

            {/* Per-Pool Analytics */}
            <BurnAccordionSection
              title="Per-Pool Burn Analytics"
              description="Detailed burn tracking across trading pairs"
              icon={<BarChart3 className="w-5 h-5 text-video-cyan" />}
            >
              <LazyPoolBurnDashboard />
            </BurnAccordionSection>

            {/* Protocol Analytics */}
            <BurnAccordionSection
              title="Advanced Analytics"
              description="Burn rate charts, efficiency metrics, and projections"
              icon={<Target className="w-5 h-5 text-video-gold" />}
            >
              <LazyBurnProtocolAnalytics />
            </BurnAccordionSection>

            {/* Live Activity */}
            <BurnAccordionSection
              title="Live Activity & Mechanics"
              description="Real-time updates and burn mechanism details"
              icon={<Activity className="w-5 h-5 text-video-purple" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-video-gold flex items-center gap-2">
                      <Activity className="w-5 h-5 animate-pulse" />
                      Live Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/20 rounded-lg p-3 md:p-4 max-h-96 overflow-y-auto border border-white/5">
                      <div className="space-y-3">
                        {recentNotifications.length > 0 ? recentNotifications.map(notification => 
                          <div key={notification.id} className="flex items-start gap-3 p-2 md:p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-2 h-2 bg-video-cyan rounded-full mt-2 animate-pulse flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white/90 break-words">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-white/60">
                                  {notification.timestamp.toLocaleTimeString()}
                                </span>
                                <button 
                                  onClick={() => window.open(`https://scan.pulsechain.com/tx/${notification.txHash}`, '_blank')} 
                                  className="text-xs text-video-cyan hover:text-video-cyan/80 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Activity className="w-8 h-8 text-white/40 mx-auto mb-2" />
                            <p className="text-white/60">No recent burn activity</p>
                            <p className="text-xs text-white/40 mt-1">Waiting for new transactions...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-video-gold flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Burn Mechanics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Card className="bg-black/20 border border-white/5">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-video-cyan mb-2 flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            Liquidity Auto-Burn
                          </h4>
                          <p className="text-sm text-white/70 mb-2">Automatic conversion and burn from liquidity accumulation</p>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-video-cyan h-2 rounded-full animate-pulse" style={{width: '60%'}} />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 border border-white/5">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-video-cyan mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Swap Tax Burns
                          </h4>
                          <p className="text-sm text-white/70 mb-2">20% of swap taxes directly burned</p>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-video-cyan h-2 rounded-full animate-pulse" style={{width: '30%'}} />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 border border-white/5">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-video-cyan mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Early Unlock Penalties
                          </h4>
                          <p className="text-sm text-white/70 mb-2">50% of penalties burned, 50% to lockers</p>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-video-cyan h-2 rounded-full animate-pulse" style={{width: '50%'}} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </BurnAccordionSection>
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