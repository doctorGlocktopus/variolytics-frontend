import { useEffect, useRef, useState } from "react";
import CustomBarChart from './CustomBarChart';
import styles from '../../styles/Device.module.css';
import { useRouter } from 'next/router';

function DeviceCard({ device, onFetchData }) {
    const [selectedChart, setSelectedChart] = useState('N2O');
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('2024-09-01');
    const [endDate, setEndDate] = useState('2024-09-25');
    const deviceRef = useRef();
    const router = useRouter();
    
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

        console.log(measurement)

        acc.push({
            key: measurement.key,
            date,
            value: selectedChart === 'all' ? value : (measurement.value || 0),
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

    
    const handleMeasureClick = (id) => {
        router.push(`/devices/${id}`);
    };

    return (
        <div ref={deviceRef} className={styles.deviceCard}>
            <div>
                <a className={styles.deviceLink}><h3 onClick={() => handleMeasureClick(device.DeviceId) }>{device.DeviceName}</h3></a>
            </div>

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
