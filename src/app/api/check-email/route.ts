import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await client
    .db()
    .collection("user")
    .findOne({ email: String(email).toLowerCase().trim() });
  return NextResponse.json({ exists: !!user });
}
