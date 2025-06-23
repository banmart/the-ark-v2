
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Target } from 'lucide-react';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set a target date (you can adjust this as needed)
  const targetDate = new Date('2024-12-31T23:59:59').getTime();
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
          minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
          seconds: Math.floor(difference % (1000 * 60) / 1000)
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-cyan-400 mr-3" />
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            New Year Countdown
          </h2>
          <Target className="w-8 h-8 text-purple-400 ml-3" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all">
            <div className="text-3xl md:text-4xl font-black text-cyan-400 mb-2">
              {timeLeft.days}
            </div>
            <div className="text-sm text-gray-400 font-medium">DAYS</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all">
            <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-sm text-gray-400 font-medium">HOURS</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-sm text-gray-400 font-medium">MINUTES</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/40 transition-all">
            <div className="text-3xl md:text-4xl font-black text-pink-400 mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-sm text-gray-400 font-medium">SECONDS</div>
          </div>
        </div>
        
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Time until the new year begins. Join the ARK community as we sail into 2025 together!
        </p>
      </div>
    </section>
  );
};

export default CountdownSection;
