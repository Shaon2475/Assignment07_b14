"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function Profile() {
  const { data, isPending } = useSession();
  const u = data?.user;
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-base-300 rounded-2xl p-6 text-center">
        {isPending || !u ? (
          <div className="space-y-3 flex flex-col items-center">
            <div className="skeleton w-24 h-24 rounded-full" /><div className="skeleton h-6 w-40" /><div className="skeleton h-4 w-52" />
          </div>
        ) : (
          <>
            {u.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.image} alt={u.name} className="w-24 h-24 rounded-full mx-auto object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto bg-primary text-white grid place-items-center text-4xl font-bold">{u.name?.[0]?.toUpperCase()}</div>
            )}
            <h1 className="text-2xl font-extrabold mt-4">{u.name}</h1>
            <p className="text-neutral/60 mb-5">{u.email}</p>
            <Link href="/profile/update" className="btn btn-primary">তথ্য আপডেট করুন</Link>
          </>
        )}
      </div>
    </div>
  );
}
