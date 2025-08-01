import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts';
import './StatusTimelineChart.css';

const durationToHours = (timeSpent) => {
  const match = timeSpent.match(/(\d+)d (\d+)h (\d+)m/);
  if (!match) return 0;
  const [, d, h, m] = match.map(Number);
  return d * 24 + h + m / 60;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { status, timeSpent, assignee } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div><strong>🛠 Status:</strong> {status}</div>
        <div><strong>⏱ Time Spent:</strong> {timeSpent}</div>
        <div><strong>👤 Assignee:</strong> {assignee}</div>
      </div>
    );
  }
  return null;
};

const StatusTimelineChart = ({ statusData }) => {
  const chartData = statusData.map(item => ({
    status: item.status,
    timeSpent: item.timeSpent,
    assignee: item.assignee,
    hours: durationToHours(item.timeSpent),
  }));

  return (
    <div className="timeline-chart-container">
      <div className="timeline-chart-card">
        <h4 className="timeline-chart-title">📊 Workflow Status Duration Chart</h4>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 40, left: 100, bottom: 10 }}
            barCategoryGap={24}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8884d8" />
                <stop offset="100%" stopColor="#82ca9d" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              label={{
                value: 'Total Hours',
                position: 'insideBottomRight',
                offset: -5,
              }}
            />
            <YAxis
              type="category"
              dataKey="status"
              tick={{ fontSize: 14 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="hours"
              fill="url(#barGradient)"
              radius={[0, 10, 10, 0]}
              animationDuration={1200}
            >
              <LabelList
                dataKey="assignee"
                position="right"
                className="bar-label"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusTimelineChart;
