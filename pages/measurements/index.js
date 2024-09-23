import styles from '../../styles/Device.module.css';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { setCookie, getCookie } from 'cookies-next';
import { useContext, useEffect, useState } from "react";
import { getColor } from '../../utils/utils.js';


function delMeasure(MeasureId) {
    let jwt = getCookie("auth");
    let urlID = `/api/measurements/${MeasureId}`;

    fetch(urlID, {
        method: 'DELETE',
        headers: {
            auth: jwt,
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(() => window.location.reload(false));
}

function ListPageComponent() {
    const { currentUser } = useContext(AppContext);
    const router = useRouter();
    const { page: pageQuery } = router.query;
    const [devices, setDevices] = useState([]);
    const [totalDevices, setTotalDevices] = useState(0);
    const limit = 5;
    const page = parseInt(pageQuery) || 1;
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDevices = async () => {
            const response = await fetch(`/api/measurements?page=${page}&limit=${limit}`);
            const data = await response.json();
            setDevices(data.devices);
            setTotalDevices(data.total);
        };
    
        fetchDevices();
    }, [page, searchTerm]);

    const handleMeasureClick = (MeasureId) => {
        router.push(`/measurements/${MeasureId}`);
    };

    const totalPages = Math.ceil(totalDevices / limit);

    const changePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; 
        router.push(`/measurements?page=${newPage}`);
    };


    return (
        <div className={styles.tableContainer}>
            <h2>Geräteliste</h2>
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
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Messungs ID</th>
                        <th>Gerät ID</th>
                        <th>Gerätename</th>
                        <th>N2O (ppm)</th>
                        <th>CH4 (ppm)</th>
                        <th>CO2 (Vol.%))</th>
                        <th>O2 (Vol.%))</th>
                        <th>Durchflussrate (m³/h)</th>
                        <th>Temperatur (°C)</th>
                        <th>Datum</th>
                        <th>Status</th>
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
                                    <button onClick={(e) => { e.stopPropagation(); delMeasure(device.MeasureId); }}>Löschen</button>
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
