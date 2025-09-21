import React, { memo, lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load the BurnProtocolAnalytics component
const BurnProtocolAnalytics = lazy(() => import('./BurnProtocolAnalytics'));

const AnalyticsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

const LazyBurnProtocolAnalytics: React.FC = memo(() => {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <BurnProtocolAnalytics />
    </Suspense>
  );
});

LazyBurnProtocolAnalytics.displayName = 'LazyBurnProtocolAnalytics';

export default LazyBurnProtocolAnalytics;