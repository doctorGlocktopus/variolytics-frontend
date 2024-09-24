import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'mockData.json');
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    const { searchTerm = '' } = req.query;

    const devices = {};

    data.forEach(measurement => {
        const { DeviceId, DeviceName, ...values } = measurement;
        if (!devices[DeviceId]) { 
            devices[DeviceId] = {
                DeviceId,
                DeviceName,
                measurements: [],
            };
        }
        devices[DeviceId].measurements.push(values);
    });

    const filteredDevices = Object.values(devices).filter(device => 
        device.DeviceId.toString().includes(searchTerm) ||
        device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredDevices.sort((a, b) => a.DeviceName.localeCompare(b.DeviceName));

    res.status(200).json({
        devices: filteredDevices,
    });
}
