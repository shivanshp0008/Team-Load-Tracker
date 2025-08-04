import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('issue', {
    header: 'Issue Key',
    cell: info => (
      <a href={info.getValue().url} target="_blank" rel="noopener noreferrer">
        {info.getValue().key}
      </a>
    ),
  }),
  columnHelper.accessor('project', {
    header: 'Project',
  }),
  columnHelper.accessor('assignee', {
    header: 'Assignee',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
  }),
];

const data = [
  {
    issue: { key: 'CLO-101', url: 'https://your-jira/browse/CLO-101' },
    project: 'Alpha',
    assignee: 'Alice',
    status: 'Open',
    priority: 'High',
  },
  {
    issue: { key: 'CLO-102', url: 'https://your-jira/browse/CLO-102' },
    project: 'Beta',
    assignee: 'Bob',
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    issue: { key: 'CLO-103', url: 'https://your-jira/browse/CLO-103' },
    project: 'Gamma',
    assignee: 'Charlie',
    status: 'Closed',
    priority: 'Low',
  },
];

export default function Team() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div style={{ padding: '16px' }}>
      <h2>Jira Issues Table (TanStack + Forge)</h2>

      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />

      <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} style={{ backgroundColor: '#f0f0f0' }}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No matching data
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


// import React, { useState } from 'react';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
//   createColumnHelper,
// } from '@tanstack/react-table';

// const columnHelper = createColumnHelper();

// const data = [
//   {
//     issue: { key: 'CLO-101', url: 'https://your-jira/browse/CLO-101' },
//     project: 'Alpha',
//     assignee: 'Alice',
//     status: 'Open',
//     priority: 'High',
//   },
//   {
//     issue: { key: 'CLO-102', url: 'https://your-jira/browse/CLO-102' },
//     project: 'Beta',
//     assignee: 'Bob',
//     status: 'In Progress',
//     priority: 'Medium',
//   },
//   {
//     issue: { key: 'CLO-103', url: 'https://your-jira/browse/CLO-103' },
//     project: 'Gamma',
//     assignee: 'Charlie',
//     status: 'Closed',
//     priority: 'Low',
//   },
// ];

// const columns = [
//   columnHelper.accessor('issue', {
//     header: 'Issue Key',
//     cell: info => (
//       <a href={info.getValue().url} target="_blank" rel="noopener noreferrer">
//         {info.getValue().key}
//       </a>
//     ),
//     filterFn: (row, columnId, filterValue) =>
//       row.original.issue.key.toLowerCase().includes(filterValue.toLowerCase()),
//   }),
//   columnHelper.accessor('project', {
//     header: 'Project',
//     filterFn: 'includesString',
//   }),
//   columnHelper.accessor('assignee', {
//     header: 'Assignee',
//     filterFn: 'includesString',
//   }),
//   columnHelper.accessor('status', {
//     header: 'Status',
//     filterFn: 'includesString',
//   }),
//   columnHelper.accessor('priority', {
//     header: 'Priority',
//     filterFn: 'includesString',
//   }),
// ];

// export default function Team() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);

//   const handleHeaderClick = column => {
//     // Toggle sort for the clicked column only
//     setSorting(prev => {
//       const existing = prev.find(s => s.id === column.id);
//       const newDirection =
//         !existing ? 'asc' : existing.desc ? null : 'desc';

