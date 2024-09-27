import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    try {
        await client.connect();
        const db = client.db('users');
        const collection = db.collection('users');

        if (req.method === 'GET') {
            const user = await collection.findOne({ _id: new ObjectId(id) });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        }

        if (req.method === 'PUT') {
            const updatedUser = req.body;
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedUser }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ message: 'User updated successfully' });
        }

        if (req.method === 'DELETE') {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(204).send();
        }

        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
