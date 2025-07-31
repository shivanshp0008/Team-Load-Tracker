import React from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format } from "date-fns";

const ChartsDashboard = ({ data }) => {
  if (!data || data.length === 0) return null;

  // PIE CHART DATA - Status Distribution
  const statusData = Object.values(
    data.reduce((acc, item) => {
      const key = item.fields.status?.name || "Unknown";
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {})
  );

  // LINE CHART DATA - Priority Trend (simulated)
  const priorityData = data.map((item, index) => ({
    name: item.fields.priority?.name || "None",
    index,
  }));

  // HEATMAP DATA - Issue Created Dates
  const today = new Date();
  const startDate = subDays(today, 90);
  const heatmapData = data.map((item) => {
    const created = new Date(item.fields.created);
    return {
      date: format(created, "yyyy-MM-dd"),
      count: 1,
    };
  });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

  return (
    <div className="charts-wrapper">
      <h3>Status Distribution</h3>
      <PieChart width={400} height={300}>
        <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100}>
          {statusData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>Priority Line Trend</h3>
      <LineChart width={500} height={300} data={priorityData}>
        <XAxis dataKey="index" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="index" stroke="#8884d8" />
        <Tooltip />
      </LineChart>

      <h3>Status Change Heatmap</h3>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 5) return "color-github-4";
            if (value.count >= 3) return "color-github-3";
            if (value.count >= 2) return "color-github-2";
            return "color-github-1";
          }}
          tooltipDataAttrs={(value) =>
            value.date ? { "data-tip": `${value.date} – ${value.count} issue(s)` } : {}
          }
          showWeekdayLabels
        />
      </div>
    </div>
  );
};

export default ChartsDashboard;
