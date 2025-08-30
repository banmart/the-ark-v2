import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Flame, RefreshCcw, Droplets, Lock, ArrowRight, Database } from 'lucide-react';
import { useContractData } from '../hooks/useContractData';
import { useARKTokenData } from '../hooks/useARKTokenData';
import { useLockerData } from '../hooks/useLockerData';
import { useIsMobile } from '../hooks/use-mobile';
import { useFeeMetrics } from '../hooks/useFeeMetrics';
import { useBurnAnalytics } from '../hooks/useBurnAnalytics';
import { useNavigate } from 'react-router-dom';
type PillarState = 'MONITORING' | 'ACTIVE' | 'THRESHOLD_REACHED' | 'PROCESSING' | 'ACCUMULATING';
interface PillarData {
  id: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  value: number;
  maxValue: number;
  unit: string;
  state: PillarState;
  liveData: string;
  actionText: string;
  onClick?: () => void;
}
const InteractiveQuantumPillars = memo(() => {
  const [pillarsLoaded, setPillarsLoaded] = useState(false);
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const {
    data: contractData,
    loading: contractLoading
  } = useContractData();
  const {
    data: tokenData,
    loading: tokenLoading
  } = useARKTokenData();
  const {
    protocolStats,
    userStats,
    loading: lockerLoading
  } = useLockerData();
  const {
    feeMetrics,
    loading: feeLoading
  } = useFeeMetrics(tokenData?.volume24h ? Number(tokenData.volume24h) : undefined);
  const {
    burnMetrics
  } = useBurnAnalytics(typeof tokenData?.volume24h === 'number' ? tokenData.volume24h : 0);
  useEffect(() => {
    // Animate pillars on load
    const timer = setTimeout(() => setPillarsLoaded(true), 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Real-time animation effect
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);
    }, 3000);
    return () => clearInterval(glitchTimer);
  }, []);
  const getStateColor = useCallback((state: PillarState) => {
    switch (state) {
      case 'MONITORING':
        return 'blue';
      case 'ACTIVE':
        return 'green';
      case 'THRESHOLD_REACHED':
        return 'yellow';
      case 'PROCESSING':
        return 'orange';
      case 'ACCUMULATING':
        return 'purple';
      default:
        return 'blue';
    }
  }, []);
  const getPillarsData = useMemo((): PillarData[] => {
    // Get real fee data from service
    const currentVolume = typeof tokenData?.volume24h === 'number' ? tokenData.volume24h : 0;
    const fees = feeMetrics?.feesCollected;
    const efficiency = feeMetrics?.efficiency;

    // Use real fee data when available, fallback to calculations
    const burnDaily = fees?.burn.dailyFees || 0;
    const reflectionDaily = fees?.reflection.dailyFees || 0;
    const liquidityDaily = fees?.liquidity.dailyFees || 0;
    const lockerDaily = fees?.locker.dailyFees || 0;

    // Get real-time data
    const liquidityThreshold = contractData?.swapSettings?.threshold ? parseFloat(contractData.swapSettings.threshold) : 1000000;
    const currentLiquidity = contractData?.liquidityData?.currentAccumulation ? parseFloat(contractData.liquidityData.currentAccumulation) : 0;
    const totalLocked = typeof protocolStats?.totalLockedTokens === 'number' ? protocolStats.totalLockedTokens : 0;
    const rewardPool = typeof protocolStats?.rewardPool === 'number' ? protocolStats.rewardPool : 0;

    // Calculate dynamic max values based on real fee collection
    const burnMaxCapacity = Math.max(currentVolume * 0.02, burnDaily * 2); // 2% of volume or 2x current rate
    const reflectionMaxCapacity = Math.max(currentVolume * 0.02, reflectionDaily * 2);
    const liquidityMaxCapacity = Math.max(currentVolume * 0.03, liquidityDaily * 2);
    const rewardMaxCapacity = Math.max(rewardPool * 0.01, lockerDaily * 2);

    // Enhanced state calculation functions using real fee efficiency
    const getBurnState = (rate: number, capacity: number, eff: number = 0): PillarState => {
      if (eff > 80) return 'PROCESSING';
      if (eff > 50 || rate > capacity * 0.5) return 'ACTIVE';
      if (eff > 20 || rate > capacity * 0.1) return 'MONITORING';
      return 'MONITORING';
    };
    const getReflectionState = (reflections: number, capacity: number, eff: number = 0): PillarState => {
      if (eff > 70) return 'ACTIVE';
      if (eff > 30 || reflections > capacity * 0.3) return 'MONITORING';
      return 'MONITORING';
    };
    const getLiquidityState = (current: number, threshold: number, eff: number = 0): PillarState => {
      if (current >= threshold) return 'THRESHOLD_REACHED';
      if (eff > 60 || current > threshold * 0.7) return 'PROCESSING';
      if (eff > 20 || current > threshold * 0.3) return 'ACCUMULATING';
      return 'MONITORING';
    };
    const getRewardState = (rewards: number, capacity: number, eff: number = 0): PillarState => {
      if (eff > 60) return 'ACTIVE';
      if (eff > 20 || rewards > capacity * 0.2) return 'ACCUMULATING';
      return 'MONITORING';
    };
    return [{
      id: 0,
      icon: Flame,
      emoji: '🔥',
      title: 'BURN PROTOCOL',
      subtitle: 'Molecular Disintegration',
      description: 'Real-time token burning with quantum incineration to void address plus automated LP destruction.',
      color: 'red',
      gradient: 'from-red-500 to-orange-500',
      value: burnDaily,
      maxValue: burnMaxCapacity,
      unit: 'ARK/day',
      state: getBurnState(burnDaily, burnMaxCapacity, efficiency?.burn || 0),
      liveData: burnDaily > 0 ? `${burnDaily > 1000 ? (burnDaily / 1000).toFixed(1) + 'K' : burnDaily.toFixed(0)} ARK/DAY` : 'LOADING...',
      actionText: 'VIEW_BURN_ANALYTICS',
      onClick: () => navigate('/burn-analytics')
    }, {
      id: 1,
      icon: RefreshCcw,
      emoji: '🫂',
      title: 'REFLECTION MATRIX',
      subtitle: 'Quantum Redistribution',
      description: 'Autonomous redistribution to holders based on molecular weight with extended holding amplification.',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      value: reflectionDaily,
      maxValue: reflectionMaxCapacity,
      unit: 'ARK/day',
      state: getReflectionState(reflectionDaily, reflectionMaxCapacity, efficiency?.reflection || 0),
      liveData: reflectionDaily > 0 ? `${reflectionDaily > 1000 ? (reflectionDaily / 1000).toFixed(1) + 'K' : reflectionDaily.toFixed(0)} ARK/DAY` : 'LOADING...',
      actionText: 'VIEW_REFLECTIONS'
    }, {
      id: 2,
      icon: Droplets,
      emoji: '💧',
      title: 'LIQUIDITY ENGINE',
      subtitle: 'Fluid Dynamics Control',
      description: 'Automated liquidity synthesis with quantum slippage protection and threshold management.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      value: currentLiquidity,
      maxValue: liquidityThreshold,
      unit: 'ARK',
      state: getLiquidityState(currentLiquidity, liquidityThreshold, efficiency?.liquidity || 0),
      liveData: `${(currentLiquidity / liquidityThreshold * 100).toFixed(1)}% TO SWAP`,
      actionText: 'VIEW_LIQUIDITY'
    }, {
      id: 3,
      icon: Lock,
      emoji: '🔒',
      title: 'VAULT REWARDS',
      subtitle: 'Temporal Amplification',
      description: 'Dedicated quantum vault rewards for temporal commitment with up to 8x multipliers.',
      color: 'green',
      gradient: 'from-green-500 to-teal-500',
      value: lockerDaily,
      maxValue: rewardMaxCapacity,
      unit: 'ARK/day',
      state: getRewardState(lockerDaily, rewardMaxCapacity, efficiency?.locker || 0),
      liveData: lockerDaily > 0 ? `${lockerDaily > 1000 ? (lockerDaily / 1000).toFixed(1) + 'K' : lockerDaily.toFixed(0)} ARK/DAY` : 'LOADING...',
      actionText: 'ENTER_VAULT'
    }];
  }, [feeMetrics, contractData, tokenData, protocolStats, realTimeUpdate]);
  const pillarsData = getPillarsData;

  // Show loading state while fee data is being fetched
  const loading = contractLoading || tokenLoading || lockerLoading || feeLoading;
  return;
});
InteractiveQuantumPillars.displayName = 'InteractiveQuantumPillars';
export default InteractiveQuantumPillars;