import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileData = fs.readFileSync(filePath);
    const users = JSON.parse(fileData);

    if (req.method === 'PUT') {

        const { id } = req.query;
        const updatedUser = req.body;

        const userIndex = users.findIndex(user => String(user._id) === String(id));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users[userIndex] = { ...users[userIndex], ...updatedUser };

        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        return res.status(200).json(users[userIndex]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        const updatedUsers = users.filter(user => String(user._id) !== String(id));

        fs.writeFileSync(filePath, JSON.stringify(updatedUsers, null, 2));

        return res.status(204).send();
    }

    res.status(200).json(users);
}
