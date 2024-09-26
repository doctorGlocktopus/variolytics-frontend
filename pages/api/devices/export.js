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
    const { deviceId, selectedChart = 'N2O', startDate, endDate } = req.query;

    try {
        const connectedClient = await connectToDatabase();
        const db = connectedClient.db('measurements');
        const collection = db.collection('measurements');

        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date();

        const pipeline = [
            {
                $match: {
                    DeviceId: parseFloat(deviceId),
                    Date: {
                        $gte: start.toISOString(),
                        $lte: end.toISOString(),
                    },
                },
            },
            {
                $project: {
                    DeviceId: 1,
                    DeviceName: 1,
                    Date: 1,
                    N2O: { $toDouble: "$N2O" },
                    CH4: { $toDouble: "$CH4" },
                    CO2: { $toDouble: "$CO2" },
                    O2: { $toDouble: "$O2" },
                    Temperature: { $toDouble: "$Temperature" },
                    FlowRate: { $toDouble: "$FlowRate" },
                }
            }
        ];

        const cursor = collection.aggregate(pipeline);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=device_${deviceId}_data_${startDate}_to_${endDate}.csv`);

        res.write('DeviceId,DeviceName,Date,N2O,CH4,CO2,O2,Temperature,FlowRate\n');

        for await (const doc of cursor) {
            const row = [
                doc.DeviceId,
                doc.DeviceName,
                doc.Date,
                doc.N2O || '',
                doc.CH4 || '',
                doc.CO2 || '',
                doc.O2 || '',
                doc.Temperature || '',
                doc.FlowRate || ''
            ].join(',') + '\n';
            res.write(row);
        }

        res.end();
    } catch (error) {
        console.error('Fehler beim Export der Daten:', error);
        res.status(500).json({ error: 'Daten konnten nicht exportiert werden' });
    }
}
