"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

/** Shows a toast when middleware redirects a guest away from a protected route */
export default function AuthToast() {
  const sp = useSearchParams();
  const reason = sp.get("reason");
  useEffect(() => {
    if (reason === "protected") toast.error("এই পেজ দেখতে আগে সাইন ইন করুন", { id: "protected" });
  }, [reason]);
  return null;
}
