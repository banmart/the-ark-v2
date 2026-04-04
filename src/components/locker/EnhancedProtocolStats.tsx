import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Lock, Activity, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import { useLockerData } from '../../hooks/useLockerData';
import { useWallet } from '../../hooks/useWallet';
import { toast } from "@/components/ui/use-toast";

const EnhancedProtocolStats = () => {
  const {
    protocolStats,
    emergencyMode,
    contractPaused,
    earlyUnlockSettings,
    loading
  } = useLockerContractData();

  const { forceUnlockMatured } = useLockerData();
  const { signer } = useWallet();
  const [processingMatured, setProcessingMatured] = useState(false);

  const handleForceUnlockMatured = async () => {
    if (!signer) {
      toast({ variant: "destructive", title: "Wallet Required", description: "Connect your wallet to process matured locks" });
      return;
    }
    setProcessingMatured(true);
    try {
      await forceUnlockMatured(50);
      toast({ title: "Matured Locks Processed!", description: "Successfully processed up to 50 matured lock positions" });
    } catch (error: any) {
      console.error('Force unlock matured failed:', error);
      toast({ variant: "destructive", title: "Processing Failed", description: error.message || "Failed to process matured locks" });
    } finally {
      setProcessingMatured(false);
    }
  };

  const stats = [
    {
      title: 'Locked Supply',
      value: protocolStats.totalLockedTokens,
      unit: 'ARK',
      emoji: '🏛️',
      icon: Lock,
      colorRGB: '255, 255, 255',
      description: 'Total tokens currently locked in the protocol',
    },
    {
      title: 'Active Lockers',
      value: protocolStats.totalActiveLockers,
      unit: 'Users',
      emoji: '👥',
      icon: Users,
      colorRGB: '255, 255, 255',
      description: 'Unique addresses with active lock positions',
    },
    {
      title: 'Reward Pool',
      value: protocolStats.rewardPool,
      unit: 'ARK',
      emoji: '💰',
      icon: DollarSign,
      colorRGB: '255, 255, 255',
      description: 'Tokens available for distribution to lockers',
    },
    {
      title: 'Total Distributed',
      value: protocolStats.totalRewardsDistributed,
      unit: 'ARK',
      emoji: '📈',
      icon: TrendingUp,
      colorRGB: '255, 255, 255',
      description: 'Lifetime rewards paid to protocol participants',
    }
  ];

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ARK') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toFixed(0);
    }
    return value.toString();
  };

  return (
    <div className="space-y-8">
      {/* Premium System Status Header */}
      <div className="relative">
        <div className="relative liquid-glass rounded-2xl border border-white/10 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                <Activity className="w-6 h-6 text-white/60" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">PROTOCOL METRICS</h2>
                <p className="text-xs text-white/50 font-mono tracking-[0.2em] uppercase">[STATION-01 LIVE FEED]</p>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-4">
              <div className={`flex items-center gap-2 px-6 py-2 rounded-xl border font-mono text-[10px] font-black tracking-widest uppercase transition-colors ${
                emergencyMode 
                  ? 'bg-red-500/10 border-red-500/40 text-red-500' 
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                {emergencyMode ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {emergencyMode ? 'EXCLUSION_ACTIVE' : 'PROTOCOL_STABLE'}
              </div>
              
              <div className={`flex items-center gap-2 px-6 py-2 rounded-xl border font-mono text-xs font-black tracking-widest uppercase bg-white/5 border-white/20 text-white/50`}>
                EARLY_UNLOCK: {earlyUnlockSettings.enabled ? 'PERMITTED' : 'FORBIDDEN'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.title}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Outer glow */}
              <div 
                className="absolute -inset-0.5 rounded-2xl blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: `rgba(${stat.colorRGB}, 0.5)` }}
              ></div>
              
              {/* Card */}
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-500 overflow-hidden">
                {/* Inner gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: `radial-gradient(ellipse at top, rgba(${stat.colorRGB}, 0.08) 0%, transparent 60%)`
                  }}
                ></div>
                
                <div className="relative z-10">
                  {/* Icon and emoji */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div 
                        className="absolute inset-0 blur-xl opacity-40"
                        style={{ background: `rgba(${stat.colorRGB}, 0.5)` }}
                      ></div>
                      <div 
                        className="relative p-3 rounded-xl border"
                        style={{ 
                          background: `rgba(${stat.colorRGB}, 0.1)`,
                          borderColor: `rgba(${stat.colorRGB}, 0.3)`
                        }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: `rgb(${stat.colorRGB})` }} />
                      </div>
                    </div>
                    <span className="text-3xl">{stat.emoji}</span>
                  </div>
                  
                  {/* Title */}
                  <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
                  
                  {/* Value with gradient */}
                  <div 
                    className="text-2xl md:text-3xl font-black font-mono mb-1"
                    style={{ color: `rgb(${stat.colorRGB})` }}
                  >
                    {loading ? '...' : formatValue(stat.value, stat.unit)}
                  </div>
                  
                  {/* Unit */}
                  <div className="text-xs text-gray-500 font-mono">{stat.unit}</div>
                </div>

                {/* Scan line effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden rounded-2xl">
                  <div 
                    className="absolute top-0 left-0 w-full h-0.5 animate-[statScan_2s_ease-in-out_infinite]"
                    style={{ background: `linear-gradient(to right, transparent, rgba(${stat.colorRGB}, 0.6), transparent)` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Matured Locks Utility */}
      <div className="relative">
        <div className="relative liquid-glass rounded-2xl border border-white/10 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono">
                [STATUTE MAINTENANCE]
              </h3>
              <p className="text-xs text-white/50 font-mono uppercase tracking-widest leading-relaxed max-w-xl">
                 Administrate the return of matured tokens to their origin. This maintenance processes up to 50 expired lock positions in the current cycle.
               </p>
            </div>
            <button
              onClick={handleForceUnlockMatured}
              disabled={processingMatured || !signer}
              className="flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black font-mono tracking-[0.3em] uppercase transition-all duration-300 hover:scale-[1.05] disabled:opacity-20 bg-white text-black"
            >
              {processingMatured ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  INITIATING...
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3" />
                  EXECUTE MAINTENANCE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes statScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedProtocolStats;
