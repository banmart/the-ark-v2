import React, { useState } from 'react';
import { ArrowRight, Zap, DollarSign, Lock, Gift, ExternalLink, Wallet } from 'lucide-react';
import BaseLayout from '../components/layout/BaseLayout';
import ProcessFlow from '../components/onboarding/ProcessFlow';
import ServiceCard from '../components/onboarding/ServiceCard';
import MobileBrowserPopup from '../components/MobileBrowserPopup';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useBrowserPopup } from '../components/providers/BrowserPopupProvider';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../components/providers/WalletProvider';

// Mock the imported components to match original structure
const BaseLayout = ({ children }) => children;

const ProcessFlow = () => {
  const steps = ['WALLET', 'BANK', 'BRIDGE', 'BUY', 'LOCK'];
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-16">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center text-black font-bold text-sm mb-2">
              {index + 1}
            </div>
            <span className="text-xs font-mono text-cyan-400">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-6 h-6 text-cyan-500 mx-4 hidden md:block" />
          )}
        </div>
      ))}
    </div>
  );
};

const ServiceCard = ({ name, description, icon: Icon, color, onClick, isAvailable }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <div 
      onClick={onClick}
      className="w-full max-w-sm bg-black/50 border-cyan-500/30 hover:bg-black/70 transition-all duration-300 hover:scale-105 group relative overflow-hidden rounded-lg border cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-mono text-lg text-cyan-400">{name}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded ${isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {isAvailable ? 'AVAILABLE' : 'COMING SOON'}
          </span>
          <ExternalLink className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
    </div>
  );
};

const Card = ({ children, className }) => (
  <div className={`rounded-lg border ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 pt-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 ${className}`}
  >
    {children}
  </button>
);

