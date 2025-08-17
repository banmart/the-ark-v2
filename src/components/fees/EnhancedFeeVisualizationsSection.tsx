import React, { useState, useEffect, useMemo } from 'react';

interface ContractData {
  totalSupply: number;
  burnedTokens: number;
  reflectionPool: number;
  liquidityAccumulation: number;
  lockerRewards: number;
  swapThreshold: number;
}

const EnhancedFeeVisualizationsSection: React.FC = () => {
  // Mock data based on smart contract analysis
  const [contractData, setContractData] = useState<ContractData>({
    totalSupply: 1000000000,
    burnedTokens: 15420000,
    reflectionPool: 8750000,
    liquidityAccumulation: 2340000,
    lockerRewards: 12800000,
    swapThreshold: 50000
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fee structure from contract
  const feeStructure = {
    burn: 2, // 200/10000 = 2%
    reflection: 2, // 200/10000 = 2%
    liquidity: 3, // 300/10000 = 3%
    locker: 2 // 200/10000 = 2%
  };

  const formatAmount = (amount: number): string => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
    return amount.toString();
  };

  const pillars = useMemo(() => [
    {
      id: 'burn',
      title: 'Burn Protocol',
      emoji: '🔥',
      fee: feeStructure.burn,
      amount: contractData.burnedTokens,
      description: 'Tokens permanently removed from circulation',
      color: 'from-red-500/20 to-orange-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-300',
      glowColor: 'shadow-red-500/20'
    },
    {
      id: 'reflection',
      title: 'Reflection Matrix',
      emoji: '💎',
      fee: feeStructure.reflection,
      amount: contractData.reflectionPool,
      description: 'Rewards distributed to all holders',
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/20'
    },
    {
      id: 'liquidity',
      title: 'Liquidity Engine',
      emoji: '🌊',
      fee: feeStructure.liquidity,
      amount: contractData.liquidityAccumulation,
      description: 'Auto-liquidity for price stability',
      color: 'from-cyan-500/20 to-teal-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-300',
      glowColor: 'shadow-cyan-500/20'
    },
    {
      id: 'locker',
      title: 'Locker Rewards',
      emoji: '🔒',
      fee: feeStructure.locker,
      amount: contractData.lockerRewards,
      description: 'Additional rewards for locked tokens',
      color: 'from-purple-500/20 to-violet-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-300',
      glowColor: 'shadow-purple-500/20'
    }
  ], [contractData]);

  interface PillarCardProps {
    pillar: typeof pillars[0];
    index: number;
  }

  const PillarCard: React.FC<PillarCardProps> = ({ pillar, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        className={`
          relative group transition-all duration-700 ease-out transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          hover:scale-105 hover:-translate-y-2
        `}
        style={{ transitionDelay: `${index * 150}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Container */}
        <div className={`
          relative h-48 rounded-2xl backdrop-blur-md border-2 overflow-hidden
          bg-gradient-to-br ${pillar.color}
          ${pillar.borderColor} hover:border-opacity-60
          transition-all duration-500 ease-out
          hover:${pillar.glowColor}
        `}>
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div 
              className={`
                absolute inset-0 bg-gradient-to-br ${pillar.color}
                transition-transform duration-1000 ease-out
                ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}
              `}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  text-3xl transition-transform duration-300
                  ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}
                `}>
                  {pillar.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  <div className={`text-2xl font-bold ${pillar.textColor}`}>
                    {pillar.fee}%
                  </div>
                </div>
              </div>
              
              {/* Live Indicator */}
              <div className="flex items-center gap-2">
                <div className={`
                  w-2 h-2 rounded-full bg-green-400
                  transition-all duration-1000
                  ${isHovered ? 'animate-pulse scale-125' : ''}
                `} />
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            </div>

            {/* Amount Display */}
            <div className="text-center py-4">
              <div className={`
                text-3xl font-bold bg-gradient-to-r from-white to-gray-300 
                bg-clip-text text-transparent transition-all duration-300
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}>
                {formatAmount(pillar.amount)}
              </div>
              <div className="text-xs text-gray-400 mt-1">ARK Tokens</div>
            </div>

            {/* Description */}
            <div className="text-center">
              <p className="text-sm text-gray-300 leading-relaxed">
                {pillar.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className={`
                    h-full bg-gradient-to-r ${pillar.color.replace('/20', '/60').replace('/10', '/40')}
                    rounded-full transition-all duration-1000 ease-out
                    ${isVisible ? 'w-full' : 'w-0'}
                  `}
                  style={{ transitionDelay: `${index * 200 + 800}ms` }}
                />
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${pillar.color.replace('/20', '/5').replace('/10', '/3')}
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
            pointer-events-none
          `} />
        </div>
      </div>
    );
  };

  return (
    <section className="relative py-16 px-6 overflow-hidden">
      
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className={`
          text-center mb-12 transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm text-cyan-300 font-medium">Quantum Fee Distribution</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            The ARK Pillars
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Real-time visualization of our 9% maximum fee structure on PulseChain
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.id} pillar={pillar} index={index} />
          ))}
        </div>

        {/* Total Fee Summary */}
        <div className={`
          text-center transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
        style={{ transitionDelay: '1200ms' }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-400/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-300 font-semibold">Max Total Fee:</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              9%
            </div>
            <span className="text-sm text-gray-400">• PulseChain Network</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeeVisualizationsSection;