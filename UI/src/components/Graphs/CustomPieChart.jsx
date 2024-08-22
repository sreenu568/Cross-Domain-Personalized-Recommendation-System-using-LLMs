import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomPieChart = ({ data, detailedItems, setSelectedItem, setHoveredItem }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5555', '#6a5acd'];

  // Filter out data with zero value
  const filteredData = data.filter(entry => entry.value > 0);

  const totalValue = filteredData.reduce((sum, entry) => sum + entry.value, 0);

  const renderLabel = ({ name, value }) => {
    const percentage = ((value / totalValue) * 100).toFixed(2);
    return `${name} - ${percentage}%`;
  };

  const handleClick = (entry) => {
    setSelectedItem(entry.name); // Set the selected item for the sidebar
  };

  const handleMouseEnter = (entry) => {
    setHoveredItem(entry.name); // Set the hovered item for the sidebar
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={handleMouseEnter} // Handle mouse enter events on pie slices
          onClick={handleClick} // Handle clicks on pie slices
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
