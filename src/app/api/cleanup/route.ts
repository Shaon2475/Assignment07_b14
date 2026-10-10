import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
export async function POST() {
  const db = client.db();
  const users = await db.collection("user").find({}, { projection: { _id: 1 } }).toArray();
  const ids = new Set(users.map((u) => String(u._id)));

  let removed = 0;
  for (const name of ["account", "session"]) {
    const col = db.collection(name);
    const docs = await col.find({}, { projection: { _id: 1, userId: 1 } }).toArray();
    const orphans = docs.filter((d) => !ids.has(String(d.userId))).map((d) => d._id);
    if (orphans.length) {
      const res = await col.deleteMany({ _id: { $in: orphans } });
      removed += res.deletedCount;
    }
  }
  return NextResponse.json({ removed });
}
