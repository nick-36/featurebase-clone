import { Skeleton } from "@/components/ui/skeleton";

export function DefaultPendingSkeleton() {
  return (
    <div className="mx-auto mt-8 p-4">
      <Skeleton className="h-8 w-1/4 mb-6" /> {/* Header placeholder */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
      </ul>
    </div>
  );
}

export const PendingSkeleton = () => {
  return (
    <div className="p-4">
      <Skeleton className="w-full  mb-4" />
      <Skeleton className="w-full h-96" />
    </div>
  );
};
