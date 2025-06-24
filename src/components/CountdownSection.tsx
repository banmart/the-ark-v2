
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Target, Database, Activity } from 'lucide-react';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [phase, setPhase] = useState(0);

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

  useEffect(() => {
    // Cinematic reveal sequence
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 1000, phase: 2 },
      { delay: 1800, phase: 3 },
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setPhase(phase), delay);
    });
  }, []);

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(251, 146, 60, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-4">
            <Database className="w-3 h-3 animate-pulse" />
            <span>[TEMPORAL_COUNTDOWN_PROTOCOL]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-teal-500 to-green-500 bg-clip-text text-transparent font-mono">
            [MISSION_COUNTDOWN]
          </h3>
        </div>

        {/* Countdown Display */}
        <div className={`transition-all duration-1000 delay-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 rounded-xl">
                <div className="text-4xl font-black text-cyan-400 font-mono mb-2">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="text-cyan-300 font-mono text-sm">DAYS</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 border border-teal-500/30 rounded-xl">
                <div className="text-4xl font-black text-teal-400 font-mono mb-2">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-teal-300 font-mono text-sm">HOURS</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-teal-500/5 border border-green-500/30 rounded-xl">
                <div className="text-4xl font-black text-green-400 font-mono mb-2">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-green-300 font-mono text-sm">MINUTES</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/30 rounded-xl">
                <div className="text-4xl font-black text-emerald-400 font-mono mb-2">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-emerald-300 font-mono text-sm">SECONDS</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className={`mt-8 transition-all duration-1000 delay-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-mono">[COUNTDOWN_STATUS]</span>
              </div>
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>TEMPORAL_SYNC_ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
