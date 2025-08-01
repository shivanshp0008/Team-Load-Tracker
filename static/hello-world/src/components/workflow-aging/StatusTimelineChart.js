import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import { parseISO, differenceInMinutes } from 'date-fns';

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
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
        <strong>{status}</strong><br />
        ⏱️ <b>{timeSpent}</b><br />
        👤 {assignee}
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
    hours: durationToHours(item.timeSpent)
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 40, left: 80, bottom: 20 }}
        >
          <XAxis type="number" label={{ value: 'Hours', position: 'insideBottomRight', offset: -5 }} />
          <YAxis type="category" dataKey="status" width={120} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="hours" fill="#8884d8">
            <LabelList
              dataKey="assignee"
              position="right"
              style={{ fill: '#000', fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusTimelineChart;
