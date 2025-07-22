
import React from 'react';
import { LucideIcon, ExternalLink } from 'lucide-react';
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
          border: 'border-blue-500/30 hover:border-blue-400/50',
          bg: 'hover:bg-blue-500/10',
          text: 'text-blue-400',
          button: 'from-blue-500 to-blue-600',
          glow: 'shadow-blue-500/20'
        };
      case 'green':
        return {
          border: 'border-green-500/30 hover:border-green-400/50',
          bg: 'hover:bg-green-500/10',
          text: 'text-green-400',
          button: 'from-green-500 to-green-600',
          glow: 'shadow-green-500/20'
        };
      case 'purple':
        return {
          border: 'border-purple-500/30 hover:border-purple-400/50',
          bg: 'hover:bg-purple-500/10',
          text: 'text-purple-400',
          button: 'from-purple-500 to-purple-600',
          glow: 'shadow-purple-500/20'
        };
      case 'yellow':
        return {
          border: 'border-yellow-500/30 hover:border-yellow-400/50',
          bg: 'hover:bg-yellow-500/10',
          text: 'text-yellow-400',
          button: 'from-yellow-500 to-yellow-600',
          glow: 'shadow-yellow-500/20'
        };
      default:
        return {
          border: 'border-cyan-500/30 hover:border-cyan-400/50',
          bg: 'hover:bg-cyan-500/10',
          text: 'text-cyan-400',
          button: 'from-cyan-500 to-cyan-600',
          glow: 'shadow-cyan-500/20'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <Card className={`
      bg-black/50 ${colors.border} ${colors.bg} 
      transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.glow}
      group relative overflow-hidden
      ${!isAvailable ? 'opacity-60' : ''}
    `}>
      {/* Scanning effect */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.button} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className={`font-mono text-lg ${colors.text}`}>{name}</span>
          </div>
          {isAvailable && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              LIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        
        <Button 
          onClick={onClick}
          disabled={!isAvailable}
          className={`
            w-full bg-gradient-to-r ${colors.button} text-white 
            font-mono tracking-wide hover:scale-105 transition-transform
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span className="mr-2">
            {isAvailable ? 'LAUNCH_SERVICE' : 'COMING_SOON'}
          </span>
          {isAvailable && <ExternalLink className="w-4 h-4" />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
