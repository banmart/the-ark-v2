import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Activity, Zap } from 'lucide-react';

interface LoadingMessageProps {
  message: string;
  icon?: React.ReactNode;
}

const LoadingMessage = ({ message, icon }: LoadingMessageProps) => (
  <div className="flex items-center justify-center space-x-3 p-4">
    <div className="animate-spin">
      {icon || <Flame className="w-5 h-5 text-video-cyan" />}
    </div>
    <span className="text-sm text-white/70 font-medium">{message}</span>
  </div>
);

interface BurnMetricsSkeletonProps {
  showLoadingMessages?: boolean;
}

export const BurnMetricsSkeleton = ({ showLoadingMessages = true }: BurnMetricsSkeletonProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-16 bg-white/10" />
              <Skeleton className="h-6 w-20 bg-white/20" />
            </div>
            <Skeleton className="h-6 w-6 rounded bg-white/10" />
          </div>
        </CardContent>
      </Card>
    ))}
    {showLoadingMessages && (
      <div className="col-span-full">
        <LoadingMessage 
          message="🔥 Scanning burn transactions on PulseChain..." 
          icon={<Flame className="w-5 h-5 text-video-cyan" />}
        />
      </div>
    )}
  </div>
);

export const BurnChartSkeleton = ({ showLoadingMessages = true }: BurnMetricsSkeletonProps) => (
  <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Skeleton className="h-5 w-32 bg-white/20" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-40 w-full bg-white/5" />
        {showLoadingMessages && (
          <LoadingMessage 
            message="📊 Processing historical burn data..." 
            icon={<Activity className="w-5 h-5 text-video-blue" />}
          />
        )}
      </div>
    </CardContent>
  </Card>
);

export const BurnProgressSkeleton = ({ showLoadingMessages = true }: BurnMetricsSkeletonProps) => (
  <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
    <CardHeader>
      <CardTitle className="text-center">
        <Skeleton className="h-6 w-40 mx-auto bg-white/20" />
      </CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <div className="flex justify-center mb-4">
        <Skeleton className="h-32 w-32 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 mx-auto bg-white/15" />
        <Skeleton className="h-3 w-32 mx-auto bg-white/10" />
      </div>
      {showLoadingMessages && (
        <div className="mt-4">
          <LoadingMessage 
            message="🔍 Analyzing burn efficiency..." 
            icon={<Zap className="w-5 h-5 text-video-gold" />}
          />
        </div>
      )}
    </CardContent>
  </Card>
);

interface ProgressiveLoadingProps {
  step: 'initial' | 'token-data' | 'burn-analytics' | 'complete';
  children: React.ReactNode;
}

export const ProgressiveLoading = ({ step, children }: ProgressiveLoadingProps) => {
  const getLoadingMessage = () => {
    switch (step) {
      case 'initial':
        return '⚡ Initializing burn tracker...';
      case 'token-data':
        return '📈 Loading ARK token data...';
      case 'burn-analytics':
        return '🔥 Scanning blockchain for burn events...';
      case 'complete':
        return null;
      default:
        return '⚡ Loading...';
    }
  };

  const message = getLoadingMessage();

  if (step === 'complete') {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {message && (
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <LoadingMessage message={message} />
          </CardContent>
        </Card>
      )}
      {children}
    </div>
  );
};