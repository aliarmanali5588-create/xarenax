import { Skeleton } from "@/components/ui/skeleton";

const TransactionSkeleton = () => {
  return (
    <div className="glass-panel rounded-lg p-3 sm:p-4">
      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TransactionSkeleton;
