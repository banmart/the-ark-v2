// Creative animated background component
const AnimatedBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
    
    {/* Floating orbs */}
    <motion.div
      className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
      animate={{
        x: [0, -80, 0],
        y: [0, 60, 0],
        scale: [1, 0.8, 1],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="absolute bottom-32 left-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"
      animate={{
        x: [0, -60, 0],
        y: [0, -40, 0],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    
    {/* Grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
  </div>
));

// Creative fee card component with unique layouts
const CreativeFeeCard = memo(({ card, index, contractData }) => {
  const isEven = index % 2 === 0;
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: isEven ? -15 : 15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const hoverVariants = {
    hover: { 
      scale: 1.05,
      y: -10,
      rotateY: isEven ? 5 : -5,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-100px" }}
      className="group perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <Card className={`
        relative overflow-hidden backdrop-blur-md h-80
        bg-gradient-to-br ${card.bgGradient}
        border-2 ${card.border}
        transition-all duration-700 ease-out
        hover:shadow-2xl ${card.shadowColor}
        group-hover:border-opacity-100
        transform-gpu
      `}>
        <CardContent className="p-0 h-full relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.patternGradient}`} />
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${card.accentColor}22 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${card.accentColor}15 0%, transparent 50%)`
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 p-8 h-full flex flex-col">
            {/* Header with icon and title */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className={`p-4 rounded-2xl bg-gradient-to-br ${card.iconBg} backdrop-blur-sm border ${card.iconBorder} shadow-lg`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {card.icon}
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400 font-semibold">Live Protocol</span>
                  </div>
                </div>
              </div>
              
              <motion.div
                className="text-right"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200 }}
              >
                <div className={`text-4xl font-bold bg-gradient-to-r ${card.efficiencyGradient} bg-clip-text text-transparent`}>
                  {(card.efficiency * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-300 font-medium">Efficiency</div>
              </motion.div>
            </div>

            {/* Data showcase */}
            <div className="flex-1 flex flex-col justify-center">
              <motion.div 
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${card.dataBg} backdrop-blur-sm border ${card.dataBorder} shadow-inner`}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.3 }}
              >
                {/* Sparkle effect */}
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-400 opacity-60" />
                </motion.div>

                <div className="text-center">
                  <motion.div 
                    className={`text-5xl font-bold bg-gradient-to-r ${card.amountGradient} bg-clip-text text-transparent mb-3`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.8, type: "spring" }}
                  >
                    {card.formattedAmount}
                  </motion.div>
                  
                  <div className={`text-lg font-semibold ${card.labelColor} mb-2 flex items-center justify-center gap-2`}>
                    <Target className="h-5 w-5" />
                    {card.realData.label}
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {card.realData.description}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 relative">
                  <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${card.progressGradient} rounded-full relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${card.efficiency * 100}%` }}
                      transition={{ delay: index * 0.2 + 1.2, duration: 1.5, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action indicator */}
            <motion.div 
              className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-300"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Real-time PulseChain Data</span>
            </motion.div>
          </div>

          {/* Hover glow effect */}
          <motion.div 
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${card.glowGradient}`}
            initial={false}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
});

const App = () => {
  const { data: arkData } = useARKTokenData();
  const { data: contractData, loading: contractLoading } = useContractData();
  const { data: reflectionData, loading: reflectionLoading } = useReflectionData();
  const { protocolStats, loading: lockerLoading } = useLockerData();

  // Memoized calculations for better performance
  const calculations = useMemo(() => {
    const formatAmount = (amount) => {
      if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
      if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
      if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
      return amount.toFixed(2);
    };

    const burnedTokens = parseFloat(contractData?.burnedTokens?.toString() || '0');
    const reflectionPool = parseFloat(reflectionData?.totalReflectionPool?.toString() || '0');
    const liquidityAccumulation = parseFloat(contractData?.liquidityData?.currentAccumulation?.toString() || '0');
    const totalLocked = parseFloat(protocolStats?.totalLockedTokens?.toString() || '0');
    
    const totalSupply = parseFloat(contractData?.totalSupply?.toString() || '1000000000');
    const burnEfficiency = Math.min(100, (burnedTokens / (totalSupply * 0.05)) * 100);
    const reflectionEfficiency = Math.min(100, (reflectionPool / (totalSupply * 0.02)) * 100);
    const liquidityEfficiency = Math.min(100, (liquidityAccumulation / (totalSupply * 0.01)) * 100);
    const lockerEfficiency = Math.min(100, (totalLocked / (totalSupply * 0.10)) * 100);

    return {
      formatAmount,
      burnedTokens,
      reflectionPool,
      liquidityAccumulation,
      totalLocked,
      burnEfficiency,
      reflectionEfficiency,
      liquidityEfficiency,
      lockerEfficiency
    };
  }, [contractData, reflectionData, protocolStats]);

  // Creative fee cards with unique styling
  const feeCards = useMemo(() => [
    {
      title: '🔥 Burn Protocol',
      icon: <Flame className="h-10 w-10 text-red-400" />,
      realData: {
        amount: calculations.burnedTokens,
        label: 'Total Burned',
        description: 'Tokens permanently removed from circulation, reducing supply forever'
      },
      formattedAmount: calculations.formatAmount(calculations.burnedTokens),
      efficiency: calculations.burnEfficiency / 100,
      bgGradient: 'from-red-900/40 via-orange-900/30 to-red-800/40',
      border: 'border-red-500/50',
      shadowColor: 'hover:shadow-red-500/25',
      patternGradient: 'from-red-500/10 to-orange-500/5',
      iconBg: 'from-red-500/20 to-orange-500/20',
      iconBorder: 'border-red-400/40',
      dataBg: 'from-red-950/50 to-orange-950/30',
      dataBorder: 'border-red-400/30',
      efficiencyGradient: 'from-red-400 to-orange-400',
      amountGradient: 'from-red-300 to-orange-300',
      labelColor: 'text-red-300',
      progressGradient: 'from-red-500 to-orange-500',
      glowGradient: 'from-red-500/5 via-orange-500/5 to-transparent',
      accentColor: '#ef4444'
    },
    {
      title: '💎 Reflection Matrix',
      icon: <Grid3X3 className="h-10 w-10 text-blue-400" />,
      realData: {
        amount: calculations.reflectionPool,
        label: 'Active Pool',
        description: 'Reflections ready for distribution to all token holders'
      },
      formattedAmount: calculations.formatAmount(calculations.reflectionPool),
      efficiency: calculations.reflectionEfficiency / 100,
      bgGradient: 'from-blue-900/40 via-indigo-900/30 to-blue-800/40',
      border: 'border-blue-500/50',
      shadowColor: 'hover:shadow-blue-500/25',
      patternGradient: 'from-blue-500/10 to-indigo-500/5',
      iconBg: 'from-blue-500/20 to-indigo-500/20',
      iconBorder: 'border-blue-400/40',
      dataBg: 'from-blue-950/50 to-indigo-950/30',
      dataBorder: 'border-blue-400/30',
      efficiencyGradient: 'from-blue-400 to-indigo-400',
      amountGradient: 'from-blue-300 to-indigo-300',
      labelColor: 'text-blue-300',
      progressGradient: 'from-blue-500 to-indigo-500',
      glowGradient: 'from-blue-500/5 via-indigo-500/5 to-transparent',
      accentColor: '#3b82f6'
    },
    {
      title: '🌊 Liquidity Engine',
      icon: <Waves className="h-10 w-10 text-cyan-400" />,
      realData: {
        amount: calculations.liquidityAccumulation,
        label: 'Accumulation',
        description: 'Tokens collected for next liquidity swap, strengthening the pool'
      },
      formattedAmount: calculations.formatAmount(calculations.liquidityAccumulation),
      efficiency: calculations.liquidityEfficiency / 100,
      bgGradient: 'from-cyan-900/40 via-teal-900/30 to-cyan-800/40',
      border: 'border-cyan-500/50',
      shadowColor: 'hover:shadow-cyan-500/25',
      patternGradient: 'from-cyan-500/10 to-teal-500/5',
      iconBg: 'from-cyan-500/20 to-teal-500/20',
      iconBorder: 'border-cyan-400/40',
      dataBg: 'from-cyan-950/50 to-teal-950/30',
      dataBorder: 'border-cyan-400/30',
      efficiencyGradient: 'from-cyan-400 to-teal-400',
      amountGradient: 'from-cyan-300 to-teal-300',
      labelColor: 'text-cyan-300',
      progressGradient: 'from-cyan-500 to-teal-500',
      glowGradient: 'from-cyan-500/5 via-teal-500/5 to-transparent',
      accentColor: '#06b6d4'
    },
    {
      title: '🔒 Locker Rewards',
      icon: <Vault className="h-10 w-10 text-purple-400" />,
      realData: {
        amount: calculations.totalLocked,
        label: 'Total Locked',
        description: 'Tokens secured in locker protocol, earning additional rewards'
      },
      formattedAmount: calculations.formatAmount(calculations.totalLocked),
      efficiency: calculations.lockerEfficiency / 100,
      bgGradient: 'from-purple-900/40 via-violet-900/30 to-purple-800/40',
      border: 'border-purple-500/50',
      shadowColor: 'hover:shadow-purple-500/25',
      patternGradient: 'from-purple-500/10 to-violet-500/5',
      iconBg: 'from-purple-500/20 to-violet-500/20',
      iconBorder: 'border-purple-400/40',
      dataBg: 'from-purple-950/50 to-violet-950/30',
      dataBorder: 'border-purple-400/30',
      efficiencyGradient: 'from-purple-400 to-violet-400',
      amountGradient: 'from-purple-300 to-violet-300',
      labelColor: 'text-purple-300',
      progressGradient: 'from-purple-500 to-violet-500',
      glowGradient: 'from-purple-500/5 via-violet-500/5 to-transparent',
      accentColor: '#8b5cf6'
    }
  ], [calculations]);

  const isLoading = contractLoading || reflectionLoading || lockerLoading;

  return (
    <section className="relative py-32 px-6 overflow-hidden min-h-screen">
      <AnimatedBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 backdrop-blur-sm mb-8"
          >
            <Zap className="h-5 w-5 text-cyan-400" />
            <span className="text-lg text-cyan-300 font-semibold">PulseChain Token Features</span>
          </motion.div>
          
          <motion.h2 
            className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Quantum Fee Distribution
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-2xl max-w-5xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Experience real-time blockchain fee mechanics showcasing our innovative 9% maximum fee structure
          </motion.p>
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 inline-flex items-center gap-3 text-cyan-400"
            >
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg">Loading live data...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Creative Fee Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {feeCards.map((card, index) => (
            <CreativeFeeCard 
              key={card.title} 
              card={card} 
              index={index} 
              contractData={contractData}
            />
          ))}
        </div>

        {/* Enhanced Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/50 backdrop-blur-sm">
            <motion.div 
              className="w-4 h-4 bg-green-400 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Lock className="h-5 w-5 text-green-400" />
            <span className="text-lg text-green-300 font-bold">Live PulseChain Data • Updates Every 3 Minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

App;