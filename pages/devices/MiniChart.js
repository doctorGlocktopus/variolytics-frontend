import styles from '../../styles/Device.module.css';
import Image from 'next/image';

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} - ${hours}:${minutes} Uhr`;
  };

  const getSvgPath = (gasType) => {
    switch (gasType) {
      case 'N2O':
        return '/assets/svg/n2o.svg';
      case 'CH4':
        return '/assets/svg/ch4.svg';
      case 'CO2':
        return '/assets/svg/co2.svg';
      case 'O2':
        return '/assets/svg/o2.svg';
      case 'Temperature':
          return '/assets/svg/temperature.svg';
      case 'flowRate':
        return '/assets/svg/flowRate.svg';
      default:
        return '/assets/svg/default.svg';
    }
  };

  return (
    <div>
      <div className={styles.latestValuesContainer}>
        <h3>{formatDate(mostRecentValues.date)}</h3>
        <div className={styles.valueCardContainer}>
          <div className={styles.valueCard}>
            <Image src={getSvgPath('N2O')} alt="N2O" className={styles.icon} width={50} height={50} />
            N2O: <br></br>{mostRecentValues.N2O} ppm
          </div>
          <div className={styles.valueCard}>
            <Image src={getSvgPath('CH4')} alt="CH4" className={styles.icon} width={50} height={50} />
            CH4: <br></br>{mostRecentValues.CH4} ppm
          </div>
          <div className={styles.valueCard}>
            <Image src={getSvgPath('CO2')} alt="CO2" className={styles.icon} width={50} height={50} />
            CO2: <br></br>{mostRecentValues.CO2} Vol. %
          </div>
          <div className={styles.valueCard}>
            <Image src={getSvgPath('O2')} alt="O2" className={styles.icon} width={50} height={50} />
            O2: <br></br>{mostRecentValues.O2} Vol. %
          </div>
          <div className={styles.valueCard}>
            <Image src={getSvgPath('Temperature')} alt="Temperature" className={styles.icon} width={50} height={50} />
            Temperatur: <br></br>{mostRecentValues.temperature} °C
          </div>
          <div className={styles.valueCard}>
            <Image src={getSvgPath('flowRate')} alt="flowRate" className={styles.icon} width={50} height={50} />
            FlowRate: <br></br>{mostRecentValues.flowRate} L/min
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniChart;
