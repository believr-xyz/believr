import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BookmarksLoading() {
  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center">
      <LoadingSpinner size="lg" color="text-[#00A8FF]" />
    </div>
  );
}
