import fs from 'fs';
import path from 'path';
import * as jose from 'jose';

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const filePath = path.join(process.cwd(), 'data', 'users.json');

        const fileData = fs.readFileSync(filePath);
        const users = JSON.parse(fileData);

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            try {
                const accessToken = await new jose.SignJWT({ _id: user._id, username: user.username })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('2h')
                    .sign(new TextEncoder().encode(secretKey));

                res.status(200).json({
                    user: {
                        username: user.username,
                        email: user.email,
                        admin: user.admin,
                    },
                    accessToken: accessToken,
                });
            } catch (error) {
                res.status(500).json({ message: 'Fehler beim Erstellen des Tokens', error });
            }
        } else {
            res.status(401).json({ message: 'Benutzername oder Passwort stimmen nicht' });
        }
    } else {
        res.status(405).json({ message: 'Nur POST-Methode erlaubt' });
    }
}
