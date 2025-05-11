import React, { useMemo, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const TableCore = ({
  columns,
  setColumns,
  data,
  selectedRows,
  onRowSelect,
  onSelectAll,
  sortConfig,
  onSortChange,
  onDragEnd,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {

  const tableRef = useRef(null);
  const resizingColId = useRef(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const sorted = [...data].sort((a, b) => {
      const valA = typeof a[sortConfig.key] === "string" ? a[sortConfig.key] : Number(a[sortConfig.key]);
      const valB = typeof b[sortConfig.key] === "string" ? b[sortConfig.key] : Number(b[sortConfig.key]);
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
    return sorted;
  }, [data, sortConfig]);

  const paginatedData = sortedData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const isAllSelected = () =>
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows[row.tableId]);

    const startResizing = (e, columnId) => {
      resizingColId.current = columnId;
      document.addEventListener("mousemove", handleResizing);
      document.addEventListener("mouseup", stopResizing);
    };
  
    const handleResizing = (e) => {
      if (!resizingColId.current) return;
  
      const colIndex = columns.findIndex((c) => c.id === resizingColId.current);
      if (colIndex === -1) return;
  
      const tableLeft = tableRef.current.getBoundingClientRect().left;
      const currentOffset = columns
        .slice(0, colIndex)
        .reduce((sum, col) => sum + (col.width || 150), 0);
      const newWidth = e.clientX - tableLeft - currentOffset;
  
      if (newWidth >= 50) {
        const updatedCols = [...columns];
        updatedCols[colIndex] = {
          ...updatedCols[colIndex],
          width: newWidth,
        };
        setColumns(updatedCols);
      }
    };
  
    const stopResizing = () => {
      document.removeEventListener("mousemove", handleResizing);
      document.removeEventListener("mouseup", stopResizing);
      resizingColId.current = null;
    };

  return (
    <div className="p-1 mt-4" ref={tableRef}>
      <div className="overflow-x-auto border rounded shadow-md">
        <div style={{ minWidth: `${columns.length * 200}px`, maxWidth: "100%" }}>
        <table className="w-full table-fixed">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.id}
                  style={{position: 'relative', width: col.width || 150}}
                  className={`px-4 py-2 text-left border-l border-r ${
                    col.isSticky ? "sticky left-0 z-20 bg-gray-100" : ""
                  }`}
                >
                  <div className="px-2">
                  {col.id === "select" ? (
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={isAllSelected()}
                      onChange={(e) => onSelectAll(e.target.checked)}
                    />
                  ) : (
                    <>
                      {col.label}
                    </>
                    
                  )}</div>
                   {col.id !== "select" && (
                    <div
                      onMouseDown={(e) => startResizing(e, col.id)}
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-transparent group-hover:bg-blue-300"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.tableId} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.id}
                    style={{width:col.width}}
                    className={`px-4 py-2 border-t text-sm border-l border-r ${
                      col.isSticky ? "sticky left-0 z-10 bg-white" : ""
                    }`}
                  >
                    {col.id === "select" ? (
                      <input
                        type="checkbox"
                        checked={!!selectedRows[row.tableId]}
                        onChange={() => onRowSelect(row.tableId)}
                      />
                    ) : (
                      <span>{row[col.id]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-2 bg-white border-t">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {currentPage + 1} of {Math.ceil(sortedData.length / rowsPerPage)}
          </span>

          <button
            onClick={() =>
              onPageChange(
                currentPage + 1 < Math.ceil(sortedData.length / rowsPerPage)
                  ? currentPage + 1
                  : currentPage
              )
            }
            disabled={currentPage >= Math.ceil(sortedData.length / rowsPerPage) - 1}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

          <select
            className="ml-4 px-2 py-1 border rounded text-sm"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          >
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>
                Show {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TableCore;
