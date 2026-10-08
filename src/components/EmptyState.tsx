import Link from "next/link";

export default function EmptyState({ title = "৪০৪ — পেজটি পাওয়া যায়নি", message = "আপনি যা খুঁজছেন তা এখানে নেই।" }: { title?: string; message?: string }) {
  return (
    <div className="max-w-xl mx-auto text-center py-20 px-4">
      <div className="text-6xl mb-4">🧺</div>
      <h1 className="text-2xl font-extrabold mb-2">{title}</h1>
      <p className="text-neutral/60 mb-6">{message}</p>
      <Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
