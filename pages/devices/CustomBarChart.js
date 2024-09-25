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
                {labels.map((label, index) => (
                    <span key={index} style={{ fontSize: '10px' }}>{label}</span>
                ))}
            </div>
        </div>
    );
}

export default CustomBarChart;
