import React from 'react';
import { ArrowRight, Zap, DollarSign, Lock, Gift, ExternalLink, Wallet, Sparkles } from 'lucide-react';
import BaseLayout from '../components/layout/BaseLayout';
import ProcessFlow from '../components/onboarding/ProcessFlow';
import ServiceCard from '../components/onboarding/ServiceCard';
import MobileBrowserPopup from '../components/MobileBrowserPopup';
import PremiumBackground from '../components/layout/PremiumBackground';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useBrowserPopup } from '../components/providers/BrowserPopupProvider';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../components/providers/WalletProvider';

const Onboarding = () => {
  const {
    openPopup,
    isOpen,
    closePopup,
    url,
    title
  } = useBrowserPopup();
  const navigate = useNavigate();
  const {
    isConnected
  } = useWalletContext();
  
  const handleExternalLink = (url: string, title: string) => {
    openPopup(url, title);
  };

  const handleNewTabLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getSectionColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          gradient: 'from-purple-400 via-violet-400 to-purple-300',
          glow: 'shadow-purple-500/30',
          border: 'border-purple-500/30',
          pulse: 'bg-purple-400'
        };
      case 'cyan':
        return {
          gradient: 'from-cyan-400 via-teal-400 to-cyan-300',
          glow: 'shadow-cyan-500/30',
          border: 'border-cyan-500/30',
          pulse: 'bg-cyan-400'
        };
      case 'blue':
        return {
          gradient: 'from-blue-400 via-indigo-400 to-blue-300',
          glow: 'shadow-blue-500/30',
          border: 'border-blue-500/30',
          pulse: 'bg-blue-400'
        };
      case 'green':
        return {
          gradient: 'from-green-400 via-emerald-400 to-green-300',
          glow: 'shadow-green-500/30',
          border: 'border-green-500/30',
          pulse: 'bg-green-400'
        };
      default:
        return {
          gradient: 'from-cyan-400 via-teal-400 to-cyan-300',
          glow: 'shadow-cyan-500/30',
          border: 'border-cyan-500/30',
          pulse: 'bg-cyan-400'
        };
    }
  };

  // Grouped sections for organized onboarding
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
        url: 'https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67',
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
        url: 'https://pulsex.mypinata.cloud/ipfs/bafybeibzu7nje2o2tufb3ifitjrto3n3xcwon7fghq2igtcupulfubnrim/#/add/v2/0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67/0xefD766cCb38EaF1dfd701853BFCe31359239F305',
        icon: '💧',
        external: true
      }]
    }
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Premium Background */}
        <PremiumBackground variant="onboarding" particleCount={16} />

        {/* Hero Section */}
        <div className="relative z-10">
          <div className="relative text-center py-16 px-6">
            {/* Premium System Status Badge */}
            <div className="flex justify-center mb-8" style={{ animationDelay: '0.1s' }}>
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]" />
                
                <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl">
                  {/* Inner highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-[pulse_2s_ease-in-out_infinite]" />
                  
                  <div className="relative flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-xs font-mono text-white/90 tracking-[0.2em]">ARK ONBOARDING PROTOCOL</span>
                  </div>
                  
                  <Sparkles className="w-4 h-4 text-teal-400 animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
                </div>
              </div>
            </div>

            {/* Premium Title Section */}
            <div className="mb-10" style={{ animationDelay: '0.2s' }}>
              <div className="text-sm font-mono text-cyan-400/70 mb-4 tracking-[0.3em]">
                [INITIALIZATION SEQUENCE]
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                  GET STARTED WITH ARK
                </span>
              </h1>
              
              <div className="text-sm font-mono text-cyan-400/70 tracking-[0.3em]">
                [DIVINE ASCENSION AWAITS]
              </div>
              
              {/* Animated accent line */}
              <div className="flex justify-center mt-8">
                <div className="relative w-48 h-px">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="relative z-10 px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <ProcessFlow />
          </div>
        </div>

        {/* Grouped Onboarding Sections */}
        {Object.values(groupedSections).map((section, sectionIndex) => {
          const colors = getSectionColorClasses(section.color);
          
          return (
            <div 
              key={section.id} 
              id={section.id} 
              className="relative z-10 px-6 mb-20"
              style={{ animationDelay: `${0.3 + sectionIndex * 0.1}s` }}
            >
              <div className="max-w-6xl mx-auto">
                {/* Premium Section Header */}
                <div className="text-center mb-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative group">
                      {/* Outer glow ring */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-2xl blur-sm opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
                      
                      <div className="relative inline-flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        
                        <div className="relative">
                          <div className={`w-2 h-2 ${colors.pulse} rounded-full animate-pulse`} />
                          <div className={`absolute inset-0 w-2 h-2 ${colors.pulse} rounded-full animate-ping opacity-75`} />
                        </div>
                        <span className="text-xs font-mono text-white/90 tracking-[0.2em]">{section.title} PROTOCOL</span>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className={`text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent font-mono`}>
                    {section.title}
                  </h2>
                  <p className="text-white/60 text-sm">{section.subtitle}</p>
                  
                  {/* Animated separator */}
                  <div className="flex justify-center mt-6">
                    <div className="relative w-32 h-px">
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${colors.gradient.includes('cyan') ? 'via-cyan-400/40' : colors.gradient.includes('purple') ? 'via-purple-400/40' : colors.gradient.includes('blue') ? 'via-blue-400/40' : 'via-green-400/40'} to-transparent`} />
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                {section.services && section.services.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {section.services.map((service, index) => (
                      <div key={service.name} style={{ animationDelay: `${index * 0.1}s` }}>
                        <ServiceCard 
                          name={service.name} 
                          description={service.description} 
                          icon={service.icon} 
                          color={service.color as "blue" | "green" | "purple" | "yellow" | "cyan"} 
                          onClick={() => {
                            if (service.name === 'MetaMask' || service.name === 'ChangeNow') {
                              handleNewTabLink(service.url);
                            } else {
                              handleExternalLink(service.url, service.name);
                            }
                          }}
                          isAvailable={service.isAvailable} 
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Premium Actions Grid */}
                {section.actions && section.actions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {section.actions.map((action, index) => (
                      <div key={action.name} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                        {/* Outer glow ring */}
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        <Card className="relative w-full bg-white/[0.02] backdrop-blur-2xl border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 group overflow-hidden hover:translate-y-[-2px]">
                          {/* Top edge highlight */}
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          
                          {/* Scanning effect */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                          
                          {/* Corner glow */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-4">
                              {/* Premium icon container */}
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center justify-center w-12 h-12 bg-white/[0.05] backdrop-blur-xl rounded-xl border border-white/[0.1] group-hover:scale-110 transition-transform duration-300">
                                  <span className="text-2xl">{action.icon}</span>
                                </div>
                              </div>
                              <span className="font-mono text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{action.name}</span>
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent>
                            <p className="text-white/50 text-sm mb-5 leading-relaxed">{action.description}</p>
                            
                            <div className="relative group/btn">
                              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/40 to-teal-500/40 rounded-lg blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                              <Button 
                                onClick={() => {
                                  if (action.external) {
                                    handleNewTabLink(action.url);
                                  } else {
                                    navigate(action.url);
                                  }
                                }} 
                                className="relative w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-mono font-semibold tracking-wide hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                <span className="relative flex items-center justify-center gap-2">
                                  <Zap className="w-4 h-4" />
                                  {action.external ? 'OPEN' : 'NAVIGATE'}
                                  {action.external && <ExternalLink className="w-4 h-4" />}
                                </span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Premium Wallet Connection CTA */}
        {!isConnected && (
          <div className="relative z-10 px-6 mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Multi-layer background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-[pulse_4s_ease-in-out_infinite]" />
                
                <Card className="relative bg-white/[0.02] backdrop-blur-2xl border-white/[0.08] overflow-hidden">
                  {/* Top edge highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  
                  {/* Animated background pulse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-purple-500/5 animate-[pulse_3s_ease-in-out_infinite]" />
                  
                  <CardContent className="p-10 text-center relative z-10">
                    <div className="mb-8">
                      {/* Premium icon container */}
                      <div className="relative inline-block">
                        <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/40 to-teal-500/40 rounded-full blur-lg animate-[pulse_2s_ease-in-out_infinite]" />
                        <div className="relative w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Zap className="w-10 h-10 text-black" />
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-teal-400 to-green-400 bg-clip-text text-transparent font-mono">
                      WALLET CONNECTION REQUIRED
                    </h4>
                    <p className="text-white/50 mb-8 max-w-md mx-auto">Connect your wallet to access the full ARK ecosystem</p>
                    
                    <div className="relative inline-block group/btn">
                      <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500/50 to-teal-500/50 rounded-xl blur-sm opacity-60 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <Button 
                        onClick={() => {
                          (document.querySelector('nav button') as HTMLButtonElement)?.click();
                        }} 
                        className="relative bg-gradient-to-r from-cyan-500 to-teal-500 text-black px-10 py-4 font-mono font-bold tracking-wide hover:scale-105 transition-all duration-300 text-base overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          INITIALIZE WALLET CONNECTION
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <MobileBrowserPopup isOpen={isOpen} onClose={closePopup} url={url} title={title} />
    </BaseLayout>
  );
};

export default Onboarding;
