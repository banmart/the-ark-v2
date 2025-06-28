
import React from 'react';
import { Filter, SortAsc, SortDesc, Search } from 'lucide-react';
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
    <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400">Filter & Sort Positions</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
              {filteredCount} of {totalLocks}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by amount or tier..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 bg-black/30 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tier Filter */}
        <Select value={filters.tier} onValueChange={(value) => updateFilter('tier', value)}>
          <SelectTrigger className="bg-black/30 border-gray-600 text-white">
            <SelectValue placeholder="All Tiers" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-600">
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
          <SelectTrigger className="bg-black/30 border-gray-600 text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-600">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ready">Ready to Unlock</SelectItem>
            <SelectItem value="soon">Unlocking Soon</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>

        {/* Time Remaining Filter */}
        <Select value={filters.timeRemaining} onValueChange={(value) => updateFilter('timeRemaining', value)}>
          <SelectTrigger className="bg-black/30 border-gray-600 text-white">
            <SelectValue placeholder="Time Remaining" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-600">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="ready">Ready Now</SelectItem>
            <SelectItem value="week">Less than 7 days</SelectItem>
            <SelectItem value="month">Less than 30 days</SelectItem>
            <SelectItem value="long">More than 30 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="bg-black/30 border-gray-600 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              <SelectItem value="timeRemaining">Time Remaining</SelectItem>
              <SelectItem value="amount">Amount Locked</SelectItem>
              <SelectItem value="tier">Tier Level</SelectItem>
              <SelectItem value="rewards">Rewards Earned</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-black/30 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          >
            {filters.sortOrder === 'asc' ? 
              <SortAsc className="w-4 h-4 text-gray-400" /> : 
              <SortDesc className="w-4 h-4 text-gray-400" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockPositionFilters;
