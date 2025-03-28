import { Db, MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  const client: MongoClient = clientPromise;
  const db: Db = client.db("authDB");
  await db.collection("sessions").deleteMany({});

  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

  return response;
}