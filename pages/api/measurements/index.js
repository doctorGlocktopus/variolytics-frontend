import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'mockData.json');
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    const { page = 1 } = req.query;
    const limit = 5;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    res.status(200).json({
        total: data.length,
        page: Number(page),
        limit: limit,
        devices: paginatedData,
    });
}
