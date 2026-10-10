"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProduct } from "@/lib/api";
import { fmtPrice, toBn } from "@/lib/bn";
import { useAsync } from "@/lib/hooks";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";

const money = (n: number) =>
  toBn(n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })) + " টাকা";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: p, loading } = useAsync(() => getProduct(slug), [slug]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-40 rounded-2xl" />
        <div className="grid sm:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    );
  if (!p) return <EmptyState title="পণ্যটি পাওয়া যায়নি" message="এই পণ্যটি আমাদের তালিকায় নেই।" />;

  const unitShort = p.unit.replace("প্রতি ", "");
  const up = p.change > 0, down = p.change < 0;
 
  const diff = Math.round(Math.abs(p.price - p.price / (1 + p.change / 100)));
  const trendText = !up && !down
    ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত"
    : `গতকালের তুলনায় আজ দাম ${up ? "বেড়েছে" : "কমেছে"} · ${toBn(diff)} টাকা`;
  const cheapest = p.markets.find((m) => m.min === p.min);
  const priciest = p.markets.find((m) => m.max === p.max);

  const stats = [
    { label: "সর্বনিম্ন দাম", value: p.min, sub: "সবচেয়ে কম দামের বাজার", market: cheapest?.name, color: "text-green-700" },
    { label: "সর্বাধিক দাম", value: p.max, sub: "সবচেয়ে বেশি দামের বাজার", market: priciest?.name, color: "text-red-600" },
    { label: "গড় দাম", value: p.avg, sub: `${p.unit}-এর হিসাবে`, market: undefined, color: "text-primary" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral/60 mb-4">
        <Link href="/" className="text-primary font-medium hover:underline">হোম</Link>
        <span className="mx-2">›</span>
        <span>{p.name}</span>
      </nav>

      {/* Top: title + price panel */}
      <section className="bg-white border border-base-300 rounded-2xl p-6 mb-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="flex items-start gap-4">
          <span className="text-6xl leading-none">{p.emoji}</span>
          <div>
            <h1 className="text-3xl font-extrabold">{p.name}</h1>
            <p className="text-neutral/70 mt-2">
              {p.unit}{p.categories.length > 0 && <> · {p.categories.join(", ")}</>}
            </p>
            <p className={`mt-1 font-medium ${up ? "text-green-700" : down ? "text-red-600" : "text-neutral/60"}`}>{trendText}</p>
          </div>
        </div>
        <div className="bg-base-200 rounded-2xl px-8 py-5 text-center md:min-w-56">
          <p className="text-sm text-neutral/60">আজকের দাম</p>
          <p className="text-5xl font-extrabold text-primary my-1">{toBn(p.price.toLocaleString("en-US"))}</p>
          <p className="text-sm text-neutral/70 mb-2">টাকা / {unitShort}</p>
          <Badge change={p.change} />
        </div>
      </section>

      {/* Price summary */}
      <h2 className="text-2xl font-extrabold mb-4">দামের সারসংক্ষেপ</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-base-300 rounded-2xl p-5">
            <p className="text-sm text-neutral/60">{s.label}</p>
            <p className={`text-3xl font-extrabold my-1 ${s.color}`}>{fmtPrice(s.value)}</p>
            <p className="text-sm text-neutral/60">{s.sub}</p>
            {s.market && <p className="text-sm font-semibold mt-0.5">📍 {s.market}</p>}
          </div>
        ))}
      </div>

      {/* Market table */}
      <h2 className="text-2xl font-extrabold mb-4">বাজারভিত্তিক আজকের দাম</h2>
      {p.markets.length === 0 ? (
        <p className="text-neutral/60">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
      ) : (
        <div className="bg-white border border-base-300 rounded-2xl overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-neutral">
                <th>বাজার</th><th>বিভাগ</th>
                <th className="text-right">সর্বনিম্ন</th><th className="text-right">সর্বাধিক</th><th className="text-right">গড়</th>
              </tr>
            </thead>
            <tbody>
              {p.markets.map((m) => (
                <tr key={m.name} className="hover">
                  <td className="font-medium whitespace-nowrap">{m.name}</td>
                  <td className="whitespace-nowrap">{m.division}</td>
                  <td className={`text-right whitespace-nowrap ${m.min === p.min ? "text-green-700 font-bold" : ""}`}>{money(m.min)}</td>
                  <td className={`text-right whitespace-nowrap ${m.max === p.max ? "text-red-600 font-bold" : ""}`}>{money(m.max)}</td>
                  <td className="text-right whitespace-nowrap">{money((m.min + m.max) / 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
