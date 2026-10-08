export type Market = { name: string; division: string; min: number; max: number };
export type Product = {
  id: string; slug: string; name: string; emoji: string; unit: string;
  price: number; change: number; categories: string[];
  description: string; markets: Market[]; min: number; max: number; avg: number;
};
export type Category = { slug: string; name: string; icon: string };