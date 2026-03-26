import React, { useState } from 'react';
import { Trophy, Medal, Award, Crown, Star, Search, Zap, Lock, Gift, Users, Copy, CheckCircle, Anchor, Compass, Ship, Sparkles, Shield } from 'lucide-react';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import { useWallet } from '../hooks/useWallet';
import { useLockerContractData } from '../hooks/useLockerContractData';
import BaseLayout from '../components/layout/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { tiers } from '../components/locker/tier-legend/tierData';
const Leaderboard = () => {
  const {
    isConnected,
    account
  } = useWallet();
  const {
    users,
    loading,
    error,
    sortBy,
    setSortBy,
    totalUsers,
    refetch,
    findUserRank
  } = useLeaderboardData(50);
  const {
    protocolStats
  } = useLockerContractData();
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const handleSearch = async () => {
    if (!searchAddress) return;
    setSearchLoading(true);
    try {
      const result = await findUserRank(searchAddress);
      setSearchResult(result);
      if (!result) {
        toast({
          title: "User Not Found",
          description: "No locker activity found for this address.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Search Error",
        description: "Failed to search for user.",
        variant: "destructive"
      });
    } finally {
      setSearchLoading(false);
    }
  };
  const handleFindMyRank = async () => {
    if (!account) return;
    setSearchAddress(account);
    await handleSearch();
  };
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard."
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address.",
        variant: "destructive"
      });
    }
  };
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };
  const getArkTier = (totalWeight: number) => {
    if (totalWeight >= 800000) return {
      name: 'ARCH-KEEPER',
      icon: '⚜️',
      color: 'white',
      glow: 'white',
      description: 'Supreme Custodian'
    };
    if (totalWeight >= 500000) return {
      name: 'HIGH SENTINEL',
      icon: '⚔️',
      color: 'white',
      glow: 'white',
      description: 'The Inner Circle'
    };
    if (totalWeight >= 300000) return {
      name: 'WARDEN',
      icon: '🛡️',
      color: 'white',
      glow: 'white',
      description: 'Statute Defender'
    };
    if (totalWeight >= 150000) return {
      name: 'ACOLYTE',
      icon: '🕯️',
      color: 'white',
      glow: 'white',
      description: 'Vow Follower'
    };
    if (totalWeight >= 15000) return {
      name: 'INITIATE',
      icon: '📜',
      color: 'white',
      glow: 'white',
      description: 'Newly Bound'
    };
    return {
      name: 'OUTCAST',
      icon: '🌑',
      color: 'white',
      glow: 'white',
      description: 'Unbound Soul'
    };
  };
  const getRankIcon = (rank: number, totalWeight: number) => {
    const arkTier = getArkTier(totalWeight);
    switch (rank) {
      case 1:
        return <div className="relative"><Crown className="w-6 h-6 text-yellow-500" /><Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" /></div>;
      case 2:
        return <div className="relative"><Medal className="w-6 h-6 text-gray-400" /><Star className="w-3 h-3 text-gray-300 absolute -top-1 -right-1 animate-pulse" /></div>;
      case 3:
        return <div className="relative"><Award className="w-6 h-6 text-amber-600" /><Shield className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-pulse" /></div>;
      default:
        return <span className="text-2xl animate-pulse">{arkTier.icon}</span>;
    }
  };
  const getRankBadge = (rank: number, totalWeight: number) => {
    const arkTier = getArkTier(totalWeight);
    if (rank <= 3) {
      const colors = {
        1: `bg-white text-black font-black`,
        2: `bg-white/80 text-black font-black`,
        3: `bg-white/60 text-black font-black`
      };
      return colors[rank as keyof typeof colors];
    }
    return `bg-white/5 text-white/60 border border-white/10 font-mono`;
  };
  const getAchievementBadges = (user: any) => {
    const badges = [];
    if (user.totalWeight >= 800000) badges.push({
      name: 'Noah',
      color: 'orange',
      icon: '⚡'
    });
    if (user.activeLocksCount >= 10) badges.push({
      name: 'Multi-Lock',
      color: 'purple',
      icon: '🔒'
    });
    if (user.totalRewardsEarned >= 100000) badges.push({
      name: 'Reward Master',
      color: 'green',
      icon: '💰'
    });
    if (user.totalLocked >= 500000) badges.push({
      name: 'Whale',
      color: 'blue',
      icon: '🐋'
    });
    return badges;
  };
  const getSortLabel = (criteria: string) => {
    switch (criteria) {
      case 'weight':
        return 'Ark Authority';
      case 'locked':
        return 'Vault Holdings';
      case 'rewards':
        return 'Divine Rewards';
      case 'activeLocks':
        return 'Active Covenants';
      default:
        return 'Ark Authority';
    }
  };

  const getSortLabelMobile = (criteria: string) => {
    switch (criteria) {
      case 'weight':
        return 'Authority';
      case 'locked':
        return 'Vault';
      case 'rewards':
        return 'Rewards';
      case 'activeLocks':
        return 'Locks';
      default:
        return 'Authority';
    }
  };
  return <BaseLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Quantum ARK Header */}
        <div className="relative">
          <div className="relative z-10 text-center py-24 px-6">
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
              <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">[HIERARCHY STATUS]</span>
            </div>

            <div className="mb-12">
              <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
                THE ASCENSION
              </h1>
              <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
            </div>

            <div className="max-w-2xl mx-auto mb-16">
              <p className="text-white/40 text-lg md:text-xl font-mono leading-relaxed uppercase tracking-tighter italic">
                Descend the hierarchy of the Keepers. Only the most consecrated shall inherit the protection of the Ark.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-6 -mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Keepers</p>
                    <p className="text-xl font-black text-white font-mono">{totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Star className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">The Consecrated</p>
                    <p className="text-xl font-black text-white font-mono">{Math.min(users.length, 50)}</p>
                  </div>
                </div>
              </div>

              <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Zap className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Metric</p>
                    <p className="text-[10px] font-black text-white font-mono uppercase truncate">{getSortLabel(sortBy)}</p>
                  </div>
                </div>
              </div>

              <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Lock className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Sanctified Vault</p>
                    <p className="text-xl font-black text-white font-mono">{formatNumber(protocolStats.totalLockedTokens)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divine Ascension Controls */}
        <div className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 justify-center">
              {(['weight', 'locked', 'rewards', 'activeLocks'] as const).map(criteria => (
                <button 
                  key={criteria} 
                  onClick={() => setSortBy(criteria)} 
                  className={`px-8 py-3 rounded-xl font-black font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                    sortBy === criteria 
                      ? 'bg-white text-black border-white' 
                      : 'bg-white/[0.03] text-white/40 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {getSortLabel(criteria)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divine Search Portal */}
        <div className="px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-black/50 border-cyan-500/30 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-purple-500/5"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono tracking-wider">
                  <Search className="w-5 h-5" />
                  [DIVINE SEEKER PROTOCOL]
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <Input placeholder="Enter divine address to locate..." value={searchAddress} onChange={e => setSearchAddress(e.target.value)} className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder:text-gray-500 text-sm" />
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} disabled={searchLoading || !searchAddress} className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black font-mono tracking-wide hover:scale-105 transition-transform px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none">
                      {searchLoading ? 'SEEKING...' : 'DIVINE SEEK'}
                    </Button>
                    {isConnected && <Button onClick={handleFindMyRank} disabled={searchLoading} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono tracking-wide px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none">
                        MY ASCENSION
                      </Button>}
                  </div>
                </div>

                {searchResult && <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRankIcon(searchResult.rank, searchResult.totalWeight)}
                          <div>
                            <p className="font-mono text-purple-400 text-lg">{formatAddress(searchResult.address)}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-400">
                                Rank #{searchResult.rank} • Top {searchResult.percentile}%
                              </p>
                              <Badge className={`text-xs px-2 py-1 ${getRankBadge(searchResult.rank, searchResult.totalWeight)}`}>
                                {getArkTier(searchResult.totalWeight).name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 font-mono">Divine Authority</p>
                          <p className="font-bold text-purple-400 text-lg">{formatNumber(searchResult.totalWeight)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Divine Ascension Leaderboard */}
        <div className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {loading ? <div className="space-y-4">
                {Array.from({
              length: 10
            }).map((_, i) => <Skeleton key={i} className="h-24 w-full bg-gray-800 animate-pulse" />)}
              </div> : error ? <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-red-400 mb-4 font-mono">[ERROR] {error}</p>
                  <Button onClick={refetch} variant="outline" className="border-red-500/30 text-red-400 font-mono">
                    RETRY_CONNECTION
                  </Button>
                </CardContent>
              </Card> : <div className="space-y-4">
                {users.map((user) => {
                  const arkTier = getArkTier(user.totalWeight);
                  return (
                    <div 
                      key={user.address} 
                      className="relative liquid-glass rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                          {/* Rank & User */}
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black font-mono tracking-tighter ${getRankBadge(user.rank, user.totalWeight)}`}>
                              #{user.rank}
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <p className="text-lg font-black text-white tracking-tighter uppercase font-sans">
                                  {formatAddress(user.address)}
                                </p>
                                <button onClick={() => copyAddress(user.address)} className="text-white/20 hover:text-white transition-colors">
                                  {copiedAddress === user.address ? <CheckCircle className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                                  {arkTier.name} • {arkTier.description}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            <div>
                              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Authority</p>
                              <p className="text-sm font-black text-white font-mono tracking-tighter">{formatNumber(user.totalWeight)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Vault</p>
                              <p className="text-sm font-black text-white font-mono tracking-tighter">{formatNumber(user.totalLocked)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Rewards</p>
                              <p className="text-sm font-black text-white font-mono tracking-tighter">{formatNumber(user.totalRewardsEarned)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Covenants</p>
                              <p className="text-sm font-black text-white font-mono tracking-tighter">{user.activeLocksCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>}
          </div>
        </div>
      </div>
    </BaseLayout>;
};
export default Leaderboard;