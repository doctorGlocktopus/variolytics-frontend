import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileData = fs.readFileSync(filePath);
    const users = JSON.parse(fileData);
console.log(11111111111)
    if (req.method === 'DELETE') {
        const { id } = req.query;

        const updatedUsers = users.filter(user => String(user.id) !== String(id));


        fs.writeFileSync(filePath, JSON.stringify(updatedUsers, null, 2));

        return res.status(204).send();
    }

    res.status(200).json(users);
}
