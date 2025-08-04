import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format } from "date-fns";
import "./ChartsDashboard.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#00C49F", "#FFBB28"];

const STATUS_COLORS = {
  "To Do": "#8884d8",
  "In Progress": "#82ca9d",
  "Done": "#ffc658",
  "Blocked": "#ff8042",
  "Unknown": "#ccc",
};

const ChartsDashboard = ({ data, mode = "all", selectedUser }) => {
  if (!data || data.length === 0) return null ;
console.log(mode, selectedUser, data)
  const userData = useMemo(() => {
    if (mode === "individual" && selectedUser) {
      return data.filter(
        (item) => (item.fields.assignee?.displayName || "Unassigned") === selectedUser
      );
    }
    return data;
  }, [data, mode, selectedUser]);

  const workloadHours = useMemo(() => {
    const grouped = {};
    data.forEach(issue => {
      const assignee = issue.fields.assignee?.displayName || "Unassigned";
      const estimate = issue.fields.timeoriginalestimate || 0; 
      grouped[assignee] = (grouped[assignee] || 0) + estimate;
    });
    console.log("workload", grouped)
    return Object.entries(grouped).map(([name, estimate]) => ({
      name,
      workloadHours: estimate / 3600, 

    }));

  }, [data]);

  const statusData = useMemo(() => {
    return Object.values(
      userData.reduce((acc, item) => {
        const key = item.fields.status?.name || "Unknown";
        acc[key] = acc[key] || { name: key, value: 0 };
        acc[key].value += 1;
        return acc;
      }, {})
    );
  }, [userData]);

  const priorityScores = {
    Highest: 5,
    High: 4,
    Medium: 3,
    Low: 2,
    Lowest: 1,
    None: 0
  };

  const priorityTrendData = useMemo(() => {
    return userData.map((item) => ({
      name: item.key,
      priorityScore: priorityScores[item.fields.priority?.name || "None"]
    }));
  }, [userData]);


  const etaAccuracyData = useMemo(() => {
    return userData.map((item) => ({
      name: item.key,
      estimated: item.fields.timeoriginalestimate || 0,
      actual: item.fields.timespent || 0,
    }));
  }, [userData]);

  const assigneeData = useMemo(() => {
    const grouped = {};
    data.forEach((issue) => {
      const name = issue.fields.assignee?.displayName || "Unassigned";
      grouped[name] = (grouped[name] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  }, [data]);


    const statusIcons = {
      "To Do": "🟢",
      "In Progress": "🟡",
      "Done": "✅",
      "Backlog": "🔵",
      "Selected for Development": "🧭",
      "Unknown": "⚪",
    };

  
    const heatmapData = useMemo(() => {
    const grouped = {};

    userData.forEach((item) => {
      const date = format(new Date(item.fields.created), "yyyy-MM-dd");
      const status = item.fields.status?.name || "Unknown";

      if (!grouped[date]) {
        grouped[date] = {};
      }

      grouped[date][status] = (grouped[date][status] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, statusCounts]) => {
      const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
      return { date, count: total, statusCounts };
    });
  }, [userData]);

  const individualStatusData = useMemo(() => {
    return Object.values(
      userData.reduce((acc, item) => {
        const key = item.fields.status?.name || "Unknown";
        acc[key] = acc[key] || { name: key, value: 0 };
        acc[key].value += 1;
        return acc;
      }, {})
    );
  }, [userData]);


  const startDate = subDays(new Date(), 90);

  return (
    <div className="charts-wrapper">
      <div className="chart-grid">
        {mode === "all" && (
          <>
            <div className="chart-card">
              <h2>Team Member Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assigneeData}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, count }) => `${name}: ${count}`}
                    isAnimationActive
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  >
                    {assigneeData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => (
                      <span className="custom-legend-item">
                        <span
                          className="legend-color-box"
                          style={{ backgroundColor: STATUS_COLORS[value] || "#ccc" }}
                        ></span>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Workload Balance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workloadHours} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="workloadHours" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => {
                    const num = Number(value);
                    return isNaN(num) ? 'N/A' : `${num.toFixed(1)} hrs`;
                  }} />
                  <Bar dataKey="workloadHours" fill="#8884d8" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                    isAnimationActive
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => (
                      <span className="custom-legend-item">
                        <span
                          className="legend-color-box"
                          style={{ backgroundColor: STATUS_COLORS[value] || "#ccc" }}
                        ></span>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {mode === "individual" && (
          <>
            <div className="chart-card">
              <h2>ETA Accuracy</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={etaAccuracyData}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  {/* <Tooltip /> */}
                  <Tooltip
                    formatter={(value) => {
                      const seconds = Number(value);
                      if (isNaN(seconds)) return 'N/A';
                      const hours = Math.floor(seconds / 3600);
                      const minutes = Math.floor((seconds % 3600) / 60);
                      return `${hours}h ${minutes}m`;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="estimated"
                    stroke="#8884d8"
                    animationDuration={1000}
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#82ca9d"
                    animationDuration={1000}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Performance Trends (Priority Levels)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priorityTrendData}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 5]} tickFormatter={(val) => {
                    const labels = ['None', 'Lowest', 'Low', 'Medium', 'High', 'Highest'];
                    return labels[val];
                  }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => {
                    const labels = ['None', 'Lowest', 'Low', 'Medium', 'High', 'Highest'];
                    return labels[value];
                  }} />
                  <Line type="monotone" dataKey="priorityScore" stroke="#8884d8" dot />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Task Status Heatmap</h2>
              <CalendarHeatmap
                startDate={startDate}
                endDate={new Date()}
                values={heatmapData}
                classForValue={(value) => {
                  if (!value) return "color-empty";
                  if (value.count >= 5) return "color-github-4";
                  if (value.count >= 3) return "color-github-3";
                  if (value.count >= 2) return "color-github-2";
                  return "color-github-1";
                }}
                tooltipDataAttrs={(value) => {
                  if (!value || !value.statusCounts) return {};
                  const breakdown = Object.entries(value.statusCounts)
                    .map(
                      ([status, count]) => `${statusIcons[status] || "⚪"} ${status}: ${count}`
                    )
                    .join(" | ");
                  return {
                    title: `${value.date} – ${breakdown}`,
                    'aria-label': `${value.date} – ${breakdown}`,
                    role: 'tooltip'
                  };
                }}
                showWeekdayLabels
              />
            </div>

            <div className="chart-card">
              <h1 className="chart-heading">Status Distribution</h1>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={individualStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {individualStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartsDashboard;