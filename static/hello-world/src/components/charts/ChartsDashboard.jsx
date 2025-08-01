// ChartsDashboard.jsx
// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";

// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";
// import { subDays, format } from "date-fns";

// const ChartsDashboard = ({
//   data,
//   showPieChart = true,
//   showLineChart = true,
//   showHeatmap = true,
//   showTeamCharts = false,
// }) => {
//   if (!data || data.length === 0) return null;

//   const statusData = Object.values(
//     data.reduce((acc, item) => {
//       const key = item.fields.status?.name || "Unknown";
//       acc[key] = acc[key] || { name: key, value: 0 };
//       acc[key].value += 1;
//       return acc;
//     }, {})
//   );

//   const priorityData = data.map((item, index) => ({
//     name: item.fields.priority?.name || "None",
//     index,
//   }));

//   const stackedBarData = useMemo(() => {
//     const grouped = {};
//     data.forEach((issue) => {
//       const project = issue.fields.project?.name || "Unknown";
//       const priority = issue.fields.priority?.name || "None";
//       if (!grouped[project]) grouped[project] = {};
//       grouped[project][priority] = (grouped[project][priority] || 0) + 1;
//     });
//     return Object.entries(grouped).map(([project, counts]) => ({
//       project,
//       ...counts,
//     }));
//   }, [data]);

//   const priorities = Array.from(
//     new Set(data.map((d) => d.fields.priority?.name || "None"))
//   );

//   const assigneeData = useMemo(() => {
//     const grouped = {};
//     data.forEach((issue) => {
//       const name = issue.fields.assignee?.displayName || "Unassigned";
//       grouped[name] = (grouped[name] || 0) + 1;
//     });
//     return Object.entries(grouped).map(([name, count]) => ({
//       name,
//       count,
//     }));
//   }, [data]);

//   const today = new Date();
//   const startDate = subDays(today, 90);
//   const heatmapData = data.map((item) => ({
//     date: format(new Date(item.fields.created), "yyyy-MM-dd"),
//     count: 1,
//   }));

//   const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

//   return (
//     <div className="charts-wrapper">
//       <div className="chart-grid">
//         {showPieChart && (
//           <div className="chart-card">
//             <h1 className="chart-heading">Status Distribution</h1>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={statusData}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={100}
//                   label={({ name, value }) => `${name}: ${value}`}
//                 >
//                   {statusData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend layout="horizontal" verticalAlign="bottom" align="center" />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {showLineChart && (
//           <div className="chart-card">
//             <h1 className="chart-heading">Priority Line Trend</h1>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={priorityData}>
//                 <XAxis dataKey="index" />
//                 <YAxis />
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Line type="monotone" dataKey="index" stroke="#8884d8" />
//                 <Tooltip />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {showHeatmap && (
//           <div className="chart-card">
//             <h1 className="chart-heading">Status Change Heatmap</h1>
//             <CalendarHeatmap
//               startDate={startDate}
//               endDate={today}
//               values={heatmapData}
//               classForValue={(value) => {
//                 if (!value) return "color-empty";
//                 if (value.count >= 5) return "color-github-4";
//                 if (value.count >= 3) return "color-github-3";
//                 if (value.count >= 2) return "color-github-2";
//                 return "color-github-1";
//               }}
//               tooltipDataAttrs={(value) =>
//                 value.date ? { "data-tip": `${value.date} – ${value.count} issue(s)` } : {}
//               }
//               showWeekdayLabels
//             />
//           </div>
//         )}

//         {showTeamCharts && (
//           <>
//             <div className="chart-card">
//               <h1 className="chart-heading">Project-wise Priority Distribution</h1>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={stackedBarData} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" />
//                   <YAxis type="category" dataKey="project" />
//                   <Tooltip />
//                   <Legend />
//                   {priorities.map((priority, idx) => (
//                     <Bar
//                       key={priority}
//                       dataKey={priority}
//                       stackId="a"
//                       barSize={40}
//                       fill={COLORS[idx % COLORS.length]}
//                     />
//                   ))}
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="chart-card">
//               <h1 className="chart-heading">Issues by Assignee</h1>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={assigneeData} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" />
//                   <YAxis type="category" dataKey="name" />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#8884d8" barSize={40} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChartsDashboard;


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
import "./ChartsDashboard.css"; // Custom styles

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#00C49F", "#FFBB28"];

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const ChartsDashboard = ({ data, mode = "all", selectedUser }) => {
  if (!data || data.length === 0) return null;

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
        const estimate = issue.fields.timeoriginalestimate || 0; // in seconds
        grouped[assignee] = (grouped[assignee] || 0) + estimate;
      });
      console.log("workload",grouped)
      return Object.entries(grouped).map(([name, estimate]) => ({
        name,
        workloadHours: (estimate / 3600).toFixed(1), // convert to hours
        
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

  const priorityData = useMemo(() => {
    return userData.map((item, index) => ({
      name: item.fields.priority?.name || "None",
      index,
    }));
  }, [userData]);

  const etaAccuracyData = useMemo(() => {
    return userData.map((item, index) => ({
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

  const heatmapData = useMemo(() => {
    return userData.map((item) => ({
      date: format(new Date(item.fields.created), "yyyy-MM-dd"),
      count: 1,
    }));
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
                  >
                    {assigneeData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Workload Balance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workloadHours} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="workloadHours"/>
                   {/* <XAxis type="number" domain={[0, 'dataMax']} /> */}
                  <YAxis type="category" dataKey="name" />
                  {/* <Tooltip /> */}
                  {/* <Tooltip formatter={(value) => `${value.toFixed(1)} hrs`} /> */}
                  <Tooltip formatter={(value) => {
                    const num = Number(value);
                    return isNaN(num) ? 'N/A' : `${num.toFixed(1)} hrs`;
                  }} />
                  <Bar dataKey="workloadHours" fill="#8884d8" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h1 className="chart-heading">Status Distribution</h1>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
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

        {mode === "individual" && (
          <>
            <div className="chart-card">
              <h2>ETA Accuracy</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={etaAccuracyData}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="estimated" stroke="#8884d8" />
                  <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Performance Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priorityData}>
                  <XAxis dataKey="index" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="index" stroke="#8884d8" />
                  <Tooltip />
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
                tooltipDataAttrs={(value) =>
                  value.date ? { "data-tip": `${value.date} – ${value.count} issue(s)` } : {}
                }
                showWeekdayLabels
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartsDashboard;
