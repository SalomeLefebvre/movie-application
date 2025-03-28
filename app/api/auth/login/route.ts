import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient } from "mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const client: MongoClient = clientPromise;
  const db: Db = client.db("authDB");

  const user = await db.collection("users").findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" });

  await db.collection("sessions").insertOne({ username, refreshToken });

  const response = NextResponse.json({ message: "Authenticated", jwt: token });
  response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
  response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/" });

  return response;
}