import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'mockData.json');
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    const { page = 1, search = '' } = req.query;
    const limit = 5;

    const filteredData = data.filter(device => 
        device.MeasureId.toString().includes(search) ||
        device.DeviceId.toString().includes(search) ||
        device.DeviceName.toLowerCase().includes(search.toLowerCase())
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.status(200).json({
        total: filteredData.length,
        page: Number(page),
        limit: limit,
        devices: paginatedData,
    });
}
