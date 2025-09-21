import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Filter, TrendingUp, Flame } from 'lucide-react';
import { PoolBurnEvent } from '../../services/perPoolBurnAnalyticsService';

interface PoolBurnEventsTableProps {
  events: PoolBurnEvent[];
  title?: string;
  showPoolColumn?: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

const PoolBurnEventsTable: React.FC<PoolBurnEventsTableProps> = ({ 
  events, 
  title = "Burn Events",
  showPoolColumn = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'burnAmount' | 'efficiency'>('timestamp');
  const [filterPool, setFilterPool] = useState<string>('all');

  // Get unique pools for filter
  const uniquePools = Array.from(new Set(events.map(event => event.poolName)));

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.poolName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPool = filterPool === 'all' || event.poolName === filterPool;
      return matchesSearch && matchesPool;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return b.timestamp - a.timestamp;
        case 'burnAmount':
          return b.burnAmount - a.burnAmount;
        case 'efficiency':
          return b.burnEfficiency - a.burnEfficiency;
        default:
          return b.timestamp - a.timestamp;
      }
    });

  const openTransaction = (txHash: string) => {
    window.open(`https://scan.pulsechain.com/tx/${txHash}`, '_blank');
  };

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-video-cyan" />
            <CardTitle className="text-lg font-semibold text-white">
              {title}
            </CardTitle>
            <Badge variant="outline" className="text-xs border-video-cyan/30 text-video-cyan">
              {events.length} total
            </Badge>
          </div>
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search wallet or tx..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-48 bg-black/50 border-white/20"
              />
            </div>
            
            {/* Pool Filter */}
            {showPoolColumn && uniquePools.length > 1 && (
              <Select value={filterPool} onValueChange={setFilterPool}>
                <SelectTrigger className="w-full sm:w-32 bg-black/50 border-white/20">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pools</SelectItem>
                  {uniquePools.map(pool => (
                    <SelectItem key={pool} value={pool}>{pool}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-32 bg-black/50 border-white/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Time</SelectItem>
                <SelectItem value="burnAmount">Amount</SelectItem>
                <SelectItem value="efficiency">Efficiency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Flame className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No burn events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/70 font-semibold pb-3">Time</th>
                  {showPoolColumn && (
                    <th className="text-left text-xs text-white/70 font-semibold pb-3">Pool</th>
                  )}
                  <th className="text-left text-xs text-white/70 font-semibold pb-3">Wallet</th>
                  <th className="text-right text-xs text-white/70 font-semibold pb-3">Burned</th>
                  <th className="text-right text-xs text-white/70 font-semibold pb-3">Swap Amount</th>
                  <th className="text-right text-xs text-white/70 font-semibold pb-3">Efficiency</th>
                  <th className="text-center text-xs text-white/70 font-semibold pb-3">Tx</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.slice(0, 50).map((event, index) => (
                  <tr 
                    key={`${event.txHash}-${index}`}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 text-sm text-white">
                      {formatTimeAgo(event.timestamp)}
                    </td>
                    {showPoolColumn && (
                      <td className="py-3">
                        <Badge 
                          variant="outline" 
                          className="text-xs border-video-cyan/30 text-video-cyan"
                        >
                          {event.poolName}
                        </Badge>
                      </td>
                    )}
                    <td className="py-3 text-sm font-mono text-white">
                      {event.wallet.slice(0, 6)}...{event.wallet.slice(-4)}
                    </td>
                    <td className="py-3 text-sm text-right text-video-cyan font-semibold">
                      {formatNumber(event.burnAmount)} ARK
                    </td>
                    <td className="py-3 text-sm text-right text-white">
                      {formatNumber(event.swapAmount)} ARK
                    </td>
                    <td className="py-3 text-sm text-right">
                      <span className={`font-semibold ${
                        event.burnEfficiency >= 5 ? 'text-green-400' :
                        event.burnEfficiency >= 2 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {event.burnEfficiency.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openTransaction(event.txHash)}
                        className="h-6 w-6 p-0 hover:bg-video-cyan/20"
                      >
                        <ExternalLink className="w-3 h-3 text-video-cyan" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEvents.length > 50 && (
              <div className="text-center pt-4">
                <p className="text-xs text-white/70">
                  Showing first 50 of {filteredEvents.length} events
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoolBurnEventsTable;