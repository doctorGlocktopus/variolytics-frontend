import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('measurements');
        const collection = db.collection('measurements');

        const { searchTerm = '', page = 1, limit = 10, selectedChart = 'N2O' } = req.query; // added selectedChart
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const matchStage = {
            $match: {
                $or: [
                    { DeviceId: { $regex: searchTerm, $options: 'i' } },
                    { DeviceName: { $regex: searchTerm, $options: 'i' } }
                ]
            }
        };

        const groupStage = {
            $group: {
                _id: { DeviceId: "$DeviceId", DeviceName: "$DeviceName" },
                measurements: {
                    $push: {
                        Date: "$Date",
                        value: `$${selectedChart}`, // Only keep the selected measurement
                    }
                }
            }
        };

        const pipeline = [
            matchStage,
            groupStage,
            {
                $sort: {
                    "_id.DeviceName": 1
                }
            },
            {
                $project: {
                    DeviceId: "$_id.DeviceId",
                    DeviceName: "$_id.DeviceName",
                    measurements: 1,
                    _id: 0
                }
            },
            {
                $skip: skip
            },
            {
                $limit: parseInt(limit)
            }
        ];

        const devices = await collection.aggregate(pipeline).toArray();

        res.status(200).json({
            devices: devices,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    } finally {
        await client.close();
    }
}
