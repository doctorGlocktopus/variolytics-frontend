import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/utils.js';

function CustomBarChart({ values, label }) {
  const data = values.map((item) => ({
    key: `${item.Date}-${item.value}-${item}`,
    date: item.date,
    value: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date"
          tickFormatter={(isoDateString) => formatDate(isoDateString)}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(isoDateString) => formatDate(isoDateString)}
        />
        <Bar dataKey="value" fill="#8884d8" name={label} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CustomBarChart;
