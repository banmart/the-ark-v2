
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
import { Shield, Database, AlertTriangle, Activity } from 'lucide-react';

const Locker = () => {
  const [vaultPhase, setVaultPhase] = useState(0);
  const [systemStatus, setSystemStatus] = useState('INITIALIZING');

  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const { lockTiers, emergencyMode, contractPaused, loading, error } = useLockerData();

  useEffect(() => {
    const sequence = [
      { delay: 300, phase: 1, status: 'SCANNING_VAULT' },
      { delay: 600, phase: 2, status: 'LOADING_LIVE_DATA' },
      { delay: 900, phase: 3, status: 'ACTIVATING_INTERFACE' },
      { delay: 1200, phase: 4, status: 'SYSTEMS_ONLINE' },
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
      <AnimatedBackground />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      <div className="relative z-10 pt-20">
        {/* Compact Header */}
        <div className="text-center py-8 relative">
          {/* System Status */}
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${vaultPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-2 text-cyan-400/60 font-mono text-xs bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-full px-3 py-1">
              <Database className="w-3 h-3 animate-pulse" />
              <span>[{systemStatus}]</span>
            </div>
          </div>

          {/* Compact Title */}
          <div className={`transition-all duration-500 delay-200 ${vaultPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              🔒 QUANTUM VAULT 🔒
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-200 leading-relaxed">
                  Lock your ARK tokens in the <span className="text-purple-400 font-bold">Temporal Vault</span> and earn 
                  multiplied rewards based on your <span className="text-cyan-400 font-semibold">commitment tier</span>.
                </p>
                <div className="text-xs text-gray-400 font-mono mt-2">
                  <span className="text-cyan-400">[LIVE_DATA]</span> Real-time blockchain integration • 1-day to 5-year locks
                </div>
              </div>
            </div>

            {/* Emergency Status */}
            {(emergencyMode || contractPaused) && (
              <div className="inline-block bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-bold font-mono text-sm">
                    {emergencyMode ? '[EMERGENCY_MODE]' : '[PAUSED]'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Grid Layout with Overflow Scrolling */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
              {/* Protocol Stats - Full Width on Mobile, 1 column on Desktop */}
              <div className={`lg:col-span-3 transition-all duration-500 delay-300 ${vaultPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <EnhancedProtocolStats />
              </div>

              {/* Lock Interface */}
              <div className={`transition-all duration-500 delay-400 ${vaultPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <EnhancedLockInterface isConnected={isConnected} />
              </div>

              {/* User Dashboard */}
              <div className={`transition-all duration-500 delay-500 ${vaultPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <EnhancedUserDashboard isConnected={isConnected} />
              </div>

              {/* Tier Benefits */}
              <div className={`transition-all duration-500 delay-600 ${vaultPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <TierBenefits lockTiers={lockTiers} />
              </div>

              {/* Compact Security Matrix */}
              <div className={`lg:col-span-3 transition-all duration-500 delay-700 ${vaultPhase >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-cyan-400 font-mono">[SECURITY_MATRIX]</h3>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 font-mono text-xs">
                      <Activity className="w-3 h-3 animate-pulse" />
                      <span>OPERATIONAL</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-green-400 font-mono text-xs">REENTRANCY_GUARD</div>
                          <div className="text-gray-400 text-xs">Attack protection</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-blue-400 font-mono text-xs">OWNERSHIP_RENOUNCED</div>
                          <div className="text-gray-400 text-xs">Immutable contract</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/30 rounded text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-purple-400 font-mono text-xs">TEMPORAL_TIERS</div>
                          <div className="text-gray-400 text-xs">6 tiers (1x - 8x)</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded text-sm">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-orange-400 font-mono text-xs">EARLY_UNLOCK_PENALTY</div>
                          <div className="text-gray-400 text-xs">50% max deterrent</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-sm">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-red-400 font-mono text-xs">PENALTY_DISTRIBUTION</div>
                          <div className="text-gray-400 text-xs">50% burn + 50% rewards</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-sm">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-cyan-400 font-mono text-xs">LIVE_BLOCKCHAIN_DATA</div>
                          <div className="text-gray-400 text-xs">Real-time updates</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="mt-3 pt-3 border-t border-gray-600/30">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span>LIVE_CONNECTION: {loading ? 'SYNCING' : 'ACTIVE'}</span>
                      </div>
                      <div className="text-gray-400">
                        CONTRACT: {contractPaused ? 'PAUSED' : 'OPERATIONAL'}
                      </div>
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>DATA_FLOWING</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileDock 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.3) transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(34, 211, 238, 0.3);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Locker;
