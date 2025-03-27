import { NextResponse } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     tags: [Theaters]
 *     summary: Récupérer la liste de tous les théâtres et cinémas
 *     responses:
 *       200:
 *         description: Liste des théâtres et cinémas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5f96f4f3a4f3a4f3a4f3a"
 *                       name:
 *                         type: string
 *                         example: "Cinéma Paradiso"
 *                       location:
 *                         type: string
 *                         example: "123 Rue du Cinéma, Paris"
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const theaters = await db.collection('theaters').find({}).limit(10).toArray();

    return NextResponse.json({ status: 200, data: theaters });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'POST method is not supported' });
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'PUT method is not supported' });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'DELETE method is not supported' });
}