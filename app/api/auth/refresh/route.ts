import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Db, MongoClient } from "mongodb";
import clientPromise from "@/lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     tags: [Authentification]
 *     summary: Rafraîchissement du token JWT
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *       401:
 *         description: Aucun token de rafraîchissement fourni
 *       403:
 *         description: Token de rafraîchissement invalide
 */
export async function GET(req: Request) {
  const refreshToken = req.headers.get("cookie")?.split("refreshToken=")[1];
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
  }

  const client: MongoClient = await clientPromise;
  const db: Db = client.db("authDB");
  const session = await db.collection("sessions").findOne({ refreshToken });
  if (!session) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);
    const newToken = jwt.sign({ username: decoded.username }, SECRET_KEY, { expiresIn: "15m" });
    const response = NextResponse.json({ token: newToken });
    response.cookies.set("token", newToken, { httpOnly: true, secure: true, path: "/" });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
  }
}