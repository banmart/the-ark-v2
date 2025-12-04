import React from 'react';
import { LucideIcon, ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ServiceCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'cyan';
  onClick: () => void;
  isAvailable: boolean;
}

const ServiceCard = ({ name, description, icon: Icon, color, onClick, isAvailable }: ServiceCardProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'from-blue-500 to-indigo-500',
          ring: 'from-blue-500/30 via-indigo-500/30 to-blue-500/30',
          text: 'from-blue-400 to-indigo-400',
          glow: 'shadow-blue-500/30',
          border: 'hover:border-blue-500/30'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-emerald-500',
          ring: 'from-green-500/30 via-emerald-500/30 to-green-500/30',
          text: 'from-green-400 to-emerald-400',
          glow: 'shadow-green-500/30',
          border: 'hover:border-green-500/30'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-violet-500',
          ring: 'from-purple-500/30 via-violet-500/30 to-purple-500/30',
          text: 'from-purple-400 to-violet-400',
          glow: 'shadow-purple-500/30',
          border: 'hover:border-purple-500/30'
        };
      case 'yellow':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          ring: 'from-yellow-500/30 via-amber-500/30 to-yellow-500/30',
          text: 'from-yellow-400 to-amber-400',
          glow: 'shadow-yellow-500/30',
          border: 'hover:border-yellow-500/30'
        };
      default:
        return {
          gradient: 'from-cyan-500 to-teal-500',
          ring: 'from-cyan-500/30 via-teal-500/30 to-cyan-500/30',
          text: 'from-cyan-400 to-teal-400',
          glow: 'shadow-cyan-500/30',
          border: 'hover:border-cyan-500/30'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className={`relative group ${!isAvailable ? 'opacity-60' : ''}`}>
      {/* Outer glow ring */}
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${colors.ring} rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      <Card className={`
        relative bg-white/[0.02] backdrop-blur-2xl 
        border-white/[0.08] ${colors.border}
        transition-all duration-500 
        hover:translate-y-[-4px] hover:shadow-xl ${colors.glow}
        overflow-hidden
      `}>
        {/* Top edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Scanning effect */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
        
        {/* Corner glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-radial ${colors.ring.replace('/30', '/10')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Premium icon container with glow */}
              <div className="relative">
                <div className={`absolute -inset-1.5 bg-gradient-to-br ${colors.gradient} rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <span className={`font-mono text-base bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                {name}
              </span>
            </div>
            
            {isAvailable && (
              <div className="relative">
                <div className="absolute -inset-1 bg-green-500/30 rounded-full blur-sm animate-[pulse_2s_ease-in-out_infinite]" />
                <Badge className="relative bg-white/[0.05] backdrop-blur-xl text-green-400 border-green-500/30 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-75" />
                    </div>
                    LIVE
                  </div>
                </Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">{description}</p>
          
          <div className="relative group/btn">
            {/* Button outer glow */}
            <div className={`absolute -inset-[1px] bg-gradient-to-r ${colors.gradient} rounded-lg blur-sm opacity-0 group-hover/btn:opacity-70 transition-opacity duration-300`} />
            
            <Button 
              onClick={onClick}
              disabled={!isAvailable}
              className={`
                relative w-full bg-gradient-to-r ${colors.gradient} text-white 
                font-mono tracking-wide 
                hover:scale-[1.02] transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                overflow-hidden
              `}
            >
              {/* Scan effect on button */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {isAvailable ? 'LAUNCH SERVICE' : 'COMING SOON'}
                {isAvailable && <ExternalLink className="w-4 h-4" />}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCard;
