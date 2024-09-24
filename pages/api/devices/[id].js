import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Stelle sicher, dass diese Umgebungsvariable gesetzt ist
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { id } = req.query; // Geräte-ID
    const { selectedChart } = req.query; // Den ausgewählten Messwert

    try {
        await client.connect();
        const db = client.db('measurements');
        const collection = db.collection('measurements');

        // Suche nach der spezifischen Geräte-ID
        const pipeline = [
            {
                $match: {
                    DeviceId: id // Vergleich mit der String-ID
                }
            },
            {
                $group: {
                    _id: { DeviceId: "$DeviceId", DeviceName: "$DeviceName" },
                    measurements: {
                        $push: {
                            Date: "$Date",
                            value: `$${selectedChart}` // Dynamisch basierend auf selectedChart
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
            res.status(200).json({
                measurements: devices[0].measurements,
            });
        } else {
            res.status(404).json({ error: 'Gerät nicht gefunden' });
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten von MongoDB:', error);
        res.status(500).json({ error: 'Daten konnten nicht abgerufen werden' });
    } finally {
        await client.close();
    }
}