const MobileBrowserPopup = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h3>
        <p className="text-gray-400 mb-4">Opening external link...</p>
        <div className="flex gap-2">
          <Button
            onClick={() => window.open(url, '_blank')}
            className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black flex-1"
          >
            Open
          </Button>
          <Button
            onClick={onClose}
            className="bg-gray-600 text-white flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUrl, setPopupUrl] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleExternalLink = (url, title) => {
    setPopupUrl(url);
    setPopupTitle(title);
    setIsPopupOpen(true);
  };

  const handleNewTabLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigate = (url) => {
    // Mock navigate function
    window.location.href = url;
  };

  const handleStepComplete = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  // Enhanced grouped sections with completion tracking
  const groupedSections = {
    wallet: {
      id: 'wallet',
      title: 'WALLET',
      subtitle: 'Setup your crypto wallet',
      color: 'purple',
      services: [{
        name: 'MetaMask',
        description: 'Crypto wallet browser extension',
        icon: Wallet,
        color: 'yellow',
        url: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
        isAvailable: true
      }],
      actions: []
    },
    bank: {
      id: 'bank',
      title: 'BANK',
      subtitle: 'Connect bank account',
      color: 'cyan',
      services: [{
        name: '0xCoast',
        description: 'Buy crypto with credit card',
        icon: DollarSign,
        color: 'blue',
        url: 'https://0xcoast.com',
        isAvailable: true
      }, {
        name: 'RampNow',
        description: 'Fast fiat on-ramp service',
        icon: Zap,
        color: 'green',
        url: 'https://app.rampnow.io/',
        isAvailable: true
      }, {
        name: 'Coinbase',
        description: 'Leading cryptocurrency exchange',
        icon: DollarSign,
        color: 'cyan',
        url: 'https://www.coinbase.com/',
        isAvailable: true
      }],
      actions: []
    },
    bridge: {
      id: 'bridge',
      title: 'BRIDGE',
      subtitle: 'Move assets to PulseChain',
      color: 'blue',
      services: [{
        name: 'ChangeNow',
        description: 'Exchange crypto instantly',
        icon: ArrowRight,
        color: 'purple',
        url: 'https://changenow.app.link/referral?link_id=e49c221824244a',
        isAvailable: true
      }, {
        name: 'Liberty Swap',
        description: 'Decentralized exchange for crypto swaps',
        icon: ArrowRight,
        color: 'blue',
        url: 'https://libertyswap.finance/',
        isAvailable: true
      }],
      actions: [{
        name: 'Bridge Assets',
        description: 'Move assets to PulseChain',
        url: 'https://bridge.mypinata.cloud/ipfs/bafybeif242ld54nzjg2aqxvfse23wpbkqbyqasj3usgslccuajnykonzo4/#/bridge',
        icon: '🌉',
        external: true
      }]
    },
    buy: {
      id: 'buy',
      title: 'BUY',
      subtitle: 'Purchase ARK tokens',
      color: 'green',
      services: [],
      actions: [{
        name: 'Buy ARK',
        description: 'Purchase ARK tokens on PulseX',
        url: 'https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0x4d547181427Ee90342b4781E0eF2cd46F189cb2C',
        icon: '💰',
        external: true
      }]
    },
    lock: {
      id: 'lock',
      title: 'LOCK',
      subtitle: 'Lock tokens for rewards',
      color: 'purple',
      services: [],
      actions: [{
        name: 'Vault (Locker)',
        description: 'Lock tokens for rewards',
        url: '/locker',
        icon: '🔒',
        external: false
      }, {
        name: 'Add Liquidity',
        description: 'Provide liquidity to earn fees',
        url: 'https://pulsex.mypinata.cloud/ipfs/bafybeibzu7nje2o2tufb3ifitjrto3n3xcwon7fghq2igtcupulfubnrim/#/add/v2/0x4d547181427Ee90342b4781E0eF2cd46F189cb2C/0xefD766cCb38EaF1dfd701853BFCe31359239F305',
        icon: '💧',
        external: true
      }]
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    return Math.round((completedSteps.size / Object.keys(groupedSections).length) * 100);
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative">
          {/* Quantum field background */}
          <div className="absolute inset-0 -top-20 -bottom-20">
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
          </div>

          <div className="relative z-10 text-center py-16 px-6">
            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-green-400 tracking-wider">ARK_ONBOARDING_PROTOCOL</span>
            </div>

            {/* Main Title */}
            <div className="mb-8">
              <div className="text-sm font-mono text-cyan-400/60 mb-2 tracking-[0.2em]">
                [INITIALIZATION_SEQUENCE]
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                GET STARTED WITH ARK
              </h1>
              <div className="text-sm font-mono text-cyan-400/60 tracking-[0.2em]">
                [DIVINE_ASCENSION_AWAITS]
              </div>
            </div>

            {/* Progress Indicator */}
            {completedSteps.size > 0 && (
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-cyan-400">PROGRESS</span>
                  <span className="text-sm font-mono text-cyan-400">{calculateProgress()}%</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500 ease-out"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  {completedSteps.size} OF {Object.keys(groupedSections).length} PROTOCOLS_COMPLETED
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Process Flow */}
        <div className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <ProcessFlow />
          </div>
        </div>

        {/* Grouped Onboarding Sections */}
        {Object.values(groupedSections).map((section) => (
          <div key={section.id} id={section.id} className="px-6 mb-16">
            <div className="max-w-6xl mx-auto">
              {/* Section Header with completion status */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${completedSteps.has(section.id) ? 'bg-green-400' : 'bg-cyan-400'}`}></div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider">{section.title}_PROTOCOL</span>
                  {completedSteps.has(section.id) && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-mono">
                  {section.title}
                </h2>
                <p className="text-gray-400 text-sm">{section.subtitle}</p>
              </div>

              {/* Services Grid */}
              {section.services && section.services.length > 0 && (
                <div className="grid grid-cols-1 gap-6 mb-6 justify-items-center">
                  {section.services.map(service => (
                    <ServiceCard 
                      key={service.name} 
                      name={service.name} 
                      description={service.description} 
                      icon={service.icon} 
                      color={service.color} 
                      onClick={() => {
                        if (service.name === 'MetaMask' || service.name === 'ChangeNow') {
                          handleNewTabLink(service.url);
                        } else {
                          handleExternalLink(service.url, service.name);
                        }
                      }}
                      isAvailable={service.isAvailable} 
                    />
                  ))}
                </div>
              )}

              {/* Actions Grid */}
              {section.actions && section.actions.length > 0 && (
                <div className="grid grid-cols-1 gap-6 justify-items-center mb-6">
                  {section.actions.map((action) => (
                    <Card key={action.name} className="bg-black/50 border-cyan-500/30 hover:bg-black/70 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                      {/* Scanning effect */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>
                      
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-cyan-400">
                          <span className="text-2xl">{action.icon}</span>
                          <span className="font-mono text-sm">{action.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                        <Button onClick={() => {
                          if (action.external) {
                            handleNewTabLink(action.url);
                          } else {
                            navigate(action.url);
                          }
                        }} className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-black font-mono tracking-wide hover:scale-105 transition-transform">
                          {action.external ? 'OPEN' : 'NAVIGATE'}
                          {action.external && <ExternalLink className="w-4 h-4 ml-2" />}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Complete Step Button */}
              <div className="text-center">
                <Button
                  onClick={() => handleStepComplete(section.id)}
                  disabled={completedSteps.has(section.id)}
                  className={`px-8 py-3 font-mono tracking-wide transition-all ${
                    completedSteps.has(section.id)
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-105'
                  }`}
                >
                  {completedSteps.has(section.id) ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      PROTOCOL_COMPLETED
                    </div>
                  ) : (
                    `COMPLETE_${section.title}_PROTOCOL`
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Completion Celebration */}
        {completedSteps.size === Object.keys(groupedSections).length && (
          <div className="px-6 mb-20">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5 animate-pulse"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h4 className="text-2xl font-bold text-green-400 mb-2 font-mono">ALL_PROTOCOLS_COMPLETED</h4>
                    <p className="text-gray-400">Divine ascension protocol initialization complete. Welcome to the ARK ecosystem!</p>
                  </div>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-black px-8 py-3 font-mono font-bold tracking-wide hover:scale-105 transition-all">
                    ENTER_ARK_ECOSYSTEM
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Wallet Connection CTA */}
        {!isConnected && (
          <div className="px-6 mb-20">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-purple-500/5 animate-pulse"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="text-xl font-bold text-cyan-400 mb-2 font-mono">WALLET CONNECTION REQUIRED</h4>
                    <p className="text-gray-400">Connect your wallet to access the full ARK ecosystem</p>
                  </div>
                  <Button 
                    onClick={() => setIsConnected(true)}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-8 py-3 font-mono font-bold tracking-wide hover:scale-105 transition-all"
                  >
                    INITIALIZE_WALLET_CONNECTION
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Browser Popup */}
      <MobileBrowserPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        url={popupUrl} 
        title={popupTitle} 
      />
    </BaseLayout>
  );
};

export default Onboarding;