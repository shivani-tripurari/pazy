import React, { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const TableCore = ({
  columns,
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

  return (
    <div className="p-1 mt-4">
      <div className="overflow-x-auto border rounded shadow-md">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.id}
                  className={`px-4 py-2 text-left ${
                    col.isSticky ? "sticky left-0 z-20 bg-gray-100" : ""
                  }`}
                >
                  {col.id === "select" ? (
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={isAllSelected()}
                      onChange={(e) => onSelectAll(e.target.checked)}
                    />
                  ) : (
                    <>{col.label}</>
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
                    className={`px-4 py-2 border-t text-sm ${
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
