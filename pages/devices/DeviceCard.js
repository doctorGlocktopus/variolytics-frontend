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
            setMeasurements(data.measurements || []);
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

    const valueData = measurements.reduce((acc, measurement) => {
        const { date, value, temperature, flowRate } = measurement;
        acc.push({
            key: measurement.key,
            date,
            value: selectedChart === 'all' ? value : (measurement[selectedChart] || 0),
            temperature: parseFloat(temperature) || 0,
            flowRate: parseFloat(flowRate) || 0,
        });
        return acc;
    }, []);

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
            <h3>{device.DeviceName}</h3> 

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
            </div>

            {loading ? (
                <p>Lade Messdaten...</p>
            ) : (
                valueData.length > 0 ? (
                    <CustomBarChart
                        values={valueData} 
                        label={`Messdaten (Einheit)`} 
                    />
                ) : (
                    <p>Keine Messdaten verfügbar</p>
                )
            )}
        </div>
    );
}

export default DeviceCard;
