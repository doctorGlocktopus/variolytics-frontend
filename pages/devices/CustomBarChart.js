import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { formatDate } from '../../utils/utils.js';
import styles from '../../styles/Device.module.css';

function CustomBarChart({ values }) {
  const [chartType, setChartType] = useState('line');

  const data = values.map((item) => {
    const date = new Date(item.date);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}`;

    return {
      key: item.key,
      date: formattedDate,
      N2O: item.value.N2O?.value || 0,
      CH4: item.value.CH4?.value || 0,
      CO2: item.value.CO2?.value || 0,
      O2: item.value.O2?.value || 0,
      temperature: item.temperature,
      flowRate: item.flowRate,
    };
  }).filter(item => (
    item.N2O > 0 || item.CH4 > 0 || item.CO2 > 0 || item.O2 > 0 || item.temperature > 0 || item.flowRate > 0
  ));

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'bar' ? 'line' : 'bar'));
  };

  return (
    <div>
      <div className={styles.tabContainer}>
        <button onClick={toggleChartType}>
          {chartType === 'bar' ? 'Zu Liniendiagramm wechseln' : 'Zu Balkendiagramm wechseln'}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={(isoDateString) => formatDate(isoDateString)}
            />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              labelFormatter={(isoDateString) => formatDate(isoDateString)}
              formatter={(value, name) => {
                if (value === 0) return [null, name];
                let displayValue = value;
                if (name === 'N2O') {
                  displayValue = `N2O: ${value} ppm`;
                } else if (name === 'temperature') {
                  displayValue = `Temperatur: ${value} °C`;
                } else if (name === 'flowRate') {
                  displayValue = `FlowRate: ${value} L/min`;
                }
                return [displayValue, name];
              }}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            {data.some(item => item.N2O > 0) && (
              <Bar dataKey="N2O" fill="#8884d8" name="N2O (ppm)" yAxisId="left" />
            )}
            {data.some(item => item.CH4 > 0) && (
              <Bar dataKey="CH4" fill="#82ca9d" name="CH4 (ppm)" yAxisId="left" />
            )}
            {data.some(item => item.CO2 > 0) && (
              <Bar dataKey="CO2" fill="#ffc658" name="CO2 (Vol. %)" yAxisId="left" />
            )}
            {data.some(item => item.O2 > 0) && (
              <Bar dataKey="O2" fill="#ff8042" name="O2 (Vol. %)" yAxisId="left" />
            )}
            {data.some(item => item.temperature > 0) && (
              <Bar dataKey="temperature" fill="#ffbb28" name="Temperatur" yAxisId="right" />
            )}
            {data.some(item => item.flowRate > 0) && (
              <Bar dataKey="flowRate" fill="#00c49f" name="FlowRate" yAxisId="right" />
            )}
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
            />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              labelFormatter={(isoDateString) => formatDate(isoDateString)}
              formatter={(value, name) => {
                if (value === 0) return [null, name];
                let displayValue = value;
                if (name === 'N2O') {
                  displayValue = `N2O: ${value} ppm`;
                } else if (name === 'temperature') {
                  displayValue = `Temperatur: ${value} °C`;
                } else if (name === 'flowRate') {
                  displayValue = `FlowRate: ${value} L/min`;
                }
                return [displayValue, name];
              }}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            {data.some(item => item.N2O > 0) && (
              <Line type="monotone" dataKey="N2O" stroke="#8884d8" name="N2O (ppm)" yAxisId="left" />
            )}
            {data.some(item => item.CH4 > 0) && (
              <Line type="monotone" dataKey="CH4" stroke="#82ca9d" name="CH4 (ppm)" yAxisId="left" />
            )}
            {data.some(item => item.CO2 > 0) && (
              <Line type="monotone" dataKey="CO2" stroke="#ffc658" name="CO2 (Vol. %)" yAxisId="left" />
            )}
            {data.some(item => item.O2 > 0) && (
              <Line type="monotone" dataKey="O2" stroke="#ff8042" name="O2 (Vol. %)" yAxisId="left" />
            )}
            {data.some(item => item.temperature > 0) && (
              <Line type="monotone" dataKey="temperature" stroke="#ffbb28" name="Temperatur" yAxisId="right" />
            )}
            {data.some(item => item.flowRate > 0) && (
              <Line type="monotone" dataKey="flowRate" stroke="#00c49f" name="FlowRate" yAxisId="right" />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
