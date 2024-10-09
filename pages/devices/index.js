import styles from '../../styles/Device.module.css';
import { useEffect, useState } from "react";
import DeviceCard from './DeviceCard';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';

function ListPageComponent() {
    const [devices, setDevices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('Device ');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/devices?searchTerm=${searchTerm}&page=${page}&limit=10`);
            const data = await response.json();
            
            setDevices(data.devices);

        } catch (error) {
            const newNotification = {
                id: Date.now(),
                message: `Fehler beim Abrufen der Geräte:`,
            };
            dispatch(addNotification(newNotification));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [searchTerm, page]);

    return (
        <div className={styles.container}>
            <input 
                type="text" 
                placeholder="Device X"
                value={searchTerm} 
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                }} 
                className={styles.searchInput}
            />
            {loading ? (
                <div className={styles.loader}></div>
            ) : (
                <div className={styles.deviceGrid}>
                    {devices.map(device => (
                        <DeviceCard key={device.DeviceId} device={device} onFetchData={() => {}} />
                    ))}
                </div>
            )}
        </div>
    );
    
}

export default ListPageComponent;
