import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { id } = req.query;
    const filePath = path.join(process.cwd(), 'data', 'mockData.json');
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    if (req.method === 'DELETE') {

        const updatedData = data.filter(item => String(item.MeasureId) !== String(id));

        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

        return res.status(204).send();

    } else {

        const measurement = data.find(item => String(item.MeasureId) === String(id));

        if (!measurement) {
            return res.redirect(302, '/measurements');
        }        
    
        res.status(200).json(measurement);
    }

}
