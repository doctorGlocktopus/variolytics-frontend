import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { id } = req.query;

    if (id && !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    try {
        await client.connect();
        const db = client.db('user_management');
        const collection = db.collection('users');

        if (req.method === 'GET') {

            if (id) {
                const user = await collection.findOne({ _id: new ObjectId(id) });

                if (!user) {
                    return res.status(404).json({ error: 'user not found' });
                }

                return res.status(200).json(user);
            } else {
                const users = await collection.find().toArray();
                return res.status(200).json(users);
            }
        }

        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
