import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataTableBasicDemo from "../../components/ui/table/Table";
import { InputComponent } from "../../components/ui/input/Input";

const EditableTable = (props:any) => {
    const {tableData,setTableData} = props;

//   const [numRows, setNumRows] = useState(0); // Number of rows from input
   // Dynamic table data

  // Generate rows based on the input number
  const handleRowGeneration = () => {
    const rows = Array.from({ length: props?.noOfRows || 0 }, (_, i) => ({
      id: i + 1,
      resourceType: "",
      manMonthRate: "",
    }));
    setTableData(rows);
  };

  useEffect(() => {
    const rows = Array.from({ length: props?.noOfRows || 0 }, (_, i) => ({
        id: i + 1,
        resourceType: "",
        manMonthRate: "",
      }));
      setTableData(rows);
    
  },[props?.noOfRows])

  // Handle cell edit
  const onCellEditComplete = (e:any) => {
    console.log('eeeee--->',e);
    const { rowData, field, newValue } = e;
    const updatedRows = tableData.map((row:any) =>
      row.id === rowData.id ? { ...row, [field]: newValue } : row
    );
    setTableData(updatedRows);
  };

  // Render input editor for Resource Type and Man Month Rate
  const textEditor = (options:any,rowIndex:any) => {
    return (
        <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        placeholder="Enter value"
        style={{ width: "100%" }}
      />
    
    );
  };

  // Submit data
  const handleSubmit = () => {
    console.log("Submitted Data:", tableData);
    alert(JSON.stringify(tableData, null, 2));
  };
  const editableColumns = [
        {
          label: "Resource Type",
          fieldName: "resourceType",
          textAlign: "left",
          fieldValue: "resourceType",
          //   changeFilter: true,
          editor:(options:any,rowIndex:any) => textEditor(options,rowIndex),
          onCellEditComplete:onCellEditComplete,  
        },
        {
          label: "Man Month Rate",
          fieldName: "manMonthRate",
          textAlign: "left", 
          fieldValue: "manMonthRate",
          editor:(options:any,rowIndex:any) => textEditor(options,rowIndex),
          onCellEditComplete:onCellEditComplete,  
        },
  ]

  return (
    <div>
       <DataTableBasicDemo
            data={tableData}
            column={editableColumns}
            showGridlines={true}
            resizableColumns={true}
            editMode="cell"
            headerRequired={false}
        />
    </div>
  );
};

export default EditableTable;
