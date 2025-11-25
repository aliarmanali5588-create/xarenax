import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const StatCardSkeleton = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20 admin-neon-card admin-rgb-glow relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-admin-gold/5 to-transparent opacity-50" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </CardHeader>
      <CardContent className="relative z-10">
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
};

export default StatCardSkeleton;
