import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface LiveDataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  isLoading: boolean;
  error?: string | null;
  badge?: {
    text: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  };
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
  onClick?: () => void;
}

export const LiveDataCard: React.FC<LiveDataCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  isLoading,
  error,
  badge,
  trend,
  className = '',
  onClick
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isLoading && !error) {
      setDisplayValue(value);
    }
  }, [value, isLoading, error]);

  const formatDisplayValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
      if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
      return val.toFixed(2);
    }
    return val.toString();
  };

  return (
    <Card 
      className={`bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-white/30' : ''
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-white/90">{title}</p>
              {badge && (
                <Badge variant={badge.variant || 'outline'} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20 bg-white/10" />
                <Skeleton className="h-3 w-16 bg-white/10" />
              </div>
            ) : error ? (
              <div>
                <p className="text-2xl font-bold text-red-400">Error</p>
                <p className="text-xs text-red-300">{error}</p>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {formatDisplayValue(displayValue)}
                </p>
                {subtitle && (
                  <p className="text-sm text-white/70">{subtitle}</p>
                )}
                {trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs ${
                      trend.direction === 'up' ? 'text-green-400' :
                      trend.direction === 'down' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {trend.direction === 'up' ? '↗' : 
                       trend.direction === 'down' ? '↘' : '→'} {trend.value}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {icon && (
            <div className="flex-shrink-0 ml-3">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};