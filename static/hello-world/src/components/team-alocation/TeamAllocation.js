import React, { useMemo, useState } from 'react';
import { invoke } from '@forge/bridge';
import IssueChart from './IssueChart';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';


const TeamAllocation = ({ data, filters, onBack }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState({});
   const [showCharts, setShowCharts] = useState(false);


  const filteredData = useMemo(() => {
    if (!filters) return data;

    const { selectedOptions, fromDate, toDate } = filters;
    const selectedAssigneeIds = selectedOptions?.map((opt) => opt.value);

    return data.filter((issue) => {
      const assigneeId = issue.fields?.assignee?.accountId;
      const created = issue.fields?.created;

      const matchAssignee =
        !selectedAssigneeIds || selectedAssigneeIds.length === 0
          ? true
          : selectedAssigneeIds.includes(assigneeId);

      const matchDate =
        fromDate && toDate
          ? new Date(created) >= new Date(fromDate) &&
            new Date(created) <= new Date(toDate)
          : true;

      return matchAssignee && matchDate;
    });
  }, [data, filters]);



  const columns = useMemo(
    () => [
      {
        header: 'Issue ID',
        accessorKey: 'id',
        accessorFn: (row) =>
          typeof row.id === 'string' ? row.id : row.id?.toString() || '[Unsupported Format]',
        cell: ({ row }) => {
          const issueId = row.original.id;
          return (
            <a
              onClick={() => getIssueById(issueId)}
              rel="noopener noreferrer"
              className="issue-link"
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              {issueId}
            </a>
          );
        },
        filterFn: 'includesString',
      },
      {
        header: 'Project',
        accessorFn: (row) => row.fields.project?.name || 'Unknown Project',
        cell: ({ row }) => {
          const projectName = row.original.fields.project?.name;
          return <span className="project-name">{projectName || 'Unknown Project'}</span>;
        },
        filterFn: 'includesString',
      },
      {
        header: 'Assignee',
        accessorFn: (row) => row.fields.assignee?.displayName || 'Unassigned',
        filterFn: 'includesString',
      },
      {
        header: 'Status',
        accessorFn: (row) => row.fields.status.name,
        filterFn: 'includesString',
      },
      {
        header: 'Priority',
        accessorFn: (row) => row.fields.priority?.name || 'No Priority',
        filterFn: 'includesString',
      },
      {
        header: 'Summary',
        accessorFn: (row) => {
          const summary = row.fields.summary;
          return typeof summary === 'string'
            ? summary
            : summary?.content?.[0]?.content?.[0]?.text || '[Unsupported Format]';
        },
        filterFn: 'includesString',
      },
      {
        header: 'ETA',
        accessorFn: (row) => row.fields.duedate || 'N/A',
      },
      {
        header: 'TS',
      },
      {
        header: 'TR',
      },
      {
        header: 'ACD',
      },
    ],
    []
  );

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

  
  const toggleFilter = (columnId) => {
    setVisibleFilters((prev) => {
      const isVisible = prev[columnId];
      return isVisible ? {} : { [columnId]: true };
    });
  };

    const getIssueById = async (issueId) => {
    try {
      const issue = await invoke('getIssueById', { IssueId: issueId });
      console.log('Fetched Issue:', issue);
    } catch (error) {
      console.error('Error fetching issue:', error);
    }
  };

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
            value={globalFilter ?? ''}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer' }}
                    >
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
                        ☰
                      </button>
                    )}
                  </div>
                  {visibleFilters[header.column.id] && (
                    <div className="filter-container">
                      <input
                        className="column-filter"
                        type="text"
                        value={header.column.getFilterValue() ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
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
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
             <div>
      {!showCharts ? (
        <>
          {/* Your full table logic goes here */}
          <button className="calculate-btn" onClick={() => setShowCharts(true)}>
            📊 Calculate
          </button>
        </>
      ) : (
        <IssueChart data={filteredData} onBack={() => setShowCharts(false)} />
      )}
    </div>
    </div>
  );
};

export default TeamAllocation;
