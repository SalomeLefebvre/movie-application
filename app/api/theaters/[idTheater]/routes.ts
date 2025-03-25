import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /theaters/{idTheater}:
 *   get:
 *     summary: Récupérer un théâtre ou un cinéma
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du théâtre ou cinéma
 *     responses:
 *       200:
 *         description: Théâtre ou cinéma récupéré
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
 *                     name:
 *                       type: string
 *                       example: "Cinéma Paradiso"
 *                     location:
 *                       type: string
 *                       example: "123 Rue du Cinéma, Paris"
 *       400:
 *         description: ID de théâtre ou cinéma invalide
 *       404:
 *         description: Théâtre ou cinéma non trouvé
 *       500:
 *         description: Erreur interne du serveur
 *   post:
 *     summary: Ajouter un théâtre ou un cinéma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cinéma Paradiso"
 *               location:
 *                 type: string
 *                 example: "123 Rue du Cinéma, Paris"
 *     responses:
 *       201:
 *         description: Théâtre ou cinéma ajouté
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
 *       500:
 *         description: Erreur interne du serveur
 *   put:
 *     summary: Modifier un théâtre ou un cinéma
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du théâtre ou cinéma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cinéma Paradiso"
 *               location:
 *                 type: string
 *                 example: "123 Rue du Cinéma, Paris"
 *     responses:
 *       200:
 *         description: Théâtre ou cinéma modifié
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
 *                   example: "Théâtre ou cinéma mis à jour avec succès"
 *       400:
 *         description: ID de théâtre ou cinéma invalide
 *       404:
 *         description: Théâtre ou cinéma non trouvé
 *       500:
 *         description: Erreur interne du serveur
 *   delete:
 *     summary: Supprimer un théâtre ou un cinéma
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du théâtre ou cinéma
 *     responses:
 *       200:
 *         description: Théâtre ou cinéma supprimé
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
 *                   example: "Théâtre ou cinéma supprimé avec succès"
 *       400:
 *         description: ID de théâtre ou cinéma invalide
 *       404:
 *         description: Théâtre ou cinéma non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { name, location } = await request.json();

    const result = await db.collection('theaters').insertOne({ name, location });

    return NextResponse.json({ status: 201, data: { id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function PUT(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const { name, location } = await request.json();

    const result = await db.collection('theaters').updateOne({ _id: new ObjectId(idTheater) }, { $set: { name, location } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Theater updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function DELETE(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Theater deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
