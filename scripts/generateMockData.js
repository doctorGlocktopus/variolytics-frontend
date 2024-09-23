const fs = require('fs');
const path = require('path');

const generateMockData = () => {
  return {
    DeviceId: `device_${Math.floor(Math.random() * 10) + 1}`,
    DeviceName: `Device ${Math.floor(Math.random() * 10)}`,
    N2O: (Math.random() * 50).toFixed(2),  // 0 - 50 ppm
    CH4: (Math.random() * 100).toFixed(2), // 0 - 100 ppm
    CO2: (Math.random() * 20).toFixed(2),  // 0 - 20 Vol.%
    O2: (Math.random() * 100).toFixed(2),  // 0 - 100 Vol.%
    FlowRate: (Math.random() * 5000).toFixed(2), // 0 - 5000 m³/h
    Temperature: (Math.random() * 100).toFixed(2), // 0 - 100°C
    Date: new Date().toISOString(),
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
