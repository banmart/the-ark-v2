import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_40%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              THE ARK
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-cyan-400 transition-colors">Swap</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Vault</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Stats</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Features</a>
              <Link to="/locker" className="hover:text-cyan-400 transition-colors">Locker</Link>
              <a href="#" className="hover:text-cyan-400 transition-colors">Chart</a>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 lg:p-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 animate-heroFadeIn">
            Salvation from the Flood
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 animate-heroFadeIn delay-100">
            Board THE ARK and be saved from the crypto flood. Deflationary tokenomics with burns, reflections, and vault rewards.
          </p>
          <div className="space-x-4 animate-heroFadeIn delay-200">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-cyan-400 transition-colors">
            <h3 className="text-xl font-semibold mb-4">Deflationary Tokenomics</h3>
            <p className="text-gray-300">
              Automatic burns reduce supply over time, increasing scarcity and value.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-blue-400 transition-colors">
            <h3 className="text-xl font-semibold mb-4">Vault Rewards</h3>
            <p className="text-gray-300">
              Stake your ARK tokens in our secure vaults and earn passive rewards.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-purple-400 transition-colors">
            <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
            <p className="text-gray-300">
              Join a vibrant community of crypto enthusiasts and shape the future of THE ARK.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 p-6 md:p-12 text-center text-gray-500 border-t border-white/10">
        <p>&copy; 2023 THE ARK. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
