import styles from '../../styles/Device.module.css';
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import DeviceCard from './DeviceCard';

function ListPageComponent() {
    const { currentUser } = useContext(AppContext);
    const [devices, setDevices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/devices?searchTerm=${searchTerm}&page=${page}&limit=10`);
            const data = await response.json();
            
            setDevices(data.devices);
            
            if (data.devices.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Geräte:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [searchTerm, page]);

    return (
        <div className={styles.container}>
            {loading ? (
                <p>Lade Geräte...</p>
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