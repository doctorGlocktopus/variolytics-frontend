import styles from '../../styles/Measurements.module.css';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { getCookie } from 'cookies-next';
import { useContext, useEffect, useState } from "react";
import { getColor } from '../../utils/utils.js';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';

function ListPageComponent() {
    const { currentUser } = useContext(AppContext);
    const router = useRouter();
    const { page: pageQuery } = router.query;
    const [devices, setDevices] = useState([]);
    const [totalDevices, setTotalDevices] = useState(0);
    const limit = 5;
    const page = parseInt(pageQuery) || 1;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('Date');
    const [sortDirection, setSortDirection] = useState('desc');
    const dispatch = useDispatch();

    const fetchDevices = async () => {
        const response = await fetch(`/api/measurements?page=${page}&limit=${limit}&sortBy=${sortColumn}&sortDirection=${sortDirection}&searchTerm=${searchTerm}`);
        const data = await response.json();
        setDevices(data.devices);
        setTotalDevices(data.total);
    };

    useEffect(() => {
        fetchDevices();
    }, [page, sortColumn, sortDirection, searchTerm]);

    const delMeasure = async (MeasureId) => {
        let jwt = getCookie("auth");
        let urlID = `/api/measurements/${MeasureId}`;

        const response = await fetch(urlID, {
            method: 'DELETE',
            headers: {
                auth: jwt,
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (response.ok) {
            const newNotification = {
                id: Date.now(),
                message: `Der Messung ${MeasureId} wurde entfernt!`,
            };
            dispatch(addNotification(newNotification));

            fetchDevices();
        }
    };

    const sortDevices = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
        router.push(`/measurements?page=1&sortBy=${column}&sortDirection=${direction}&searchTerm=${searchTerm}`);
    };

    const handleMeasureClick = (MeasureId) => {
        router.push(`/measurements/${MeasureId}`);
    };

    const totalPages = Math.ceil(totalDevices / limit);

    const changePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; 
        router.push(`/measurements?page=${newPage}&sortBy=${sortColumn}&sortDirection=${sortDirection}&searchTerm=${searchTerm}`);
    };

    return (
        <div className={styles.container}>
            <input 
                type="text" 
                placeholder="Suche..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className={styles.searchInput}
            />
            <div className={styles.pagination}>
                <button onClick={() => changePage(page - 1)} disabled={page === 1}>Vorherige</button>
                <span>Seite {page} von {totalPages}</span>
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages}>Nächste</button>
            </div>
            <table className={styles.deviceTable}>
                <thead>
                    <tr>
                        <th onClick={() => sortDevices('MeasureId')}>Messungs ID</th>
                        <th onClick={() => sortDevices('DeviceId')}>Geräte ID</th>
                        <th onClick={() => sortDevices('DeviceName')}>Gerätename</th>
                        <th onClick={() => sortDevices('N2O')}>N2O (ppm)</th>
                        <th onClick={() => sortDevices('CH4')}>CH4 (ppm)</th>
                        <th onClick={() => sortDevices('CO2')}>CO2 (Vol.%))</th>
                        <th onClick={() => sortDevices('O2')}>O2 (Vol.%))</th>
                        <th onClick={() => sortDevices('FlowRate')}>Durchflussrate (m³/h)</th>
                        <th onClick={() => sortDevices('Temperature')}>Temperatur (°C)</th>
                        <th onClick={() => sortDevices('Date')}>Datum</th>
                        <th onClick={() => sortDevices('IsActive')}>Status</th>
                        {currentUser?.admin && <th>Aktionen</th>}
                    </tr>
                </thead>
                <tbody>
                    {devices.map(device => (
                        <tr key={device.MeasureId} onClick={() => handleMeasureClick(device.MeasureId)} className={styles.cursorPointer}>
                            <td>{device.MeasureId}</td>
                            <td>{device.DeviceId}</td>
                            <td>{device.DeviceName}</td>
                            <td style={{ color: getColor(device.N2O, 50) }}>{device.N2O}</td>
                            <td style={{ color: getColor(device.CH4, 100) }}>{device.CH4}</td>
                            <td style={{ color: getColor(device.CO2, 20) }}>{device.CO2}</td>
                            <td style={{ color: getColor(device.O2, 100) }}>{device.O2}</td>
                            <td style={{ color: getColor(device.FlowRate, 5000) }}>{device.FlowRate}</td>
                            <td style={{ color: getColor(device.Temperature, 100) }}>{device.Temperature}</td>
                            <td>{new Date(device.Date).toLocaleString()}</td>
                            <td>{device.IsActive ? "Aktiv" : "Inaktiv"}</td>
                            {currentUser?.admin && (
                                <td>
                                    <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); delMeasure(device.MeasureId); }}>Löschen</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListPageComponent;
