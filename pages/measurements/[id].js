import styles from '../../styles/Measurements.module.css';
import AppContext from "../../AppContext";
import { useContext } from "react";
import { getCookie } from 'cookies-next';
import { getColor } from '../../utils/utils.js';
import { useDispatch } from 'react-redux';

function DeviceDetails({ device }) {
    const { currentUser } = useContext(AppContext);
    const dispatch = useDispatch(); // Dispatch zur Benachrichtigung

    const delMeasure = async (MeasureId) => {
        let jwt = getCookie("auth");
        let urlID = `/api/measurements/${MeasureId}`;

        await fetch(urlID, {
            method: 'DELETE',
            headers: {
                auth: jwt,
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(() => {
            const newNotification = {
                id: Date.now(),
                message: `Die Messung ${MeasureId} wurde entfernt!`,
            };
            dispatch(addNotification(newNotification));
            window.location.reload(false);
        });
    };

    if (device?.MeasureId) {
        return (
            <div className={styles.container}>
                <h2>Messungsnummer Nr. {device.MeasureId}</h2>
                <h2>Gerät Nr. {device.DeviceId}</h2>
                <h3>Gerätename: {device.DeviceName}</h3>
                {currentUser?.admin && (
                    <div onClick={() => delMeasure(device.MeasureId)}>
                        <button className={styles.deleteButton}>Messung löschen</button>
                    </div>
                )}
                <table className={styles.deviceTable}>
                    <thead>
                        <tr>
                            <th>Messwert</th>
                            <th>Wert</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>N2O (ppm)</td>
                            <td style={{ color: getColor(device.N2O, 50) }}>{device.N2O}</td>
                        </tr>
                        <tr>
                            <td>CH4 (ppm)</td>
                            <td style={{ color: getColor(device.CH4, 100) }}>{device.CH4}</td>
                        </tr>
                        <tr>
                            <td>CO2 (Vol.%):</td>
                            <td style={{ color: getColor(device.CO2, 20) }}>{device.CO2}</td>
                        </tr>
                        <tr>
                            <td>O2 (Vol.%):</td>
                            <td style={{ color: getColor(device.O2, 100) }}>{device.O2}</td>
                        </tr>
                        <tr>
                            <td>Durchflussrate (m³/h):</td>
                            <td style={{ color: getColor(device.FlowRate, 5000) }}>{device.FlowRate}</td>
                        </tr>
                        <tr>
                            <td>Temperatur (°C):</td>
                            <td style={{ color: getColor(device.Temperature, 100) }}>{device.Temperature}</td>
                        </tr>
                        <tr>
                            <td>Status:</td>
                            <td>{device.IsActive ? "Aktiv" : "Inaktiv"}</td>
                        </tr>
                        <tr>
                            <td>Datum:</td>
                            <td>{new Date(device.Date).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <nav className={styles.container}>
                <h2>Das Gerät existiert nicht mehr</h2>
            </nav>
        );
    }
}

export default DeviceDetails;

export async function getServerSideProps(ctx) {
    const jwt = getCookie('auth', { req: ctx.req, res: ctx.res });

    if (!jwt) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    let urlID = `http://localhost:3000/api/measurements/${ctx.params.id}`;

    try {
        const response = await fetch(urlID, {
            headers: {
                auth: jwt,
            },
        });

        if (!response.ok) {
            return {
                notFound: true,
            };
        }

        const device = await response.json();
        
        return { props: { device } };

    } catch (error) {
        console.error("Fetch error:", error);
        return { props: { device: null } };
    }
}
