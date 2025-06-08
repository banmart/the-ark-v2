
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowDown, TrendingUp, Users, DollarSign, Lock, Zap, Shield } from "lucide-react";
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

  const priceData = [
    { time: "00:00", price: 0.0198 },
    { time: "04:00", price: 0.0215 },
    { time: "08:00", price: 0.0189 },
    { time: "12:00", price: 0.0245 },
    { time: "16:00", price: 0.0234 },
    { time: "20:00", price: 0.0267 },
  ];

  const volumeData = [
    { time: "Mon", volume: 1250000 },
    { time: "Tue", volume: 980000 },
    { time: "Wed", volume: 1850000 },
    { time: "Thu", volume: 1420000 },
    { time: "Fri", volume: 2100000 },
    { time: "Sat", volume: 1680000 },
    { time: "Sun", volume: 1390000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_40%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20 animate-[grid-move_20s_linear_infinite]">
          <div className="absolute inset-0 bg-grid bg-[size:50px_50px]" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border border-cyan-400/30 rotate-45 animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full animate-[float_8s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-40 left-1/4 w-20 h-20 border-2 border-purple-400/30 rounded-full animate-[rotate-3d_15s_linear_infinite]" />

        {/* Scanning beam effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-[scan_4s_linear_infinite]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-[gradient-shift_3s_ease-in-out_infinite]">
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
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:scale-105 transition-all duration-200">
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 lg:p-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 animate-[heroFadeIn_1s_ease-out]">
            Salvation from the Flood
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 animate-[heroFadeIn_1s_ease-out_0.2s_both]">
            Board THE ARK and be saved from the crypto flood. Deflationary tokenomics with burns, reflections, and vault rewards.
          </p>
          
          {/* Live Price Display */}
          <div className="flex justify-center items-center space-x-4 mb-8 animate-[heroFadeIn_1s_ease-out_0.4s_both]">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
              ARK: ${currentPrice.toFixed(4)}
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.4%
            </Badge>
          </div>

          <div className="space-x-4 animate-[heroFadeIn_1s_ease-out_0.6s_both]">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:scale-105 transition-all duration-200">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-200">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section id="countdown" className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Next Burn Event
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds }
          ].map((item, index) => (
            <Card key={item.label} className="bg-black/20 backdrop-blur-sm border-white/10 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">{item.value.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Swap Section */}
      <section id="swap" className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-center text-xl">Quick Swap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
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
                  <Badge variant="outline" className="px-3 py-2">ETH</Badge>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button size="icon" variant="outline" className="rounded-full">
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">To</label>
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

              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                Swap
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Protocol Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, label: "Total Value Locked", value: "$12.5M", change: "+8.2%" },
            { icon: Users, label: "Total Holders", value: "15,420", change: "+12.1%" },
            { icon: Lock, label: "Tokens Burned", value: "2.1M", change: "+15.7%" },
            { icon: Zap, label: "Rewards Paid", value: "$890K", change: "+22.3%" }
          ].map((stat, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-sm border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-cyan-400" />
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Chart Section */}
      <section id="chart" className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Price Chart (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ price: { label: "Price", color: "#06b6d4" } }} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#priceGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Volume (7d)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ volume: { label: "Volume", color: "#8b5cf6" } }} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Why Choose THE ARK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Deflationary Tokenomics",
              description: "Automatic burns reduce supply over time, increasing scarcity and value for all holders.",
              color: "cyan"
            },
            {
              icon: Lock,
              title: "Vault Rewards",
              description: "Stake your ARK tokens in our secure vaults and earn passive rewards while you sleep.",
              color: "blue"
            },
            {
              icon: Users,
              title: "Community Driven",
              description: "Join a vibrant community of crypto enthusiasts and shape the future of THE ARK together.",
              color: "purple"
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Built on cutting-edge technology for instant transactions and minimal fees.",
              color: "cyan"
            },
            {
              icon: DollarSign,
              title: "Yield Farming",
              description: "Participate in liquidity mining and earn additional rewards through our farming protocols.",
              color: "blue"
            },
            {
              icon: TrendingUp,
              title: "Auto-Compounding",
              description: "Smart contracts automatically reinvest your rewards for exponential growth potential.",
              color: "purple"
            }
          ].map((feature, index) => (
            <Card key={index} className={`bg-black/20 backdrop-blur-sm border-white/10 hover:border-${feature.color}-400/50 transition-all duration-300 hover:scale-105 group`}>
              <CardContent className="p-6">
                <feature.icon className={`w-12 h-12 text-${feature.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                <Progress value={85 + index * 2} className="mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 p-6 md:p-12 border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                THE ARK
              </div>
              <p className="text-gray-400 text-sm">
                Salvation from the crypto flood. Join the ARK and secure your digital future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Tokenomics</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Audit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Medium</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Bug Bounty</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 border-t border-white/10 pt-8">
            <p>&copy; 2023 THE ARK. All rights reserved. Built for the community, by the community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
