import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { id } = req.query;

    const numericId = Number(id);

    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid id format. It must be a number.' });
    }

    try {
        await client.connect();
        const db = client.db('measurements');
        const collection = db.collection('measurements');

        if (req.method === 'DELETE') {
            const result = await collection.deleteOne({ MeasureId: numericId });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Measurement not found' });
            }
            return res.status(204).send();
        } else {
            console.log(typeof numericId, numericId);

            const measurement = await collection.findOne({ MeasureId: numericId });

            if (!measurement) {
                return res.redirect(302, '/measurements');
            }
            return res.status(200).json(measurement);
        }
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    } finally {
        await client.close();
    }
}
