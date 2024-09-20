import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password, email, admin } = req.body;

        const filePath = path.join(process.cwd(), 'data', 'users.json');

        let users = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            users = JSON.parse(fileData);
        }

        const newUser = {
            _id: Date.now().toString(),
            username,
            email,
            password,
            admin: admin || false,
        };

        users.push(newUser);

        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        res.status(200).json({ message: 'Benutzer wurde erstellt', user: newUser });
    } else {
        res.status(405).json({ message: 'Nur POST-Methode erlaubt' });
    }
}
