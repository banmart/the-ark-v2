import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { useContractData } from '../hooks/useContractData';

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  const {
    data: contractData,
    loading: contractLoading
  } = useContractData();

  useEffect(() => {
    checkWalletConnection();

    // Preload background image and trigger fade-in
    const img = new Image();
    img.onload = () => {
      setBackgroundLoaded(true);
    };
    img.src = 'https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg';
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });
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
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setWalletConnected(true);
        setAccount(accounts[0]);
        toast({
          title: "Connected!",
          description: `Wallet connected with account ${accounts[0]}`
        });
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please install Metamask!"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard"
    });
  };

  const contractAddress = "0x1234567890abcdef1234567890abcdef12345678";

  return <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              ARK
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#swap" className="text-gray-300 hover:text-cyan-400 transition-colors">Swap</a>
              <Link to="/locker" className="text-gray-300 hover:text-cyan-400 transition-colors">Locker</Link>
              <a href="#stats" className="text-gray-300 hover:text-cyan-400 transition-colors">Stats</a>
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#chart" className="text-gray-300 hover:text-cyan-400 transition-colors">Chart</a>
              <button onClick={connectWallet} className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                {walletConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative z-10 pt-32 md:pt-40 pb-12 px-6 min-h-screen flex items-center">
        {/* Background Image with Very Light Opacity */}
        <div className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ${backgroundLoaded ? 'opacity-5' : 'opacity-0'}`} style={{
        backgroundImage: 'url(https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg)'
      }}></div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent animate-[fade-in_1s_ease-out]">
                THE ARK
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-[fade-in_1s_ease-out_0.2s_both]">
                Salvation from the flood
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-[fade-in_1s_ease-out_0.4s_both]">
                While others drown in market chaos, THE ARK saves those who board early. Built on revolutionary tokenomics that reward the faithful and punish the weak.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-[fade-in_1s_ease-out_0.6s_both]">
                <button onClick={() => copyToClipboard(contractAddress)} className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                  Buy ARK
                  <ArrowRight size={18} />
                </button>
                <a href="#features" className="border border-cyan-500/30 px-8 py-3 rounded-full font-semibold hover:bg-cyan-500/10 hover:scale-105 transition-all text-center backdrop-blur-sm">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right side - Clean ❍ Symbol */}
            <div className="flex justify-center animate-[fade-in_1s_ease-out_0.8s_both]">
              <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Clean ❍ Symbol - Keep exactly as is */}
                <div className="text-[24rem] font-black bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent animate-[rotate-3d_15s_linear_infinite] relative z-10">
                  ❍
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Address Section */}
      <section className="relative z-10 py-12 px-6 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">Smart Contract Address</h3>
          <div className="bg-black/50 border border-cyan-500/30 rounded-xl p-6 flex items-center justify-between">
            <code className="text-sm md:text-base text-gray-300 font-mono">{contractAddress}</code>
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(contractAddress)} className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors">
                <Copy size={18} />
              </button>
              <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Swap Section */}
      <section id="swap" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Swap PLS for ARK
          </h2>
          <div className="bg-white/5 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="space-y-6">
              {/* From Token */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">From</span>
                  <span className="text-sm text-gray-400">Balance: 0.0 PLS</span>
                </div>
                <div className="flex items-center gap-4">
                  <input type="number" placeholder="0.0" className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none" />
                  <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    <span className="font-semibold">PLS</span>
                  </div>
                </div>
              </div>

              {/* Swap Icon */}
              <div className="flex justify-center">
                <button className="p-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full transition-colors rotate-0 hover:rotate-180 duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To Token */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">To</span>
                  <span className="text-sm text-gray-400">Balance: 0.0 ARK</span>
                </div>
                <div className="flex items-center gap-4">
                  <input type="number" placeholder="0.0" className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none" readOnly />
                  <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                    <span className="font-semibold">ARK</span>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <button disabled={!walletConnected} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform text-lg">
                {walletConnected ? 'Swap Tokens' : 'Connect Wallet First'}
              </button>

              {/* Swap Info */}
              <div className="bg-black/20 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate</span>
                  <span>1 PLS = 100 ARK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slippage</span>
                  <span>2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span>~$0.01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Real Contract Data */}
      <section id="stats" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            $ARK By The Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Market Cap */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💰 Market Cap</h3>
              <p className="text-3xl font-black text-white mb-2">
                {contractLoading ? <span className="animate-pulse">Loading...</span> : `$${contractData.marketCap}`}
              </p>
              <p className="text-sm text-gray-400">Real-time valuation</p>
            </div>

            {/* Total Supply */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💎 Total Supply</h3>
              <p className="text-3xl font-black text-white mb-2">
                {contractLoading ? <span className="animate-pulse">Loading...</span> : `${contractData.totalSupply} ARK`}
              </p>
              <p className="text-sm text-gray-400">From smart contract</p>
            </div>

            {/* Holders */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">👥 Holders</h3>
              <p className="text-3xl font-black text-white mb-2">
                {contractLoading ? <span className="animate-pulse">Loading...</span> : contractData.holders}
              </p>
              <p className="text-sm text-gray-400">Unique addresses</p>
            </div>
          </div>

          {/* Contract Fees Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-cyan-400 mb-2">🔥 Burn Fee</h4>
              <p className="text-2xl font-bold">
                {contractLoading ? '...' : `${contractData.currentFees.burn}%`}
              </p>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-cyan-400 mb-2">🫂 Reflection Fee</h4>
              <p className="text-2xl font-bold">
                {contractLoading ? '...' : `${contractData.currentFees.reflection}%`}
              </p>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-cyan-400 mb-2">💧 Liquidity Fee</h4>
              <p className="text-2xl font-bold">
                {contractLoading ? '...' : `${contractData.currentFees.liquidity}%`}
              </p>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-cyan-400 mb-2">🔒 Locker Fee</h4>
              <p className="text-2xl font-bold">
                {contractLoading ? '...' : `${contractData.currentFees.locker}%`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - The Four Pillars */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Four Pillars of Salvation
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16">
            $ARK is built upon four core principles, ensuring a stable and rewarding ecosystem for its holders.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Scarcity */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform group">
              <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">🔥</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Scarcity</h3>
              <p className="text-gray-300 text-center">
                Limited supply with continuous burns on transactions creating deflationary pressure.
              </p>
            </div>

            {/* Rewards */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform group">
              <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">💰</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Rewards</h3>
              <p className="text-gray-300 text-center">
                Vault rewards and reflections for loyal holders who believe in the mission.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform group">
              <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">🫂</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Community</h3>
              <p className="text-gray-300 text-center">
                A strong, supportive community driving the project forward together.
              </p>
            </div>

            {/* Security */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform group">
              <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">🛡️</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Security</h3>
              <p className="text-gray-300 text-center">
                Audited contract ensuring safety and transparency for all passengers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated 6-Tier Locker Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🔒 The Sacred Locker Tiers 🔒
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-4xl mx-auto mb-16">
            Lock your ARK tokens and ascend through divine tiers. The longer you lock, the greater your blessings. 
            {contractLoading ? <span className="animate-pulse">Loading rewards...</span> : `${contractData.currentFees.locker}% of every transaction flows to the vault, rewarding the faithful.`}
          </p>
          
          {/* 6-tier system */}
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
                <Link to="/locker" className="block w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform">
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
                <Link to="/locker" className="block w-full bg-gradient-to-r from-gray-400 to-gray-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform">
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
                <Link to="/locker" className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform">
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
                <Link to="/locker" className="block w-full bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform">
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
                <Link to="/locker" className="block w-full bg-gradient-to-r from-purple-400 to-purple-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform">
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
                <Link to="/locker" className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/30">
                  Become Legendary
                </Link>
              </div>
            </div>
          </div>

          {/* Locker Rewards Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-cyan-400 mb-4">💰 Pending Locker Rewards</h4>
              <p className="text-2xl font-black text-green-400">
                {contractLoading ? <span className="animate-pulse">Loading...</span> : `${contractData.lockerRewards.pending} ARK`}
              </p>
              <p className="text-sm text-gray-400 mt-2">Ready for distribution</p>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-cyan-400 mb-4">🎁 Total Distributed</h4>
              <p className="text-2xl font-black text-blue-400">
                {contractLoading ? <span className="animate-pulse">Loading...</span> : `${contractData.lockerRewards.distributed} ARK`}
              </p>
              <p className="text-sm text-gray-400 mt-2">All-time rewards paid</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link to="/locker" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-12 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30">
              <Sparkles className="inline w-5 h-5 mr-2" />
              Enter The Sacred Locker
            </Link>
          </div>
        </div>
      </section>

      {/* Noah's Prophecy Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Prophecy of Noah's ARK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* The Flood */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">🌊</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">The Flood</h3>
              <p className="text-gray-300 text-center">
                As the crypto waters rise and projects sink, only those aboard the ARK shall survive the great cleansing.
              </p>
            </div>

            {/* The Chosen */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">The Chosen</h3>
              <p className="text-gray-300 text-center">
                ARK holders are the chosen ones, guided by divine tokenomics to weather any storm in the crypto seas.
              </p>
            </div>

            {/* New World */}
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">🕊️</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">New World</h3>
              <p className="text-gray-300 text-center">
                When the waters recede, ARK passengers will rebuild the crypto world, stronger and more united than before.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            The Great Flood Approaches
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-cyan-400">07</div>
              <div className="text-sm text-gray-400">Days</div>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-cyan-400">14</div>
              <div className="text-sm text-gray-400">Hours</div>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-cyan-400">32</div>
              <div className="text-sm text-gray-400">Minutes</div>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-3xl font-black text-cyan-400">18</div>
              <div className="text-sm text-gray-400">Seconds</div>
            </div>
          </div>
          <p className="text-gray-300 mt-6">Until the next major crypto correction. Board the ARK now!</p>
        </div>
      </section>

      {/* Chart Section */}
      <section id="chart" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            $ARK Price Chart
          </h2>
          <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Interactive Chart Coming Soon</h3>
              <p className="text-gray-300">Real-time price data and trading view integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                ARK
              </div>
              <p className="text-gray-400 text-sm">
                Salvation from the crypto flood. Join the ARK and be saved.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#swap" className="hover:text-cyan-400 transition-colors">Swap</a></li>
                <li><Link to="/locker" className="hover:text-cyan-400 transition-colors">Locker</Link></li>
                <li><a href="#stats" className="hover:text-cyan-400 transition-colors">Stats</a></li>
                <li><a href="#chart" className="hover:text-cyan-400 transition-colors">Chart</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Medium</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Audit</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyan-500/20 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; 2024 THE ARK. All rights reserved. Built for the faithful.
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
