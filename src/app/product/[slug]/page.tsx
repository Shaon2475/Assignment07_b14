"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProduct } from "@/lib/api";
import { fmtPrice, toBn } from "@/lib/bn";
import { useAsync } from "@/lib/hooks";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: p, loading } = useAsync(() => getProduct(slug), [slug]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-12 w-64" /><div className="skeleton h-5 w-96 max-w-full" />
        <div className="grid sm:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  if (!p) return <EmptyState title="পণ্যটি পাওয়া যায়নি" message="এই পণ্যটি আমাদের তালিকায় নেই।" />;

  const stats = [
    { label: "সর্বনিম্ন দাম", value: p.min, color: "text-green-700" },
    { label: "সর্বোচ্চ দাম", value: p.max, color: "text-red-600" },
    { label: "গড় দাম (আজ)", value: p.avg, color: "text-primary" },
  ];
  const cheapest = p.markets.length ? Math.min(...p.markets.map((m) => m.min)) : null;
  const priciest = p.markets.length ? Math.max(...p.markets.map((m) => m.max)) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-primary font-medium">← সব পণ্য</Link>

      <div className="bg-white border border-base-300 rounded-2xl p-6 mt-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-5xl">{p.emoji}</span>
          <h1 className="text-3xl font-extrabold">{p.name}</h1>
          <Badge change={p.change} />
        </div>
        {p.description && <p className="text-neutral/70 mt-3">{p.description}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {p.categories.map((c) => <span key={c} className="badge badge-outline badge-primary">{c}</span>)}
          <span className="badge badge-neutral">{p.unit}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-base-300 rounded-2xl p-5">
            <p className="text-sm text-neutral/60">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{fmtPrice(s.value)}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold mb-4">বাজারভিত্তিক আজকের দাম</h2>
      {p.markets.length === 0 ? (
        <p className="text-neutral/60">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.markets.map((m) => (
            <div key={m.name} className="bg-white border border-base-300 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">📍 {m.name}</p>
                  {m.division && <p className="text-xs text-neutral/60">{m.division} বিভাগ</p>}
                </div>
                {m.min === cheapest && <span className="badge badge-success badge-sm text-white">সবচেয়ে কম</span>}
                {m.max === priciest && <span className="badge badge-error badge-sm text-white">সবচেয়ে বেশি</span>}
              </div>
              <p className="mt-3 text-sm text-neutral/60">দামের পরিসীমা</p>
              <p className="font-extrabold text-primary">{toBn(m.min)} – {fmtPrice(m.max)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}