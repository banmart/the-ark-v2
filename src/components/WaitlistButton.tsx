
import React from 'react';
import { cn } from '@/lib/utils';

interface WaitlistButtonProps {
  className?: string;
  variant?: 'navbar' | 'hero';
  onClick?: () => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  account?: string | null;
}

export const WaitlistButton: React.FC<WaitlistButtonProps> = ({ 
  className, 
  variant = 'navbar',
  onClick,
  isConnecting,
  isConnected,
  account
}) => {
  const isNavbar = variant === 'navbar';

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected && account) return `${account.slice(0, 6)}...${account.slice(-4)}`;
    return "Connect Wallet";
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-full p-[1px] overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95",
        "bg-ark-gold-400/20 hover:bg-ark-gold-400/30",
        className
      )}
    >
      {/* Inner Pill */}
      <div
        className={cn(
          "relative rounded-full px-8 py-3 flex items-center justify-center transition-all duration-500",
          isNavbar ? "bg-space-black/80 backdrop-blur-xl text-starlight group-hover:bg-ark-gold-400 group-hover:text-space-black shadow-divine-glow" : "bg-ark-gold-400 text-space-black hover:bg-ark-gold-500 shadow-divine-glow"
        )}
      >
        {/* Subtle Glow Streak */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"
        />
        
        <span className="text-[14px] font-bold tracking-tight uppercase">
          {getButtonText()}
        </span>
      </div>
    </button>
  );
};
