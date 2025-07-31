import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";


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

  const columns = useMemo(() => [
    {
      header: 'Issue Key',
      accessorKey: 'key',
      filterFn: 'includesString',
    },
    {
      header: 'Summary',
      accessorFn: row => {
        const summary = row.fields.summary;
        return typeof summary === 'string'
          ? summary
          : summary?.content?.[0]?.content?.[0]?.text || '[Unsupported Format]';
      },
      filterFn: 'includesString',
    },
    {
      header: 'Status',
      accessorFn: row => row.fields.status.name,
      filterFn: 'includesString',
    },
    {
      header: 'Assignee',
      accessorFn: row => row.fields.assignee?.displayName || 'Unassigned',
      filterFn: 'includesString',
    },
  ], []);

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

      <table className="data-table ">
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

    </div>
  );
};

export default WorkFlowAging;
