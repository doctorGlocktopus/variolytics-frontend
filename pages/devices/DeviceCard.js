import { useEffect, useRef, useState } from "react";
import CustomBarChart from './CustomBarChart';
import styles from '../../styles/Device.module.css';

function DeviceCard({ device, onFetchData }) {
    const [selectedChart, setSelectedChart] = useState('N2O');
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('2024-09-01');
    const [endDate, setEndDate] = useState('2024-09-25');
    const deviceRef = useRef();

    const fetchMeasurements = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/api/devices/${device.DeviceId}?selectedChart=${selectedChart}&startDate=${startDate}&endDate=${endDate}`);
            
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Messdaten: ' + response.statusText);
            }
    
            const data = await response.json();
    
            if (data.measurements) {
                setMeasurements(data.measurements);
            } else {
                setMeasurements([]);
            }
            onFetchData();
        } catch (error) {
            console.error('Fehler beim Abrufen der Messdaten:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchMeasurements();
                observer.unobserve(deviceRef.current);
            }
        });

        if (deviceRef.current) {
            observer.observe(deviceRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [deviceRef]);

    useEffect(() => {
        fetchMeasurements();
    }, [selectedChart, startDate, endDate]);

    const valueData = measurements.map(measurement => ({
        key: measurement.key,
        date: measurement.date,
        value: parseFloat(measurement.value) || 0,
        temperature: parseFloat(measurement.temperature) || 0,
        flowRate: parseFloat(measurement.flowRate) || 0,
    }));

    return (
        <div ref={deviceRef} className={styles.deviceCard}>
            <h3>{device.DeviceName}</h3>
            <p>Geräte ID: {device.DeviceId}</p>
            <select onChange={(e) => setSelectedChart(e.target.value)} value={selectedChart}>
                <option value="N2O">N2O (ppm)</option>
                <option value="CH4">CH4 (ppm)</option>
                <option value="CO2">CO2 (Vol.%)</option>
                <option value="O2">O2 (Vol.%)</option>
            </select>

            <div>
                <label>Startdatum:</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                />
                <label>Enddatum:</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                />
            </div>

            {loading ? (
                <p>Lade Messdaten...</p>
            ) : (
                measurements.length > 0 ? (
                    <CustomBarChart
                        key={valueData.key} 
                        values={valueData} 
                        label={`${selectedChart} (Einheit)`} 
                    />
                ) : (
                    <p>Keine Messdaten verfügbar</p>
                )
            )}
        </div>
    );
}

export default DeviceCard;
