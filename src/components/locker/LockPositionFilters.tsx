import React from 'react';
import { Filter, SortAsc, SortDesc, Search, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  tier: string;
  status: string;
  timeRemaining: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
}

interface LockPositionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalLocks: number;
  filteredCount: number;
}

const LockPositionFilters = ({ 
  filters, 
  onFiltersChange, 
  totalLocks, 
  filteredCount 
}: LockPositionFiltersProps) => {

  const updateFilter = (key: keyof FilterOptions, value: string | 'asc' | 'desc') => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      tier: 'all',
      status: 'all',
      timeRemaining: 'all',
      sortBy: 'timeRemaining',
      sortOrder: 'asc',
      searchTerm: ''
    });
  };

  const hasActiveFilters = filters.tier !== 'all' || 
                          filters.status !== 'all' || 
                          filters.timeRemaining !== 'all' || 
                          filters.searchTerm !== '';

  return (
    <div className="relative group/filter mb-6">
      {/* Outer glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-cyan-500/10 rounded-xl blur-sm opacity-40"></div>
      
      {/* Filter container */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Filter className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Filter & Sort</h3>
            {hasActiveFilters && (
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {filteredCount} of {totalLocks}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/[0.08]"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search amount or tier..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground h-10 focus:border-ring"
              />
            </div>
          </div>

          {/* Tier Filter */}
          <Select value={filters.tier} onValueChange={(value) => updateFilter('tier', value)}>
            <SelectTrigger className="bg-muted border-border text-foreground h-10 focus:border-ring">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="bronze">🛡️ Bronze</SelectItem>
              <SelectItem value="silver">🥈 Silver</SelectItem>
              <SelectItem value="gold">👑 Gold</SelectItem>
              <SelectItem value="diamond">💎 Diamond</SelectItem>
              <SelectItem value="platinum">✨ Platinum</SelectItem>
              <SelectItem value="legendary">⚡ Legendary</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="bg-muted border-border text-foreground h-10 focus:border-ring">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ready">🟢 Ready to Unlock</SelectItem>
              <SelectItem value="soon">🟡 Unlocking Soon</SelectItem>
              <SelectItem value="active">🔵 Active</SelectItem>
            </SelectContent>
          </Select>

          {/* Time Remaining Filter */}
          <Select value={filters.timeRemaining} onValueChange={(value) => updateFilter('timeRemaining', value)}>
            <SelectTrigger className="bg-muted border-border text-foreground h-10 focus:border-ring">
              <SelectValue placeholder="Time Remaining" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="ready">Ready Now</SelectItem>
              <SelectItem value="week">&lt; 7 days</SelectItem>
              <SelectItem value="month">&lt; 30 days</SelectItem>
              <SelectItem value="long">&gt; 30 days</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <div className="flex gap-2">
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="bg-muted border-border text-foreground h-10 flex-1 focus:border-ring">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="timeRemaining">Time</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="tier">Tier</SelectItem>
                <SelectItem value="rewards">Rewards</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 bg-muted border border-border rounded-lg hover:bg-accent hover:border-ring transition-all h-10 w-10 flex items-center justify-center"
            >
              {filters.sortOrder === 'asc' ? 
                <SortAsc className="w-4 h-4 text-muted-foreground" /> : 
                <SortDesc className="w-4 h-4 text-muted-foreground" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockPositionFilters;
