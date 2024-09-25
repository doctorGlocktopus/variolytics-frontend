import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let isConnected = false;

async function connectToDatabase() {
    if (client && isConnected) {
        return client;
    }

    client = new MongoClient(uri);
    await client.connect();
    isConnected = true;
    return client;
}

export default async function handler(req, res) {
    const { id } = req.query;
    const { selectedChart = 'N2O' } = req.query;

    try {
        const connectedClient = await connectToDatabase();
        const db = connectedClient.db('measurements');
        const collection = db.collection('measurements');

        console.log('DeviceId:', id);
        console.log('SelectedChart:', selectedChart);

        const pipeline = [
            {
                $match: {
                    DeviceId: parseFloat(id)
                }
            },
            {
                $group: {
                    _id: { DeviceId: "$DeviceId", DeviceName: "$DeviceName" },
                    measurements: {
                        $push: {
                            Date: "$Date",
                            value: { $toDouble: `$${selectedChart}` }
                        }
                    }
                }
            },
            {
                $project: {
                    DeviceId: "$_id.DeviceId",
                    DeviceName: "$_id.DeviceName",
                    measurements: 1,
                    _id: 0
                }
            }
        ];

        const devices = await collection.aggregate(pipeline).toArray();

        if (devices.length > 0) {
            return res.status(200).json({
                measurements: devices[0].measurements,
            });
        } else {
            return res.status(404).json({ error: 'Gerät nicht gefunden' });
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten von MongoDB:', error);
        return res.status(500).json({ error: 'Daten konnten nicht abgerufen werden' });
    }
}
