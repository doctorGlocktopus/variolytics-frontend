import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const filePath = path.join(process.cwd(), 'data', 'users.json');

        const fileData = fs.readFileSync(filePath);
        const users = JSON.parse(fileData);

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            const accessToken = `${user._id}-${Date.now()}`;

            res.status(200).json({
                user: {
                    username: user.username,
                    email: user.email,
                    admin: user.admin,
                },
                accessToken: accessToken,
            });
        } else {
            res.status(401).json({ message: 'Benutzername oder Passwort stimmen nicht' });
        }
    } else {
        res.status(405).json({ message: 'Nur POST-Methode erlaubt' });
    }
}
