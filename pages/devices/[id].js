import { useEffect, useRef, useState, useContext } from "react";
import { useDispatch } from 'react-redux';
import styles from '../../styles/Device.module.css';
import CustomBarChart from './CustomBarChart';
import MiniChart from './MiniChart';
import { addNotification } from '../../redux/notificationSlice';
import AppContext from '../../AppContext';
import routes from '../../locales/devices.js';

function DeviceDetails() {
    const dispatch = useDispatch();
    const { language } = useContext(AppContext);

    let [device, setDevice] = useState(null);
    const [selectedChart, setSelectedChart] = useState('N2O');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('2024-09-18');
    const [endDate, setEndDate] = useState('2024-09-25');
    const deviceRef = useRef();

    const fetchDeviceDetails = async () => {
        setLoading(true);

        let urlID = `http://localhost:3000/api/devices/${window.location.pathname.split('/').pop()}?isLive=${true}&selectedChart=${selectedChart}&startDate=${startDate}&endDate=${endDate}`;

        try {
            const response = await fetch(urlID);

            if (!response.ok) {
                throw new Error(routes.deviceCard.errorMessage[language] || "Device not found or error fetching data.");
            }

            const deviceData = await response.json();
            setDevice(deviceData);
        } catch (error) {
            console.error("Fetch error:", error);
            const newNotification = {
                id: Date.now(),
                message: `${routes.deviceCard.errorMessage[language] || "Error loading device data."}`,
            };
            dispatch(addNotification(newNotification));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeviceDetails();
        
        const intervalId = setInterval(fetchDeviceDetails, 120000);
        
        return () => clearInterval(intervalId);
    }, [selectedChart, startDate, endDate]);

    if (!device) {
        return <p>{routes.deviceCard.loadingData[language] || "Loading device data..."}</p>;
    }

    const valueData = device.measurements.measurements.map(item => {
        return {
            key: item.key,
            date: item.date,
            value: item.value,
            temperature: parseFloat(item.temperature) || 0,
            flowRate: parseFloat(item.flowRate) || 0,
        };
    });

    device = device.measurements._id;

    const exportData = async () => {
        try {
            const response = await fetch(`/api/devices/export?deviceId=${device.DeviceId}&selectedChart=${selectedChart}&startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(routes.deviceCard.errorMessage[language] || 'Error exporting data: ' + response.statusText);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `device_${device.DeviceId}_data_${startDate}_to_${endDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    const navigateStartDateWeeks = (direction) => {
        const startDateObj = new Date(startDate);
        const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        setStartDate(new Date(startDateObj.getTime() + (direction * weekInMilliseconds)).toISOString().split('T')[0]);
    };

    const navigateEndDateWeeks = (direction) => {
        const endDateObj = new Date(endDate);
        const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        setEndDate(new Date(endDateObj.getTime() + (direction * weekInMilliseconds)).toISOString().split('T')[0]);
    };

    return (
        <div ref={deviceRef} className={styles.deviceCard}>
            <div className={styles.container} ref={deviceRef}>
                <h2>{`${routes.deviceCard.deviceLabel[language] || "Device"} ${device.DeviceId}`}</h2>
                <h3>{`${routes.deviceCard.deviceNameLabel[language] || "Device Name"}: ${device.DeviceName}`}</h3>

                <div className={styles.tabContainer}>
                    <button onClick={() => setSelectedChart('all')} className={selectedChart === 'all' ? styles.activeTab : ''}>
                        {routes.deviceCard.all[language] || "All (ppm)"}
                    </button>
                    <button onClick={() => setSelectedChart('N2O')} className={selectedChart === 'N2O' ? styles.activeTab : ''}>
                        {routes.deviceCard.n2o[language] || "N2O (ppm)"}
                    </button>
                    <button onClick={() => setSelectedChart('CH4')} className={selectedChart === 'CH4' ? styles.activeTab : ''}>
                        {routes.deviceCard.ch4[language] || "CH4 (ppm)"}
                    </button>
                    <button onClick={() => setSelectedChart('CO2')} className={selectedChart === 'CO2' ? styles.activeTab : ''}>
                        {routes.deviceCard.co2[language] || "CO2 (Vol.)"}
                    </button>
                    <button onClick={() => setSelectedChart('O2')} className={selectedChart === 'O2' ? styles.activeTab : ''}>
                        {routes.deviceCard.o2[language] || "O2 (Vol.)"}
                    </button>

                    <button onClick={() => navigateStartDateWeeks(-1)}>{routes.deviceCard.previousWeek[language] || "<"}</button>
                    <div className={styles.flexX}>
                        <label>{routes.deviceCard.startDate[language] || "Start Date:"}</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <button onClick={() => navigateStartDateWeeks(1)}>{routes.deviceCard.nextWeek[language] || ">"}</button>

                    <button onClick={() => navigateEndDateWeeks(-1)}>{routes.deviceCard.previousWeek[language] || "<"}</button>
                    <div className={styles.flexX}>
                        <label>{routes.deviceCard.endDate[language] || "End Date:"}</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button onClick={() => navigateEndDateWeeks(1)}>{routes.deviceCard.nextWeek[language] || ">"}</button>
                    <button onClick={exportData} className={styles.downloadButton}>
                        {routes.deviceCard.downloadData[language] || "Download Data"}
                    </button>
                </div>

                {valueData.length > 0 ? (
                    <div>
                        <CustomBarChart
                            values={valueData}
                            label={`Messdaten (Einheit)`}
                        />
                        <MiniChart
                            values={valueData}
                            label={`Messdaten (Einheit)`}
                        />
                    </div>

                ) : (
                    <p>{routes.deviceCard.noDataAvailable[language] || "No measurement data available."}</p>
                )}
            </div>
        </div>
    );
}

export default DeviceDetails;
