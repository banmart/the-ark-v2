import React, { useState } from 'react';
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
import EarlyUnlockWarningDialog from './EarlyUnlockWarningDialog';

interface CompactLockPositionProps {
  lock: LockedPosition;
  onUnlock: (lockId: number) => void;
  onClaim: (lockId: number) => void;
  processingUnlock: number | null;
  processingClaim: number | null;
}

const CompactLockPosition = ({ lock, onUnlock, onClaim, processingUnlock, processingClaim }: CompactLockPositionProps) => {
  const { lockTiers, calculateEarlyUnlockPenalty } = useLockerData();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const now = Date.now() / 1000;
  const isUnlocked = now >= lock.unlockTime;
  const penalty = calculateEarlyUnlockPenalty(lock);
  const tierInfo = lockTiers[lock.tier] || lockTiers[0];
  const progress = Math.max(0, Math.min(100, ((now - lock.lockTime) / (lock.unlockTime - lock.lockTime)) * 100));
  
  const getTierIconComponent = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'initiate': return Shield;
      case 'acolyte': return Award;
      case 'warden': return Crown;
      case 'sentinel': return Star;
      case 'arch-keeper': return Zap;
      default: return Shield;
    }
  };

  const TierIconComponent = getTierIconComponent(tierInfo.name);

  const getStatusInfo = () => {
    // Handle withdrawn/inactive locks first
    if (!lock.active) {
      return { 
        label: 'WITHDRAWN', 
        colorRGB: '255, 255, 255',
        bgClass: 'bg-white/5 border-white/10 opacity-20'
      };
    }
    if (isUnlocked) {
      return { 
        label: 'MATURED', 
        colorRGB: '255, 255, 255',
        bgClass: 'bg-white/10 border-white/40 text-white'
      };
    }
    if (lock.daysRemaining <= 7) {
      return { 
        label: 'UNLOCKING SOON', 
        colorRGB: '255, 255, 255',
        bgClass: 'bg-white/5 border-white/20 text-white/60'
      };
    }
    return { 
      label: 'LOCKED', 
      colorRGB: '255, 255, 255',
      bgClass: 'bg-white/5 border-white/10 text-white/40'
    };
  };

  const statusInfo = getStatusInfo();

  // Get tier color RGB
  const getTierColorRGB = () => {
    return '255, 255, 255';
  };

  const tierColorRGB = getTierColorRGB();

  return (
    <div className="relative group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem 
          value={`lock-${lock.id}`}
          className="relative border-0 rounded-2xl overflow-hidden mb-4"
        >
          {/* Card background */}
          <div 
            className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl border rounded-2xl transition-all duration-500 border-white/5 group-hover:border-white/20"
          ></div>
          
          <AccordionTrigger className="relative z-10 px-8 py-8 hover:no-underline">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-6 pr-4">
              {/* Left side - Tier and Amount */}
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-3xl filter grayscale brightness-200">{tierInfo.icon}</span>
                </div>
                <div className="text-left space-y-1">
                  <div className="text-2xl font-black text-white uppercase tracking-tighter">
                    {lock.amount.toLocaleString()} <span className="text-sm text-white/40 ml-1">ARK</span>
                  </div>
                  <div className="text-xs font-black font-mono tracking-[0.2em] text-white/60 uppercase">
                    {tierInfo.name} TIER • {lock.multiplier}
                  </div>
                </div>
              </div>

              {/* Right side - Status and Time */}
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                <Badge className={`${statusInfo.bgClass} border text-[10px] font-black font-mono tracking-widest uppercase px-4 py-1.5 rounded-xl`}>
                  {statusInfo.label}
                </Badge>
                <div className="text-right space-y-1">
                  <div className={`text-lg font-black uppercase tracking-tighter ${isUnlocked ? 'text-white' : 'text-white/60'}`}>
                    {isUnlocked ? 'MATURED' : `${lock.daysRemaining} DAYS`}
                  </div>
                  <div className="text-xs font-black font-mono tracking-widest text-white/50 uppercase">
                    +{lock.totalRewardsEarned.toLocaleString()} EARNED
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="relative z-10 px-4 sm:px-6 pb-6">
            {/* Progress Bar */}
            <div className="mb-12 px-2">
              <div className="flex justify-between text-xs font-black font-mono tracking-widest text-white/50 mb-3 uppercase">
                <span>LOCK PROGRESS</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="relative w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <div 
                  className="absolute inset-0 h-1 rounded-full transition-all duration-700 bg-white"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {[
                { icon: Calendar, label: 'Duration', value: `${Math.round(lock.lockPeriod / (24 * 60 * 60))} days` },
                { icon: Award, label: 'Weight', value: (lock.amount * (tierInfo.multiplier / 10000)).toFixed(0) },
                { icon: Clock, label: 'Unlock Date', value: new Date(lock.unlockTime * 1000).toLocaleDateString() }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/[0.08] hover:border-white/[0.15] transition-all"
                >
                  <div className="flex items-center mb-1.5">
                    <item.icon className="w-4 h-4 text-white/40 mr-2" />
                    <span className="text-white/60 text-sm">{item.label}</span>
                  </div>
                  <div className="text-white font-semibold">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Early Unlock Warning */}
            {/* Early Unlock Warning */}
            {!isUnlocked && penalty.penalty > 0 && (
              <div className="relative mb-8 group/warn">
                <div className="relative bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/10 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black font-mono tracking-widest text-red-500 uppercase">WITHDRAWAL PENALTY</span>
                        <p className="text-xs text-white/60 font-mono uppercase">Standard protocol rules apply</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-red-500 tracking-tighter">
                        -{penalty.penalty.toFixed(0)} <span className="text-xs">ARK</span>
                      </div>
                      <div className="text-[10px] font-mono text-red-500/40 uppercase">
                        LOSS RATE: {penalty.penaltyRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Only show for active locks */}
            {/* Action Buttons - Only show for active locks */}
            {lock.active && (
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Claim Rewards Button */}
                <button
                  onClick={() => onClaim(lock.id)}
                  disabled={processingClaim === lock.id}
                  className="flex-1 py-4 rounded-xl font-black font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-300 hover:scale-[1.05] disabled:opacity-20 flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white"
                >
                  {processingClaim === lock.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      INITIATING...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      CLAIM REWARDS
                    </>
                  )}
                </button>

                {/* Unlock Button */}
                <button
                  onClick={() => setDialogOpen(true)}
                  disabled={processingUnlock === lock.id}
                  className={`flex-1 py-4 rounded-xl font-black font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-300 hover:scale-[1.05] disabled:opacity-20 flex items-center justify-center gap-3 ${
                    isUnlocked 
                      ? 'bg-white text-black' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 text-white'
                  }`}
                >
                  {processingUnlock === lock.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      PROCESSING...
                    </>
                  ) : isUnlocked ? (
                    <>
                      <Zap className="w-4 h-4" />
                      UNSTAKE ASSETS
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      EXIT EARLY (-{penalty.penaltyRate.toFixed(1)}%)
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Withdrawn Status Message */}
            {!lock.active && (
              <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-400 text-sm">This position has been withdrawn</span>
              </div>
            )}

            {/* Early Unlock Warning Dialog */}
            <EarlyUnlockWarningDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              lock={lock}
              penalty={penalty}
              onConfirm={() => onUnlock(lock.id)}
              processing={processingUnlock === lock.id}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CompactLockPosition;
