
import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import EnhancedProtocolStats from '../components/locker/EnhancedProtocolStats';
import EnhancedLockInterface from '../components/locker/EnhancedLockInterface';
import TierBenefits from '../components/locker/TierBenefits';
import EnhancedUserDashboard from '../components/locker/EnhancedUserDashboard';
import { Shield, Database, Cpu, Lock, Zap, AlertTriangle, Activity } from 'lucide-react';

const Locker = () => {
  const [vaultPhase, setVaultPhase] = useState(0);
  const [systemStatus, setSystemStatus] = useState('INITIALIZING');

  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const { lockTiers, emergencyMode, contractPaused } = useLockerData();

  useEffect(() => {
    // Cinematic vault initialization sequence
    const sequence = [
      { delay: 500, phase: 1, status: 'SCANNING_QUANTUM_VAULT' },
      { delay: 1500, phase: 2, status: 'ANALYZING_SECURITY_PROTOCOLS' },
      { delay: 2500, phase: 3, status: 'ACTIVATING_TEMPORAL_LOCKS' },
      { delay: 3500, phase: 4, status: 'VAULT_SYSTEMS_ONLINE' },
    ];

    sequence.forEach(({ delay, phase, status }) => {
      setTimeout(() => {
        setVaultPhase(phase);
        setSystemStatus(status);
      }, delay);
    });
  }, []);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Animated Background with Vault Grid */}
      <AnimatedBackground />
      
      {/* Quantum Vault Grid Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 200px 200px'
        }}></div>
      </div>

      {/* Navigation */}
      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      <div className="relative z-10 pt-24">
        {/* Cinematic Header */}
        <div className="text-center py-16 relative">
          {/* System Status HUD */}
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${vaultPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="flex items-center gap-2 text-cyan-400/60 font-mono text-xs bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 py-2">
              <Database className="w-3 h-3 animate-pulse" />
              <span>[{systemStatus}]</span>
              <Database className="w-3 h-3 animate-pulse" />
            </div>
          </div>

          {/* Main Title */}
          <div className={`transition-all duration-1000 delay-300 ${vaultPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 bg-clip-text text-transparent relative">
              <span className="animate-[glitch_3s_ease-in-out_infinite]">🔒 QUANTUM</span>{' '}
              <span className="animate-[glitch_3s_ease-in-out_0.5s_infinite]">VAULT</span>{' '}
              <span className="animate-[glitch_3s_ease-in-out_1s_infinite]">🔒</span>
            </h1>
            
            {/* Glitch overlay */}
            <h1 className="absolute top-0 left-1/2 transform -translate-x-1/2 text-5xl md:text-6xl font-black text-red-500/20 animate-[glitch-overlay_3s_ease-in-out_infinite] pointer-events-none">
              🔒 QUANTUM VAULT 🔒
            </h1>
          </div>

          {/* Mission Brief */}
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-600 ${vaultPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 mb-6">
              <div className="border-l-4 border-cyan-400 pl-6">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                  [MISSION_BRIEFING]
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed mb-4">
                  Deep within The ARK's quantum core lies the <span className="text-purple-400 font-bold">Temporal Vault</span>—
                  where time itself becomes currency. Those who commit their tokens to the sacred chambers 
                  shall be blessed according to their <span className="text-cyan-400 font-semibold">devotion multiplier</span>.
                </p>
                <div className="text-sm text-gray-400 font-mono">
                  <span className="text-cyan-400">[PROTOCOL_INFO]</span> The longer the temporal lock, the greater the quantum rewards. 
                  Choose your commitment level and watch your tokens multiply through dimensional rifts.
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Status */}
          {(emergencyMode || contractPaused) && (
            <div className={`transition-all duration-1000 delay-900 ${vaultPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-block bg-red-900/40 border border-red-500/50 rounded-xl px-6 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-bold font-mono">
                    {emergencyMode ? '[EMERGENCY_PROTOCOL_ACTIVE]' : '[VAULT_SYSTEMS_PAUSED]'}
                  </span>
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20 space-y-12">
          {/* Enhanced Protocol Stats */}
          <div className={`transition-all duration-1000 delay-1000 ${vaultPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <EnhancedProtocolStats />
          </div>

          {/* Row 1: Enhanced Lock Interface */}
          <div className={`transition-all duration-1000 delay-1200 ${vaultPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <EnhancedLockInterface isConnected={isConnected} />
          </div>

          {/* Row 2: Sacred Lock Tier Benefits */}
          <div className={`transition-all duration-1000 delay-1400 ${vaultPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <TierBenefits lockTiers={lockTiers} />
          </div>

          {/* Row 3: Your Sacred Lock Positions */}
          <div className={`transition-all duration-1000 delay-1600 ${vaultPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <EnhancedUserDashboard isConnected={isConnected} />
          </div>

          {/* Enhanced Contract Security Matrix */}
          <div className={`transition-all duration-1000 delay-1800 ${vaultPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-1 shadow-2xl shadow-cyan-500/20">
              {/* Animated Security Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl animate-[pulse_4s_ease-in-out_infinite]"></div>
              
              <div className="relative bg-black/60 rounded-xl p-8">
                {/* Security Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-cyan-400 font-mono">
                      [SECURITY_MATRIX]
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>ALL_SYSTEMS_OPERATIONAL</span>
                  </div>
                </div>

                {/* Security Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-green-400 font-mono text-sm">REENTRANCY_GUARD</div>
                        <div className="text-gray-400 text-xs">Maximum attack protection</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-blue-400 font-mono text-sm">OWNERSHIP_RENOUNCED</div>
                        <div className="text-gray-400 text-xs">Immutable forever</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-purple-400 font-mono text-sm">TEMPORAL_TIERS</div>
                        <div className="text-gray-400 text-xs">6 lock tiers (1x - 8x multipliers)</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-orange-400 font-mono text-sm">EARLY_UNLOCK_PENALTY</div>
                        <div className="text-gray-400 text-xs">50% maximum deterrent</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-red-400 font-mono text-sm">PENALTY_DISTRIBUTION</div>
                        <div className="text-gray-400 text-xs">50% burn + 50% to faithful lockers</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-cyan-400 font-mono text-sm">QUANTUM_DISTRIBUTION</div>
                        <div className="text-gray-400 text-xs">Weight-based reward algorithm</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Diagnostics */}
                <div className="mt-6 pt-6 border-t border-gray-600/30">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Cpu className="w-3 h-3" />
                      <span>QUANTUM_CORE: STABLE</span>
                    </div>
                    <div className="text-gray-400">
                      UPTIME: 99.97% | LOCKS_PROCESSED: {Math.floor(Math.random() * 10000)}
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <Zap className="w-3 h-3 animate-pulse" />
                      <span>REWARDS_FLOWING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Dock */}
      <MobileDock 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />
    </div>
  );
};

export default Locker;
