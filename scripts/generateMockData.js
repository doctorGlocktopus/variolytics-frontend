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

const dates = [
  new Date('2024-01-01'),
  new Date('2024-02-01'),
  new Date('2024-03-01'),
  new Date('2024-04-01'),
  new Date('2024-05-01'),
  new Date('2024-06-01'),
  new Date('2024-07-01'),
  new Date('2024-08-01')
];

let currentId = 100;

const generateMockData = () => {
  const randomDevice = devices[Math.floor(Math.random() * devices.length)];
  const randomDate = dates[Math.floor(Math.random() * dates.length)];

  return {
    MeasureId:  currentId++,
    DeviceId: randomDevice.id,
    DeviceName: randomDevice.name,
    N2O: (Math.random() * 50).toFixed(2),  // 0 - 50 ppm
    CH4: (Math.random() * 100).toFixed(2), // 0 - 100 ppm
    CO2: (Math.random() * 20).toFixed(2),  // 0 - 20 Vol.%
    O2: (Math.random() * 100).toFixed(2),  // 0 - 100 Vol.%
    FlowRate: (Math.random() * 5000).toFixed(2), // 0 - 5000 m³/h
    Temperature: (Math.random() * 100).toFixed(2), // 0 - 100°C
    Date: randomDate.toISOString(),
    IsActive: Math.random() > 0.5
  };
};

const generateData = (numRecords) => {
  const data = [];
  for (let i = 0; i < numRecords; i++) {
    data.push(generateMockData());
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
