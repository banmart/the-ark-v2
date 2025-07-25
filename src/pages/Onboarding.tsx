import React from 'react';
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
        url: 'https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0xACC15eF8fa2e702d0138c3662A9E7d696f40F021',
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
        url: 'https://pulsex.mypinata.cloud/ipfs/bafybeibzu7nje2o2tufb3ifitjrto3n3xcwon7fghq2igtcupulfubnrim/#/add/v2/0xacc15ef8fa2e702d0138c3662a9e7d696f40f021/0xefD766cCb38EaF1dfd701853BFCe31359239F305',
        icon: '💧',
        external: true
      }]
    }
  };
  return <BaseLayout>
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
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">GET STARTED WITH ARK</h1>
              <div className="text-sm font-mono text-cyan-400/60 tracking-[0.2em]">
                [DIVINE_ASCENSION_AWAITS]
              </div>
            </div>

            {/* Description */}
            
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
              {/* Section Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider">{section.title}_PROTOCOL</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-mono">
                  {section.title}
                </h2>
                <p className="text-gray-400 text-sm">{section.subtitle}</p>
              </div>

              {/* Services Grid */}
              {section.services && (
                <div className="grid grid-cols-1 gap-6 mb-6 justify-items-center">
                  {section.services.map(service => (
                    <ServiceCard 
                      key={service.name} 
                      name={service.name} 
                      description={service.description} 
                      icon={service.icon} 
                      color={service.color as "blue" | "green" | "purple" | "yellow" | "cyan"} 
                      onClick={() => handleExternalLink(service.url, service.name)} 
                      isAvailable={service.isAvailable} 
                    />
                  ))}
                </div>
              )}

              {/* Actions Grid */}
              {section.actions && (
                <div className="grid grid-cols-1 gap-6 justify-items-center">
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
                            handleExternalLink(action.url, action.name);
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
            </div>
          </div>
        ))}

        {/* Wallet Connection CTA */}
        {!isConnected && <div className="px-6 mb-20">
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
                  <Button onClick={() => {
                // This will trigger wallet connection from the navigation
                (document.querySelector('nav button') as HTMLButtonElement)?.click();
              }} className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-8 py-3 font-mono font-bold tracking-wide hover:scale-105 transition-all">
                    INITIALIZE_WALLET_CONNECTION
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>}
      </div>
      
      {/* Mobile Browser Popup */}
      <MobileBrowserPopup isOpen={isOpen} onClose={closePopup} url={url} title={title} />
    </BaseLayout>;
};
export default Onboarding;