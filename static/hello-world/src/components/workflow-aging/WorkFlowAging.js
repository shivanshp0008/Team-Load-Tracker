import React, { useMemo, useState } from "react";
import { invoke } from "@forge/bridge";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import ChartsDashboard from "../charts/ChartsDashboard";

const WorkFlowAging = ({ data, filters, onBack }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState({});

  const toggleFilter = (columnId) => {
    setVisibleFilters((prev) => {
      const isCurrentlyVisible = prev[columnId];
      return isCurrentlyVisible ? {} : { [columnId]: true };
    });
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "srNo",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Issue ID",
        accessorKey: "id",
        accessorFn: (row) => row.id?.toString() || "[Invalid ID]",
        cell: ({ row }) => {
          const issueKey = row.original.key;
          const issueId = row.original.id;
          return (
            <a
              onClick={() => getIssueById(issueId)}
              rel="noopener noreferrer"
              className="issue-link"
            >
              {issueId}
            </a>
          );
        },
        filterFn: "includesString",
      },
      {
        header: "Project",
        accessorFn: (row) => row.fields.project?.name || "Unknown Project",
        cell: ({ row }) => (
          <span className="project-name">
            {row.original.fields.project?.name || "Unknown Project"}
          </span>
        ),
        filterFn: "includesString",
      },
      {
        header: "Assignee",
        accessorFn: (row) => row.fields.assignee?.displayName || "Unassigned",
        filterFn: "includesString",
      },
      {
        header: "Status",
        accessorFn: (row) => row.fields.status?.name || "Unknown Status",
        filterFn: "includesString",
      },
      {
        header: "Priority",
        accessorFn: (row) => row.fields.priority?.name || "No Priority",
        filterFn: "includesString",
      },
      {
        header: "Summary",
        accessorFn: (row) => {
          const summary = row.fields.summary;
          return typeof summary === "string"
            ? summary
            : summary?.content?.[0]?.content?.[0]?.text || "[Unsupported]";
        },
        filterFn: "includesString",
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!filters) return data;

    const { selectedOptions } = filters;
    const selectedIds = selectedOptions?.map((opt) => opt.value);

    return data.filter((issue) =>
      !selectedIds || selectedIds.length === 0
        ? true
        : selectedIds.includes(issue.id)
    );
  }, [data, filters]);

  const getIssueById = async (issueId) => {
    try {
      const issue = await invoke("getIssueById", { IssueId: issueId });
      const issuelog = await invoke("getIssueLogById", { IssueId: issueId });
      console.log("Fetched Issue Log:", issuelog);
      console.log("Fetched Issue:", issue);
    } catch (error) {
      console.error("Error fetching issue by ID:", error);
    }
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="table-wrapper">
      <div className="search-container">
        <div className="table-header">
          <button onClick={onBack} className="back-btn">
            ← Back to Form
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Global search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="table-search"
          />
        </div>
      </div>

      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: "pointer" }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="sort-icon">
                        {header.column.getIsSorted() === "asc"
                          ? "🔼"
                          : header.column.getIsSorted() === "desc"
                          ? "🔽"
                          : "🔼"}
                      </span>
                    </span>
                    {header.column.getCanFilter() && (
                      <button
                        onClick={() => toggleFilter(header.column.id)}
                        className={`filter-toggle-btn ${
                          visibleFilters[header.column.id] ? "active" : ""
                        }`}
                      >
                        ☰
                      </button>
                    )}
                  </div>
                  {visibleFilters[header.column.id] && (
                    <div className="filter-container">
                      <input
                        className="column-filter"
                        type="text"
                        value={header.column.getFilterValue() ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder="Filter..."
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ChartsDashboard data={filteredData} showTeamCharts showPieChart={false} showLineChart={false} showHeatmap={false}/>
    </div>
  );
};

export default WorkFlowAging;
