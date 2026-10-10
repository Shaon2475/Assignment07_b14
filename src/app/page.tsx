"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/lib/api";
import { banglaDate, toBn } from "@/lib/bn";
import { useAsync } from "@/lib/hooks";
import ProductGrid, { SkeletonGrid } from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";

function Section({ title, icon, iconClass, id, children }: {
  title: string; icon?: string; iconClass?: string; id?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-40">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-3">
        {icon && <span className={`text-base ${iconClass ?? ""}`}>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  const { data, loading, error } = useAsync(() => getProducts(), []);
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);

  const risers = useMemo(() => (data ?? []).filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6), [data]);
  const fallers = useMemo(() => (data ?? []).filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6), [data]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero: card, text left + image right */}
      <section className="bg-base-100 border border-base-300 rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 flex flex-col items-start gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium min-h-7">{date}</span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">আজকের বাজারের দাম এক নজরে</h1>
          <p className="mt-1 mb-3">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary font-semibold">সব পণ্য দেখুন</a>
        </div>
        <div className="relative w-full md:w-[315px] aspect-[315/263] shrink-0">
          <Image src="/bazar-hero.png" alt="বাজার" fill priority sizes="(min-width:768px) 315px, 100vw" className="object-contain" />
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
