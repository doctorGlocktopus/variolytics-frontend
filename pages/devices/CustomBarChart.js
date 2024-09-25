import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { formatDate } from '../../utils/utils.js';

function CustomBarChart({ values, label }) {
  const [chartType, setChartType] = useState('bar');

  const data = values.map((item) => ({
    key: `${item.Date}-${item.value}-${item.temperature}-${item.flowRate}`,
    date: item.Date,
    value: item.value,
    temperature: item.temperature,
    flowRate: item.flowRate,
  }));

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
                if (name === 'value') {
                  return [`${label}: ${value}`, 'Messwert'];
                } else if (name === 'temperature') {
                  return [`Temperatur: ${value} °C`, 'Temperatur'];
                } else if (name === 'flowRate') {
                  return [`FlowRate: ${value} L/min`, 'FlowRate'];
                }
                return value;
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
              tickFormatter={(isoDateString) => formatDate(isoDateString)}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(isoDateString) => formatDate(isoDateString)}
              formatter={(value, name) => {
                if (name === 'value') {
                  return [`${label}: ${value}`, 'Messwert'];
                } else if (name === 'temperature') {
                  return [`Temperatur: ${value} °C`, 'Temperatur'];
                } else if (name === 'flowRate') {
                  return [`FlowRate: ${value} L/min`, 'FlowRate'];
                }
                return value;
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