//       if (!newDirection) return []; // remove sort
//       return [{ id: column.id, desc: newDirection === 'desc' }];
//     });
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     columnFilterFns: {
//       includesString: (row, columnId, filterValue) =>
//         String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase()),
//     },
//   });

//   return (
//     <div style={{ padding: '16px' }}>
//       <h2>Jira Issues Table (Click = Sort Only That Column)</h2>

//       <table
//         border="1"
//         cellPadding="8"
//         cellSpacing="0"
//         style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}
//       >
//         <thead>
//           {table.getHeaderGroups().map(headerGroup => (
//             <tr key={headerGroup.id} style={{ backgroundColor: '#f0f0f0' }}>
//               {headerGroup.headers.map(header => (
//                 <th
//                   key={header.id}
//                   style={{
//                     cursor: header.column.getCanSort() ? 'pointer' : 'default',
//                     textAlign: 'left',
//                     whiteSpace: 'nowrap',
//                   }}
//                   onClick={() => handleHeaderClick(header.column)}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                     <span style={{ width: '16px' }}>
//                       {{
//                         asc: '🔼',
//                         desc: '🔽',
//                       }[
//                         sorting.find(s => s.id === header.column.id)?.desc ? 'desc' : 'asc'
//                       ] ?? ''
//                       }
//                     </span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           ))}
//           {/* Column filters */}
//           <tr>
//             {table.getHeaderGroups()[0].headers.map(header => (
//               <th key={header.id}>
//                 {header.column.getCanFilter() && (
//                   <input
//                     type="text"
//                     value={header.column.getFilterValue() ?? ''}
//                     onChange={e => header.column.setFilterValue(e.target.value)}
//                     placeholder="Filter..."
//                     style={{ width: '100%' }}
//                   />
//                 )}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {table.getRowModel().rows.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length} style={{ textAlign: 'center' }}>
//                 No matching data
//               </td>
//             </tr>
//           ) : (
//             table.getRowModel().rows.map(row => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map(cell => (
//                   <td key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }




// import React, { useState } from 'react';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
//   createColumnHelper,
// } from '@tanstack/react-table';

// const columnHelper = createColumnHelper();

// const data = [
//   {
//     issue: { key: 'CLO-101', url: 'https://your-jira/browse/CLO-101' },
//     project: 'Alpha',
//     assignee: 'Alice',
//     status: 'Open',
//     priority: 'High',
//   },
//   {
//     issue: { key: 'CLO-102', url: 'https://your-jira/browse/CLO-102' },
//     project: 'Beta',
//     assignee: 'Bob',
//     status: 'In Progress',
//     priority: 'Medium',
//   },
//   {
//     issue: { key: 'CLO-103', url: 'https://your-jira/browse/CLO-103' },
//     project: 'Gamma',
//     assignee: 'Charlie',
//     status: 'Closed',
//     priority: 'Low',
//   },
// ];

// const columns = [
//   columnHelper.accessor('issue', {
//     header: 'Issue Key',
//     cell: info => (
//       <a href={info.getValue().url} target="_blank" rel="noopener noreferrer">
//         {info.getValue().key}
//       </a>
//     ),
//     filterFn: (row, columnId, filterValue) =>
//       row.original.issue.key.toLowerCase().includes(filterValue.toLowerCase()),
//   }),
//   columnHelper.accessor('project', {
//     header: 'Project',
//     filterFn: 'includesString',
//   }),
//   columnHelper.accessor('assignee', {
//     header: 'Assignee',
//     filterFn: 'includesString',
//   }),
//   columnHelper.accessor('status', {
//     header: 'Status',
//     filterFn: 'includesString',
//   }),
//   columnHelper.accessor('priority', {
//     header: 'Priority',
//     filterFn: 'includesString',
//   }),
// ];

// export default function Team() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);

//   // ✅ Only toggle sorting for clicked column
//   const handleHeaderClick = column => {
//     setSorting(prev => {
//       const current = prev.find(s => s.id === column.id);
//       if (!current) return [{ id: column.id, desc: false }]; // ascending
//       if (!current.desc) return [{ id: column.id, desc: true }]; // descending
//       return []; // remove sorting
//     });
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     columnFilterFns: {
//       includesString: (row, columnId, filterValue) =>
//         String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase()),
//     },
//     enableMultiSort: false, // Optional: prevent Shift+Click multi-sorting
//   });

//   return (
//     <div style={{ padding: '16px' }}>
//       <h2>Jira Issues Table (Single Column Sort Only)</h2>

//       <table
//         border="1"
//         cellPadding="8"
//         cellSpacing="0"
//         style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}
//       >
//         <thead>
//           {table.getHeaderGroups().map(headerGroup => (
//             <tr key={headerGroup.id} style={{ backgroundColor: '#f0f0f0' }}>
//               {headerGroup.headers.map(header => {
//                 const sort = sorting.find(s => s.id === header.column.id);
//                 const sortIcon = sort ? (sort.desc ? '🔽' : '🔼') : '';
//                 return (
//                   <th
//                     key={header.id}
//                     style={{
//                       cursor: header.column.getCanSort() ? 'pointer' : 'default',
//                       textAlign: 'left',
//                       whiteSpace: 'nowrap',
//                     }}
//                     onClick={() => handleHeaderClick(header.column)}
//                   >
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                       {flexRender(header.column.columnDef.header, header.getContext())}
//                       <span style={{ width: '16px' }}>{sortIcon}</span>
//                     </div>
//                   </th>
//                 );
//               })}
//             </tr>
//           ))}

//           {/* Filters row */}
//           <tr>
//             {table.getHeaderGroups()[0].headers.map(header => (
//               <th key={header.id}>
//                 {header.column.getCanFilter() && (
//                   <input
//                     type="text"
//                     value={header.column.getFilterValue() ?? ''}
//                     onChange={e => header.column.setFilterValue(e.target.value)}
//                     placeholder="Filter..."
//                     style={{ width: '100%' }}
//                   />
//                 )}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {table.getRowModel().rows.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length} style={{ textAlign: 'center' }}>
//                 No matching data
//               </td>
//             </tr>
//           ) : (
//             table.getRowModel().rows.map(row => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map(cell => (
//                   <td key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
