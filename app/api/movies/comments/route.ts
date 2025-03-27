import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Récupérer la liste de tous les commentaires liés à un film
 *     parameters:
 *       - in: query
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Liste des commentaires
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
 *                       movie_id:
 *                         type: string
 *                         example: "60d5f96f4f3a4f3a4f3a4f3a"
 *                       text:
 *                         type: string
 *                         example: "Super film!"
 *       400:
 *         description: ID de film invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const idMovie = url.searchParams.get('idMovie');

  if (!idMovie || !ObjectId.isValid(idMovie)) {
    return NextResponse.json({
      status: 400,
      message: 'Invalid movie ID',
      error: 'ID format is incorrect',
    });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const comments = await db
      .collection('comments')
      .find({ movie_id: new ObjectId(idMovie) })
      .toArray();

    return NextResponse.json({
      status: 200,
      message: 'Comments fetched successfully',
      data: comments,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
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
