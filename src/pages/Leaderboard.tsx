import React, { useState } from 'react';
import { Trophy, Medal, Award, Crown, Star, Search, Zap, Lock, Gift, Users, Copy, CheckCircle } from 'lucide-react';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import { useWallet } from '../hooks/useWallet';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';

const Leaderboard = () => {
  const { isConnected, account } = useWallet();
  const { users, loading, error, sortBy, setSortBy, totalUsers, refetch, findUserRank } = useLeaderboardData(50);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { toast } = useToast();

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
        description: "Address copied to clipboard.",
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black',
        2: 'bg-gradient-to-r from-gray-400 to-gray-500 text-black',
        3: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
      };
      return colors[rank as keyof typeof colors];
    }
    if (rank <= 10) return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    if (rank <= 25) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    return 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black';
  };

  const getSortLabel = (criteria: string) => {
    switch (criteria) {
      case 'weight': return 'Total Weight';
      case 'locked': return 'Total Locked';
      case 'rewards': return 'Total Rewards';
      case 'activeLocks': return 'Active Locks';
      default: return 'Total Weight';
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h1 className="text-4xl md:text-6xl michroma-regular bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                  Leaderboard
                </h1>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Compete with the top ARK holders. Rankings based on lock weight, rewards, and commitment.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-black/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Total Users</p>
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
                      <p className="text-sm text-gray-400">Top Holders</p>
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
                      <p className="text-sm text-gray-400">Sort By</p>
                      <p className="text-sm font-bold text-purple-400">{getSortLabel(sortBy)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <Button 
                    onClick={refetch}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-black hover:scale-105 transition-transform"
                  >
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {(['weight', 'locked', 'rewards', 'activeLocks'] as const).map((criteria) => (
                <Button
                  key={criteria}
                  variant={sortBy === criteria ? "default" : "outline"}
                  onClick={() => setSortBy(criteria)}
                  className={`${
                    sortBy === criteria 
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-black' 
                      : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  {getSortLabel(criteria)}
                </Button>
              ))}
            </div>

            {/* Search Section */}
            <Card className="bg-black/50 border-cyan-500/30 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Search className="w-5 h-5" />
                  Find Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter wallet address..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    className="bg-black/50 border-gray-600 text-white"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={searchLoading || !searchAddress}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black"
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </Button>
                  {isConnected && (
                    <Button 
                      onClick={handleFindMyRank}
                      disabled={searchLoading}
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      My Rank
                    </Button>
                  )}
                </div>

                {searchResult && (
                  <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRankIcon(searchResult.rank)}
                          <div>
                            <p className="font-mono text-purple-400">{formatAddress(searchResult.address)}</p>
                            <p className="text-sm text-gray-400">
                              Rank #{searchResult.rank} • Top {searchResult.percentile}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Weight</p>
                          <p className="font-bold text-purple-400">{formatNumber(searchResult.totalWeight)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full bg-gray-800" />
                ))}
              </div>
            ) : error ? (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={refetch} variant="outline" className="border-red-500/30 text-red-400">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <Card 
                    key={user.address} 
                    className={`bg-black/50 border-cyan-500/30 hover:bg-black/70 transition-all duration-300 ${
                      user.rank <= 3 ? 'ring-2 ring-yellow-500/30' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        {/* Left: Rank and User Info */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <Badge 
                              className={`px-3 py-1 font-bold ${getRankBadge(user.rank)}`}
                            >
                              #{user.rank}
                            </Badge>
                            {getRankIcon(user.rank)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-lg text-cyan-400">
                                {formatAddress(user.address)}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyAddress(user.address)}
                                className="h-6 w-6 p-0 hover:bg-cyan-500/20"
                              >
                                {copiedAddress === user.address ? (
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400" />
                                )}
                              </Button>
                            </div>
                            <p className="text-sm text-gray-400">Top {user.percentile}%</p>
                          </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                          <div>
                            <p className="text-xs text-gray-400">Weight</p>
                            <p className="font-bold text-cyan-400">{formatNumber(user.totalWeight)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Locked</p>
                            <p className="font-bold text-green-400">{formatNumber(user.totalLocked)} ARK</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Rewards</p>
                            <p className="font-bold text-purple-400">{formatNumber(user.totalRewardsEarned)} ARK</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Active Locks</p>
                            <p className="font-bold text-yellow-400">{user.activeLocksCount}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Leaderboard;