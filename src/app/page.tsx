"use client";
import Image from "next/image";
import { useMemo } from "react";
import { getProducts } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import ProductGrid, { SkeletonGrid } from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";

function Section({ title, sub, id, children }: { title: string; sub?: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-28">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {sub && <p className="text-neutral/60 mb-4">{sub}</p>}
      <div className={sub ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

export default function Home() {
  const { data, loading, error } = useAsync(() => getProducts(), []);
  const risers = useMemo(() => (data ?? []).filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6), [data]);
  const fallers = useMemo(() => (data ?? []).filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6), [data]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center py-10 md:py-14">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">আজকের বাজারের দাম এক নজরে</h1>
          <p className="text-neutral/70 mb-6">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
          <a href="#সব-পণ্য" className="btn btn-primary">সব পণ্য দেখুন ↓</a>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-base-300">
          <Image src="/bazar-hero.png" alt="বাজার" fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      {error ? (
        <EmptyState title="ডাটা লোড করা যায়নি" message="একটু পরে আবার চেষ্টা করুন।" />
      ) : (
        <>
          <Section title="আজ দাম বেড়েছে" icon="▲" iconClass="text-error">
            {loading ? <SkeletonGrid n={6} /> : <ProductGrid items={risers} />}
          </Section>
          <Section title="আজ দাম কমেছে" icon="▼" iconClass="text-success">
            {loading ? <SkeletonGrid n={6} /> : <ProductGrid items={fallers} />}
          </Section>
          <Section id="সব-পণ্য" title="সব পণ্য">
            <div className="space-y-4">
              <p className="text-sm">
                {loading ? "লোড হচ্ছে…" : `মোট ${toBn(data?.length ?? 0)}টি পণ্য দেখানো হচ্ছে`}
              </p>
              {loading ? <SkeletonGrid n={9} /> : <ProductGrid items={data ?? []} />}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
