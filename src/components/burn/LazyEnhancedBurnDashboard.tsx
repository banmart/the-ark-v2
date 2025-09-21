import { lazy, Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';

const EnhancedBurnDashboard = lazy(() => import('./EnhancedBurnDashboard'));

const LazyEnhancedBurnDashboard = () => {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <EnhancedBurnDashboard />
    </Suspense>
  );
};

export default LazyEnhancedBurnDashboard;