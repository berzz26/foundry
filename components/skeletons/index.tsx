import { Skeleton } from '@/components/ui/skeleton';

export function JobCardSkeleton() {
  return (
    <div className="card-double-border p-5">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-9 h-9 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-2/3 mb-1.5" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-4/5 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-1.5 mb-4">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-12 rounded" />
        <Skeleton className="h-6 w-14 rounded" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded" />
        <Skeleton className="h-8 flex-1 rounded" />
      </div>
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="card-double-border p-5">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/2 mb-1.5" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-4/5 mb-4" />
      <div className="flex gap-1.5 mb-4">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-10 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded" />
        <Skeleton className="h-8 flex-1 rounded" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-7 w-1/3 mb-1" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
