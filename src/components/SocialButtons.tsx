"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SocialButtons() {
  const go = async (provider: "google" | "github") => {
    await fetch("/api/cleanup", { method: "POST" }).catch(() => {});
    const { error } = await signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে");
  };
  return (
    <div className="space-y-2">
      <div className="divider text-xs">অথবা</div>
      <button type="button" onClick={() => go("google")} className="btn btn-outline w-full gap-2">
        <Image src="/gmail.png" alt="Gmail" width={22} height={22} />
        Google দিয়ে চালিয়ে যান
      </button>
      <button type="button" onClick={() => go("github")} className="btn btn-outline w-full gap-2">
        <Image src="/github.png" alt="GitHub" width={22} height={22} />
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
