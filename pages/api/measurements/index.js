import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
    const { page = 1, sortBy = 'DeviceName', sortDirection = 'asc', searchTerm = '' } = req.query;
    const limit = 30;

    try {
        const client = await clientPromise;
        const db = client.db('measurements');
        const collection = db.collection('measurements');

        const matchStage = {
            $and: [
              {
                $or: [
                  { DeviceId: { $regex: searchTerm, $options: 'i' } }, // Suche in DeviceId
                  { DeviceName: { $regex: searchTerm, $options: 'i' } }, // Suche in DeviceName
                  { MeasureId: { $regex: searchTerm, $options: 'i' } }, // Suche in MeasureId
                ]
              },
              // Falls searchTerm eine Zahl ist, überprüfe numerische Felder
              searchTerm && !isNaN(searchTerm) ? {
                $or: [
                  { FlowRate: parseFloat(searchTerm) }, // Suche nach FlowRate
                  { N2O: parseFloat(searchTerm) }, // Suche nach N2O
                  { CH4: parseFloat(searchTerm) }, // Suche nach CH4
                  { CO2: parseFloat(searchTerm) }, // Suche nach CO2
                  { O2: parseFloat(searchTerm) }, // Suche nach O2
                  { Temperature: parseFloat(searchTerm) } // Suche nach Temperature
                ]
              } : {},
              // Suche nach IsActive, falls der Begriff "true" oder "false" ist
              searchTerm === 'true' || searchTerm === 'false' ? {
                IsActive: searchTerm === 'true'
              } : {}
            ]
          };
          

        const sortOptions = {
            [sortBy]: sortDirection === 'asc' ? 1 : -1,
        };

        const pipeline = [
            { $match: matchStage },
            { $sort: sortOptions },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ];

        const devices = await collection.aggregate(pipeline).toArray();
        const totalResult = await collection.aggregate([{ $match: matchStage }, { $count: 'total' }]).toArray();
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        console.log(devices[0])

        res.status(200).json({
            total: total,
            page: Number(page),
            limit: limit,
            devices: devices,
        });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).json({ error: 'Failed to fetch data from MongoDB' });
    }
}
