import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export const GRID = "grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

export function SkeletonGrid({ n = 8 }: { n?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
    </div>
  );
}

export default function ProductGrid({ items }: { items: Product[] }) {
  return <div className={GRID}>{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>;
}
