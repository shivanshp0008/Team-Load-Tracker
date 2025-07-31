// import React, { useState } from "react";
// import { Table, Form } from "react-bootstrap";

// const initialData = [
//   {
//     issue: { key: "CLO-119", url: "https://your-jira-instance/browse/CLO-119" },
//     project: "Project A",
//     assignee: "Alice",
//     status: "Open",
//     priority: "High",
//     eta: "2025-07-30",
//     ts: "3h",
//     rt: "2h",
//     acd: "Done",
//   },
//   {
//     issue: { key: "CLO-120", url: "https://your-jira-instance/browse/CLO-120" },
//     project: "Project B",
//     assignee: "Deepak",
//     status: "Closed",
//     priority: "Low",
//     eta: "2025-08-01",
//     ts: "4h",
//     rt: "1h",
//     acd: "Pending",
//   },
// ];

// const TeamAllocation = () => {
//   const [data, setData] = useState(initialData);
//   const [filters, setFilters] = useState({});
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
//   const [filterVisible, setFilterVisible] = useState({});

//   const handleSort = (key) => {
//     const direction =
//       sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
//     setSortConfig({ key, direction });

//     const sorted = [...data].sort((a, b) => {
//       const valA = (a[key]?.key || a[key] || "").toLowerCase();
//       const valB = (b[key]?.key || b[key] || "").toLowerCase();
//       return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
//     });

//     setData(sorted);
//   };

//   const handleFilter = (e, key) => {
//     const value = e.target.value.toLowerCase();
//     const updatedFilters = { ...filters, [key]: value };
//     setFilters(updatedFilters);

//     const filtered = initialData.filter((row) =>
//       Object.keys(updatedFilters).every((field) => {
//         const cell = row[field]?.key || row[field] || "";
//         return cell.toLowerCase().includes(updatedFilters[field]);
//       })
//     );

//     setData(filtered);
//   };

//   const toggleFilter = (key) => {
//     const newVisible = !filterVisible[key];

//     setFilterVisible((prev) => ({
//       ...prev,
//       [key]: newVisible,
//     }));

//     if (!newVisible) {
//       // Clear that column's filter
//       const updatedFilters = { ...filters };
//       delete updatedFilters[key];
//       setFilters(updatedFilters);

//       // Apply remaining filters or reset
//       const filtered = Object.keys(updatedFilters).length
//         ? initialData.filter((row) =>
//             Object.keys(updatedFilters).every((field) => {
//               const cell = row[field]?.key || row[field] || "";
//               return cell.toLowerCase().includes(updatedFilters[field]);
//             })
//           )
//         : initialData;

//       setData(filtered);
//     }
//   };

//   const renderColumnHeader = (label, key) => (
//     <th style={{ position: "relative" }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <span
//           onClick={() => handleSort(key)}
//           style={{ cursor: "pointer", flex: 1 }}
//         >
//           {label}{" "}
//           {sortConfig.key === key
//             ? sortConfig.direction === "asc"
//               ? "▲"
//               : "▼"
//             : ""}
//         </span>
//         <span
//           style={{ cursor: "pointer", marginLeft: 5 }}
//           onClick={() => toggleFilter(key)}
//           title="Toggle Filter"
//         >
//           🔽
//         </span>
//       </div>
//       {filterVisible[key] && (
//         <Form.Control
//           type="text"
//           placeholder="Filter"
//           value={filters[key] || ""}
//           onChange={(e) => handleFilter(e, key)}
//           style={{
//             fontSize: "0.8rem",
//             marginTop: 5,
//           }}
//         />
//       )}
//     </th>
//   );

//   return (
//     <div className="container mt-3">
//       <h5>Jira Issue Tracker</h5>
//       <Table bordered hover responsive size="sm">
//         <thead>
//           <tr>
//             {renderColumnHeader("Issue", "issue")}
//             {renderColumnHeader("Project", "project")}
//             {renderColumnHeader("Assignee", "assignee")}
//             {renderColumnHeader("Status", "status")}
//             {renderColumnHeader("Priority", "priority")}
//             {renderColumnHeader("ETA", "eta")}
//             {renderColumnHeader("TS", "ts")}
//             {renderColumnHeader("RT", "rt")}
//             {renderColumnHeader("ACD", "acd")}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, idx) => (
//             <tr key={idx}>
//               <td>
//                 <a href={row.issue.url} target="_blank" rel="noopener noreferrer">
//                   {row.issue.key}
//                 </a>
//               </td>
//               <td>{row.project}</td>
//               <td>{row.assignee}</td>
//               <td>{row.status}</td>
//               <td>{row.priority}</td>
//               <td>{row.eta}</td>
//               <td>{row.ts}</td>
//               <td>{row.rt}</td>
//               <td>{row.acd}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default TeamAllocation;



import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  HeatMap,
  Legend,
} from "recharts";

