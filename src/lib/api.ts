/* eslint-disable @typescript-eslint/no-explicit-any */
import { fmtPrice, num } from "./bn";
import type { Category, Market, Product } from "./types";

const BASES = [
  process.env.NEXT_PUBLIC_API_BASE || "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor", // alternative
];

async function get(path: string): Promise<any> {
  let err: unknown = new Error("API error");
  for (const b of BASES) {
    try {
      const r = await fetch(b + path);
      if (!r.ok) throw new Error(String(r.status));
      return await r.json();
    } catch (e) { err = e; }
  }
  throw err;
}

const asList = (j: any): any[] =>
  Array.isArray(j) ? j : j?.data ?? j?.products ?? j?.categories ?? j?.items ?? [];
const unwrap = (j: any) => (j?.data && !Array.isArray(j.data) ? j.data : j?.product ?? j?.category ?? j);

const UNITS: Record<string, string> = {
  kg: "প্রতি কেজি", litre: "প্রতি লিটার", liter: "প্রতি লিটার", l: "প্রতি লিটার",
  dozen: "প্রতি ডজন", doz: "প্রতি ডজন", piece: "প্রতি পিস", pcs: "প্রতি পিস", pc: "প্রতি পিস", hali: "প্রতি হালি",
};
const unitBn = (u: unknown) => {
  const s = String(u ?? "kg").trim();
  return UNITS[s.toLowerCase()] ?? (s.startsWith("প্রতি") ? s : `প্রতি ${s}`);
};

function toProduct(r: any, i = 0): Product {
  const id = String(r?.id ?? r?._id ?? i + 1);
  const markets: Market[] = (Array.isArray(r?.markets) ? r.markets : []).map((m: any) => ({
    name: String(m?.market ?? m?.name ?? "বাজার"),
    division: String(m?.division ?? ""),
    min: num(m?.min),
    max: num(m?.max),
  }));
  const mins = markets.map((m) => m.min).filter(Boolean);
  const maxs = markets.map((m) => m.max).filter(Boolean);
  const price = num(r?.today ?? r?.price);

  // change: { dir: "up" | "down", pct: 2.1 }
  const ch = r?.change;
  let change = typeof ch === "object" && ch ? num(ch.pct) : num(ch ?? r?.pct);
  if (ch?.dir === "down" && change > 0) change = -change;
  if (ch?.dir === "up" && change < 0) change = -change;

  const catName = r?.categoryNameBn ?? r?.categoryName ?? r?.category;
  const trend = [
    r?.yesterday != null && `গতকাল ${fmtPrice(num(r.yesterday))}`,
    r?.lastWeek != null && `গত সপ্তাহে ${fmtPrice(num(r.lastWeek))}`,
    r?.lastMonth != null && `গত মাসে ${fmtPrice(num(r.lastMonth))}`,
  ].filter(Boolean).join(" · ");

  return {
    id,
    slug: String(r?.slug ?? id),
    name: String(r?.nameBn ?? r?.name ?? r?.title ?? "পণ্য"),
    emoji: String(r?.image ?? r?.emoji ?? r?.categoryIcon ?? "🛒"),
    unit: unitBn(r?.unit),
    price,
    change,
    categories: catName ? [String(catName)] : [],
    description: String(r?.description ?? trend),
    markets,
    min: mins.length ? Math.min(...mins) : price,
    max: maxs.length ? Math.max(...maxs) : price,
    avg: price,
  };
}

const toCategory = (r: any): Category => {
  const slug = String(r?.slug ?? r?.id ?? "");
  return { slug, name: String(r?.nameBn ?? r?.name ?? slug), icon: String(r?.icon ?? r?.emoji ?? "🛒") };
};

export const getProducts = async (category?: string): Promise<Product[]> =>
  asList(await get(category ? `/products?category=${encodeURIComponent(category)}` : "/products")).map(toProduct);

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const p = toProduct(unwrap(await get(`/products/${encodeURIComponent(slug)}`)));
    if (p.name !== "পণ্য" || p.price) return p;
  } catch { /* fall back to list */ }
  try {
    return (await getProducts()).find((p) => p.slug === slug || p.id === slug) ?? null;
  } catch { return null; }
}

export const getCategories = async (): Promise<Category[]> =>
  asList(await get("/categories")).map(toCategory).filter((c) => c.slug);

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const c = toCategory(unwrap(await get(`/categories/${encodeURIComponent(slug)}`)));
    if (c.slug) return c;
  } catch { /* fall back to list */ }
  try { return (await getCategories()).find((c) => c.slug === slug) ?? null; } catch { return null; }
}