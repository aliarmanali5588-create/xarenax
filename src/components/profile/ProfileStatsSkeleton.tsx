import { Skeleton } from "@/components/ui/skeleton";

const ProfileStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="glass-panel rounded-xl p-4 sm:p-6 text-center"
        >
          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 md:mb-4 rounded-full" />
          <Skeleton className="h-8 sm:h-10 w-20 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      ))}
    </div>
  );
};

export default ProfileStatsSkeleton;
