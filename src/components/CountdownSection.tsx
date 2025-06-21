
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
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-red-500/5 to-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            ⏰ The ARK Ascension ⏰
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The sacred countdown to the next major milestone in the ARK ecosystem. Every second brings us closer to destiny.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="glass-card rounded-2xl p-8 mb-12 border-2 border-red-500/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="glass-card rounded-xl p-6 mb-4">
                <Calendar className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-4xl font-black text-red-400 mb-2">{timeLeft.days}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Days</div>
              </div>
            </div>

            <div className="text-center">
              <div className="glass-card rounded-xl p-6 mb-4">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-4xl font-black text-orange-400 mb-2">{timeLeft.hours}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Hours</div>
              </div>
            </div>

            <div className="text-center">
              <div className="glass-card rounded-xl p-6 mb-4">
                <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-4xl font-black text-yellow-400 mb-2">{timeLeft.minutes}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Minutes</div>
              </div>
            </div>

            <div className="text-center">
              <div className="glass-card rounded-xl p-6 mb-4">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-4xl font-black text-cyan-400 mb-2">{timeLeft.seconds}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4">🎯 Next Milestone</h3>
            <p className="text-gray-300 mb-4">
              Major protocol upgrade featuring enhanced locker mechanics, new tier benefits, and expanded deflationary mechanisms.
            </p>
            <div className="text-sm text-gray-400">
              Target: End of 2024
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">🚀 Upcoming Features</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Enhanced LP token burning mechanism</li>
              <li>• New locker tier with 10x multiplier</li>
              <li>• Cross-chain bridge integration</li>
              <li>• Advanced analytics dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
