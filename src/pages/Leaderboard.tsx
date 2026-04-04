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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
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
      name: 'TIER 0: ALPHA',
      icon: '💎',
      color: 'white',
      glow: 'white',
      description: 'Maximum Protocol Weight'
    };
    if (totalWeight >= 500000) return {
      name: 'TIER 1: PRIME',
      icon: '⚡',
      color: 'white',
      glow: 'white',
      description: 'Prime Participant'
    };
    if (totalWeight >= 300000) return {
      name: 'TIER 2: ELITE',
      icon: '🛡️',
      color: 'white',
      glow: 'white',
      description: 'High Weight Stake'
    };
    if (totalWeight >= 150000) return {
      name: 'TIER 3: CORE',
      icon: '💠',
      color: 'white',
      glow: 'white',
      description: 'Core Protocol Member'
    };
    if (totalWeight >= 15000) return {
      name: 'TIER 4: MEMBER',
      icon: '📊',
      color: 'white',
      glow: 'white',
      description: 'Active Participant'
    };
    return {
      name: 'TIER 5: ENTRY',
      icon: '🌑',
      color: 'white',
      glow: 'white',
      description: 'Initial Stake'
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
      name: 'Pioneer',
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
        return 'Yield Weight';
      case 'locked':
        return 'Vault Balance';
      case 'rewards':
        return 'Protocol Rewards';
      case 'activeLocks':
        return 'Active Locks';
      default:
        return 'Yield Weight';
    }
  };

  const getSortLabelMobile = (criteria: string) => {
    switch (criteria) {
      case 'weight':
        return 'Weight';
      case 'locked':
        return 'Vault';
      case 'rewards':
        return 'Rewards';
      case 'activeLocks':
        return 'Locks';
      default:
        return 'Weight';
    }
  };
  return <BaseLayout fixed={true}>
      <div className="min-h-screen bg-transparent text-white">
        {/* Protocol Leaderboard Header */}
        <div className="relative">
          <div className="relative z-10 text-center py-24 px-6">
            <div className="mb-12">
              <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
                Leaderboard
              </h1>

            </div>

            <div className="max-w-2xl mx-auto mb-16">
              <p className="text-white/40 text-lg md:text-xl font-mono leading-relaxed uppercase tracking-tighter italic">
                Track the global distribution of the protocol. Monitor staker positions, vault depth, and yield weightings across the network.
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
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Participants</p>
                    <p className="text-xl font-black text-white font-mono">{totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Star className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Top Participants</p>
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
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Total Vaulted</p>
                    <p className="text-xl font-black text-white font-mono">{formatNumber(protocolStats.totalLockedTokens)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Controls */}
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
                      : 'bg-white/[0.03] text-white/40 border-white/10 hover:border-white/20 hover:text-white backdrop-blur-md'
                  }`}
                >
                  {getSortLabel(criteria)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Participant Search Portal */}
        <div className="px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="liquid-glass border-cyan-500/30 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-purple-500/5"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono tracking-wider">
                  <Search className="w-5 h-5" />
                  [PARTICIPANT SEARCH]
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <Input placeholder="Enter wallet address to locate..." value={searchAddress} onChange={e => setSearchAddress(e.target.value)} className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder:text-gray-500 text-sm" />
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} disabled={searchLoading || !searchAddress} className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black font-mono tracking-wide hover:scale-105 transition-transform px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none">
                      {searchLoading ? 'SEARCHING...' : 'SEARCH'}
                    </Button>
                    {isConnected && <Button onClick={handleFindMyRank} disabled={searchLoading} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono tracking-wide px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none">
                        MY RANKING
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
                          <p className="text-sm text-gray-400 font-mono">Yield Weight</p>
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
                <Accordion type="single" collapsible className="space-y-4">
                  {users.map((user) => {
                    const arkTier = getArkTier(user.totalWeight);
                    return (
                      <AccordionItem 
                        key={user.address} 
                        value={user.address}
                        className="relative liquid-glass rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group border-b-0"
                      >
                        <AccordionTrigger className="hover:no-underline p-4 md:p-6 w-full">
                          <div className="flex items-center justify-between w-full gap-4 pr-2">
                            {/* Rank & User Info (Always Visible) */}
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xs md:text-sm font-black font-mono tracking-tighter shrink-0 ${getRankBadge(user.rank, user.totalWeight)}`}>
                                #{user.rank}
                              </div>
                              
                              <div className="text-left">
                                <p className="text-sm md:text-lg font-black text-white tracking-tighter uppercase font-sans truncate max-w-[120px] md:max-w-none">
                                  {formatAddress(user.address)}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">
                                    {arkTier.name}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Main Stat (Visible on Mobile) */}
                            <div className="text-right">
                              <p className="text-xs font-mono text-white/50 uppercase tracking-widest md:hidden mb-0.5">Weight</p>
                              <p className="text-sm md:text-xl font-black text-white font-mono tracking-tighter">
                                {formatNumber(user.totalWeight)}
                              </p>
                              <p className="hidden md:block text-xs font-mono text-white/50 uppercase tracking-widest mt-1">Weight</p>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 md:px-6 pb-6">
                          <div className="pt-4 border-t border-white/5 space-y-6">
                            {/* Detailed Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Vault Balance</p>
                                <p className="text-sm font-black text-white font-mono">{formatNumber(user.totalLocked)}</p>
                              </div>
                              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Protocol Rewards</p>
                                <p className="text-sm font-black text-white font-mono">{formatNumber(user.totalRewardsEarned)}</p>
                              </div>
                              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Active Locks</p>
                                <p className="text-sm font-black text-white font-mono">{user.activeLocksCount}</p>
                              </div>
                              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Global Percentile</p>
                                <p className="text-sm font-black text-white font-mono">Top {((user.rank / totalUsers) * 100).toFixed(1)}%</p>
                              </div>
                            </div>

                            {/* Action Buttons & Badges */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                              {/* Achievement Badges */}
                              <div className="flex flex-wrap gap-2">
                                {getAchievementBadges(user).map((badge, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-mono text-white/60">
                                    <span>{badge.icon}</span>
                                    <span className="uppercase tracking-widest">{badge.name}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => copyAddress(user.address)} 
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-mono text-white/40 hover:text-white transition-all uppercase tracking-widest"
                                >
                                  {copiedAddress === user.address ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedAddress === user.address ? 'Copied' : 'Copy Address'}
                                </button>
                                <a 
                                  href={`https://otter.pulsechain.com/address/${user.address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                >
                                  <Anchor className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>}
          </div>
        </div>
      </div>
    </BaseLayout>;
};
export default Leaderboard;