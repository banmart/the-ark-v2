
import React, { useState, useEffect } from 'react';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [plsAmount, setPlsAmount] = useState('');
  const [arkAmount, setArkAmount] = useState('');
  const [copyMessage, setCopyMessage] = useState(false);

  // Scroll handler for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 40);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = days.toString();
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, []);

  // Load stats
  useEffect(() => {
    const loadStats = () => {
      const stats = {
        totalSupply: '1,000,000,000',
        tokensBurned: '47,500,000',
        tvl: '$2,450,000',
        holders: '8,742',
        reflections: '150,000,000',
        lockerRewards: '75,000,000'
      };

      Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
          element.innerHTML = value;
        }
      });

      // Add burn percentage
      const burnPercentage = document.getElementById('burnPercentage');
      if (burnPercentage) {
        burnPercentage.textContent = '+4.75% since launch';
      }
    };

    setTimeout(loadStats, 1000);
  }, []);

  const connectWallet = () => {
    setWalletConnected(!walletConnected);
    const swapButton = document.getElementById('swapButton');
    if (swapButton) {
      swapButton.innerHTML = walletConnected ? 'Connect Wallet' : 'Swap Tokens';
    }
  };

  const calculateSwap = () => {
    const amount = parseFloat(plsAmount) || 0;
    const rate = 10000; // 1 PLS = 10,000 ARK
    const total = amount * rate;
    const fees = total * 0.09; // 9% total fees
    const received = total - fees;

    setArkAmount(total.toString());
    
    const elements = {
      swapRate: rate.toLocaleString(),
      totalFees: fees.toLocaleString(),
      youReceive: received.toLocaleString()
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  };

  const copyContract = () => {
    const contractAddress = "0x0000000000000000000000000000000000000000";
    navigator.clipboard.writeText(contractAddress);
    setCopyMessage(true);
    setTimeout(() => setCopyMessage(false), 3000);
  };

  const executeSwap = () => {
    if (!walletConnected) {
      connectWallet();
    } else {
      alert('Swap functionality would be implemented here');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-['Inter']">
      {/* Animated Background */}
      <div className="fixed w-full h-full top-0 left-0 -z-10 overflow-hidden bg-gradient-radial from-[#1a1a2e] to-[#0a0a0a]">
        <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-grid bg-[length:50px_50px] animate-[grid-move_20s_linear_infinite] opacity-30"></div>
        <div className="floating-orb absolute w-[300px] h-[300px] rounded-full bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent blur-[40px] top-[10%] left-[10%] animate-[float_15s_ease-in-out_infinite]"></div>
        <div className="floating-orb absolute w-[300px] h-[300px] rounded-full bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent blur-[40px] top-[60%] right-[10%] animate-[float_15s_ease-in-out_infinite] [animation-delay:5s]"></div>
        <div className="floating-orb absolute w-[300px] h-[300px] rounded-full bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent blur-[40px] bottom-[10%] left-[30%] animate-[float_15s_ease-in-out_infinite] [animation-delay:10s]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full p-5 backdrop-blur-[20px] z-[1000] transition-all duration-300 ${isScrolled ? 'bg-[rgba(10,10,10,0.95)] py-4' : 'bg-[rgba(10,10,10,0.8)]'}`}>
        <div className="flex justify-between items-center max-w-[1400px] mx-auto">
          <div className="text-[28px] font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-[2px]">
            ARK
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <a href="#swap" className="text-white no-underline font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full">Swap</a>
            <a href="#vault" className="text-white no-underline font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full">Vault</a>
            <a href="#stats" className="text-white no-underline font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full">Stats</a>
            <a href="#features" className="text-white no-underline font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full">Features</a>
            <a href="#chart" className="text-white no-underline font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full">Chart</a>
            <button 
              onClick={connectWallet}
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-[30px] text-black font-bold cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,255,255,0.3)]"
            >
              {walletConnected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-[5%] pt-[120px] pb-[80px] relative bg-cover bg-center bg-fixed animate-[heroFadeIn_2s_ease-out]" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop')"
      }}>
        <div className="max-w-[1400px] w-full grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[1.1] mb-8 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_3s_ease-in-out_infinite]">
              THE ARK
            </h1>
            <p className="text-xl text-[#b0b0b0] mb-10 leading-relaxed">
              The flood is coming. While others drown in inflation and rug pulls, THE ARK saves those who board early. Every transaction builds the vessel stronger - burning supply, rewarding believers, and locking in permanent value. Will you be saved, or will you watch from the shore?
            </p>
            <div className="flex gap-5 flex-wrap">
              <a 
                href="https://pulsex.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-[30px] font-bold no-underline inline-flex items-center gap-2.5 transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,255,255,0.3)]"
              >
                <span>Buy ARK</span>
                <span>→</span>
              </a>
              <a 
                href="#features" 
                className="px-10 py-4 rounded-[30px] font-bold no-underline inline-flex items-center gap-2.5 transition-all duration-300 relative overflow-hidden bg-transparent text-cyan-400 border-2 border-cyan-400 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,255,255,0.3)]"
              >
                <span>Learn More</span>
              </a>
            </div>
          </div>
          <div className="relative flex justify-center items-center h-[500px]">
            <div className="w-[350px] h-[350px] relative [transform-style:preserve-3d] animate-[rotate-3d_20s_linear_infinite]">
              <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-[rgba(0,255,255,0.1)] to-[rgba(0,128,255,0.1)] border-2 border-[rgba(0,255,255,0.5)] flex items-center justify-center text-[15rem] font-black backdrop-blur-[10px] shadow-[0_0_50px_rgba(0,255,255,0.5)] text-cyan-400 [text-shadow:0_0_30px_rgba(0,255,255,0.8),0_0_60px_rgba(0,255,255,0.5)]">
                ❍
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Address Section */}
      <section className="py-20 px-[5%] bg-gradient-to-b from-transparent via-[rgba(0,255,255,0.02)] to-transparent">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[2rem] mb-8 text-cyan-400">🔐 The Sacred Contract 🔐</h2>
          <div className="bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(0,255,255,0.3)] rounded-[20px] p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[rgba(0,255,255,0.05)] to-transparent animate-pulse"></div>
            <p className="text-lg text-[#b0b0b0] mb-5">Official ARK Contract Address (PulseChain)</p>
            <div className="bg-[rgba(0,0,0,0.5)] border border-[rgba(0,255,255,0.5)] rounded-[15px] p-5 flex items-center gap-4 relative">
              <input 
                type="text" 
                id="contractAddress" 
                value="0x0000000000000000000000000000000000000000" 
                readOnly 
                className="flex-1 bg-transparent border-none text-cyan-400 font-mono text-lg outline-none cursor-pointer"
                onClick={copyContract}
              />
              <button 
                onClick={copyContract}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 border-none py-3 px-6 rounded-[10px] text-black font-bold cursor-pointer transition-all duration-300 whitespace-nowrap"
              >
                <span>📋 Copy</span>
              </button>
            </div>
            <div className={`mt-4 text-green-400 text-sm transition-opacity duration-300 ${copyMessage ? 'opacity-100' : 'opacity-0'}`}>
              ✅ Contract address copied to clipboard!
            </div>
            <div className="mt-8 flex gap-5 justify-center flex-wrap">
              <a href="https://scan.pulsechain.com/address/0x0000000000000000000000000000000000000000" target="_blank" rel="noopener noreferrer" className="text-cyan-400 no-underline flex items-center gap-1 py-2.5 px-5 border border-[rgba(0,255,255,0.3)] rounded-[10px] transition-all duration-300">
                <span>🔍</span> View on PulseScan
              </a>
              <a href="https://dexscreener.com/pulsechain/0x0000000000000000000000000000000000000000" target="_blank" rel="noopener noreferrer" className="text-cyan-400 no-underline flex items-center gap-1 py-2.5 px-5 border border-[rgba(0,255,255,0.3)] rounded-[10px] transition-all duration-300">
                <span>📊</span> View on DexScreener
              </a>
            </div>
            <p className="mt-5 text-sm text-[#666]">
              ⚠️ Always verify the contract address. Beware of scams and copies.
            </p>
          </div>
        </div>
      </section>

      {/* Swap Section */}
      <section id="swap" className="py-[100px] px-[5%] bg-gradient-to-b from-transparent via-[rgba(0,255,255,0.03)] to-transparent">
        <div className="max-w-[500px] mx-auto">
          <h2 className="text-[2.5rem] font-black text-center mb-10 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">Board THE ARK</h2>
          <div className="bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(0,255,255,0.3)] rounded-[30px] p-8 relative overflow-hidden">
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent blur-[80px]"></div>
            
            {/* From Token */}
            <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-5 mb-5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[#666] text-sm">From</span>
                <span className="text-[#666] text-sm">Balance: <span id="plsBalance">0.00</span></span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  id="plsAmount" 
                  placeholder="0.0" 
                  value={plsAmount}
                  onChange={(e) => {
                    setPlsAmount(e.target.value);
                    calculateSwap();
                  }}
                  className="flex-1 bg-transparent border-none text-white text-3xl font-semibold outline-none"
                />
                <div className="flex items-center gap-2.5 bg-[rgba(255,255,255,0.1)] py-2.5 px-4 rounded-[15px]">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">PLS</span>
                </div>
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center my-0 -my-2.5">
              <div className="bg-[rgba(0,255,255,0.2)] w-[50px] h-[50px] rounded-[15px] flex items-center justify-center border-2 border-[rgba(0,255,255,0.3)] cursor-pointer transition-all duration-300">
                <span className="text-2xl">⬇</span>
              </div>
            </div>

            {/* To Token */}
            <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-5 mb-5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[#666] text-sm">To</span>
                <span className="text-[#666] text-sm">Balance: <span id="arkBalance">0.00</span></span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  id="arkAmount" 
                  placeholder="0.0" 
                  value={arkAmount}
                  readOnly
                  className="flex-1 bg-transparent border-none text-white text-3xl font-semibold outline-none"
                />
                <div className="flex items-center gap-2.5 bg-[rgba(255,255,255,0.1)] py-2.5 px-4 rounded-[15px]">
                  <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center font-black">❍</div>
                  <span className="font-semibold">ARK</span>
                </div>
              </div>
            </div>

            {/* Swap Info */}
            <div className="bg-[rgba(0,0,0,0.2)] rounded-[15px] p-4 mb-5 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-[#666]">Rate</span>
                <span>1 PLS = <span id="swapRate">0</span> ARK</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#666]">Slippage Tolerance</span>
                <span>2%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#666]">Total Fees (9%)</span>
                <span id="totalFees">0 ARK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">You Receive</span>
                <span className="text-cyan-400 font-semibold"><span id="youReceive">0</span> ARK</span>
              </div>
            </div>

            {/* Swap Button */}
            <button 
              id="swapButton" 
              onClick={executeSwap}
              className="w-full py-[18px] bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-[15px] text-black text-xl font-bold cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <span>{walletConnected ? 'Swap Tokens' : 'Connect Wallet'}</span>
            </button>

            {/* Warning */}
            <p className="text-center mt-4 text-[0.85rem] text-[#666]">
              🛡️ Audited & Safe • 🔥 3% Burn • 💎 2% Reflections • 💧 2% LP • 🔒 2% Locker
            </p>
          </div>
          
          {/* Quick Buy Links */}
          <div className="mt-8 text-center">
            <p className="text-[#666] mb-4">Or swap directly on:</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://app.pulsex.com/swap?outputCurrency=YOUR_CONTRACT_ADDRESS" target="_blank" rel="noopener noreferrer" className="py-3 px-6 bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.3)] rounded-[10px] text-cyan-400 no-underline transition-all duration-300">
                PulseX
              </a>
              <a href="https://app.piteas.io/#/swap?outputCurrency=YOUR_CONTRACT_ADDRESS" target="_blank" rel="noopener noreferrer" className="py-3 px-6 bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.3)] rounded-[10px] text-cyan-400 no-underline transition-all duration-300">
                Piteas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Noah's Ark Section */}
      <section className="py-[100px] px-[5%] bg-gradient-to-b from-transparent via-[rgba(0,255,255,0.05)] to-transparent">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-[2.5rem] font-black mb-10 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">⛵ The Prophecy of Wealth ⛵</h2>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.2)] rounded-[20px] py-[60px] px-10 relative overflow-hidden">
            <div className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent blur-[60px]"></div>
            <p className="text-[1.4rem] leading-[1.8] text-cyan-400 font-medium mb-8">
              "For 40 days and 40 nights, the markets shall flood with worthless tokens. 
              But those who enter THE ARK shall be lifted above the waters."
            </p>
            <p className="text-xl leading-relaxed text-[#b0b0b0]">
              Every holder becomes Noah. Every transaction makes the ARK stronger. 
              The 3% burn is the flood washing away excess. The 2% reflections are manna from heaven. 
              The liquidity pools are the foundation that keeps us afloat. 
              And the locker rewards? That's your covenant with the future.
            </p>
            <div className="mt-10 p-5 bg-[rgba(0,255,255,0.1)] rounded-[15px]">
              <p className="text-lg text-white font-semibold">
                🔥 2 Million tokens burned every hour = Rising above the flood<br/>
                💎 Reflections compound while you sleep = Blessed are the holders<br/>
                🌊 50% of LP burned forever = The ARK cannot sink
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-[100px] px-[5%] bg-[rgba(255,255,255,0.02)] backdrop-blur-[10px] relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:border-[rgba(0,255,255,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)] group">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="text-sm text-cyan-400 uppercase tracking-[2px] mb-4">Total Supply</div>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2.5" id="totalSupply">
              <span className="inline-block w-5 h-5 border-2 border-[rgba(0,255,255,0.3)] rounded-full border-t-cyan-400 animate-spin"></span>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:border-[rgba(0,255,255,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)] group">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="text-sm text-cyan-400 uppercase tracking-[2px] mb-4">Tokens Burned</div>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2.5" id="tokensBurned">
              <span className="inline-block w-5 h-5 border-2 border-[rgba(0,255,255,0.3)] rounded-full border-t-cyan-400 animate-spin"></span>
            </div>
            <div className="text-sm text-green-400" id="burnPercentage"></div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:border-[rgba(0,255,255,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)] group">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="text-sm text-cyan-400 uppercase tracking-[2px] mb-4">Total Value Locked</div>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2.5" id="tvl">
              <span className="inline-block w-5 h-5 border-2 border-[rgba(0,255,255,0.3)] rounded-full border-t-cyan-400 animate-spin"></span>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:border-[rgba(0,255,255,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)] group">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="text-sm text-cyan-400 uppercase tracking-[2px] mb-4">Holders</div>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2.5" id="holders">
              <span className="inline-block w-5 h-5 border-2 border-[rgba(0,255,255,0.3)] rounded-full border-t-cyan-400 animate-spin"></span>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:border-[rgba(0,255,255,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)] group">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="text-sm text-cyan-400 uppercase tracking-[2px] mb-4">Reflections Distributed</div>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2.5" id="reflections">
              <span className="inline-block w-5 h-5 border-2 border-[rgba(0,255,255,0.3)] rounded-full border-t-cyan-400 animate-spin"></span>
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:border-[rgba(0,255,255,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)] group">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-[rgba(0,255,255,0.1)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="text-sm text-cyan-400 uppercase tracking-[2px] mb-4">Locker Rewards</div>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2.5" id="lockerRewards">
              <span className="inline-block w-5 h-5 border-2 border-[rgba(0,255,255,0.3)] rounded-full border-t-cyan-400 animate-spin"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[100px] px-[5%] max-w-[1400px] mx-auto">
        <h2 className="text-center text-5xl font-black mb-[60px] bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">The Four Pillars of Salvation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 transition-all duration-300 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent after:animate-[scan_3s_linear_infinite]">
            <div className="w-20 h-20 bg-gradient-to-r from-[rgba(0,255,255,0.2)] to-[rgba(0,128,255,0.2)] rounded-[20px] flex items-center justify-center text-[2rem] mb-8">🔥</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">The Great Flood</h3>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-5">3%</div>
            <p className="text-[#b0b0b0] leading-relaxed">Like the biblical flood that cleansed the earth, every transaction burns 3% of tokens forever. The supply drowns while your value rises. This is not a bug - it's salvation.</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 transition-all duration-300 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent after:animate-[scan_3s_linear_infinite]">
            <div className="w-20 h-20 bg-gradient-to-r from-[rgba(0,255,255,0.2)] to-[rgba(0,128,255,0.2)] rounded-[20px] flex items-center justify-center text-[2rem] mb-8">💎</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manna From Heaven</h3>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-5">2%</div>
            <p className="text-[#b0b0b0] leading-relaxed">Hold and be blessed. 2% of every transaction rains down on true believers. The longer you hold, the more you receive. Diamond hands are holy hands.</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 transition-all duration-300 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent after:animate-[scan_3s_linear_infinite]">
            <div className="w-20 h-20 bg-gradient-to-r from-[rgba(0,255,255,0.2)] to-[rgba(0,128,255,0.2)] rounded-[20px] flex items-center justify-center text-[2rem] mb-8">💧</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">The Eternal Foundation</h3>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-5">2%</div>
            <p className="text-[#b0b0b0] leading-relaxed">The ARK's foundation grows stronger with each trade. Auto-liquidity ensures we stay afloat, and 50% of LP tokens are sacrificed to the burn address - a permanent covenant.</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 transition-all duration-300 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent after:animate-[scan_3s_linear_infinite]">
            <div className="w-20 h-20 bg-gradient-to-r from-[rgba(0,255,255,0.2)] to-[rgba(0,128,255,0.2)] rounded-[20px] flex items-center justify-center text-[2rem] mb-8">🔒</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">The Chosen Vault</h3>
            <div className="text-[2.5rem] font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-5">2%</div>
            <p className="text-[#b0b0b0] leading-relaxed">Lock your tokens and receive divine rewards. The vault protects the faithful and rewards patience. Time in THE ARK beats timing THE ARK.</p>
          </div>
        </div>
      </section>

      {/* The Flood Timer Section */}
      <section className="py-20 px-[5%] bg-[rgba(0,0,0,0.5)]">
        <div className="max-w-[800px] mx-auto text-center">
          <h3 className="text-[2rem] mb-8 text-cyan-400">⏰ The Flood Approaches ⏰</h3>
          <div className="grid grid-cols-4 gap-5 mb-8">
            <div className="bg-[rgba(255,255,255,0.05)] p-5 rounded-[15px] border border-[rgba(0,255,255,0.3)]">
              <div className="text-[2.5rem] font-black text-cyan-400" id="days">40</div>
              <div className="text-sm text-[#666] uppercase">Days</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] p-5 rounded-[15px] border border-[rgba(0,255,255,0.3)]">
              <div className="text-[2.5rem] font-black text-cyan-400" id="hours">00</div>
              <div className="text-sm text-[#666] uppercase">Hours</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] p-5 rounded-[15px] border border-[rgba(0,255,255,0.3)]">
              <div className="text-[2.5rem] font-black text-cyan-400" id="minutes">00</div>
              <div className="text-sm text-[#666] uppercase">Minutes</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] p-5 rounded-[15px] border border-[rgba(0,255,255,0.3)]">
              <div className="text-[2.5rem] font-black text-cyan-400" id="seconds">00</div>
              <div className="text-sm text-[#666] uppercase">Seconds</div>
            </div>
          </div>
          <p className="text-xl text-[#b0b0b0]">Until the next major burn event. Board THE ARK before it's too late.</p>
        </div>
      </section>

      {/* Locker Vault Section */}
      <section id="vault" className="py-[100px] px-[5%] bg-gradient-to-b from-[rgba(0,0,0,0.5)] via-[rgba(0,255,255,0.02)] to-[rgba(0,0,0,0.5)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[2.5rem] font-black text-center mb-5 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">🔒 The Chosen Vault 🔒</h2>
          <p className="text-center text-xl text-[#b0b0b0] max-w-[800px] mx-auto mb-[60px]">
            Lock your ARK tokens and ascend through divine tiers. The longer you lock, the greater your blessings. 
            2% of every transaction flows to the vault, rewarding the faithful.
          </p>
          
          {/* Vault Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.3)] rounded-[20px] p-8 text-center">
              <div className="text-5xl mb-2.5">🏛️</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2.5">Total Locked</div>
              <div className="text-[2rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                <span id="totalLocked">0</span> ARK
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.3)] rounded-[20px] p-8 text-center">
              <div className="text-5xl mb-2.5">👥</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2.5">Vault Members</div>
              <div className="text-[2rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                <span id="vaultMembers">0</span>
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.3)] rounded-[20px] p-8 text-center">
              <div className="text-5xl mb-2.5">💰</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2.5">Rewards Pool</div>
              <div className="text-[2rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                <span id="rewardsPool">0</span> ARK
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.3)] rounded-[20px] p-8 text-center">
              <div className="text-5xl mb-2.5">📈</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2.5">APY Range</div>
              <div className="text-[2rem] font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                15-150%
              </div>
            </div>
          </div>

          {/* Lock Tiers */}
          <h3 className="text-center text-[2rem] mb-10 text-cyan-400">Lock Tiers & Divine Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-[60px]">
            
            {/* Believer Tier */}
            <div className="bg-gradient-to-br from-[rgba(184,134,11,0.1)] to-[rgba(184,134,11,0.05)] border-2 border-[#B8860B] rounded-[20px] p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-radial from-[rgba(184,134,11,0.2)] to-transparent blur-[60px]"></div>
              <div className="relative z-[1]">
                <div className="text-5xl text-center mb-4">⛵</div>
                <h4 className="text-2xl text-[#B8860B] text-center mb-5">BELIEVER</h4>
                <div className="text-center mb-5">
                  <div className="text-xl font-semibold text-[#B8860B]">7 Days Lock</div>
                  <div className="text-[2rem] font-black text-[#FFD700] my-2.5">15% APY</div>
                </div>
                <ul className="list-none p-0 text-[0.95rem] text-[#b0b0b0]">
                  <li className="mb-2.5">✓ Entry level blessing</li>
                  <li className="mb-2.5">✓ Share in 2% transaction rewards</li>
                  <li className="mb-2.5">✓ Believer role in community</li>
                  <li>✓ Protected from the flood</li>
                </ul>
                <button className="w-full mt-5 py-4 bg-gradient-to-r from-[#B8860B] to-[#FFD700] border-none rounded-[15px] text-black font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  Lock for 7 Days
                </button>
              </div>
            </div>

            {/* Apostle Tier */}
            <div className="bg-gradient-to-br from-[rgba(192,192,192,0.1)] to-[rgba(192,192,192,0.05)] border-2 border-[#C0C0C0] rounded-[20px] p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-radial from-[rgba(192,192,192,0.2)] to-transparent blur-[60px]"></div>
              <div className="relative z-[1]">
                <div className="text-5xl text-center mb-4">🛡️</div>
                <h4 className="text-2xl text-[#C0C0C0] text-center mb-5">APOSTLE</h4>
                <div className="text-center mb-5">
                  <div className="text-xl font-semibold text-[#C0C0C0]">30 Days Lock</div>
                  <div className="text-[2rem] font-black text-[#E5E5E5] my-2.5">50% APY</div>
                </div>
                <ul className="list-none p-0 text-[0.95rem] text-[#b0b0b0]">
                  <li className="mb-2.5">✓ 3.3x rewards multiplier</li>
                  <li className="mb-2.5">✓ Priority vault distributions</li>
                  <li className="mb-2.5">✓ Apostle role & privileges</li>
                  <li>✓ Governance participation</li>
                </ul>
                <button className="w-full mt-5 py-4 bg-gradient-to-r from-[#C0C0C0] to-[#E5E5E5] border-none rounded-[15px] text-black font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  Lock for 30 Days
                </button>
              </div>
            </div>

            {/* Prophet Tier */}
            <div className="bg-gradient-to-br from-[rgba(255,215,0,0.1)] to-[rgba(255,215,0,0.05)] border-2 border-[#FFD700] rounded-[20px] p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-radial from-[rgba(255,215,0,0.2)] to-transparent blur-[60px]"></div>
              <div className="relative z-[1]">
                <div className="text-5xl text-center mb-4">👑</div>
                <h4 className="text-2xl text-[#FFD700] text-center mb-5">PROPHET</h4>
                <div className="text-center mb-5">
                  <div className="text-xl font-semibold text-[#FFD700]">90 Days Lock</div>
                  <div className="text-[2rem] font-black text-[#FFED4E] my-2.5">100% APY</div>
                </div>
                <ul className="list-none p-0 text-[0.95rem] text-[#b0b0b0]">
                  <li className="mb-2.5">✓ 6.6x rewards multiplier</li>
                  <li className="mb-2.5">✓ Exclusive prophet benefits</li>
                  <li className="mb-2.5">✓ Early access to features</li>
                  <li>✓ Prophet council membership</li>
                </ul>
                <button className="w-full mt-5 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] border-none rounded-[15px] text-black font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  Lock for 90 Days
                </button>
              </div>
            </div>

            {/* Noah Tier */}
            <div className="bg-gradient-to-br from-[rgba(0,255,255,0.1)] to-[rgba(0,128,255,0.05)] border-2 border-cyan-400 rounded-[20px] p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-radial from-[rgba(0,255,255,0.3)] to-transparent blur-[60px]"></div>
              <div className="absolute top-2.5 right-2.5 bg-cyan-400 text-black py-1 px-4 rounded-[20px] text-xs font-bold">HIGHEST TIER</div>
              <div className="relative z-[1]">
                <div className="text-5xl text-center mb-4 drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]">⚡</div>
                <h4 className="text-2xl text-cyan-400 text-center mb-5 [text-shadow:0_0_20px_rgba(0,255,255,0.8)]">NOAH</h4>
                <div className="text-center mb-5">
                  <div className="text-xl font-semibold text-cyan-400">180 Days Lock</div>
                  <div className="text-[2rem] font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent my-2.5">150% APY</div>
                </div>
                <ul className="list-none p-0 text-[0.95rem] text-[#b0b0b0]">
                  <li className="mb-2.5">✓ 10x rewards multiplier</li>
                  <li className="mb-2.5">✓ Noah status & recognition</li>
                  <li className="mb-2.5">✓ Maximum vault rewards</li>
                  <li className="mb-2.5">✓ Exclusive Noah benefits</li>
                  <li>✓ Lead the new world</li>
                </ul>
                <button className="w-full mt-5 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-[15px] text-black font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-[0_5px_20px_rgba(0,255,255,0.3)]">
                  Become Noah - Lock 180 Days
                </button>
              </div>
            </div>
          </div>

          {/* Your Locks */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.3)] rounded-[20px] p-10 text-center">
            <h3 className="text-3xl mb-8 text-cyan-400">Your Sacred Locks</h3>
            <div id="userLocks" className="text-[#666]">
              <p>Connect wallet to view your locks</p>
            </div>
            <button 
              onClick={connectWallet}
              className="mt-5 py-4 px-8 bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-[15px] text-black font-bold cursor-pointer"
            >
              {walletConnected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section id="chart" className="py-[100px] px-[5%] max-w-[1400px] mx-auto">
        <h2 className="text-center text-5xl font-black mb-[60px] bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">Price Chart</h2>
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,255,0.2)] rounded-[20px] p-10 h-[500px] relative">
          <canvas id="priceChart" className="w-full h-full"></canvas>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-[60px] px-[5%] bg-[rgba(0,0,0,0.5)] text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="#" title="Twitter" className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.1)] border border-[rgba(0,255,255,0.3)] rounded-full flex items-center justify-center no-underline text-cyan-400 text-xl transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,255,0.3)]">
            𝕏
          </a>
          <a href="#" title="Telegram" className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.1)] border border-[rgba(0,255,255,0.3)] rounded-full flex items-center justify-center no-underline text-cyan-400 text-xl transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,255,0.3)]">
            ✈
          </a>
          <a href="#" title="Discord" className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.1)] border border-[rgba(0,255,255,0.3)] rounded-full flex items-center justify-center no-underline text-cyan-400 text-xl transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,255,0.3)]">
            💬
          </a>
          <a href="#" title="GitHub" className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.1)] border border-[rgba(0,255,255,0.3)] rounded-full flex items-center justify-center no-underline text-cyan-400 text-xl transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,255,0.3)]">
            ⚡
          </a>
        </div>
        <p className="text-[#666]">© 2025 ARK Token. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
