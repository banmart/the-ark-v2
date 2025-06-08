
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Unlock, Trophy, Clock, Coins, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const LOCK_TIERS = [
  { name: "Bronze", minDays: 30, maxDays: 89, multiplier: "1x", color: "bg-amber-600" },
  { name: "Silver", minDays: 90, maxDays: 179, multiplier: "1.5x", color: "bg-gray-400" },
  { name: "Gold", minDays: 180, maxDays: 364, multiplier: "2x", color: "bg-yellow-500" },
  { name: "Diamond", minDays: 365, maxDays: 1094, multiplier: "3x", color: "bg-blue-400" },
  { name: "Platinum", minDays: 1095, maxDays: 1459, multiplier: "5x", color: "bg-purple-400" },
  { name: "Legendary", minDays: 1460, maxDays: 1826, multiplier: "8x", color: "bg-red-500" }
];

const DURATION_OPTIONS = [
  { label: "30 Days", value: 30, tier: "Bronze" },
  { label: "90 Days", value: 90, tier: "Silver" },
  { label: "180 Days", value: 180, tier: "Gold" },
  { label: "1 Year", value: 365, tier: "Diamond" },
  { label: "3 Years", value: 1095, tier: "Platinum" },
  { label: "5 Years", value: 1826, tier: "Legendary" }
];

const Locker = () => {
  const [lockAmount, setLockAmount] = useState("");
  const [lockDuration, setLockDuration] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for demonstration
  const userStats = {
    totalLocked: "1,000,000",
    pendingRewards: "50,000",
    totalRewardsEarned: "250,000",
    activeLocksCount: 3
  };

  const protocolStats = {
    totalLockedTokens: "10,000,000",
    totalRewardsDistributed: "2,500,000",
    totalActiveLockers: 1250
  };

  const userLocks = [
    {
      id: 1,
      amount: "500,000",
      tier: "Gold",
      unlockTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 75,
      rewards: "25,000"
    },
    {
      id: 2,
      amount: "300,000",
      tier: "Silver",
      unlockTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      progress: 50,
      rewards: "15,000"
    },
    {
      id: 3,
      amount: "200,000",
      tier: "Diamond",
      unlockTime: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
      progress: 25,
      rewards: "10,000"
    }
  ];

  const handleLock = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!lockAmount || !lockDuration) {
      toast.error("Please enter amount and select duration");
      return;
    }
    toast.success("Lock transaction submitted!");
  };

  const handleUnlock = (lockId: number) => {
    toast.success(`Unlock transaction submitted for lock #${lockId}`);
  };

  const handleClaimRewards = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    toast.success("Rewards claimed successfully!");
  };

  const getTierByDuration = (days: number) => {
    return LOCK_TIERS.find(tier => days >= tier.minDays && days <= tier.maxDays);
  };

  const selectedTier = lockDuration ? getTierByDuration(parseInt(lockDuration)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-20 animate-pulse" />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to THE ARK
          </Link>
          
          <Button 
            variant={isConnected ? "secondary" : "default"}
            onClick={() => setIsConnected(!isConnected)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
          >
            {isConnected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ARK Token Locker
          </h1>
          <p className="text-xl text-gray-300">
            Lock your ARK tokens to earn rewards and increase your multiplier
          </p>
        </div>

        <Tabs defaultValue="lock" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="lock">Lock Tokens</TabsTrigger>
            <TabsTrigger value="locks">My Locks</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Lock Tokens Tab */}
          <TabsContent value="lock" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Lock Interface */}
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xl font-semibold">Lock ARK Tokens</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount to Lock</Label>
                      <Input
                        id="amount"
                        placeholder="Enter ARK amount"
                        value={lockAmount}
                        onChange={(e) => setLockAmount(e.target.value)}
                        className="bg-black/30 border-white/20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Lock Duration</Label>
                      <Select value={lockDuration} onValueChange={setLockDuration}>
                        <SelectTrigger className="bg-black/30 border-white/20">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label} ({option.tier})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedTier && (
                      <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <span>Selected Tier:</span>
                          <Badge className={`${selectedTier.color} text-white`}>
                            {selectedTier.name} - {selectedTier.multiplier}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleLock}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                    >
                      Lock Tokens
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Tier Information */}
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-xl font-semibold">Lock Tiers</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {LOCK_TIERS.map((tier) => (
                      <div key={tier.name} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                          <span className="font-medium">{tier.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div>{tier.minDays}-{tier.maxDays} days</div>
                          <div className="text-cyan-400">{tier.multiplier} rewards</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* My Locks Tab */}
          <TabsContent value="locks" className="space-y-6">
            <div className="grid gap-4">
              {userLocks.map((lock) => (
                <Card key={lock.id} className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="font-semibold">Lock #{lock.id}</div>
                        <div className="text-sm text-gray-400">{lock.amount} ARK</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={LOCK_TIERS.find(t => t.name === lock.tier)?.color}>
                      {lock.tier}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{lock.progress}%</span>
                    </div>
                    <Progress value={lock.progress} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div>Unlocks: {lock.unlockTime.toLocaleDateString()}</div>
                        <div className="text-cyan-400">Rewards: {lock.rewards} ARK</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnlock(lock.id)}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-xl font-semibold">Pending Rewards</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {userStats.pendingRewards} ARK
                  </div>
                  <Button 
                    onClick={handleClaimRewards}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"
                  >
                    Claim Rewards
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Reward Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Earned:</span>
                      <span className="text-cyan-400">{userStats.totalRewardsEarned} ARK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Locks:</span>
                      <span>{userStats.activeLocksCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Locked:</span>
                      <span>{userStats.totalLocked} ARK</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">Total Locked</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {protocolStats.totalLockedTokens} ARK
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-400">Rewards Distributed</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {protocolStats.totalRewardsDistributed} ARK
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-400">Active Lockers</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {protocolStats.totalActiveLockers.toLocaleString()}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Locker;
