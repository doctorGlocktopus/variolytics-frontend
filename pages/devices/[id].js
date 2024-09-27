import styles from '../../styles/Device.module.css';
import AppContext from "../../AppContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import CustomBarChart from './CustomBarChart';
import MiniChart from './MiniChart';

function DeviceDetails() {
    const { currentUser } = useContext(AppContext);
    const dispatch = useDispatch();

    let [device, setDevice] = useState(null);
    const [selectedChart, setSelectedChart] = useState('N2O');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('2024-09-01');
    const [endDate, setEndDate] = useState('2024-09-25');
    const [error, setError] = useState(null);
    const deviceRef = useRef();

    const fetchDeviceDetails = async () => {
        setLoading(true);
        setError(null);
        
        let urlID = `http://localhost:3000/api/devices/${window.location.pathname.split('/').pop()}?isLive=${true}&selectedChart=${selectedChart}&startDate=${startDate}&endDate=${endDate}`;

        try {
            const response = await fetch(urlID);

            if (!response.ok) {
                throw new Error('Gerät nicht gefunden oder Fehler beim Abrufen der Daten.');
            }

            const deviceData = await response.json();
            setDevice(deviceData);

            const newNotification = {
                id: Date.now(),
                message: `Der Messung ${deviceData.measurements._id} wurde entfernt!`,
            };
            dispatch(addNotification(newNotification));

        } catch (error) {
            console.error("Fetch error:", error);
            setError('Fehler beim Laden der Gerätedaten.');
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
        return <p>Lade Gerätedaten...</p>;
    }


    const valueData = device.measurements.measurements.map(item=> {
        return {
            key: item.key,
            date: item.date,
            value: item.value,
            temperature: parseFloat(item.temperature) || 0,
            flowRate: parseFloat(item.flowRate) || 0,
        };

    })

    device = device.measurements._id

    const exportData = async () => {
        try {
            const response = await fetch(`/api/devices/export?deviceId=${device.DeviceId}&selectedChart=${selectedChart}&startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error('Fehler beim Export der Daten: ' + response.statusText);
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
            console.error('Fehler beim Export der Daten:', error);
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

    console.log(valueData)
    
    return (
        <div ref={deviceRef} className={styles.deviceCard}>
            <div className={styles.container} ref={deviceRef}>
                <h2>Gerät Nr. {device.DeviceId}</h2>
                <h3>Gerätename: {device.DeviceName}</h3>

                <div className={styles.tabContainer}>
                    <button onClick={() => setSelectedChart('all')} className={selectedChart === 'all' ? styles.activeTab : ''}>Alle (ppm)</button>
                    <button onClick={() => setSelectedChart('N2O')} className={selectedChart === 'N2O' ? styles.activeTab : ''}>N2O (ppm)</button>
                    <button onClick={() => setSelectedChart('CH4')} className={selectedChart === 'CH4' ? styles.activeTab : ''}>CH4 (ppm)</button>
                    <button onClick={() => setSelectedChart('CO2')} className={selectedChart === 'CO2' ? styles.activeTab : ''}>CO2 (Vol.%)</button>
                    <button onClick={() => setSelectedChart('O2')} className={selectedChart === 'O2' ? styles.activeTab : ''}>O2 (Vol.%)</button>

                    <button onClick={() => navigateStartDateWeeks(-1)}>&lt;</button>
                    <div className={styles.flexX}>
                        <label>Startdatum:</label>
                        <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                    </div>
                    <button onClick={() => navigateStartDateWeeks(1)}>&gt;</button>

                    <button onClick={() => navigateEndDateWeeks(-1)}>&lt;</button>
                    <div className={styles.flexX}>
                        <label>Enddatum:</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>
                    <button onClick={() => navigateEndDateWeeks(1)}>&gt;</button>
                    <button onClick={exportData} className={styles.downloadButton}>Daten herunterladen</button>
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
                    <p>Keine Messdaten verfügbar</p>
                )}
            </div>
        </div>
    );
    
}

export default DeviceDetails;
