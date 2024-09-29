import styles from '../../styles/Measurements.module.css';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { useContext, useEffect, useState } from "react";
import { getColor } from '../../utils/utils.js';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';
import { getCookie } from 'cookies-next';
import routes from '../../locales/measurements.js'; 

function ListPageComponent() {
    const { currentUser, language } = useContext(AppContext);
    const router = useRouter();
    const { page: pageQuery } = router.query;
    const [devices, setDevices] = useState([]);
    const [totalDevices, setTotalDevices] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 5;
    const page = parseInt(pageQuery) || 1;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('Date');
    const [sortDirection, setSortDirection] = useState('desc');
    const dispatch = useDispatch();

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/measurements?page=${page}&limit=${limit}&sortBy=${sortColumn}&sortDirection=${sortDirection}&searchTerm=${searchTerm}`);
            const data = await response.json();
            if (response.ok) {
                setDevices(data.devices || []);
                setTotalDevices(data.total);
            } else {
                console.error('Error fetching devices:', data.error);
                setDevices([]); 
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
            setDevices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [page, sortColumn, sortDirection, searchTerm]);

    const delMeasure = async (measureId) => {
        let jwt = getCookie("auth");
        let urlID = `/api/measurements/${measureId}`;
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
                message: `Die Messung ${measureId} wurde entfernt!`,
            };
            dispatch(addNotification(newNotification));
            fetchDevices();
        } else {
            const errorNotification = {
                id: Date.now(),
                message: `Fehler beim Entfernen der Messung ${measureId}.`,
            };
            dispatch(addNotification(errorNotification));
        }
    };

    const sortDevices = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
        router.push(`/measurements?page=1&sortBy=${column}&sortDirection=${direction}&searchTerm=${searchTerm}`);
    };

    const handleMeasureClick = (measureId) => {
        router.push(`/measurements/${measureId}`);
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
                placeholder={routes.measurements.searchPlaceholder[language]}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className={styles.searchInput}
            />
            <div className={styles.pagination}>
                <button onClick={() => changePage(page - 1)} disabled={page === 1}>{routes.measurements.previous[language]}</button>
                <span>Seite {page} von {totalPages}</span>
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages}>{routes.measurements.next[language]}</button>
            </div>

            {loading ? (
                <div className={styles.loader}></div>
            ) : (
                <table className={styles.deviceTable}>
                    <thead>
                        <tr>
                            <th onClick={() => sortDevices('MeasureId')}>{routes.measurements.columns.measureId[language]}</th>
                            <th onClick={() => sortDevices('DeviceId')}>{routes.measurements.columns.deviceId[language]}</th>
                            <th onClick={() => sortDevices('DeviceName')}>{routes.measurements.columns.deviceName[language]}</th>
                            <th onClick={() => sortDevices('N2O')}>{routes.measurements.columns.n2o[language]}</th>
                            <th onClick={() => sortDevices('CH4')}>{routes.measurements.columns.ch4[language]}</th>
                            <th onClick={() => sortDevices('CO2')}>{routes.measurements.columns.co2[language]}</th>
                            <th onClick={() => sortDevices('O2')}>{routes.measurements.columns.o2[language]}</th>
                            <th onClick={() => sortDevices('FlowRate')}>{routes.measurements.columns.flowRate[language]}</th>
                            <th onClick={() => sortDevices('Temperature')}>{routes.measurements.columns.temperature[language]}</th>
                            <th onClick={() => sortDevices('Date')}>{routes.measurements.columns.date[language]}</th>
                            <th onClick={() => sortDevices('IsActive')}>{routes.measurements.columns.status[language]}</th>
                            {currentUser?.admin && <th>{routes.measurements.columns.actions[language]}</th>}
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
                                <td>{device.IsActive ? routes.measurements.columns.active[language] : routes.measurements.columns.inactive[language]}</td>
                                {currentUser?.admin && (
                                    <td>
                                        <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); delMeasure(device.MeasureId); }}>{routes.measurements.columns.delete[language]}</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ListPageComponent;
