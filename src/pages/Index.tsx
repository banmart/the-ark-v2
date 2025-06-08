
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, TrendingUp, Lock, Users, DollarSign } from 'lucide-react';

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 z-[-2]">
        <div className="pulse-grid"></div>
        <div className="floating-orb orb1"></div>
        <div className="floating-orb orb2"></div>
        <div className="floating-orb orb3"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-nav z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ARK
            </div>
            <div className="flex items-center gap-8">
              <a href="#swap" className="text-muted-foreground hover:text-cyan-400 transition-colors z-20 relative">Swap</a>
              <a href="/locker" className="text-muted-foreground hover:text-cyan-400 transition-colors z-20 relative">Locker</a>
              <a href="#stats" className="text-muted-foreground hover:text-cyan-400 transition-colors z-20 relative">Stats</a>
              <Button 
                onClick={() => setWalletConnected(!walletConnected)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:scale-105 transition-transform z-20 relative"
              >
                {walletConnected ? 'Disconnect' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        
        {/* Gradient Overlay - Bottom to Top Fade */}
        <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              THE ARK
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Salvation from the Flood
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
              Board THE ARK and be saved from the crypto flood. Our deflationary tokenomics with burns, reflections, and vault rewards ensure only the faithful are rewarded.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:scale-105 transition-transform text-lg px-8 py-4 z-20 relative"
              >
                Enter The Ark <ArrowRight className="ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:scale-105 transition-transform text-lg px-8 py-4 z-20 relative"
              >
                Read Whitepaper
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Divine Tokenomics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card hover:scale-105 transition-transform z-20 relative">
              <CardContent className="p-8 text-center">
                <Shield className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-4 text-white">Deflationary Burns</h3>
                <p className="text-gray-300">
                  5% of every transaction is permanently burned, reducing supply and increasing scarcity for true believers.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform z-20 relative">
              <CardContent className="p-8 text-center">
                <Zap className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-4 text-white">Reflection Rewards</h3>
                <p className="text-gray-300">
                  3% redistributed to all holders automatically. The more you hold, the more you receive.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform z-20 relative">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-4 text-white">Vault Staking</h3>
                <p className="text-gray-300">
                  Lock your tokens in The Vault for multiplied rewards. The longer you commit, the greater your blessings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section id="stats" className="relative z-10 py-24 px-6 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Numbers Don't Lie
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center z-20 relative">
              <div className="text-4xl font-black text-cyan-400 mb-2">1B</div>
              <div className="text-gray-300">Total Supply</div>
            </div>
            
            <div className="text-center z-20 relative">
              <div className="text-4xl font-black text-green-400 mb-2">250M</div>
              <div className="text-gray-300">Tokens Burned</div>
            </div>
            
            <div className="text-center z-20 relative">
              <div className="text-4xl font-black text-purple-400 mb-2">15,847</div>
              <div className="text-gray-300">Holders</div>
            </div>
            
            <div className="text-center z-20 relative">
              <div className="text-4xl font-black text-yellow-400 mb-2">$2.3M</div>
              <div className="text-gray-300">Market Cap</div>
            </div>
          </div>
        </div>
      </section>

      {/* Swap Interface */}
      <section id="swap" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Board The Ark
          </h2>
          
          <Card className="glass-strong max-w-md mx-auto z-20 relative">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">From</label>
                  <div className="bg-black/50 border border-gray-600 rounded-lg p-4 flex justify-between items-center">
                    <input 
                      type="number" 
                      placeholder="0.0" 
                      className="bg-transparent text-white text-xl outline-none flex-1"
                    />
                    <div className="text-gray-400">ETH</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" size="sm" className="rounded-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 z-20 relative">
                    ⇅
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">To</label>
                  <div className="bg-black/50 border border-gray-600 rounded-lg p-4 flex justify-between items-center">
                    <input 
                      type="number" 
                      placeholder="0.0" 
                      className="bg-transparent text-white text-xl outline-none flex-1"
                    />
                    <div className="text-cyan-400 font-bold">ARK</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:scale-105 transition-transform py-6 text-lg font-bold z-20 relative"
                  disabled={!walletConnected}
                >
                  {walletConnected ? 'Swap Tokens' : 'Connect Wallet First'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative z-10 py-24 px-6 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Journey Ahead
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card z-20 relative">
              <CardContent className="p-8">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Phase 1: Genesis</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Token Launch</li>
                  <li>• Community Building</li>
                  <li>• DEX Listings</li>
                  <li>• Audit Completion</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card z-20 relative">
              <CardContent className="p-8">
                <div className="text-3xl mb-4">⛵</div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Phase 2: Voyage</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Vault Staking Launch</li>
                  <li>• CEX Listings</li>
                  <li>• NFT Collection</li>
                  <li>• Partnerships</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card z-20 relative">
              <CardContent className="p-8">
                <div className="text-3xl mb-4">🏰</div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Phase 3: Salvation</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• DeFi Ecosystem</li>
                  <li>• Cross-chain Bridge</li>
                  <li>• DAO Governance</li>
                  <li>• Global Adoption</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            THE ARK
          </div>
          <p className="text-gray-400 mb-6">
            Salvation from the Flood
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors z-20 relative">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors z-20 relative">Telegram</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors z-20 relative">Discord</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors z-20 relative">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
