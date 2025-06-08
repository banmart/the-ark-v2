
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowDown, TrendingUp, Users, DollarSign, Lock, Zap, Shield, Copy, ExternalLink, Timer, Gift } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 30
  });

  const [currentPrice, setCurrentPrice] = useState(0.0234);
  const [swapAmount, setSwapAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const contractAddress = "0x1234567890123456789012345678901234567890";

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              THE ARK
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#swap" className="hover:text-cyan-400 transition-colors">Swap</a>
              <a href="#vault" className="hover:text-cyan-400 transition-colors">Vault</a>
              <a href="#stats" className="hover:text-cyan-400 transition-colors">Stats</a>
              <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
              <Link to="/locker" className="hover:text-cyan-400 transition-colors">Locker</Link>
              <a href="#chart" className="hover:text-cyan-400 transition-colors">Chart</a>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto p-6 md:p-12 lg:p-24">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              THE ARK
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
              The flood is coming. While others drown in inflation and rug pulls, THE ARK saves those who board early. Deflationary tokenomics with burns, reflections, and vault rewards protect the chosen few.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                Buy ARK →
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-64 h-64 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Sacred Contract Section */}
      <section className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🔒 The Sacred Contract 🔒</h2>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Contract Address:</span>
              <Button onClick={copyAddress} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="font-mono text-sm bg-white/5 p-3 rounded border break-all">
              {contractAddress}
            </div>
            <div className="flex space-x-4 mt-4">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on PulseScan
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on DexScreener
              </Button>
            </div>
            <p className="text-xs text-yellow-400 mt-4">
              ⚠️ Always verify the contract address before interacting
            </p>
          </div>
        </div>
      </section>

      {/* Board THE ARK Swap Section */}
      <section id="swap" className="max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-8">Board THE ARK</h2>
        <div className="max-w-md mx-auto">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-center">Swap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-400">From</label>
                  <span className="text-sm text-gray-400">Balance: 0.0</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={swapAmount}
                    onChange={(e) => {
                      setSwapAmount(e.target.value);
                      setOutputAmount((Number(e.target.value) * 0.95).toFixed(4));
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-gray-500"
                  />
                  <Badge variant="outline" className="px-3 py-2">PLS</Badge>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button size="icon" variant="outline" className="rounded-full">
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-400">To</label>
                  <span className="text-sm text-gray-400">Balance: 0.0</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={outputAmount}
                    readOnly
                    className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-gray-500"
                  />
                  <Badge variant="outline" className="px-3 py-2 text-cyan-400 border-cyan-400/50">ARK</Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>1 PLS = 42.7 ARK</span>
                </div>
                <div className="flex justify-between">
                  <span>Slippage Tolerance:</span>
                  <span>0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Fees:</span>
                  <span>~$0.01</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                Connect Wallet
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-400">Audited & Safe</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">PulseX</Button>
                  <Button variant="outline" size="sm">Piteas</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Prophecy of Wealth */}
      <section className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-6">⛵ The Prophecy of Wealth ⛵</h2>
          <blockquote className="text-xl text-cyan-400 italic mb-6">
            "For 40 days and 40 nights, the markets shall flood with worthless tokens. But those who board THE ARK shall be saved, and their wealth shall multiply as the waters recede."
          </blockquote>
          <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
            THE ARK isn't just another token—it's salvation from the crypto flood. Our deflationary mechanics ensure that as others lose value, ARK holders are protected and rewarded.
          </p>
          <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-green-400 font-semibold mb-4">Divine Protection Features:</h3>
            <ul className="text-left space-y-2 text-sm">
              <li>• Automatic burns reduce supply permanently</li>
              <li>• Reflections reward all holders passively</li>
              <li>• Vault locking multiplies your rewards</li>
              <li>• Anti-whale mechanisms protect the community</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">ARK Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Total Supply", value: "1,000,000,000", unit: "ARK" },
            { label: "Tokens Burned", value: "125,000,000", unit: "ARK", change: "+2.5%" },
            { label: "Total Value Locked", value: "$12.5M", unit: "", change: "+8.2%" },
            { label: "Holders", value: "15,420", unit: "", change: "+12.1%" },
            { label: "Reflections Distributed", value: "$890K", unit: "", change: "+22.3%" },
            { label: "Locker Rewards", value: "$450K", unit: "", change: "+15.7%" }
          ].map((stat, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
                {stat.unit && <div className="text-xs text-gray-500">{stat.unit}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The Flood Approaches Countdown */}
      <section className="max-w-7xl mx-auto p-6 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">🌊 The Flood Approaches 🌊</h2>
        <p className="text-gray-300 mb-8">Next major burn event countdown</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds }
          ].map((item, index) => (
            <Card key={item.label} className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">{item.value.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The Chosen Vault */}
      <section id="vault" className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🔒 The Chosen Vault 🔒</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Lock your ARK tokens in our sacred vault and earn divine rewards. The longer you lock, the greater your blessing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Locked", value: "250M ARK" },
              { label: "Vault Members", value: "3,420" },
              { label: "Rewards Pool", value: "$2.1M" },
              { label: "APY Range", value: "15-150%" }
            ].map((stat, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lock Tiers */}
      <section className="max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">Lock Tiers & Divine Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              name: "Believer", 
              duration: "7 days", 
              apy: "15%", 
              color: "orange",
              benefits: ["Basic reflections", "Entry level rewards"]
            },
            { 
              name: "Apostle", 
              duration: "30 days", 
              apy: "50%", 
              color: "gray",
              benefits: ["Enhanced reflections", "Priority support"]
            },
            { 
              name: "Prophet", 
              duration: "90 days", 
              apy: "100%", 
              color: "yellow",
              benefits: ["Maximum reflections", "VIP access", "Bonus rewards"]
            },
            { 
              name: "Noah", 
              duration: "180 days", 
              apy: "150%", 
              color: "cyan",
              benefits: ["Divine reflections", "Exclusive access", "Maximum rewards"],
              badge: "HIGHEST TIER"
            }
          ].map((tier, index) => (
            <Card key={index} className={`bg-black/20 backdrop-blur-sm border-${tier.color}-400/50 relative`}>
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-cyan-500 text-white">{tier.badge}</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className={`text-${tier.color}-400 text-center`}>{tier.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-2xl font-bold">{tier.apy}</div>
                  <div className="text-sm text-gray-400">APY</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{tier.duration}</div>
                  <div className="text-sm text-gray-400">Lock Period</div>
                </div>
                <ul className="text-sm space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="text-gray-300">• {benefit}</li>
                  ))}
                </ul>
                <Button className={`w-full bg-${tier.color}-500 hover:bg-${tier.color}-400`}>
                  Lock Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Your Sacred Locks */}
      <section className="max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-8">Your Sacred Locks</h2>
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">Connect your wallet to view your locked tokens and rewards</p>
            <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="p-6 md:p-12 border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            THE ARK
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Salvation from the crypto flood. Built for the chosen few.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400">Discord</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400">Telegram</a>
          </div>
          <p className="text-gray-500 text-xs">
            &copy; 2023 THE ARK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
