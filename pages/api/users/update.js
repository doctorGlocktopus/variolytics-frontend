import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        await client.connect();
        const db = client.db('user_management');
        const collection = db.collection('users');

        if (method === 'PUT') {
            if (!id) {
                return res.status(400).json({ error: 'User ID is required.' });
            }

            const existingUser = await collection.findOne({ _id: new ObjectId(id) });
            
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            const updatedUser = req.body;
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedUser }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'User not found or not modified' });
            }

            return res.status(200).json(updatedUser);
        }

        if (method === 'DELETE') {

            if (!id) {
                return res.status(400).json({ error: 'User ID is required.' });
            }

            console.log(id, typeof id)

            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            console.log(result)
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(204).send();
        }

        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
