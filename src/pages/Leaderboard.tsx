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
      name: 'NOAH COUNCIL',
      icon: '⚡',
      color: 'orange-400',
      glow: 'orange-500',
      description: 'Divine Authority'
    };
    if (totalWeight >= 500000) return {
      name: 'ADMIRAL',
      icon: '⭐',
      color: 'purple-400',
      glow: 'purple-500',
      description: 'Fleet Command'
    };
    if (totalWeight >= 300000) return {
      name: 'CAPTAIN',
      icon: '💎',
      color: 'cyan-400',
      glow: 'cyan-500',
      description: 'Ark Command'
    };
    if (totalWeight >= 150000) return {
      name: 'NAVIGATOR',
      icon: '👑',
      color: 'yellow-400',
      glow: 'yellow-500',
      description: 'Storm Guide'
    };
    if (totalWeight >= 15000) return {
      name: 'SURVIVOR',
      icon: '🛡️',
      color: 'gray-400',
      glow: 'gray-500',
      description: 'Flood Protected'
    };
    return {
      name: 'LOST',
      icon: '⛵',
      color: 'red-400',
      glow: 'red-500',
      description: 'Seeking Ark'
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
        1: `bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/50`,
        2: `bg-gradient-to-r from-gray-400 to-gray-500 text-black shadow-lg shadow-gray-500/50`,
        3: `bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/50`
      };
      return colors[rank as keyof typeof colors];
    }
    return `bg-gradient-to-r from-${arkTier.color} to-${arkTier.color} text-black shadow-lg shadow-${arkTier.glow}/50 border border-${arkTier.glow}/30`;
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
          {/* Quantum field background */}
          <div className="absolute inset-0 -top-20 -bottom-20">
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
          </div>

          <div className="relative z-10 text-center py-12 px-6">
            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-green-400 tracking-wider">ARK LEADERBOARD ONLINE</span>
            </div>

            {/* Main Title with Diagnostic Styling */}
            <div className="mb-6">
              <div className="text-sm font-mono text-cyan-400/60 mb-2 tracking-[0.2em]">
                [DIVINE ASCENSION PROTOCOL]
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent animate-fade-in">ARK LEADERBOARD</h1>
              <div className="text-sm font-mono text-cyan-400/60 tracking-[0.2em]">
                [NOAH COUNCIL RANKINGS]
              </div>
            </div>

            {/* System Description */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-black/30 backdrop-blur-xl border border-teal-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-teal-400 tracking-wider">DIVINE HIERARCHY</span>
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Ascend through divine tiers of the ARK protocol. From lost souls to Noah's Council.
                  <br />
                  <span className="text-teal-400 font-mono text-sm">Only the most committed shall inherit the flood's protection.</span>
                </p>
              </div>
            </div>

            {/* Scanning Effect */}
            
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-6 -mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-black/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Ark Survivors</p>
                      <p className="text-xl font-bold text-cyan-400">{totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Council Members</p>
                      <p className="text-xl font-bold text-yellow-500">{Math.min(users.length, 50)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Ranking By</p>
                      <p className="text-sm font-bold text-purple-400">{getSortLabel(sortBy)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-cyan-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 animate-pulse"></div>
                <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg animate-[pulse_2s_ease-in-out_infinite]"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Total Ark Vault</p>
                      <p className="text-lg font-bold text-cyan-400">{formatNumber(protocolStats.totalLockedTokens)} ARK</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Divine Ascension Controls */}
        <div className="px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-12">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2 font-mono tracking-wider">[DIVINE RANKING PROTOCOL]</h3>
                <p className="text-sm text-gray-400">Choose your divine ascension metric</p>
              </div>
              
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 justify-center max-w-2xl mx-auto">
                {(['weight', 'locked', 'rewards', 'activeLocks'] as const).map(criteria => <Button key={criteria} variant={sortBy === criteria ? "default" : "outline"} onClick={() => setSortBy(criteria)} className={`relative px-3 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 border-2 hover:scale-105 ${sortBy === criteria ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-black border-transparent shadow-lg shadow-cyan-500/50 scale-105 animate-pulse' : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'}`}>
                    <span className="relative z-10 font-mono tracking-wide text-xs md:text-sm">
                      <span className="md:hidden">{getSortLabelMobile(criteria)}</span>
                      <span className="hidden md:inline">{getSortLabel(criteria)}</span>
                    </span>
                    {sortBy === criteria && <>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-teal-500/20 rounded-xl blur-sm"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl opacity-30 animate-[ping_2s_ease-in-out_infinite]"></div>
                      </>}
                  </Button>)}
              </div>
              
              {/* Decorative quantum field */}
              <div className="flex justify-center mt-6">
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
              </div>
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
                {users.map((user, index) => {
              const arkTier = getArkTier(user.totalWeight);
              const achievements = getAchievementBadges(user);
              return <Card key={user.address} className={`relative bg-black/50 hover:bg-black/70 transition-all duration-500 hover:scale-[1.02] overflow-hidden group ${user.rank <= 3 ? `ring-2 ring-${arkTier.glow}/50 shadow-lg shadow-${arkTier.glow}/20` : `border-${arkTier.glow}/30 hover:border-${arkTier.glow}/50`}`}>
                      {/* Animated background for top ranks */}
                      {user.rank <= 3 && <div className={`absolute inset-0 bg-gradient-to-r from-${arkTier.glow}/5 via-transparent to-${arkTier.glow}/5 animate-pulse`}></div>}
                      
                      {/* Scanning effect for hover */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>
                      
                      <CardContent className="p-4 md:p-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Top Section: Rank and User Info */}
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <Badge className={`px-2 md:px-3 py-1 md:py-2 font-bold text-xs md:text-sm relative overflow-hidden ${getRankBadge(user.rank, user.totalWeight)}`}>
                                <span className="relative z-10">#{user.rank}</span>
                                {user.rank <= 3 && <div className="absolute inset-0 animate-pulse bg-white/10"></div>}
                              </Badge>
                              <div className="relative">
                                {getRankIcon(user.rank, user.totalWeight)}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 md:mb-2">
                                <p className="font-mono text-sm md:text-lg text-cyan-400 truncate">
                                  {formatAddress(user.address)}
                                </p>
                                <Button size="sm" variant="ghost" onClick={() => copyAddress(user.address)} className="h-8 w-8 md:h-6 md:w-6 p-0 hover:bg-cyan-500/20 flex-shrink-0">
                                  {copiedAddress === user.address ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                </Button>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 md:mb-2">
                                <Badge className={`text-xs px-2 py-1 bg-${arkTier.color}/20 text-${arkTier.color} border border-${arkTier.color}/30 w-fit`}>
                                  {arkTier.name}
                                </Badge>
                                <span className="text-xs text-gray-500 font-mono hidden sm:inline">{arkTier.description}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 flex-wrap">
                                <p className="text-xs md:text-sm text-gray-400">Top {user.percentile}%</p>
                                <span className="hidden md:inline text-gray-400">•</span>
                                {achievements.slice(0, 1).map((achievement, i) => <Badge key={i} className={`text-xs px-1 py-0.5 bg-${achievement.color}-500/20 text-${achievement.color}-400 border border-${achievement.color}-500/30`}>
                                    {achievement.icon}
                                  </Badge>)}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section: Divine Stats - 2x2 grid on mobile */}
                          <div className="grid grid-cols-2 gap-3 md:gap-4 text-left md:text-right min-w-0 md:min-w-[300px]">
                            <div>
                              <p className="text-xs text-gray-400 font-mono">AUTH</p>
                              <p className={`font-bold text-${arkTier.color} text-sm md:text-lg truncate`}>{formatNumber(user.totalWeight)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-mono">VAULT</p>
                              <p className="font-bold text-green-400 text-sm md:text-base truncate">{formatNumber(user.totalLocked)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-mono">REWARDS</p>
                              <p className="font-bold text-purple-400 text-sm md:text-base truncate">{formatNumber(user.totalRewardsEarned)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-mono">LOCKS</p>
                              <p className="font-bold text-yellow-400 text-sm md:text-base">{user.activeLocksCount}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>;
            })}
              </div>}
          </div>
        </div>
      </div>
    </BaseLayout>;
};
export default Leaderboard;