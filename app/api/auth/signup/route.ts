import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Db, MongoClient } from "mongodb";
import clientPromise from "@/lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentification]
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: L'utilisateur existe déjà
 */
export async function POST(req: Request) {
  const { username, password } = await req.json();
  const client: MongoClient = await clientPromise;
  const db: Db = client.db("authDB");

  const existingUser = await db.collection("users").findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ username, password: hashedPassword });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" });
  await db.collection("sessions").insertOne({ username, refreshToken });

  const response = NextResponse.json({ message: "User registered successfully" });
  response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
  response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/" });
  return response;
}