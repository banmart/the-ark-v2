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
    // Handle withdrawn/inactive locks first
    if (!lock.active) {
      return { 
        label: 'Withdrawn', 
        colorRGB: '156, 163, 175',
        bgClass: 'bg-gray-500/20 border-gray-500/40'
      };
    }
    if (isUnlocked) {
      return { 
        label: 'Ready to Unlock', 
        colorRGB: '74, 222, 128',
        bgClass: 'bg-green-500/20 border-green-500/40'
      };
    }
    if (lock.daysRemaining <= 7) {
      return { 
        label: 'Unlocking Soon', 
        colorRGB: '250, 204, 21',
        bgClass: 'bg-yellow-500/20 border-yellow-500/40'
      };
    }
    return { 
      label: 'Active', 
      colorRGB: '96, 165, 250',
      bgClass: 'bg-blue-500/20 border-blue-500/40'
    };
  };

  const statusInfo = getStatusInfo();

  // Get tier color RGB
  const getTierColorRGB = () => {
    const colors: Record<string, string> = {
      'Bronze': '205, 127, 50',
      'Silver': '192, 192, 192',
      'Gold': '255, 215, 0',
      'Diamond': '96, 165, 250',
      'Platinum': '167, 139, 250',
      'Legendary': '251, 146, 60'
    };
    return colors[tierInfo.name] || '34, 211, 238';
  };

  const tierColorRGB = getTierColorRGB();

  return (
    <div className="relative group">
      {/* Outer glow based on tier color */}
      <div 
        className={`absolute -inset-0.5 rounded-xl blur-sm transition-opacity duration-500 ${isUnlocked ? 'opacity-60' : 'opacity-30 group-hover:opacity-50'}`}
        style={{ background: `rgba(${isUnlocked ? '74, 222, 128' : tierColorRGB}, 0.4)` }}
      ></div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem 
          value={`lock-${lock.id}`}
          className="relative border-0 rounded-xl overflow-hidden"
        >
          {/* Card background */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xl border rounded-xl transition-all duration-500"
            style={{ borderColor: `rgba(${tierColorRGB}, 0.4)` }}
          ></div>
          
          {/* Inner gradient */}
          <div 
            className="absolute inset-0 rounded-xl opacity-30"
            style={{ 
              background: `radial-gradient(ellipse at top left, rgba(${tierColorRGB}, 0.15) 0%, transparent 50%)`
            }}
          ></div>
          
          <AccordionTrigger className="relative z-10 px-4 sm:px-6 py-4 hover:no-underline">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 sm:gap-4 pr-4">
              {/* Left side - Tier and Amount */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  {/* Icon glow */}
                  <div 
                    className="absolute inset-0 blur-lg opacity-50"
                    style={{ background: `rgba(${tierColorRGB}, 0.5)` }}
                  ></div>
                  <div className="relative flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl">{tierInfo.icon}</span>
                    <TierIconComponent 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
                      style={{ color: `rgb(${tierColorRGB})` }} 
                    />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-lg font-bold text-white">
                    {lock.amount.toLocaleString()} ARK
                  </div>
                  <div 
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: `rgb(${tierColorRGB})` }}
                  >
                    {tierInfo.name} Tier • {lock.multiplier}
                  </div>
                </div>
              </div>

              {/* Right side - Status and Time */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                <Badge className={`${statusInfo.bgClass} border text-xs font-semibold`}>
                  <div 
                    className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
                    style={{ background: `rgb(${statusInfo.colorRGB})` }}
                  ></div>
                  {statusInfo.label}
                </Badge>
                <div className="text-right">
                  <div className={`text-sm font-bold ${isUnlocked ? 'text-green-400' : 'text-white'}`}>
                    {isUnlocked ? 'Ready!' : `${lock.daysRemaining}d left`}
                  </div>
                  <div className="text-xs text-gray-400">
                    +{lock.totalRewardsEarned.toLocaleString()} earned
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="relative z-10 px-4 sm:px-6 pb-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Lock Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="relative w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="absolute inset-0 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    background: `linear-gradient(to right, rgb(${tierColorRGB}), rgba(${tierColorRGB}, 0.6))`
                  }}
                ></div>
                {/* Glow effect on progress bar */}
                <div 
                  className="absolute h-2 rounded-full blur-sm"
                  style={{ 
                    width: `${progress}%`,
                    background: `rgba(${tierColorRGB}, 0.5)`
                  }}
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
                    <item.icon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  </div>
                  <div className="text-white font-semibold">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Early Unlock Warning */}
            {!isUnlocked && penalty.penalty > 0 && (
              <div className="relative mb-4 group/warn">
                <div className="absolute -inset-0.5 bg-red-500/20 rounded-xl blur-sm opacity-50"></div>
                <div className="relative bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-red-400 text-sm font-semibold">Early Unlock Penalty</span>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 text-sm font-bold">
                        -{penalty.penalty.toFixed(0)} ARK ({penalty.penaltyRate.toFixed(1)}%)
                      </div>
                      <div className="text-xs text-red-300/70">
                        You'd receive: {penalty.userReceives.toFixed(0)} ARK
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Only show for active locks */}
            {lock.active && (
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Claim Rewards Button */}
                <div className="relative group/btn flex-1">
                  <div className="absolute -inset-1 rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity bg-gradient-to-r from-cyan-500 to-teal-500"></div>
                  <button
                    onClick={() => onClaim(lock.id)}
                    disabled={processingClaim === lock.id}
                    className="relative w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/80 to-teal-500/80 text-white border border-cyan-500/30"
                  >
                    {processingClaim === lock.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Claiming...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        Claim Rewards
                      </>
                    )}
                  </button>
                </div>

                {/* Unlock Button */}
                <div className="relative group/btn flex-1">
                  <div 
                    className={`absolute -inset-1 rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition-opacity ${isUnlocked ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                  ></div>
                  <button
                    onClick={() => setDialogOpen(true)}
                    disabled={processingUnlock === lock.id}
                    className={`relative w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                      isUnlocked 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
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
                </div>
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
