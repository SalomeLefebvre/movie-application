import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/comments/{idComment}:
 *   get:
 *     summary: Récupérer un commentaire d'un film
 *     parameters:
 *       - in: path
 *         name: idComment
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire récupéré
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
 *                     movie_id:
 *                       type: string
 *                       example: "60d5f96f4f3a4f3a4f3a4f3a"
 *                     text:
 *                       type: string
 *                       example: "Super film!"
 *       400:
 *         description: ID de commentaire invalide
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne du serveur
 *   post:
 *     summary: Ajouter un commentaire à un film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_id:
 *                 type: string
 *                 example: "60d5f96f4f3a4f3a4f3a4f3a"
 *               text:
 *                 type: string
 *                 example: "Super film!"
 *     responses:
 *       201:
 *         description: Commentaire ajouté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5f96f4f3a4f3a4f3a4f3a"
 *       400:
 *         description: ID de film invalide
 *       500:
 *         description: Erreur interne du serveur
 *   put:
 *     summary: Modifier un commentaire d'un film
 *     parameters:
 *       - in: path
 *         name: idComment
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Film génial!"
 *     responses:
 *       200:
 *         description: Commentaire modifié
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
 *                   example: "Commentaire mis à jour avec succès"
 *       400:
 *         description: ID de commentaire invalide
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne du serveur
 *   delete:
 *     summary: Supprimer un commentaire d'un film
 *     parameters:
 *       - in: path
 *         name: idComment
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire supprimé
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
 *                   example: "Commentaire supprimé avec succès"
 *       400:
 *         description: ID de commentaire invalide
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });

    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }

    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { movie_id, text } = await request.json();
    if (!ObjectId.isValid(movie_id)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('comments').insertOne({ movie_id: new ObjectId(movie_id), text });

    return NextResponse.json({ status: 201, data: { id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function PUT(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const { text } = await request.json();

    const result = await db.collection('comments').updateOne({ _id: new ObjectId(idComment) }, { $set: { text } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Comment updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function DELETE(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Comment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
