import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  description: string;
  statValue: string | null;
  loading: boolean;
  icon: ReactNode;
}

export const StatsCard = ({
  title,
  description,
  statValue = "0",
  loading = false,
  icon,
}: StatsCardProps) => {
  return (
    <Card
      className={cn(
        "bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200  bg-gradient-to-br from-blue-50 via-white to-blue-100"
      )}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="text-gray-800 text-lg">{icon}</div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28 rounded" />
        ) : (
          <p className="text-3xl font-semibold text-gray-900 leading-tight">
            {statValue}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};
