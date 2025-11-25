import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActivityTableSkeleton = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20 admin-neon-card admin-rgb-glow relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-admin-gold/5 to-transparent opacity-50" />
      <CardHeader className="relative z-10">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="relative z-10">
        <Table>
          <TableHeader>
            <TableRow className="border-admin-red/20">
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="border-admin-red/20">
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityTableSkeleton;
