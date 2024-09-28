import styles from '../../styles/Measurements.module.css';
import AppContext from "../../AppContext";
import { useContext } from "react";
import { getCookie } from 'cookies-next';
import { getColor } from '../../utils/utils.js';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';
import routes from '../../locales/measurements.js'; 

function DeviceDetails({ device }) {
    const { currentUser, language } = useContext(AppContext);
    const dispatch = useDispatch();
    
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
                <h2>{routes.deviceDetails.title[language]} {device.MeasureId}</h2>
                <h2>{routes.deviceDetails.deviceId[language]} {device.DeviceId}</h2>
                <h3>{routes.deviceDetails.deviceName[language]} {device.DeviceName}</h3>
                {currentUser?.admin && (
                    <div onClick={() => delMeasure(device.MeasureId)}>
                        <button className={styles.deleteButton}>{routes.deviceDetails.deleteButton[language]}</button>
                    </div>
                )}
                <table className={styles.deviceTable}>
                    <thead>
                        <tr>
                            <th>{routes.deviceDetails.tableHeaders.measurement[language]}</th>
                            <th>{routes.deviceDetails.tableHeaders.value[language]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.n2o[language]}</td>
                            <td style={{ color: getColor(device.N2O, 50) }}>{device.N2O}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.ch4[language]}</td>
                            <td style={{ color: getColor(device.CH4, 100) }}>{device.CH4}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.co2[language]}</td>
                            <td style={{ color: getColor(device.CO2, 20) }}>{device.CO2}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.o2[language]}</td>
                            <td style={{ color: getColor(device.O2, 100) }}>{device.O2}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.flowRate[language]}</td>
                            <td style={{ color: getColor(device.FlowRate, 5000) }}>{device.FlowRate}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.temperature[language]}</td>
                            <td style={{ color: getColor(device.Temperature, 100) }}>{device.Temperature}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.status[language]}</td>
                            <td>{device.IsActive ? routes.deviceDetails.active[language] : routes.deviceDetails.inactive[language]}</td>
                        </tr>
                        <tr>
                            <td>{routes.deviceDetails.tableHeaders.date[language]}</td>
                            <td>{new Date(device.Date).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <nav className={styles.container}>
                <h2>{routes.deviceDetails.notFound[language]}</h2> {/* Gerät existiert nicht mehr */}
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
