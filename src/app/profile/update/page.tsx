"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateUser, useSession } from "@/lib/auth-client";

export default function UpdateProfile() {
  const router = useRouter();
  const { data } = useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data?.user.name) setName(data.user.name); }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    setBusy(true);
    const { error } = await updateUser({ name: name.trim() });
    setBusy(false);
    if (error) return toast.error(error.message || "আপডেট ব্যর্থ হয়েছে");
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <form onSubmit={onSubmit} className="bg-white border border-base-300 rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-center">তথ্য আপডেট করুন</h1>
        <label className="form-control">
          <span className="label-text mb-1">নাম</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" required />
        </label>
        <button disabled={busy} className="btn btn-primary w-full">{busy ? <span className="loading loading-spinner" /> : "তথ্য আপডেট করুন"}</button>
      </form>
    </div>
  );
}
