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

function CustomBarChart({ values, label }) {
  const [chartType, setChartType] = useState('bar');

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
      value: item.value,
      temperature: item.temperature,
      flowRate: item.flowRate,
    };
  });

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'bar' ? 'line' : 'bar'));
  };


  return (
    <div>
      <button onClick={toggleChartType}>
        {chartType === 'bar' ? 'Zu Liniendiagramm wechseln' : 'Zu Balkendiagramm wechseln'}
      </button>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={(isoDateString) => formatDate(isoDateString)}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(isoDateString) => formatDate(isoDateString)}
              formatter={(value, name) => {
                let displayValue = value;
                if (name === 'value') {
                  displayValue = `${label}: ${value}`;
                } else if (name === 'temperature') {
                  displayValue = `Temperatur: ${value} °C`;
                } else if (name === 'flowRate') {
                  displayValue = `FlowRate: ${value} L/min`;
                }
                return [displayValue, name];
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar dataKey="value" fill="#8884d8" name={label} />
            <Bar dataKey="temperature" fill="#82ca9d" name="Temperatur" />
            <Bar dataKey="flowRate" fill="#ffc658" name="FlowRate" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(isoDateString) => formatDate(isoDateString)}
              formatter={(value, name) => {
                let displayValue = value;
                if (name === 'value') {
                  displayValue = `${label}: ${value}`;
                } else if (name === 'temperature') {
                  displayValue = `Temperatur: ${value} °C`;
                } else if (name === 'flowRate') {
                  displayValue = `FlowRate: ${value} L/min`;
                }
                return [displayValue, name];
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" name={label} />
            <Line type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperatur" />
            <Line type="monotone" dataKey="flowRate" stroke="#ffc658" name="FlowRate" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
