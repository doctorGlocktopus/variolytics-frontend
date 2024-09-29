import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { method } = req;

    try {
        await client.connect();
        const db = client.db('user_management');
        const collection = db.collection('users');

        if (method === 'GET') {
            const users = await collection.find({}).toArray();
            return res.status(200).json(users);
        } else if (method === 'DELETE') {
            const { id } = req.query;
console.log(id)
            // Validate ObjectId format
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Ungültige Benutzer-ID' });
            }

            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Benutzer nicht gefunden' });
            }
            return res.status(204).send(); 
        } else {
            res.setHeader('Allow', ['GET', 'DELETE']);
            return res.status(405).end(`Methode ${method} nicht erlaubt`);
        }
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der Anfrage:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    } finally {
        await client.close();
    }
}