const initialData = [
  {
    issue: { key: "CLO-119", url: "https://your-jira-instance/browse/CLO-119" },
    project: "Project A",
    assignee: "Alice",
    status: "Open",
    priority: "High",
    eta: "2025-07-30",
    ts: "3h",
    rt: "2h",
    acd: "Done",
  },
  {
    issue: { key: "CLO-120", url: "https://your-jira-instance/browse/CLO-120" },
    project: "Project B",
    assignee: "Deepak",
    status: "Closed",
    priority: "Low",
    eta: "2025-08-01",
    ts: "4h",
    rt: "1h",
    acd: "Pending",
  },
];

const TeamAllocation = () => {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filterVisible, setFilterVisible] = useState({});

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) => {
      const valA = (a[key]?.key || a[key] || "").toLowerCase();
      const valB = (b[key]?.key || b[key] || "").toLowerCase();
      return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    setData(sorted);
  };

  const handleFilter = (e, key) => {
    const value = e.target.value.toLowerCase();
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    const filtered = initialData.filter((row) =>
      Object.keys(updatedFilters).every((field) => {
        const cell = row[field]?.key || row[field] || "";
        return cell.toLowerCase().includes(updatedFilters[field]);
      })
    );

    setData(filtered);
  };

  const toggleFilter = (key) => {
    const newVisible = !filterVisible[key];

    setFilterVisible((prev) => ({
      ...prev,
      [key]: newVisible,
    }));

    if (!newVisible) {
      const updatedFilters = { ...filters };
      delete updatedFilters[key];
      setFilters(updatedFilters);

      const filtered = Object.keys(updatedFilters).length
        ? initialData.filter((row) =>
            Object.keys(updatedFilters).every((field) => {
              const cell = row[field]?.key || row[field] || "";
              return cell.toLowerCase().includes(updatedFilters[field]);
            })
          )
        : initialData;

      setData(filtered);
    }
  };

  const renderColumnHeader = (label, key) => (
    <th style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span onClick={() => handleSort(key)} style={{ cursor: "pointer", flex: 1 }}>
          {label}{" "}
          {sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
        </span>
        <span style={{ cursor: "pointer", marginLeft: 5 }} onClick={() => toggleFilter(key)} title="Toggle Filter">
          🔽
        </span>
      </div>
      {filterVisible[key] && (
        <Form.Control
          type="text"
          placeholder="Filter"
          value={filters[key] || ""}
          onChange={(e) => handleFilter(e, key)}
          style={{ fontSize: "0.8rem", marginTop: 5 }}
        />
      )}
    </th>
  );

  const parsedData = data.map((item) => ({
    ...item,
    ts: parseInt(item.ts),
    rt: parseInt(item.rt),
  }));

  const priorityColors = {
    High: "#ff6384",
    Medium: "#ffcd56",
    Low: "#36a2eb",
  };

  const assigneeCount = Object.values(
    parsedData.reduce((acc, cur) => {
      acc[cur.assignee] = (acc[cur.assignee] || 0) + 1;
      return acc;
    }, {})
  ).map((count, i) => ({ name: Object.keys(parsedData.reduce((acc, cur) => {
      acc[cur.assignee] = true;
      return acc;
    }, {}))[i], value: count }));

  const priorityCount = Object.values(
    parsedData.reduce((acc, cur) => {
      acc[cur.priority] = (acc[cur.priority] || 0) + 1;
      return acc;
    }, {})
  ).map((count, i) => ({ name: Object.keys(parsedData.reduce((acc, cur) => {
      acc[cur.priority] = true;
      return acc;
    }, {}))[i], value: count }));

  return (
    <div className="container mt-3">
      <h5>Jira Issue Tracker</h5>
      <Table bordered hover responsive size="sm">
        <thead>
          <tr>
            {renderColumnHeader("Issue", "issue")}
            {renderColumnHeader("Project", "project")}
            {renderColumnHeader("Assignee", "assignee")}
            {renderColumnHeader("Status", "status")}
            {renderColumnHeader("Priority", "priority")}
            {renderColumnHeader("ETA", "eta")}
            {renderColumnHeader("TS", "ts")}
            {renderColumnHeader("RT", "rt")}
            {renderColumnHeader("ACD", "acd")}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>
                <a href={row.issue.url} target="_blank" rel="noopener noreferrer">
                  {row.issue.key}
                </a>
              </td>
              <td>{row.project}</td>
              <td>{row.assignee}</td>
              <td>{row.status}</td>
              <td>{row.priority}</td>
              <td>{row.eta}</td>
              <td>{row.ts}</td>
              <td>{row.rt}</td>
              <td>{row.acd}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="row mt-5">
        <div className="col-md-6">
          <h6>Estimated vs Resolved Time (TS vs RT)</h6>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="issue.key" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ts" stroke="#8884d8" animationDuration={1000} />
              <Line type="monotone" dataKey="rt" stroke="#82ca9d" animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h6>Issues by Assignee</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assigneeCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#36a2eb" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mt-4">
          <h6>Issues by Priority</h6>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityCount}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
                animationDuration={1000}
              >
                {priorityCount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={priorityColors[entry.name] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamAllocation;
