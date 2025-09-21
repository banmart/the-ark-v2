import React, { useState, Suspense } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface BurnAccordionSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const SectionSkeleton = () => (
  <div className="space-y-4">
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
    <Skeleton className="h-64 w-full" />
  </div>
);

export const BurnAccordionSection: React.FC<BurnAccordionSectionProps> = ({
  title,
  description,
  icon,
  children,
  defaultOpen = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={cn("bg-black/30 backdrop-blur-sm border border-white/10", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon}
                <div>
                  <CardTitle className="text-lg font-semibold text-video-cyan flex items-center gap-2">
                    {title}
                  </CardTitle>
                  {description && (
                    <p className="text-sm text-white/60 mt-1">{description}</p>
                  )}
                </div>
              </div>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-white/60 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <CardContent className="pt-0">
            <Suspense fallback={<SectionSkeleton />}>
              {isOpen && children}
            </Suspense>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};