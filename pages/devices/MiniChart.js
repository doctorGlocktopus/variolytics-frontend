import styles from '../../styles/Device.module.css';

function MiniChart({ values }) {

  const latestValues = values.reduce((acc, item) => {
    const date = new Date(item.date);
    const key = item.key;

    if (!acc[key] || date > new Date(acc[key].date)) {
      acc[key] = {
        date: item.date,
        N2O: item.value.N2O?.value || 0,
        CH4: item.value.CH4?.value || 0,
        CO2: item.value.CO2?.value || 0,
        O2: item.value.O2?.value || 0,
        temperature: item.temperature,
        flowRate: item.flowRate,
      };
    }
    return acc;
  }, {});

  const mostRecentValues = Object.values(latestValues).pop();

  return (
    <div>
      <div className={styles.tabContainer}>

      </div>
        <div className={styles.latestValues}>
          <h3>Aktuelle Werte</h3>
          <ul>
            <li>N2O: {mostRecentValues.N2O} ppm</li>
            <li>CH4: {mostRecentValues.CH4} ppm</li>
            <li>CO2: {mostRecentValues.CO2} Vol. %</li>
            <li>O2: {mostRecentValues.O2} Vol. %</li>
            <li>Temperatur: {mostRecentValues.temperature} °C</li>
            <li>FlowRate: {mostRecentValues.flowRate} L/min</li>
          </ul>
        </div>
    </div>
  );
}

export default MiniChart;
