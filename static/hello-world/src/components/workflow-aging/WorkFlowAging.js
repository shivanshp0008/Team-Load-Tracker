import React, { useMemo, useState } from "react";
import { invoke } from "@forge/bridge";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import StatusTimelineChart from "./StatusTimelineChart";

const WorkFlowAging = ({ data, filters, onBack }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState({});
  const [selectedIssueData, setSelectedIssueData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleFilter = (columnId) => {
    setVisibleFilters((prev) => {
      const isCurrentlyVisible = prev[columnId];
      return isCurrentlyVisible ? {} : { [columnId]: true };
    });
  };

  const columns = useMemo(
    () => [
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
        header: "Current Assignee",
        accessorFn: (row) =>
          row.fields.assignee?.displayName || "Unassigned",
        filterFn: "includesString",
      },
      {
        header: "Current Status",
        accessorFn: (row) => row.fields.status?.name || "Unknown Status",
        filterFn: "includesString",
      },
      {
        header: "Priority",
        accessorFn: (row) =>
          row.fields.priority?.name || "No Priority",
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
    setLoading(true); // start loading
    // setSelectedIssueData([]); // reset previous selection

    const issue = await invoke('getIssueById', { IssueId: issueId });
    const issuelog = await invoke('getIssueLogById', { IssueId: issueId });

    const assignee = issue.fields.assignee?.displayName || "Unassigned";

    const statusHistory = issuelog.values
      .map((log) => {
        const statusChange = log.items.find(item => item.field === 'status');
        if (!statusChange) return null;
        return {
          status: statusChange.toString || statusChange.to || 'Unknown',
          created: log.created,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.created) - new Date(b.created));

    if (!statusHistory || statusHistory.length === 0) {
      setSelectedIssueData([{
        status: "Backlog",
        enteredAt: new Date().toISOString(),
        timeSpent: "0d 00h 00m",
        assignee
      }]);
      return;
    }

    const now = new Date();

    const statusWithDurations = statusHistory.map((entry, index) => {
      const currentTime = new Date(entry.created);
      const nextTime = statusHistory[index + 1]
        ? new Date(statusHistory[index + 1].created)
        : now;

      const diffInSeconds = Math.floor((nextTime - currentTime) / 1000);
      const days = Math.floor(diffInSeconds / 86400);
      const hours = Math.floor((diffInSeconds % 86400) / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);

      return {
        status: entry.status || "Unknown",
        enteredAt: entry.created,
        timeSpent: `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`,
        assignee
      };
    });

    setSelectedIssueData(statusWithDurations);
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
  } finally {
    setLoading(false); // end loading
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

  console.log("loading" , loading);
  return (

      
      <div className="table-wrapper">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div className="table-header">
                    <span
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: "pointer" }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="sort-icon">
                        {header.column.getIsSorted() === 'asc' ? (
                          <ArrowUpIcon label="Sorted ascending" size="small" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ArrowDownIcon label="Sorted descending" size="small" />
                        ) : (
                          <ArrowUpIcon label="Unsorted" size="small" />
                        )}
                      </span>
                    </span>
                    {header.column.getCanFilter() && (
                      <button
                        onClick={() => toggleFilter(header.column.id)}
                        className={`filter-toggle-btn ${visibleFilters[header.column.id] ? "active" : ""
                          }`}
                      >
                        {/* ☰ */}
                         &#8942;
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
   <div className="table-footer">
    {loading && (
      <div className="loading-indicator">
        ⏳ Loading issue data...
      </div>
    )}

    {!loading && selectedIssueData?.length > 0 && (
      <StatusTimelineChart statusData={selectedIssueData} />
    )}
  </div>
      </div>





  );
};

export default WorkFlowAging;
