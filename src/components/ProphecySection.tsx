
import React from 'react';
import { Waves, Zap, Bird, BookOpen, Sparkles } from 'lucide-react';

const ProphecySection = () => {
  const prophecies = [
    {
      id: 'flood',
      title: 'The Flood',
      emoji: '🌊',
      icon: Waves,
      description: 'As the crypto waters rise and projects sink, only those aboard the ARK shall survive the great cleansing.',
      color: 'cyan',
      gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20'
    },
    {
      id: 'chosen',
      title: 'The Chosen',
      emoji: '⚡',
      icon: Zap,
      description: 'ARK holders are the chosen ones, guided by divine tokenomics to weather any storm in the crypto seas.',
      color: 'yellow',
      gradient: 'from-yellow-500/10 via-orange-500/5 to-transparent',
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/20'
    },
    {
      id: 'newworld',
      title: 'New World',
      emoji: '🕊️',
      icon: Bird,
      description: 'When the waters recede, ARK passengers will rebuild the crypto world, stronger and more united than before.',
      color: 'emerald',
      gradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    }
  ];

  const ProphecyCard = ({ prophecy }) => {
    const IconComponent = prophecy.icon;
    
    return (
      <div className={`relative group bg-gradient-to-br ${prophecy.gradient} border-2 ${prophecy.border} rounded-xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden ${prophecy.glow} hover:shadow-2xl`}>
        {/* Background glow effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-${prophecy.color}-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-${prophecy.color}-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
                animationDelay: `${i * 200}ms`,
                animation: 'float 3s ease-in-out infinite'
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Icon Section */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className={`text-5xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {prophecy.emoji}
              </div>
              <div className={`absolute -bottom-2 -right-2 text-${prophecy.color}-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold mb-6 text-${prophecy.color}-400 text-center group-hover:text-${prophecy.color}-300 transition-colors duration-300`}>
            {prophecy.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-center leading-relaxed group-hover:text-white transition-colors duration-300">
            {prophecy.description}
          </p>

          {/* Bottom accent line */}
          <div className={`mt-6 h-1 bg-gradient-to-r from-transparent via-${prophecy.color}-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-cyan-400 mr-4" />
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              The Prophecy of Noah's ARK
            </h2>
            <Sparkles className="w-10 h-10 text-purple-400 ml-4" />
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ancient wisdom meets modern innovation. Discover the three pillars of the ARK ecosystem 
            and how they will guide us through the turbulent waters of the crypto realm.
          </p>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center mt-8 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-32"></div>
            <div className="mx-4 text-2xl">⚡</div>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-32"></div>
          </div>
        </div>

        {/* Prophecy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {prophecies.map((prophecy) => (
            <ProphecyCard key={prophecy.id} prophecy={prophecy} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400 mr-2" />
              Join the ARK Community
              <Sparkles className="w-6 h-6 text-cyan-400 ml-2" />
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The prophecy is unfolding. Will you be among the chosen to board Noah's ARK and sail safely 
              through the crypto storms to the promised land of financial freedom?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30">
                Board the ARK
              </button>
              <button className="bg-transparent border-2 border-cyan-500/50 text-cyan-400 font-bold px-8 py-3 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </section>
  );
};

export default ProphecySection;
