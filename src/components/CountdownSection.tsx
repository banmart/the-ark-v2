
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
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            <Clock className="inline w-10 h-10 mr-3 text-purple-400" />
            The Great Countdown
            <Target className="inline w-10 h-10 ml-3 text-purple-400" />
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Time remaining until the next phase of the ARK protocol
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">
              {timeLeft.days}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Days</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Hours</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Minutes</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Seconds</div>
          </div>
        </div>

        <div className="text-center">
          <Calendar className="inline w-6 h-6 mr-2 text-purple-400" />
          <span className="text-gray-300">Target: December 31st, 2024</span>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
