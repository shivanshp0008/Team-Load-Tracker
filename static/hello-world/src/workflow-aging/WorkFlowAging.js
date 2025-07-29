import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const WorkFlowAging = ({ data }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState({}); // NEW STATE

const toggleFilter = (columnId) => {
  setVisibleFilters((prev) => {
    const isCurrentlyVisible = prev[columnId];
    // Close all, then open only the one clicked (if it wasn't already open)
    return isCurrentlyVisible ? {} : { [columnId]: true };
  });
};


  const columns = useMemo(() => [
    {
      header: 'ID',
      accessorKey: 'id',
      filterFn: 'includesString',
      cell: info => info.getValue(),
    },
    {
      header: 'First Name',
      accessorKey: 'firstName',
      filterFn: 'includesString',
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
      filterFn: 'includesString',
    },
    {
      header: 'Age',
      accessorKey: 'age',
      filterFn: 'includesString',
      cell: info => info.getValue(),
    },
  ], []);

  const table = useReactTable({
    data,
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
      <div className='search-container'>
      <input
        type="text"
        placeholder="Global search..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="table-search"
      />
      </div>

      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
<span className="sort-icon">
  {header.column.getIsSorted() === 'asc'
    ? '🔼'
    : header.column.getIsSorted() === 'desc'
    ? '🔽'
    : '🔼'}
</span>
                    </span>
                    {header.column.getCanFilter() && (
                      <button
  onClick={() => toggleFilter(header.column.id)}
  className={`filter-toggle-btn ${visibleFilters[header.column.id] ? 'active' : ''}`}
>
  {visibleFilters[header.column.id] && (
                    <div className='filter-container'>
                      <input
                        className="column-filter"
                        type="text"
                        value={header.column.getFilterValue() ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder={`Filter...`}
                      />
                    </div>
                  )} ☰
</button>
                    )}
                  </div>
                  
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
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
