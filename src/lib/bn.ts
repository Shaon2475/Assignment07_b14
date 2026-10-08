const BN = "০১২৩৪৫৬৭৮৯";
export const toBn = (v: string | number) => String(v).replace(/\d/g, (d) => BN[+d]);
/** Bengali digits / symbols -> real number (so sorting is numeric, not string based) */
export const num = (v: unknown): number => {
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const s = String(v ?? "").replace(/[০-৯]/g, (d) => String(BN.indexOf(d))).replace(/[^\d.\-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};
export const fmtPrice = (n: number) => toBn(n.toLocaleString("en-US", { maximumFractionDigits: 2 })) + " টাকা";
export const fmtPct = (n: number) => toBn(Math.abs(n).toFixed(1)) + "%";
export const banglaDate = () =>
  new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
