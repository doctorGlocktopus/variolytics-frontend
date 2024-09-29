const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const firstNames = ['John', 'Jane', 'Alex', 'Chris', 'Taylor', 'Sam', 'Pat', 'Jamie', 'Jordan', 'Morgan'];
const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Lee', 'Martin', 'Garcia', 'Rodriguez', 'Lewis'];
const emailDomains = ['example.com', 'mail.com', 'test.org'];

const generateMockUserData = async (numUsers) => {
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomName = `${randomFirstName} ${randomLastName}`;
    const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`;
    
    const plainPassword = '12345';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const isAdmin = Math.random() > 0.5;

    users.push({
      _id: new ObjectId(),
      username: randomName,
      email: randomEmail,
      password: hashedPassword,
      admin: isAdmin
    });
  }

  return users;
};

const saveUsersToMongoDB = async (users) => {
  try {
    await client.connect();
    const db = client.db('user_management');
    const collection = db.collection('users');

    const result = await collection.insertMany(users);
    console.log(`Inserted ${result.insertedCount} users into the collection.`);
  } catch (error) {
    console.error('Error inserting users into MongoDB:', error);
  } finally {
    await client.close();
  }
};

(async () => {
  const numUsers = 10;
  const mockUserData = await generateMockUserData(numUsers);
  await saveUsersToMongoDB(mockUserData);
})();
