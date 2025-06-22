
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
    <section id="countdown" className="relative z-10 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ARK Genesis Countdown
          </h2>
          <p className="text-gray-300 text-lg">
            Time remaining until the next major milestone
          </p>
        </div>

        {/* Countdown Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 border border-cyan-400/20 hover:scale-105 transition-transform duration-200">
            <div className="text-3xl md:text-4xl font-black text-cyan-400 mb-2">
              {timeLeft.days}
            </div>
            <div className="text-gray-300 text-sm font-medium">
              DAYS
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 border border-blue-400/20 hover:scale-105 transition-transform duration-200">
            <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-gray-300 text-sm font-medium">
              HOURS
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 border border-purple-400/20 hover:scale-105 transition-transform duration-200">
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-gray-300 text-sm font-medium">
              MINUTES
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 border border-orange-400/20 hover:scale-105 transition-transform duration-200">
            <div className="text-3xl md:text-4xl font-black text-orange-400 mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-gray-300 text-sm font-medium">
              SECONDS
            </div>
          </div>
        </div>

        {/* Target Information */}
        <div className="glass-card rounded-xl p-6 border border-cyan-400/20 inline-block">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Target className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-bold text-white">Target Date</span>
          </div>
          <div className="text-cyan-400 font-medium">
            December 31st, 2024 • 11:59 PM UTC
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
