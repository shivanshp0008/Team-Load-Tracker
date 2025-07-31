// import React from "react";
// import {
//   PieChart, Pie, Cell,
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
// } from "recharts";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";
// import { subDays, format } from "date-fns";

// const ChartsDashboard = ({ data }) => {
//   if (!data || data.length === 0) return null;

//   // PIE CHART DATA - Status Distribution
//   const statusData = Object.values(
//     data.reduce((acc, item) => {
//       const key = item.fields.status?.name || "Unknown";
//       acc[key] = acc[key] || { name: key, value: 0 };
//       acc[key].value += 1;
//       return acc;
//     }, {})
//   );

//   // LINE CHART DATA - Priority Trend (simulated)
//   const priorityData = data.map((item, index) => ({
//     name: item.fields.priority?.name || "None",
//     index,
//   }));

//   // HEATMAP DATA - Issue Created Dates
//   const today = new Date();
//   const startDate = subDays(today, 90);
//   const heatmapData = data.map((item) => {
//     const created = new Date(item.fields.created);
//     return {
//       date: format(created, "yyyy-MM-dd"),
//       count: 1,
//     };
//   });

//   const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

//   return (
//     <div className="charts-wrapper">
//       <h3>Status Distribution</h3>
//       <PieChart width={400} height={300}>
//         <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100}>
//           {statusData.map((entry, index) => (
//             <Cell key={index} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>

//       <h3>Priority Line Trend</h3>
//       <LineChart width={500} height={300} data={priorityData}>
//         <XAxis dataKey="index" />
//         <YAxis />
//         <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
//         <Line type="monotone" dataKey="index" stroke="#8884d8" />
//         <Tooltip />
//       </LineChart>

//       <h3>Status Change Heatmap</h3>
//       <div className="heatmap-container">
//         <CalendarHeatmap
//           startDate={startDate}
//           endDate={today}
//           values={heatmapData}
//           classForValue={(value) => {
//             if (!value) return "color-empty";
//             if (value.count >= 5) return "color-github-4";
//             if (value.count >= 3) return "color-github-3";
//             if (value.count >= 2) return "color-github-2";
//             return "color-github-1";
//           }}
//           tooltipDataAttrs={(value) =>
//             value.date ? { "data-tip": `${value.date} – ${value.count} issue(s)` } : {}
//           }
//           showWeekdayLabels
//         />
//       </div>
//     </div>
//   );
// };

// export default ChartsDashboard;







// import React, { useMemo } from "react";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   LineChart, Line, XAxis, YAxis, CartesianGrid
// } from "recharts";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";
// import { subDays, format } from "date-fns";
// import './ChartsDashboard.css'; // Assuming you have some styles for the charts

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#00C49F", "#FFBB28"];

// const ChartsDashboard = ({ data }) => {
//   if (!data || data.length === 0) return <p>No data to display.</p>;

//   // PIE CHART DATA - Status Distribution
//   const statusData = useMemo(() => {
//     return Object.values(
//       data.reduce((acc, item) => {
//         const key = item.fields.status?.name || "Unknown";
//         acc[key] = acc[key] || { name: key, value: 0 };
//         acc[key].value += 1;
//         return acc;
//       }, {})
//     );
//   }, [data]);

//   // LINE CHART DATA - Priority Trend over index
//   const lineData = useMemo(() => {
//     return data.map((item, index) => ({
//       index,
//       priority: item.fields.priority?.name || "None",
//       name: `#${index + 1}`,
//     }));
//   }, [data]);

//   // HEATMAP DATA - Aggregate issue counts by created date
//   const today = new Date();
//   const startDate = subDays(today, 90);
//   const heatmapData = useMemo(() => {
//     const counts = {};
//     data.forEach((item) => {
//       const date = format(new Date(item.fields.created), "yyyy-MM-dd");
//       counts[date] = (counts[date] || 0) + 1;
//     });
//     return Object.entries(counts).map(([date, count]) => ({ date, count }));
//   }, [data]);

//   return (
//     <div className="charts-wrapper" style={{ padding: 20 }}>
//       {/* PIE CHART - Status */}
//       <h3>Status Distribution</h3>
//       <PieChart width={400} height={320}>
//         <Pie
//           data={statusData}
//           dataKey="value"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           outerRadius={110}
//           fill="#8884d8"
//           label={({ name, percent }) =>
//             `${name}: ${(percent * 100).toFixed(0)}%`
//           }
//           isAnimationActive={true}
//         >
//           {statusData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>

//       {/* LINE CHART - Simulated Priority Trend */}
//       <h3>Priority Distribution Trend</h3>
//       <LineChart width={600} height={300} data={lineData}>
//         <XAxis dataKey="name" label={{ value: "Issues", position: "insideBottom", dy: 10 }} />
//         <YAxis allowDecimals={false} />
//         <CartesianGrid strokeDasharray="3 3" />
//         <Tooltip />
//         <Line
//           type="monotone"
//           dataKey="index"
//           stroke="#8884d8"
//           strokeWidth={3}
//           dot={{ r: 5 }}
//           activeDot={{ r: 8 }}
//           animationDuration={800}
//         />
//       </LineChart>

//       {/* HEATMAP */}
//       <h3>Created Issues Heatmap (Last 90 Days)</h3>
//       <div className="heatmap-container" style={{ marginBottom: 30 }}>
//         <CalendarHeatmap
//           startDate={startDate}
//           endDate={today}
//           values={heatmapData}
//           classForValue={(value) => {
//             if (!value || value.count === 0) return "color-empty";
//             if (value.count >= 5) return "color-github-4";
//             if (value.count >= 3) return "color-github-3";
//             if (value.count >= 2) return "color-github-2";
//             return "color-github-1";
//           }}
//           tooltipDataAttrs={(value) =>
//             value.date
//               ? { "data-tip": `${value.date} — ${value.count} issue(s)` }
//               : {}
//           }
//           showWeekdayLabels
//         />
//       </div>
//     </div>
//   );
// };

