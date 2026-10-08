import { fmtPct } from "@/lib/bn";

export default function Badge({ change }: { change: number }) {
  const up = change > 0, down = change < 0;
  const cls = up ? "bg-green-100 text-green-700" : down ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>
      {up ? "▲ " : down ? "▼ " : "— "}{fmtPct(change)}
    </span>
  );
}
