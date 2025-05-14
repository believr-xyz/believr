import { Skeleton } from "@/components/ui/skeleton";

export default function GroupsLoading() {
  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={`group-skeleton-${index}-${Math.random().toString(36).substring(2, 9)}`}
            className="h-[300px] w-full rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
