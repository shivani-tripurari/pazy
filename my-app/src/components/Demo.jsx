import React, {useState, useMemo} from "react";
import { TABLE_HEADER, INITIAL_DATA } from "../constants/mock.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

import TableCore from "./TableCore.jsx";

const Demo = () => {

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

    // for dragging feature

      const isAllSelected = () => {
        return paginatedData?.length > 0 && paginatedData.every((row)=>selectedRows[row.tableId]);
      }

    return(

            <div className="p-1 mt-4">
                <h1>This is from dumb test component.</h1>
               <TableCore 
                columns={columns}
                setColumns={setColumns}
                data={data}
                selectedRows={selectedRows}
                onRowSelect={(id)=>{
                    setSelectedRows(prev => ({
                        ...prev, 
                        [id]: !prev[id]
                    }));
                }}
                onSelectAll={(checked)=>{
                    const newSelected = {};
                    if(checked){
                        paginatedData.forEach(row => {
                            newSelected[row.tableId] = true;
                        });
                    }
                    setSelectedRows(checked ? newSelected : {});
                }}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                // onDragEnd={handleDragEnd}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
                // handleResize={handleResize}
               />
            </div>

    )
}

export default Demo;