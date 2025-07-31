import React, { useEffect, useState } from 'react';
import HeatMap from 'react-heatmap-grid'; // ✅ Keep only this one

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';

import './IssueChart.css'; // ✅ Keep your CSS animation file

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FF4444'];

const IssueChart = ({ data, onBack }) => {
  const [animateHeat, setAnimateHeat] = useState(false);

  useEffect(() => {
    setAnimateHeat(true);
  }, []);

  const xLabels = [...new Set(data.map(i => i.fields.project?.name || 'Unknown'))];
  const yLabels = [...new Set(data.map(i => i.fields.assignee?.displayName || 'Unassigned'))];

  const heatData = yLabels.map(assignee =>
    xLabels.map(project =>
      data.filter(
        i =>
          (i.fields.assignee?.displayName || 'Unassigned') === assignee &&
          (i.fields.project?.name || 'Unknown') === project
      ).length
    )
  );

  const lineData = Object.entries(
    data.reduce((acc, issue) => {
      const date = new Date(issue.fields.created).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  const pieData = Object.entries(
    data.reduce((acc, issue) => {
      const status = issue.fields.status?.name || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={onBack} className="back-btn">← Back to Table</button>
      <h3>📊 Issue Visualizations</h3>

      {/* Line Chart */}
      <div style={{ height: 300, marginTop: 20 }}>
        <h4>📈 Issues Created Over Time</h4>
        <ResponsiveContainer>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={{ height: 300, marginTop: 40 }}>
        <h4>🥧 Issues by Status</h4>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
              animationDuration={1000}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div style={{ marginTop: 40 }}>
        <h4>🔥 Heatmap: Issues by Assignee vs Project</h4>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={heatData}
            squares
            height={45}
            cellStyle={(background, value) => ({
              background: `rgba(0, 123, 255, ${Math.min(value / 10, 1)})`,
              fontSize: '14px',
              color: value > 5 ? '#fff' : '#000',
              transition: 'background 0.3s ease'
            })}
            cellRender={value => value !== 0 ? value : ''}
          />
        </div>
      </div>
    </div>
  );
};

export default IssueChart;
