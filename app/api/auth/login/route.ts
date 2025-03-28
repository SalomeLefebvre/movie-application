import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient } from "mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentification]
 *     summary: Authentification de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Identifiants invalides
 */
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