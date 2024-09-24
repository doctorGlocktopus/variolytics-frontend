const fs = require('fs');
const path = require('path');

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

const startDate = new Date('2024-08-01T23:59:59');
const endDate = new Date('2024-01-01T00:00:00');

const totalTimeSpan = endDate - startDate;

const generateMockData = (timestamp) => {
  const randomDevice = devices[Math.floor(Math.random() * devices.length)];

  return {
    MeasureId: currentId --,
    DeviceId: randomDevice.id,
    DeviceName: randomDevice.name,
    N2O: (Math.random() * 50).toFixed(2),  // 0 - 50 ppm
    CH4: (Math.random() * 100).toFixed(2), // 0 - 100 ppm
    CO2: (Math.random() * 20).toFixed(2),  // 0 - 20 Vol.%
    O2: (Math.random() * 100).toFixed(2),  // 0 - 100 Vol.%
    FlowRate: (Math.random() * 5000).toFixed(2), // 0 - 5000 m³/h
    Temperature: (Math.random() * 100).toFixed(2), // 0 - 100°C
    Date: new Date(timestamp).toISOString(),
    IsActive: Math.random() > 0.5
  };
};

const generateData = (numRecords) => {
  const data = [];
  
  const interval = totalTimeSpan / numRecords;
  
  for (let i = 0; i < numRecords; i++) {
    const timestamp = startDate.getTime() + (interval * i);
    data.push(generateMockData(timestamp));
  }
  
  return data;
};

const saveDataToFile = (data) => {
  const filePath = path.join(__dirname, '../data/mockData.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
};

const numRecords = 100000;
const mockData = generateData(numRecords);
saveDataToFile(mockData);
