"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import SocialButtons from "@/components/SocialButtons";
import { signIn } from "@/lib/auth-client";

export default function SignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setErr("");
    const { error } = await signIn.email({ email: String(f.get("email")), password: String(f.get("password")) });
    setBusy(false);
    if (error) { const m = error.message || "ইমেইল বা পাসওয়ার্ড ভুল"; setErr(m); toast.error(m); return; }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    const r = new URLSearchParams(window.location.search).get("redirect");
    router.push(r && r.startsWith("/") ? r : "/");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-base-300 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-center mb-5">সাইন ইন করুন</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="email" type="email" required placeholder="ইমেইল" className="input input-bordered w-full" />
          <input name="password" type="password" required placeholder="পাসওয়ার্ড" className="input input-bordered w-full" />
          {err && <p className="text-error text-sm">{err}</p>}
          <button disabled={busy} className="btn btn-primary w-full">{busy ? <span className="loading loading-spinner" /> : "সাইন ইন"}</button>
        </form>
        <SocialButtons />
        <p className="text-sm text-center mt-4">অ্যাকাউন্ট নেই? <Link href="/signup" className="text-primary font-semibold">সাইন আপ করুন</Link></p>
      </div>
    </div>
  );
}