// export default ChartsDashboard;



// import React, { useMemo } from "react";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   LineChart, Line, XAxis, YAxis, CartesianGrid,
//   ResponsiveContainer
// } from "recharts";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";
// import { subDays, format } from "date-fns";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#00C49F", "#FFBB28"];

// const ChartsDashboard = ({ data }) => {
//   if (!data || data.length === 0) return <p style={{ padding: 20 }}>No data available to display charts.</p>;

//   // --- PIE CHART DATA: Issue Status Distribution ---
//   const statusData = useMemo(() => {
//     return Object.values(
//       data.reduce((acc, item) => {
//         const status = item.fields.status?.name || "Unknown";
//         acc[status] = acc[status] || { name: status, value: 0 };
//         acc[status].value += 1;
//         return acc;
//       }, {})
//     );
//   }, [data]);

//   // --- LINE CHART DATA: Simulated Priority Trend ---
//   const lineData = useMemo(() => {
//     return data.map((item, index) => ({
//       name: `#${index + 1}`,
//       priority: item.fields.priority?.name || "None",
//       index,
//     }));
//   }, [data]);

//   // --- HEATMAP DATA: Issue Created Dates Aggregation ---
//   const today = new Date();
//   const startDate = subDays(today, 90);
//   const heatmapData = useMemo(() => {
//     const counts = {};
//     data.forEach((item) => {
//       const date = format(new Date(item.fields.created), "yyyy-MM-dd");
//       counts[date] = (counts[date] || 0) + 1;
//     });
//     return Object.entries(counts).map(([date, count]) => ({ date, count }));
//   }, [data]);

//   return (
//     <div style={styles.wrapper}>
//       {/* PIE CHART */}
//       <div style={styles.card}>
//         <h3 style={styles.title}>🟠 Issue Status Distribution</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={statusData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//               isAnimationActive
//               animationDuration={1000}
//             >
//               {statusData.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* LINE CHART */}
//       <div style={styles.card}>
//         <h3 style={styles.title}>📈 Priority Trend</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={lineData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="index"
//               stroke="#8884d8"
//               strokeWidth={3}
//               dot={{ r: 6 }}
//               activeDot={{ r: 8 }}
//               isAnimationActive
//               animationDuration={1200}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* HEATMAP */}
//       <div style={styles.card}>
//         <h3 style={styles.title}>🔥 Created Issues Heatmap (Last 90 Days)</h3>
//         <div style={{ marginTop: 10 }}>
//           <CalendarHeatmap
//             startDate={startDate}
//             endDate={today}
//             values={heatmapData}
//             classForValue={(value) => {
//               if (!value) return "color-empty";
//               if (value.count >= 5) return "color-github-4";
//               if (value.count >= 3) return "color-github-3";
//               if (value.count >= 2) return "color-github-2";
//               return "color-github-1";
//             }}
//             tooltipDataAttrs={(value) =>
//               value.date ? { "data-tip": `${value.date}: ${value.count} issue(s)` } : {}
//             }
//             showWeekdayLabels
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     display: "grid",
//     gridTemplateColumns: "1fr",
//     gap: "30px",
//     padding: "30px",
//     maxWidth: 7000,
//     margin: "0 auto",
//   },
//   card: {
//     background: "white",
//     borderRadius: "16px",
//     padding: "20px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//     transition: "all 0.3s ease",
//     transform: "scale(1)",
//     animation: "fadeInUp 0.7s ease-out",
//   },
//   title: {
//     marginBottom: "20px",
//     fontSize: "20px",
//     fontWeight: "bold",
//     color: "#333",
//   },
// };

// export default ChartsDashboard;




import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format } from "date-fns";
import "./ChartsDashboard.css"; // <-- External stylesheet

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#00C49F", "#FFBB28"];

const ChartsDashboard = ({ data }) => {
  if (!data || data.length === 0) return <p className="no-data">No data available to display charts.</p>;

  const statusData = useMemo(() => {
    return Object.values(
      data.reduce((acc, item) => {
        const status = item.fields.status?.name || "Unknown";
        acc[status] = acc[status] || { name: status, value: 0 };
        acc[status].value += 1;
        return acc;
      }, {})
    );
  }, [data]);

  const lineData = useMemo(() => {
    return data.map((item, index) => ({
      name: `#${index + 1}`,
      priority: item.fields.priority?.name || "None",
      index,
    }));
  }, [data]);

  const today = new Date();
  const startDate = subDays(today, 90);
  const heatmapData = useMemo(() => {
    const counts = {};
    data.forEach((item) => {
      const date = format(new Date(item.fields.created), "yyyy-MM-dd");
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [data]);

  return (
    <div className="charts-wrapper">
      <div className="chart-card">
        <h3 className="chart-title">🟠 Issue Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              isAnimationActive
              animationDuration={1000}
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">📈 Priority Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="index"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">🔥 Created Issues Heatmap (Last 90 Days)</h3>
        <div style={{ marginTop: 10 }}>
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return "color-empty";
              if (value.count >= 5) return "color-github-4";
              if (value.count >= 3) return "color-github-3";
              if (value.count >= 2) return "color-github-2";
              return "color-github-1 ";
            }}
            tooltipDataAttrs={(value) =>
              value.date ? { "data-tip": `${value.date}: ${value.count} issue(s)` } : {}
            }
            showWeekdayLabels
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsDashboard;
