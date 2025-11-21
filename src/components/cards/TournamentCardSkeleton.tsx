import { Skeleton } from "@/components/ui/skeleton";

const TournamentCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Prize & Entry */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="glass-panel rounded-lg p-3 sm:p-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="glass-panel rounded-lg p-3 sm:p-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Slots Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Start Time */}
      <Skeleton className="h-4 w-40 mb-4 pb-4" />

      {/* Action Button */}
      <Skeleton className="h-10 sm:h-11 w-full" />
    </div>
  );
};

export default TournamentCardSkeleton;
