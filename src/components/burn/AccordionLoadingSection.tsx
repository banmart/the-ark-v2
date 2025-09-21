import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AccordionLoadingSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingPhase?: 'initializing' | 'fetching-pairs' | 'querying-events' | 'calculating-metrics' | 'complete';
  progress?: number;
  children: React.ReactNode;
  className?: string;
}

const loadingPhaseMessages = {
  initializing: 'Initializing connection...',
  'fetching-pairs': 'Fetching trading pairs...',
  'querying-events': 'Querying burn events from blockchain...',
  'calculating-metrics': 'Calculating burn metrics...',
  complete: 'Data loaded successfully'
};

export const AccordionLoadingSection: React.FC<AccordionLoadingSectionProps> = ({
  title,
  description,
  icon,
  isOpen,
  onToggle,
  isLoading,
  error,
  onRetry,
  loadingPhase = 'initializing',
  progress = 0,
  children,
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isLoading && progress > animatedProgress) {
      const timer = setTimeout(() => {
        setAnimatedProgress(Math.min(progress, animatedProgress + 5));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress, animatedProgress, isLoading]);

  const getProgressByPhase = () => {
    switch (loadingPhase) {
      case 'initializing': return 10;
      case 'fetching-pairs': return 25;
      case 'querying-events': return 60;
      case 'calculating-metrics': return 85;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const currentProgress = progress || getProgressByPhase();

  return (
    <Card className={`bg-black/40 backdrop-blur-sm border border-white/20 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex-shrink-0">
                    {icon}
                  </div>
                )}
                <div className="text-left">
                  <CardTitle className="text-white text-lg font-semibold">
                    {title}
                  </CardTitle>
                  {description && (
                    <p className="text-sm text-white/70 mt-1">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-blue-400">
                      {loadingPhaseMessages[loadingPhase]}
                    </span>
                  </div>
                )}
                {error && (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <ChevronDown 
                  className={`h-5 w-5 text-white/70 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </div>
            
            {isLoading && isOpen && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">
                    {loadingPhaseMessages[loadingPhase]}
                  </span>
                  <span className="text-white/70">
                    {Math.round(currentProgress)}%
                  </span>
                </div>
                <Progress 
                  value={currentProgress} 
                  className="h-2 bg-white/10"
                />
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {error ? (
              <Alert className="bg-red-500/10 border-red-500/20 mb-4">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  <div className="flex items-center justify-between">
                    <span>{error}</span>
                    {onRetry && (
                      <Button 
                        onClick={onRetry}
                        variant="outline"
                        size="sm"
                        className="ml-2 border-red-400/50 text-red-400 hover:bg-red-400/10"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-white/10" />
                      <Skeleton className="h-8 w-full bg-white/10" />
                      <Skeleton className="h-3 w-16 bg-white/10" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-32 w-full bg-white/10" />
              </div>
            ) : (
              children
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};