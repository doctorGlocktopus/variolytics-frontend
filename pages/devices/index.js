import styles from '../../styles/Device.module.css';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { useContext, useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ListPageComponent() {
    const { currentUser } = useContext(AppContext);
    const router = useRouter();
    const [devices, setDevices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/devices?searchTerm=${searchTerm}`);
            const data = await response.json();
            setDevices(data.devices);
        } catch (error) {
            console.error('Fehler beim Abrufen der Geräte:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchDevices();
        }, 300); // Debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    return (
        <div className={styles.container}>
            <h2>Geräte</h2>
            {loading ? (
                <p>Lade Geräte...</p>
            ) : (
                <div className={styles.deviceGrid}>
                    {devices.map(device => {
                        const measurements = device.measurements || [];

                        const chartData = {
                            labels: measurements.map(measurement => new Date(measurement.Date).toLocaleDateString()),
                            datasets: [
                                {
                                    label: 'N2O (ppm)',
                                    data: measurements.map(measurement => measurement.N2O),
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                    label: 'CH4 (ppm)',
                                    data: measurements.map(measurement => measurement.CH4),
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                },
                                {
                                    label: 'CO2 (Vol.%)',
                                    data: measurements.map(measurement => measurement.CO2),
                                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                },
                                {
                                    label: 'O2 (Vol.%)',
                                    data: measurements.map(measurement => measurement.O2),
                                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                                },
                            ],
                        };

                        const chartOptions = {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: `Messdaten für ${device.DeviceName}`,
                                },
                            },
                        };

                        return (
                            <div key={device.DeviceId} className={styles.deviceCard}>
                                <h3>{device.DeviceName}</h3>
                                <p>Geräte ID: {device.DeviceId}</p>
                                {measurements.length > 0 ? (
                                    <Bar data={chartData} options={chartOptions} />
                                ) : (
                                    <p>Keine Messdaten verfügbar</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ListPageComponent;
