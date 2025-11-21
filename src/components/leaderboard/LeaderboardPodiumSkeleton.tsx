import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardPodiumSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-8 mb-12 neon-border-cyan">
      <Skeleton className="h-8 w-64 mx-auto mb-8" />
      <div className="flex items-end justify-center gap-4 md:gap-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center flex-1 max-w-[200px]">
          <Skeleton className="w-20 h-20 rounded-full mb-4" />
          <Skeleton className="w-full h-40 rounded-t-xl mb-3" />
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center flex-1 max-w-[220px]">
          <Skeleton className="w-24 h-24 rounded-full mb-4" />
          <Skeleton className="w-full h-48 rounded-t-xl mb-3" />
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center flex-1 max-w-[200px]">
          <Skeleton className="w-20 h-20 rounded-full mb-4" />
          <Skeleton className="w-full h-32 rounded-t-xl mb-3" />
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPodiumSkeleton;
