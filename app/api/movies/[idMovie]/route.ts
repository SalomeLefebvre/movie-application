import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Récupérer un film par son ID
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Film récupéré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5f96f4f3a4f3a4f3a4f3a"
 *                     title:
 *                       type: string
 *                       example: "Inception"
 *                     releaseDate:
 *                       type: string
 *                       example: "2010-07-16"
 *                     genre:
 *                       type: string
 *                       example: "Science Fiction"
 *       400:
 *         description: ID de film invalide
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(request: NextRequest, context: { params: Promise<{ idMovie: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { idMovie } = resolvedParams;

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }

    return NextResponse.json({ status: 200, data: movie });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
