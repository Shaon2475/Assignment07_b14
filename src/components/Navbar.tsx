"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCategories } from "@/lib/api";
import { banglaDate } from "@/lib/bn";
import { useAsync } from "@/lib/hooks";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { data: cats } = useAsync(getCategories, []);
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);

  const link = (active: boolean) =>
    `whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition ${
      active ? "bg-primary text-white" : "hover:bg-base-200"}`;

  const logout = async () => {
    await signOut({ fetchOptions: { onSuccess: () => { toast.success("সাইন আউট সফল হয়েছে"); router.push("/"); router.refresh(); } } });
  };

  return (
    <header className="bg-white border-b border-base-300 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="leading-tight">
          <span className="text-xl font-extrabold text-primary">🛒 বাজার দর</span>
          <span className="block text-xs text-neutral/60 min-h-4">{date}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          <Link href="/" className={link(pathname === "/")}>সব পণ্য</Link>
          {cats?.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className={link(pathname === `/category/${c.slug}`)}>
              {c.icon} {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-9 w-24 rounded-full" />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-sm sm:btn-md btn-ghost gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white grid place-items-center text-sm">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden sm:inline max-w-28 truncate">{session.user.name}</span>
              </button>
              <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box shadow border border-base-300 w-48 p-2 mt-1">
                <li><Link href="/profile">আমার প্রোফাইল</Link></li>
                <li><button onClick={logout}>সাইন আউট</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn btn-sm sm:btn-md btn-outline btn-primary">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      {/* mobile / tablet category row */}
      <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-3">
        <Link href="/" className={link(pathname === "/")}>সব পণ্য</Link>
        {cats?.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className={link(pathname === `/category/${c.slug}`)}>
            {c.icon} {c.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
