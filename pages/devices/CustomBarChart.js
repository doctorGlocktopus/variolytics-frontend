import styles from '../../styles/Device.module.css';

function CustomBarChart({ labels, values, label }) {
    const maxValue = Math.max(...values);

    const parseDate = (label) => {
        const parts = label.split('.');
        if (parts.length !== 3) return null; 

        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];

        return new Date(`${year}-${month}-${day}`);
    };

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
                    const date = parseDate(label);
                    
                    if (!date || isNaN(date.getTime())) {
                        console.error(`Invalid date: ${label}`);
                        return null;
                    }

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
