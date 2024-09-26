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
    const { selectedChart = 'N2O', startDate, endDate } = req.query;

    const today = new Date();
    const defaultStartDate = new Date(today);
    defaultStartDate.setDate(today.getDate() - 7);

    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : today;

    try {
        const connectedClient = await connectToDatabase();
        const db = connectedClient.db('measurements');
        const collection = db.collection('measurements');

        const pipeline = [
            {
                $match: {
                    DeviceId: parseFloat(id),
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
            },
            {
                $group: {
                    _id: { DeviceId: "$DeviceId", DeviceName: "$DeviceName" },
                    measurements: {
                        $push: {
                            key: "$_id",
                            date: "$Date",
                            value: selectedChart === 'all' ? {
                                N2O: { value: "$N2O", unit: "ppm" },
                                CH4: { value: "$CH4", unit: "ppm" },
                                CO2: { value: "$CO2", unit: "Vol.%" },
                                O2: { value: "$O2", unit: "Vol.%" }
                            } : {
                                value: "$value",
                                unit: selectedChart
                            },
                            temperature: "$Temperature",
                            flowRate: "$FlowRate",
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
            },
            {
                $unwind: "$measurements"
            },
            {
                $sort: { "measurements.date": 1 }
            },
            {
                $group: {
                    _id: { DeviceId: "$DeviceId", DeviceName: "$DeviceName" },
                    measurements: { $push: "$measurements" }
                }
            }
        ];

        const devices = await collection.aggregate(pipeline).toArray();

        if (devices.length > 0) {
            return res.status(200).json({
                measurements: devices[0].measurements,
            });
        } else {
            return res.status(404).json({ error: 'Keine Messdaten gefunden für das Gerät' });
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten von MongoDB:', error);
        return res.status(500).json({ error: 'Daten konnten nicht abgerufen werden' });
    }
}
