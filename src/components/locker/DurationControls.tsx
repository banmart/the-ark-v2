
import React from 'react';
import { Calendar } from 'lucide-react';

interface LockTier {
  name: string;
  duration: number;
  multiplier: string;
  color: string;
  minDays: number;
  maxDays: number;
}

interface DurationControlsProps {
  lockDuration: number;
  setLockDuration: (duration: number) => void;
  currentTier: LockTier;
}

const DurationControls = ({ lockDuration, setLockDuration, currentTier }: DurationControlsProps) => {
  const getDurationPresets = () => [
    { label: '1D', days: 1, tier: 'Bronze' },
    { label: '30D', days: 30, tier: 'Bronze' },
    { label: '90D', days: 90, tier: 'Silver' },
    { label: '180D', days: 180, tier: 'Gold' },
    { label: '1Y', days: 365, tier: 'Diamond' },
    { label: '3Y', days: 1095, tier: 'Platinum' },
    { label: '5Y', days: 1826, tier: 'Legendary' }
  ];

  const handlePresetDuration = (days: number) => {
    setLockDuration(days);
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center text-sm font-medium text-gray-300">
        <Calendar className="w-4 h-4 mr-2" />
        Lock Duration
      </label>
      
      {/* Preset Duration Buttons */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-4">
        {getDurationPresets().map((preset) => (
          <button
            key={preset.days}
            onClick={() => handlePresetDuration(preset.days)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              lockDuration === preset.days
                ? 'bg-cyan-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      {/* Range Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="1"
          max="1826"
          value={lockDuration}
          onChange={(e) => setLockDuration(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, ${currentTier.color} 0%, ${currentTier.color} ${(lockDuration - 1) / (1826 - 1) * 100}%, #374151 ${(lockDuration - 1) / (1826 - 1) * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>1 day</span>
          <span className="font-bold text-white">{lockDuration} days</span>
          <span>5 years</span>
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${currentTier.color};
          cursor: pointer;
          box-shadow: 0 0 10px ${currentTier.color}50;
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${currentTier.color};
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px ${currentTier.color}50;
        }
      `}</style>
    </div>
  );
};

export default DurationControls;
