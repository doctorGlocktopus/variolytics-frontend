import styles from '../../styles/Device.module.css';

function CustomBarChart({ labels, values, label }) {
    const maxValue = Math.max(...values);

    return (
        <div>
            <h4>{label}</h4>
            <div className={styles.chart}>
                {values.map((value, index) => (
                    <div key={index} className={styles.chartBar} style={{ height: `${(value / maxValue) * 100}%` }}>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {labels.map((label, index) => {
                const date = new Date(label);

                const dayMonth = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
                const time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
                
                return (
                    <span key={index} style={{ fontSize: '10px' }}>
                        {`${dayMonth}, ${time}`}
                    </span>
                );
            })}
            </div>
        </div>
    );
}

export default CustomBarChart;
