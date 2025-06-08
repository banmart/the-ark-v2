import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setAccount(accounts[0]);
        } else {
          setWalletConnected(false);
          setAccount(null);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setWalletConnected(false);
        setAccount(null);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        setAccount(accounts[0]);
        toast({
          title: "Connected!",
          description: `Wallet connected with account ${accounts[0]}`,
        })
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please install Metamask!",
      })
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
        <div className="absolute inset-0 bg-grid animate-grid-move opacity-20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ARK
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#swap" className="text-gray-300 hover:text-cyan-400 transition-colors">Swap</a>
              <Link to="/locker" className="text-gray-300 hover:text-cyan-400 transition-colors">Locker</Link>
              <a href="#stats" className="text-gray-300 hover:text-cyan-400 transition-colors">Stats</a>
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#chart" className="text-gray-300 hover:text-cyan-400 transition-colors">Chart</a>
              <button 
                onClick={connectWallet}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
              >
                {walletConnected ? 'Disconnect' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 md:pt-40 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-heroFadeIn">
            THE ARK: Salvation from the Flood
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-heroFadeIn" style={{ animationDelay: '0.2s' }}>
            Board THE ARK and be saved from the crypto flood. Deflationary tokenomics with burns, reflections, and vault rewards.
          </p>
          <div className="flex justify-center gap-6 animate-heroFadeIn" style={{ animationDelay: '0.4s' }}>
            <a href="#contract" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30">
              Explore Contract
            </a>
            <a href="#swap" className="bg-black/30 border border-cyan-500/30 px-8 py-3 rounded-full font-semibold hover:bg-black/50 hover:scale-105 transition-transform">
              Buy ARK
            </a>
          </div>
        </div>
      </section>

      {/* Contract Section */}
      <section id="contract" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Genesis Contract
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Deflationary Tokenomics */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">🔥 Deflationary Tokenomics</h3>
              <p className="text-gray-300 mb-4">
                Every transaction helps reduce supply and increase value.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400">
                <li>Burns on each transaction</li>
                <li>Redistribution to holders</li>
                <li>Automated liquidity boosts</li>
              </ul>
            </div>

            {/* Vault Rewards */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💰 Vault Rewards</h3>
              <p className="text-gray-300 mb-4">
                Lock your tokens in the vault and earn rewards from transaction fees.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400">
                <li>Earn passive income</li>
                <li>Support the ecosystem</li>
                <li>Increase your holdings</li>
              </ul>
            </div>

            {/* Community Reflections */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">🫂 Community Reflections</h3>
              <p className="text-gray-300 mb-4">
                Holders are rewarded through reflections, increasing their token balance.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400">
                <li>Automatic reflections</li>
                <li>No staking required</li>
                <li>Directly to your wallet</li>
              </ul>
            </div>

            {/* Secure & Transparent */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">🛡️ Secure & Transparent</h3>
              <p className="text-gray-300 mb-4">
                The contract is designed with security and transparency in mind.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400">
                <li>Audited contract code</li>
                <li>Open-source and verifiable</li>
                <li>Community-driven governance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Swap Section */}
      <section id="swap" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Swap and Acquire $ARK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Centralized Exchange */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">🏦 Centralized Exchange</h3>
              <p className="text-gray-300 mb-4">
                Trade ARK on leading centralized exchanges for maximum liquidity.
              </p>
              <a href="#" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform block text-center">
                Trade on Binance
              </a>
            </div>

            {/* Decentralized Exchange */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💱 Decentralized Exchange</h3>
              <p className="text-gray-300 mb-4">
                Swap for ARK on decentralized exchanges with complete control over your assets.
              </p>
              <a href="#" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform block text-center">
                Swap on PancakeSwap
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Prophecy Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Prophecy of $ARK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">🔮 Vision</h3>
              <p className="text-gray-300 mb-4">
                To create a safe haven in the crypto space, rewarding long-term holders.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">🎯 Mission</h3>
              <p className="text-gray-300 mb-4">
                To build a strong, loyal community that benefits from the token's success.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💎 Values</h3>
              <p className="text-gray-300 mb-4">
                Transparency, security, and community-driven growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            $ARK By The Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Market Cap */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💰 Market Cap</h3>
              <p className="text-gray-300 mb-4">
                $12,500,000
              </p>
            </div>

            {/* Total Supply */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💎 Total Supply</h3>
              <p className="text-gray-300 mb-4">
                100,000,000 ARK
              </p>
            </div>

            {/* Holders */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">👥 Holders</h3>
              <p className="text-gray-300 mb-4">
                12,500
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Four Pillars of Salvation
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16">
            $ARK is built upon four core principles, ensuring a stable and rewarding ecosystem for its holders.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Scarcity */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-cyan-400 text-center">🔥</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Scarcity</h3>
              <p className="text-gray-300 text-center">
                Limited supply with continuous burns on transactions.
              </p>
            </div>

            {/* Rewards */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-cyan-400 text-center">💰</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Rewards</h3>
              <p className="text-gray-300 text-center">
                Vault rewards and reflections for loyal holders.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-cyan-400 text-center">🫂</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Community</h3>
              <p className="text-gray-300 text-center">
                A strong, supportive community driving the project forward.
              </p>
            </div>

            {/* Security */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-cyan-400 text-center">🛡️</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Security</h3>
              <p className="text-gray-300 text-center">
                Audited contract ensuring safety and transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Locker Vault Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🔒 The Sacred Locker Tiers 🔒
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-4xl mx-auto mb-16">
            Lock your ARK tokens and ascend through divine tiers. The longer you lock, the greater your blessings. 
            2% of every transaction flows to the vault, rewarding the faithful.
          </p>
          
          {/* Updated 6-tier system */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Bronze Tier */}
            <div className="bg-gradient-to-br from-yellow-600/10 via-yellow-700/5 to-transparent border-2 border-yellow-600/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-yellow-600/20 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl text-center mb-4">⛵</div>
                <h4 className="text-xl font-bold text-yellow-600 text-center mb-4">BRONZE</h4>
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-yellow-600">30-89 Days</div>
                  <div className="text-3xl font-black text-yellow-400 my-2">1x Multiplier</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ Entry level blessing</li>
                  <li>✓ Share in vault rewards</li>
                  <li>✓ Bronze role in community</li>
                  <li>✓ Protected from the flood</li>
                </ul>
                <Link
                  to="/locker"
                  className="block w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  Enter Bronze Tier
                </Link>
              </div>
            </div>

            {/* Silver Tier */}
            <div className="bg-gradient-to-br from-gray-400/10 via-gray-500/5 to-transparent border-2 border-gray-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-gray-400/20 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl text-center mb-4">🛡️</div>
                <h4 className="text-xl font-bold text-gray-400 text-center mb-4">SILVER</h4>
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-gray-400">90-179 Days</div>
                  <div className="text-3xl font-black text-gray-300 my-2">1.5x Multiplier</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ 1.5x rewards multiplier</li>
                  <li>✓ Enhanced vault share</li>
                  <li>✓ Silver role & privileges</li>
                  <li>✓ Priority support</li>
                </ul>
                <Link
                  to="/locker"
                  className="block w-full bg-gradient-to-r from-gray-400 to-gray-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  Ascend to Silver
                </Link>
              </div>
            </div>

            {/* Gold Tier */}
            <div className="bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-transparent border-2 border-yellow-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-yellow-400/20 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl text-center mb-4">👑</div>
                <h4 className="text-xl font-bold text-yellow-400 text-center mb-4">GOLD</h4>
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-yellow-400">180-364 Days</div>
                  <div className="text-3xl font-black text-yellow-300 my-2">2x Multiplier</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ 2x rewards multiplier</li>
                  <li>✓ Gold tier benefits</li>
                  <li>✓ Governance participation</li>
                  <li>✓ Exclusive features access</li>
                </ul>
                <Link
                  to="/locker"
                  className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  Claim Gold Status
                </Link>
              </div>
            </div>

            {/* Diamond Tier */}
            <div className="bg-gradient-to-br from-cyan-400/10 via-cyan-500/5 to-transparent border-2 border-cyan-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl text-center mb-4">💎</div>
                <h4 className="text-xl font-bold text-cyan-400 text-center mb-4">DIAMOND</h4>
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-cyan-400">1-3 Years</div>
                  <div className="text-3xl font-black text-cyan-300 my-2">3x Multiplier</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ 3x rewards multiplier</li>
                  <li>✓ Diamond hand status</li>
                  <li>✓ VIP community access</li>
                  <li>✓ Special event invites</li>
                </ul>
                <Link
                  to="/locker"
                  className="block w-full bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  Achieve Diamond
                </Link>
              </div>
            </div>

            {/* Platinum Tier */}
            <div className="bg-gradient-to-br from-purple-400/10 via-purple-500/5 to-transparent border-2 border-purple-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl text-center mb-4">⭐</div>
                <h4 className="text-xl font-bold text-purple-400 text-center mb-4">PLATINUM</h4>
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-purple-400">3-4 Years</div>
                  <div className="text-3xl font-black text-purple-300 my-2">5x Multiplier</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ 5x rewards multiplier</li>
                  <li>✓ Platinum elite status</li>
                  <li>✓ Development influence</li>
                  <li>✓ Maximum benefits tier</li>
                </ul>
                <Link
                  to="/locker"
                  className="block w-full bg-gradient-to-r from-purple-400 to-purple-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  Reach Platinum
                </Link>
              </div>
            </div>

            {/* Legendary Tier */}
            <div className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border-2 border-orange-500/50 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform shadow-2xl shadow-orange-500/20">
              <div className="absolute top-2 right-2 bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">LEGENDARY</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-orange-500/30 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl text-center mb-4 animate-pulse">⚡</div>
                <h4 className="text-xl font-bold text-orange-400 text-center mb-4">LEGENDARY</h4>
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-orange-400">4-5 Years</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent my-2">8x Multiplier</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ 8x rewards multiplier</li>
                  <li>✓ Legendary ARK status</li>
                  <li>✓ Ultimate vault rewards</li>
                  <li>✓ True Noah privileges</li>
                  <li>✓ Lead the new world</li>
                </ul>
                <Link
                  to="/locker"
                  className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/30"
                >
                  Become Legendary
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/locker"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-12 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
            >
              Enter The Sacred Locker
            </Link>
          </div>
        </div>
      </section>

      {/* Flood Timer Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Great Flood Approaches
          </h2>
          <div className="text-center text-gray-300 text-2xl">
            Time until the next major crypto correction: <span className="font-bold text-cyan-400">7 days, 14 hours, 32 minutes</span>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section id="chart" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            $ARK Price Chart
          </h2>
          <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6">
            {/* Placeholder for chart */}
            <div className="text-center text-gray-300">
              [Interactive chart will be displayed here]
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 py-12 px-6 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          &copy; 2024 THE ARK. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
