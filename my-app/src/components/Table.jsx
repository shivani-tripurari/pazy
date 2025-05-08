import React, {useState, useMemo} from "react";
import { TABLE_HEADER, INITIAL_DATA } from "../constants/mock.js";

const Table = () => {

    //local states
    const [columns, setColumns] = useState(TABLE_HEADER);
    const [data, setData] = useState(INITIAL_DATA);
    const [selectedRows, setSelectedRows] = useState({});
    const [sortConfig, setSortConfig] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //sorting , dragging logic

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

    return(

            <div className="p-1 mt-4">
                <div className="overflow-x-auto border rounded shadow-md">
                    <table className="min-w-full table-fixed">
                        {/* rendering table hearders */}
                        <thead className="bg-gray-100" >
                            <tr>
                                {columns.map((col, i)=>(
                                    <th
                                        key={col.id}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* rendering table's body */}
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
                                    onChange={() =>
                                        setSelectedRows((prev) => ({
                                        ...prev,
                                        [row.tableId]: !prev[row.tableId],
                                        }))
                                    }
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
            </div>

    )
}

export default Table;