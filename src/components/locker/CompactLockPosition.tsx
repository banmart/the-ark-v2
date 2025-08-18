
import React from 'react';
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Award,
  Zap,
  CheckCircle,
  Shield,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { LockedPosition } from '../../hooks/locker/types';
import { useLockerData } from '../../hooks/useLockerData';

interface CompactLockPositionProps {
  lock: LockedPosition;
  onUnlock: (lockId: number) => void;
  processingUnlock: number | null;
}

const CompactLockPosition = ({ lock, onUnlock, processingUnlock }: CompactLockPositionProps) => {
  const { lockTiers, calculateEarlyUnlockPenalty } = useLockerData();
  
  const now = Date.now() / 1000;
  const isUnlocked = now >= lock.unlockTime;
  const penalty = calculateEarlyUnlockPenalty(lock);
  const tierInfo = lockTiers[lock.tier] || lockTiers[0];
  const progress = Math.max(0, Math.min(100, ((now - lock.lockTime) / (lock.unlockTime - lock.lockTime)) * 100));
  
  const getTierIconComponent = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return Shield;
      case 'silver': return Award;
      case 'gold': return Crown;
      case 'diamond': return Star;
      case 'platinum': return Sparkles;
      case 'legendary': return Zap;
      default: return Shield;
    }
  };

  const TierIconComponent = getTierIconComponent(tierInfo.name);

  const getStatusInfo = () => {
    if (isUnlocked) {
      return { label: 'Ready to Unlock', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    }
    if (lock.daysRemaining <= 7) {
      return { label: 'Unlocking Soon', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    }
    return { label: 'Active', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  };

  const statusInfo = getStatusInfo();

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem 
        value={`lock-${lock.id}`}
        className="border-2 rounded-xl overflow-hidden bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40"
        style={{ borderColor: tierInfo.color }}
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            {/* Left side - Tier and Amount */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{tierInfo.icon}</div>
                <TierIconComponent className="w-5 h-5" style={{ color: tierInfo.color }} />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">
                  {lock.amount.toLocaleString()} ARK
                </div>
                <div className="text-sm" style={{ color: tierInfo.color }}>
                  {tierInfo.name} Tier • {lock.multiplier} multiplier
                </div>
              </div>
            </div>

            {/* Right side - Status and Time */}
            <div className="flex items-center gap-4">
              <Badge className={`${statusInfo.color} border`}>
                {statusInfo.label}
              </Badge>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {isUnlocked ? 'Ready!' : `${lock.daysRemaining}d left`}
                </div>
                <div className="text-xs text-gray-400">
                  +{lock.totalRewardsEarned.toLocaleString()} earned
                </div>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-6 pb-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Lock Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(to right, ${tierInfo.color}, ${tierInfo.color}80)`
                }}
              ></div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-3 border border-gray-600/50">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Duration</span>
              </div>
              <div className="text-white font-semibold">{Math.round(lock.lockPeriod / (24 * 60 * 60))} days</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 border border-gray-600/50">
              <div className="flex items-center mb-1">
                <Award className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Weight</span>
              </div>
              <div className="text-white font-semibold">
                {(lock.amount * (tierInfo.multiplier / 10000)).toFixed(0)}
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 border border-gray-600/50">
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Unlock Date</span>
              </div>
              <div className="text-white font-semibold text-sm">
                {new Date(lock.unlockTime * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Early Unlock Warning - Compact */}
          {!isUnlocked && penalty.penalty > 0 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm font-semibold">Early Unlock Penalty</span>
                </div>
                <div className="text-right">
                  <div className="text-red-400 text-sm font-bold">
                    -{penalty.penalty.toFixed(0)} ARK ({penalty.penaltyRate.toFixed(1)}%)
                  </div>
                  <div className="text-xs text-red-300">
                    You'd receive: {penalty.userReceives.toFixed(0)} ARK
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onUnlock(lock.id)}
            disabled={processingUnlock === lock.id}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
              isUnlocked 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black shadow-lg shadow-green-500/30' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
            }`}
          >
            {processingUnlock === lock.id ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : isUnlocked ? (
              <>
                <Zap className="w-4 h-4" />
                Unlock Tokens
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                Early Unlock (-{penalty.penaltyRate.toFixed(1)}%)
              </>
            )}
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CompactLockPosition;
