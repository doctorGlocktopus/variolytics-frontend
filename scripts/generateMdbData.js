const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

const devices = [
  { id: (Math.random()) + 1, name: 'Device A' },
  { id: (Math.random()) + 1, name: 'Device B' },
  { id: (Math.random()) + 1, name: 'Device C' },
  { id: (Math.random()) + 1, name: 'Device D' },
  { id: (Math.random()) + 1, name: 'Device E' },
  { id: (Math.random()) + 1, name: 'Device F' },
  { id: (Math.random()) + 1, name: 'Device G' },
  { id: (Math.random()) + 1, name: 'Device H' },
  { id: (Math.random()) + 1, name: 'Device I' },
  { id: (Math.random()) + 1, name: 'Device J' }
];

let currentId = 100000;

const startDate = new Date('2024-01-01T00:00:00');
const endDate = new Date('2024-09-25T00:00:00');
const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

const generateMockData = (timestamp) => {
  const randomDevice = devices[Math.floor(Math.random() * devices.length)];

  return {
    MeasureId: currentId--,
    DeviceId: randomDevice.id,
    DeviceName: randomDevice.name,
    N2O: (Math.random() * 50).toFixed(2),  // 0 - 50 ppm
    CH4: (Math.random() * 100).toFixed(2), // 0 - 100 ppm
    CO2: (Math.random() * 20).toFixed(2),  // 0 - 20 Vol.%
    O2: (Math.random() * 100).toFixed(2),  // 0 - 100 Vol.%
    FlowRate: (Math.random() * 200).toFixed(2), // 0 - 5000 m³/h
    Temperature: (Math.random() * 100).toFixed(2), // 0 - 100°C
    Date: new Date(timestamp).toISOString(),
    IsActive: Math.random() > 0.5
  };
};

const generateData = (numRecords) => {
  const data = [];
  const recordsPerDay = Math.ceil(numRecords / totalDays);
  
  for (let day = 0; day < totalDays; day++) {
    for (let i = 0; i < recordsPerDay; i++) {
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);
      const timestamp = new Date(startDate);
      
      timestamp.setDate(startDate.getDate() + day);
      timestamp.setHours(randomHour, randomMinute, randomSecond, 0);
      
      data.push(generateMockData(timestamp));
    }
  }
  
  return data;
};

const saveDataToMongoDB = async (data) => {
  try {
    await client.connect();
    const db = client.db('measurements');
    const collection = db.collection('measurements');
    
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents into the collection.`);
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
  } finally {
    await client.close();
  }
};

const numRecords = 100000;
const mockData = generateData(numRecords);
saveDataToMongoDB(mockData);
