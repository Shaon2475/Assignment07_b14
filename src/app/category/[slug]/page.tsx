"use client";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getCategory, getProducts } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import ProductGrid, { SkeletonGrid } from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";

type Sort = "default" | "asc" | "desc";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sort, setSort] = useState<Sort>("default");
  const { data, loading, error } = useAsync(
    () => Promise.all([getCategory(slug), getProducts(slug).catch(() => [])]), [slug]);
  const cat = data?.[0];
  const products = useMemo(() => {
    const list = [...(data?.[1] ?? [])];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);   // numeric compare (not string)
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [data, sort]);

  if (!loading && (error || !products.length))
    return <EmptyState title="এই ক্যাটেগরিতে কোনো পণ্য নেই" message="ক্যাটেগরিটি সঠিক নয় অথবা এখানে কোনো পণ্য পাওয়া যায়নি।" />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {loading ? <div className="skeleton h-9 w-48" /> : (
          <h1 className="text-3xl font-extrabold">{cat?.icon ?? "🛒"} {cat?.name ?? slug}</h1>
        )}
        <label className="flex items-center gap-2 text-sm font-medium">
          সাজান:
          <select className="select select-bordered select-sm sm:select-md" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>
      {loading ? <SkeletonGrid /> : <ProductGrid items={products} />}
    </div>
  );
}
