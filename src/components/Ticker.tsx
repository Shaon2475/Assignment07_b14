"use client";
import { getProducts } from "@/lib/api";
import { fmtPct, fmtPrice } from "@/lib/bn";
import { useAsync } from "@/lib/hooks";


export default function Ticker() {
  const { data, loading } = useAsync(() => getProducts(), []);
  if (loading) return <div className="skeleton h-9 w-full rounded-none" />;
  if (!data?.length) return null;
  const items = [...data, ...data]; 
  return (
    <div className="bg-neutral text-white overflow-hidden">
      <div className="marquee flex gap-8 py-2 text-sm">
        {items.map((p, i) => (
          <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
            <span>{p.emoji}</span><span>{p.name}</span>
            <span className="opacity-80">{fmtPrice(p.price)}/{p.unit.replace("প্রতি ", "")}</span>
            <span className={p.change > 0 ? "text-green-400" : p.change < 0 ? "text-red-400" : "text-gray-400"}>
              {p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {fmtPct(p.change)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
