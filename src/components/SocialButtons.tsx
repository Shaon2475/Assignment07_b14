"use client";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SocialButtons() {
  const go = async (provider: "google" | "github") => {
    const { error } = await signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে");
  };
  return (
    <div className="space-y-2">
      <div className="divider text-xs">অথবা</div>
      <button type="button" onClick={() => go("google")} className="btn btn-outline w-full">🇬 Google দিয়ে চালিয়ে যান</button>
      <button type="button" onClick={() => go("github")} className="btn btn-outline w-full">🐙 GitHub দিয়ে চালিয়ে যান</button>
    </div>
  );
}
