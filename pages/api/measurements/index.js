import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'mockData.json');
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    const { page = 1, sortBy = '', sortDirection = 'asc', searchTerm = '' } = req.query;
    const limit = 30;

    const filteredData = data.filter(device => {
        return (
            device.MeasureId.toString().includes(searchTerm) ||
            device.DeviceId.toString().includes(searchTerm) ||
            device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const sortedData = filteredData.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
        }
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    res.status(200).json({
        total: filteredData.length,
        page: Number(page),
        limit: limit,
        devices: paginatedData,
    });
}
