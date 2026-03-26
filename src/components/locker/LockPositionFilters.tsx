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
    <div className="relative liquid-glass border border-white/10 rounded-2xl p-8 backdrop-blur-3xl overflow-hidden mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
            <Filter className="w-5 h-5 text-white/60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">PROTOCOL QUERY</h3>
            <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">[MANAGEMENT FILTERS]</p>
          </div>
          {hasActiveFilters && (
            <Badge className="bg-white/10 text-white/60 border-white/20 font-mono text-[10px] tracking-widest px-4 py-1.5 rounded-xl uppercase">
              {filteredCount} / {totalLocks} FOUND
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="group flex items-center gap-3 text-[10px] font-black font-mono tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase px-6 py-2 bg-white/5 border border-white/10 rounded-xl"
          >
            <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
            RESET SELECTION
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input
              placeholder="SEARCH BY MAGNITUDE OR STANDING..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white font-mono text-[10px] tracking-widest h-14 rounded-2xl focus:border-white/40 placeholder:text-white/10 uppercase"
            />
          </div>
        </div>

        {/* Tier Filter */}
        <Select value={filters.tier} onValueChange={(value) => updateFilter('tier', value)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white font-black font-mono text-[10px] tracking-widest h-14 px-6 rounded-2xl focus:ring-0 focus:border-white/40 transition-all uppercase">
            <SelectValue placeholder="ALL STANDINGS" />
          </SelectTrigger>
          <SelectContent className="bg-[#050505] border-white/10 text-white font-mono uppercase tracking-widest text-[10px]">
            <SelectItem value="all">ALL STANDINGS</SelectItem>
            <SelectItem value="initiate">I • INITIATE</SelectItem>
            <SelectItem value="acolyte">II • ACOLYTE</SelectItem>
            <SelectItem value="warden">III • WARDEN</SelectItem>
            <SelectItem value="sentinel">IV • SENTINEL</SelectItem>
            <SelectItem value="arch-keeper">V • ARCH-KEEPER</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white font-black font-mono text-[10px] tracking-widest h-14 px-6 rounded-2xl focus:ring-0 focus:border-white/40 transition-all uppercase">
            <SelectValue placeholder="ALL STATUS" />
          </SelectTrigger>
          <SelectContent className="bg-[#050505] border-white/10 text-white font-mono uppercase tracking-widest text-[10px]">
            <SelectItem value="all">ALL STATUS</SelectItem>
            <SelectItem value="ready">MATURED SEALS</SelectItem>
            <SelectItem value="soon">MATURING SOON</SelectItem>
            <SelectItem value="active">ACTIVE COVENANTS</SelectItem>
          </SelectContent>
        </Select>

        {/* Time Remaining Filter */}
        <Select value={filters.timeRemaining} onValueChange={(value) => updateFilter('timeRemaining', value)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white font-black font-mono text-[10px] tracking-widest h-14 px-6 rounded-2xl focus:ring-0 focus:border-white/40 transition-all uppercase">
            <SelectValue placeholder="ALL TIME" />
          </SelectTrigger>
          <SelectContent className="bg-[#050505] border-white/10 text-white font-mono uppercase tracking-widest text-[10px]">
            <SelectItem value="all">ALL TIME</SelectItem>
            <SelectItem value="ready">MATURED NOW</SelectItem>
            <SelectItem value="week">&lt; 7 CYCLES</SelectItem>
            <SelectItem value="month">&lt; 30 CYCLES</SelectItem>
            <SelectItem value="long">&gt; 30 CYCLES</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white font-black font-mono text-[10px] tracking-widest h-14 px-6 rounded-2xl focus:ring-0 focus:border-white/40 transition-all uppercase flex-1">
              <SelectValue placeholder="SORT BY" />
            </SelectTrigger>
            <SelectContent className="bg-[#050505] border-white/10 text-white font-mono uppercase tracking-widest text-[10px]">
              <SelectItem value="timeRemaining">TIME</SelectItem>
              <SelectItem value="amount">MAGNITUDE</SelectItem>
              <SelectItem value="tier">STANDING</SelectItem>
              <SelectItem value="rewards">TITHES</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-all w-14 h-14 rounded-2xl"
          >
            {filters.sortOrder === 'asc' ? 
              <SortAsc className="w-5 h-5" /> : 
              <SortDesc className="w-5 h-5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockPositionFilters;
