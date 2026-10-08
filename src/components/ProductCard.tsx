import Link from "next/link";
import { fmtPrice } from "@/lib/bn";
import type { Product } from "@/lib/types";
import Badge from "./Badge";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`}
      className="block bg-white border border-base-300 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition">
      <div className="text-4xl mb-2">{p.emoji}</div>
      <h3 className="font-bold text-lg">{p.name}</h3>
      <p className="text-sm text-neutral/60 mb-3">{p.unit}</p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-neutral/60">আজকের দাম</p>
          <p className="font-extrabold text-primary">{fmtPrice(p.price)}</p>
        </div>
        <Badge change={p.change} />
      </div>
    </Link>
  );
}
