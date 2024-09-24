// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // In der Entwicklungsumgebung verwenden wir eine neue Verbindung für Hot Reloading
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In der Produktion verwenden wir eine einzelne Verbindung
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
