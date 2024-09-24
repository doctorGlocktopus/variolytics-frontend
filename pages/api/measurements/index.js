import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { page = 1, sortBy = 'DeviceName', sortDirection = 'asc', searchTerm = '' } = req.query;
    const limit = 30;

    try {
        await client.connect();
        const db = client.db('measurements');
        const collection = db.collection('measurements');

        const matchStage = {
            $or: [
                { MeasureId: { $regex: searchTerm, $options: 'i' } },
                { DeviceId: { $regex: searchTerm, $options: 'i' } },
                { DeviceName: { $regex: searchTerm, $options: 'i' } }
            ]
        };

        const sortOptions = {
            [sortBy]: sortDirection === 'asc' ? 1 : -1
        };

        const pipeline = [
            { $match: matchStage },
            { $sort: sortOptions },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ];

        const devices = await collection.aggregate(pipeline).toArray();

        const totalPipeline = [{ $match: matchStage }, { $count: 'total' }];
        const totalResult = await collection.aggregate(totalPipeline).toArray();
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        res.status(200).json({
            total: total,
            page: Number(page),
            limit: limit,
            devices: devices,
        });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).json({ error: 'Failed to fetch data from MongoDB' });
    } finally {
        await client.close();
    }
}
