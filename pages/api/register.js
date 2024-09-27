import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password, email, admin } = req.body;

        try {
            await client.connect();
            const db = client.db('user_management');
            const collection = db.collection('users');

            const existingUser = await collection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Benutzername bereits vergeben.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                username,
                email,
                password: hashedPassword,
                admin,
            };

            await collection.insertOne(newUser);
            res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });

        } catch (error) {
            console.error('Fehler bei der Registrierung:', error);
            res.status(500).json({ message: 'Interner Serverfehler' });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Nur POST-Methode erlaubt' });
    }
}
