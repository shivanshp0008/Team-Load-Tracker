import React, { useMemo, useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import ChartsDashboard from '../charts/ChartsDashboard';
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import { getPaginationRowModel } from '@tanstack/react-table';
import DashboardSummary from '../summary/DashboardSummary';


const TeamAllocation = ({ data, filters, onBack }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedUser, setSelectedUser] = useState(null);


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

  useEffect(() => {
    console.log("filteredData", filteredData)
  }, [filters])

  const userOptions = useMemo(() => {
    const names = Array.from(
      new Set(filteredData.map((item) => item.fields.assignee?.displayName || "Unassigned"))
    );
    console.log("names", names)
    return [{ label: "All", value: null }, ...names.map((n) => ({ label: n, value: n }))];
  }, [filteredData]);

  const analyzedData = useMemo(() => {
    if (!selectedUser) return filteredData;
    return filteredData.filter(
      (item) => (item.fields.assignee?.displayName || "Unassigned") === selectedUser
    );
  }, [filteredData, selectedUser]);

  const formatSecondsToHrMin = (seconds) => {
    if (seconds == null) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD MMM YYYY');
  };



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
        header: 'Issue Type',
        accessorFn: (row) => row.fields.issuetype?.name || 'Unknown Type',
        cell: ({ row }) => {
          const issueType = row.original.fields.issuetype?.name;
          return <span className="issue-type">{issueType || 'Unknown Type'}</span>;
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
      // {
      //   header: 'Summary',
      //   accessorFn: (row) => {
      //     const summary = row.fields.summary;
      //     return typeof summary === 'string'
      //       ? summary
      //       : summary?.content?.[0]?.content?.[0]?.text || '[Unsupported Format]';
      //   },
      //   filterFn: 'includesString',
      // },
      {
        header: 'ETA',
        accessorFn: (row) => formatSecondsToHrMin(row.fields.timeoriginalestimate),
      },
      {
        header: 'TS',
        accessorFn: (row) => formatSecondsToHrMin(row.fields.timespent),
      },
      {
        header: 'TR',
        accessorFn: (row) => formatSecondsToHrMin(row.fields.timeestimate),
      },
      {
        header: 'Due Date',
        accessorFn: (row) => formatDate(row.fields.duedate),
      },
      {
        header: '% Done',
        accessorFn: (row) =>
          row.fields.aggregateprogress?.percent != null
            ? `${row.fields.aggregateprogress.percent}%`
            : 'N/A',
      },
      // {
      //   header: 'ACD',
      // },
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
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    <div className="container">

      {/* /////////////// dashboard ////////////////// */}

     <DashboardSummary filteredData={filteredData} formatSecondsToHrMin={formatSecondsToHrMin} />

      {/* /////////////// Table //////////////////// */}
      <div className="table-wrapper">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div>
                    <span
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer' }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="sort-icon">
                        {/* {header.column.getIsSorted() === 'asc'
                          ? '🔼'
                          : header.column.getIsSorted() === 'desc'
                          ? '🔽'
                          : '🔼'} */}
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
                        className={`filter-toggle-btn ${visibleFilters[header.column.id] ? 'active' : ''}`}
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
      </div>
      <div className="pagination-controls">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          ← Prev
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next →
        </button>
      </div>

      {/* //////////////// Charts ////////////////////// */}
      
    <div className="team-performance-section">
  <h2 className="select-heading">📊 Analyze Team Performance</h2>

  <label htmlFor="user-select" className="select-label">
    Select Team Member
  </label>
  <div className="select-wrapper">
  <select
  id="user-select"
  className="form-select"
          onChange={(e) => setSelectedUser(e.target.value === 'All' ? null : e.target.value)}
  value={selectedUser || 'All'}
>
  
  {userOptions.map((option) => (<>
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  </>
  ))}
</select>

  </div>
</div>
      <ChartsDashboard data={analyzedData} mode={selectedUser ? "individual" : "all"} selectedUser={selectedUser}/>
    </div>
  );
};

export default TeamAllocation;
