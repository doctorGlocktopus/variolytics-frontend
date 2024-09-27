import { MongoClient } from 'mongodb';
import * as jose from 'jose';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            await client.connect();
            const db = client.db('user_management');
            const collection = db.collection('users');

            const user = await collection.findOne({ username });

            if (user && await bcrypt.compare(password, user.password)) {
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
            } else {
                res.status(401).json({ message: 'Benutzername oder Passwort stimmen nicht' });
            }
        } catch (error) {
            console.error('Fehler beim Abrufen des Benutzers:', error);
            res.status(500).json({ message: 'Interner Serverfehler', error });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Nur POST-Methode erlaubt' });
    }
}
