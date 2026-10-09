"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import SocialButtons from "@/components/SocialButtons";
import { signUp } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const fail = (m: string) => { setErr(m); toast.error(m); };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const password = String(f.get("password"));
    const confirm = String(f.get("confirm"));

    if (name.length < 2) return fail("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (password !== confirm) return fail("দুটি পাসওয়ার্ড মিলছে না");

    setBusy(true); setErr("");
    const { error } = await signUp.email({ name, email: String(f.get("email")), password });
    setBusy(false);
    if (error) return fail(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
    toast.success("রেজিস্ট্রেশন সফল! এবার সাইন ইন করুন");
    router.push("/signin");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-base-300 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-center mb-5">নতুন অ্যাকাউন্ট খুলুন</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" required placeholder="নাম" className="input input-bordered w-full" />
          <input name="email" type="email" required placeholder="ইমেইল" className="input input-bordered w-full" />
          <input name="password" type="password" required placeholder="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)" className="input input-bordered w-full" />
          <input name="confirm" type="password" required placeholder="আবার পাসওয়ার্ড লিখুন" className="input input-bordered w-full" />
          {err && <p className="text-error text-sm">{err}</p>}
          <button disabled={busy} className="btn btn-primary w-full">{busy ? <span className="loading loading-spinner" /> : "রেজিস্টার"}</button>
        </form>
        <SocialButtons />
        <p className="text-sm text-center mt-4">আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin" className="text-primary font-semibold">সাইন ইন করুন</Link></p>
      </div>
    </div>
  );
}
