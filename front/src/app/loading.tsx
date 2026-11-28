import { HeroSkeleton, ProductGridSkeleton } from "../components/ui/Skeletons";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-3">
      <div className="mt-4">
        <HeroSkeleton />
      </div>
      <div className="my-4 flex items-center justify-between">
        <div className="animate-shimmer h-5 w-36 rounded" />
        <div className="animate-shimmer h-4 w-16 rounded" />
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  );
}
