import { ProductGridSkeleton } from "../../components/ui/Skeletons";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-row items-center justify-between gap-2 p-5">
        <div className="animate-shimmer h-6 w-32 rounded" />
        <div className="animate-shimmer h-9 w-24 rounded-md" />
      </div>
      <div className="px-2">
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
