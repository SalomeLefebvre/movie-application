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
 *   post:
 *     summary: Ajouter un film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               releaseDate:
 *                 type: string
 *                 example: "2010-07-16"
 *               genre:
 *                 type: string
 *                 example: "Science Fiction"
 *     responses:
 *       201:
 *         description: Film créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Movie created"
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
 *         description: Champs requis manquants
 *       500:
 *         description: Erreur interne du serveur
 *   put:
 *     summary: Modifier un film par son ID
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               releaseDate:
 *                 type: string
 *                 example: "2010-07-16"
 *               genre:
 *                 type: string
 *                 example: "Science Fiction"
 *     responses:
 *       200:
 *         description: Film mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Movie updated successfully"
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
 *   delete:
 *     summary: Supprimer un film par son ID
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Film supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Movie deleted successfully"
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, releaseDate, genre } = body;

    if (!title || !releaseDate || !genre) {
      return NextResponse.json({
        status: 400,
        message: 'Missing required fields',
        error: 'title, releaseDate, and genre are required',
      });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('movies').insertOne({
      title,
      releaseDate,
      genre,
    });

    return NextResponse.json({
      status: 201,
      message: 'Movie created',
      data: { _id: result.insertedId, title, releaseDate, genre },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ idMovie: string }> }
) {
  try {
    const { idMovie } = await context.params;
    const body = await request.json();

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid movie ID',
        error: 'ID format is incorrect',
      });
    }

    const { title, releaseDate, genre } = body;

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(idMovie) },
      { $set: { title, releaseDate, genre } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: 'Movie not found',
        error: 'No movie found with the given ID',
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Movie updated successfully',
      data: { _id: idMovie, title, releaseDate, genre },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ idMovie: string }> }
) {
  try {
    const { idMovie } = await context.params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid movie ID',
        error: 'ID format is incorrect',
      });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: 'Movie not found',
        error: 'No movie found with the given ID',
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Movie deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}
