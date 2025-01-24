/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Table.scss'
import InputTextField from '../input-text-field/InputTextField'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Tooltip } from 'primereact/tooltip'
import { Box } from '@material-ui/core'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { SingleSelectComponent } from '../../ui/single-select/SingleSelect'
import MenuList from '../../ui/menu-list/MenuList'
import { Checkbox } from 'primereact/checkbox'

type TableProps = {
  data?: any
  customClass?: string
  column: {
    label?: any
    fieldName?: string
    sort?: boolean
    width?: string
    maxwidth?: string
    body?: any
    textAlign?: string
    padding?: string
    filter?: boolean
    filterElement?: any
    onCellEditComplete?:any
    bodyStyle?: any
    frozen?: boolean
    flexGrow?: number
    flexBasis?: string
    headerStyle?: {
      width?: string
      background?: string
      maxWidth?: string
    }
    height?: string
    rowEditor?: boolean
    editor?: any
    print?: boolean
    pdfStyle?: any
    dropDownFilter?: {
      filterOptions: Array<string>
      fieldValue: string
      changeFilter: boolean
      placeholder: string
    }
  }[]
  paginator?: boolean
  sortable?: boolean
  scrollHeight?: string
  rows?: number
  frozenWidth?: any
  header?: any
  footer?: any
  globalFilter?: any
  showGridlines?: boolean
  emptyMessage?: string
  scrollable?: boolean
  editMode?: string
  dataKey?: string
  setState?: any
  onSelectionChange?: any
  selection?: any
  multipleSelect?: boolean
  originalRows?: any
  search?: boolean
  totalRows?: any
  rowsOptions?: any
  sendLazyParams?: any
  currentPageTemplate?: string
  lazy?: boolean
  rowClass?: any
  background?: string
  headerRequired?: boolean
  remove?: boolean
  toolTip?: string
  columnWidth?: string
  buttonArr?: any
  selectorArr?: any
  downloadedfileName?: string
  handleNext?: any
  pdfStyles?: any
  maximumScrollableRows?: number
  ref?: any
  stripedRows?: boolean
  resizableColumns?: boolean
}

const DataTableBasicDemo = (props: TableProps) => {
  const [globalFilters, setGlobalFilter] = React.useState<any>('')
  const [defaultRows, setDefaultRows] = React.useState(20)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedValue, setSelectedValue] = useState(null)

  useEffect(() => {
    if (props.maximumScrollableRows) {
      setDefaultRows(props.maximumScrollableRows)
    }
    if (props.rowsOptions?.length) {
      setDefaultRows(props.rowsOptions[0])
    }
  }, [])

  const reset = () => {
    setGlobalFilter('')
  }

  const {
    data,
    customClass = '',
    column,
    paginator = false,
    scrollHeight = '',
    scrollable = true,
    frozenWidth = null,
    header,
    globalFilter = globalFilters,
    footer,
    showGridlines = false,
    emptyMessage = 'No Value Found',
    editMode,
    dataKey,
    headerRequired = true,
    setState,
    onSelectionChange,
    selection = null,
    multipleSelect = false,
    originalRows = {},
    search = true,
    totalRows,
    sendLazyParams = undefined,
    currentPageTemplate = 'Showing {first} to {last} of {totalRecords}',
    lazy = false,
    rowClass,
    background = '#315791',
    columnWidth = '',
    remove = true,
    buttonArr: buttonArr = undefined,
    selectorArr,
    downloadedfileName = 'table',
    pdfStyles = undefined,
    rowsOptions,
    stripedRows,
    resizableColumns = false,
  } = props

  let data_new: any = [],
    dd: any
  const intialDisplay = [true]
  intialDisplay.pop()
  for (const col of column) {
    if (col?.print != false) {
      intialDisplay.push(true)
    }
  }

  const [display, setDisplay] = React.useState<boolean[]>(intialDisplay)
  React.useEffect(() => {
    selectorArr?.setSelector('Select Round')
  }, [])

  if (selectorArr?.selector == 'Select Round') {
    data_new = [...data]
  } else {
    for (dd in data) {
      if (data[dd].current_status == selectorArr?.selector)
        data_new.push(data[dd])
    }
  }

  const optionsTemplate = (option: any) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>
  }

  //code for export
  const dt = React.useRef<any>(null)
  const [products, setProducts] = useState([])
  const exportCSV = (selectionOnly: any) => {
    dt.current.exportCSV({ selectionOnly })
  }
  const columnVisibility = (selectionOnly: any) => {
    dt.current.exportCSV({ selectionOnly })
  }
  let iter = 0
  const exportColumns =
    column &&
    column
      .filter(({ print = true }) => print === true && display[iter++] === true)
      .map((col: any) => ({ header: col.label, dataKey: col.fieldName }))
  let flag = false
  for (const d in display) {
    if (!display[d]) {
      flag = true
    }
  }
  const pdfStylesVar = flag ? undefined : pdfStyles

  const exportPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      columns: exportColumns,
      body: data_new.length > 0 ? data_new : data,
      margin: { top: 10 },
      styles: {
        minCellHeight: 9,
        halign: 'left',
        fontSize: 8,
        cellWidth: 'auto',
        lineWidth: 0.25,
      },
      headStyles: {
        textColor: 'white',
        fontSize: 8,
      },
      columnStyles: {
        ...pdfStylesVar,
      },
    })
    doc.save(`${downloadedfileName}.pdf`)
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })
      saveAsExcelFile(excelBuffer, downloadedfileName)
    })
  }

  const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        const EXCEL_EXTENSION = '.xlsx'
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        })

        module.default.saveAs(data, `${downloadedfileName}` + EXCEL_EXTENSION)
      }
    })
  }

  const displayCol = (index?: number) => {
    const new_val = display
    if (index != undefined) new_val[index] = !display[index]
    setDisplay([...new_val])
  }
  const arr =
    column &&
    column
      .filter(({ print = true }) => print === true)
      .map((col: any, index: any) => ({
        header: col.label,
        dataKey: col.fieldName,
        label: col.label,
        // onClick: () => displayCol(),
        icon: () => {
          return (
            <Checkbox
              key={index}
              checked={display[index]}
              onChange={() => {
                displayCol(index)
              }}
            ></Checkbox>
          )
        },
      }))

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowData?: any
  ) => {
    setAnchorEl(event.currentTarget)
    //handleClose()
  }

  const Defaultheader = (
    <div className="table-header">
      <div className="export-buttons">
        <Button
          type="button"
          onClick={(e: any) => handleClick(e)}
          className="tabel-setting-btn"
          icon="pi pi-cog"
          data-pr-tooltip="Column Visibility"
        />
        <MenuList anchorEl={anchorEl} arr={arr} handleClose={handleClose} />
        {/* {remove ? <span className="export">Export Data :&nbsp;</span> : null} */}
        <Button
          type="button"
          onClick={() => exportCSV(false)}
          className="tabel-csv-btn"
          label="CSV"
          data-pr-tooltip="CSV"
        />

        <Button
          type="button"
          onClick={() => exportPdf()}
          label="PDF"
          className="p-button-warning tabel-pdf-btn"
          data-pr-tooltip="PDF"
        />

        <Button
          type="button"
          onClick={() => exportExcel()}
          label="EXCEL"
          className="p-button table-excel-button"
          data-pr-tooltip="EXCEL"
        />
        {buttonArr
          ? buttonArr?.map((x: any, index: any) => (
              <Button
                key={index}
                type="button"
                icon={x.icon ? x.icon : 'pi pi-plus'}
                label={x.label ? x.label : 'label'}
                onClick={x.addFunction}
                className="p-button-add table-upload-btn"
                data-pr-tooltip={x.tooltip ? x.tooltip : 'Tooltip'}
              />
            ))
          : null}
      </div>

      {selectorArr && selectorArr.step == 0 && (
        <SingleSelectComponent
          inputtype="singleSelect"
          key="See"
          options={[...selectorArr?.selectorOptionDetails]
            .sort()
            .map((client: any) => new Option(client, client))}
          value={selectorArr.selector}
          id="roundid"
          changed={(e: any) => selectorArr.setSelector(e)}
          blurred={() => console.log('Bluered')}
          formName=""
          disable={false}
          requiredLabel={true}
          placeholder="Select Round"
          showClear={true}
        />
      )}
      {header || !search ? (
        header
      ) : (
        <Box
          className="table-search"
          display={'flex'}
          justifyContent={'flex-end'}
        >
          <span className="p-input-icon-left">
            <i className="pi pi-search" />

            {/* type="search"  -- remove this because doesn't need cross in input search */}
            <InputText
              value={props?.globalFilter || globalFilters}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search here"
              className="search-input"
            />
            <Button
              type="button"
              label="Clear"
              className="p-button-outlined p-button-sm ctm-clr-btn"
              icon="pi pi-filter-slash"
              onClick={reset}
            />
          </span>
        </Box>
      )}
    </div>
  )
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 1,
    rows: 20,
    limit: 10,
    sortField: '',
    sortOrder: null,
  })
  const onPage = (event: any) => {
    const _lazyParams = { ...lazyParams, ...event }
    setLazyParams(_lazyParams)
    setDefaultRows(_lazyParams.rows)
  }
  const onSort = (event: any) => {
    const _lazyParams = { ...lazyParams, ...event }
    setLazyParams(_lazyParams)
  }

  const rowsPerPageOptions = (options: any, rowsOptions: any) => {
    let dropdownOptions
    if (rowsOptions?.length) {
      dropdownOptions = rowsOptions
    } else {
      dropdownOptions = [
        { label: '6', value: 6 },
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
      ]
    }
    lazyParams.limit = options.value
    return (
      <Dropdown
        value={options.value}
        options={dropdownOptions}
        onChange={options.onChange}
        appendTo={document.body}
      />
    )
  }
  const template: any = {
    layout: `CurrentPageReport FirstPageLink  PrevPageLink PageLinks NextPageLink LastPageLink Rows RowsPerPageDropdown`,
    // CurrentPageReport:'',
    FirstPageLink: '',
    PrevPageLink: '',
    PageLinks: '',
    NextPageLink: '',
    LastPageLink: '',
    RowsPerPageDropdown: (e: any) => rowsPerPageOptions(e, rowsOptions),
    CurrentPageReport: (options: any) => {
      return (
        <span className="paginatorClass">
          Showing {options.first} to {options.last} of {options.totalRecords}
        </span>
      )
    },
  }

  if (sendLazyParams) {
    sendLazyParams(lazyParams)
  }
  iter = 0
  const dynamicColumns = column?.map((item) => {
    const {
      fieldName,
      label,
      sort = false,
      width = '',
      body = null,
      onCellEditComplete = null,
      padding,
      textAlign,
      filter = false,
      bodyStyle,
      frozen = false,
      flexGrow,
      flexBasis,
      headerStyle = {
        width: columnWidth,
        background: background,
        padding: '8px 8px',
        textAlign: 'left',
        color: '#fff',
      },
      dropDownFilter = {
        changeFilter: false,
        filterOptions: [],
        fieldValue: '',
        placeholder: 'search here',
      },
      height,
      rowEditor = false,
      editor,
      print = true,
    } = item

    const columnStyle: any = {
      width: width,
      padding: padding,
      textAlign: textAlign,
      flexGrow: flexGrow,
      flexBasis: flexBasis,
      height: height,
    }
    const onFilterChange = (e: any) => {
      if (dt.current != null) {
        dt.current.filter(e.value, dropDownFilter?.fieldValue, 'equals')
      }
      setSelectedValue(e.value)
    }
    const filterFunctionality = (options: any) => {
      return (
        <Dropdown
          value={options.value}
          options={dropDownFilter?.filterOptions}
          onChange={(e) => options.filterApplyCallback(e.value)}
          itemTemplate={optionsTemplate}
          placeholder={dropDownFilter?.placeholder}
          className="p-column-filter"
          showClear
          style={{
            width: '140px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
          }}
        />
      )
    }

    if (print === true && display[iter++] === false) {
      return
    }
    return (
      <Column
        key={fieldName}
        field={fieldName}
        header={label}
        sortable={sort}
        onCellEditComplete={onCellEditComplete}
        body={body}
        frozen={frozen}
        filter={filter}
        style={columnStyle}
        filterPlaceholder="Search Here"
        bodyStyle={bodyStyle}
        // headerStyle={headerStyle}
        rowEditor={rowEditor}
        filterElement={
          dropDownFilter?.changeFilter ? filterFunctionality : null
        }
        // editor={
        //   editor
        //     ? (props) => nameEditor('products3', props, fieldName)
        //     : undefined
        // }
        editor = {editor}
      ></Column>
    )
  })

  function onEditorValueChange(productKey: any, props: any, value: any) {
    const updatedProducts = [...data_new]
    updatedProducts[props.rowIndex][props.field] = value
    setState(updatedProducts)
  }
  function inputTextEditor(productKey: any, props: any, field: any) {
    return (
      <InputTextField
        id={field}
        value={props.rowData[field]}
        onChange={(e: any) =>
          onEditorValueChange(productKey, props, e.target.value)
        }
        borderBottom={true}
      />
    )
  }
  function nameEditor(productKey: any, props: any, key: any) {
    return inputTextEditor(productKey, props, key)
  }
  function onRowEditInit(event: any) {
    const products = JSON.parse(JSON.stringify(data_new))
    originalRows[event.index] = { ...products[event.index] }
  }
  const onRowEditCancel = (e: any) => {
    const products = JSON.parse(JSON.stringify(data_new))
    products[e.index] = originalRows[e.index]
    delete originalRows[e.index]
    setState(products)
  }
  const onRowSelectionChange = (e: any) => {
    onSelectionChange(e.value)
  }

  return (
    <div
      className={'global-tablestyle' + ` ${customClass}`}
      style={{ height: scrollHeight }}
    >
      <Tooltip target=".export-buttons>button" position="bottom" />
      <DataTable
        filterDisplay="row"
        columnResizeMode="fit"
        exportFilename={downloadedfileName}
        ref={dt}
        value={data_new.length > 0 ? data_new : data}
        scrollable={true}
        scrollHeight="flex"
        // scrollHeight={scrollHeight}
        paginatorPosition="bottom"
        showGridlines={showGridlines}
        frozenWidth={frozenWidth}
        header={headerRequired ? Defaultheader : null} //
        globalFilter={globalFilter}
        emptyMessage={emptyMessage}
        footer={footer}
        paginator={paginator}
        currentPageReportTemplate={currentPageTemplate}
        resizableColumns={resizableColumns}
        // columnResizeMode="fit"
        // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
        // paginatorTemplate="{template1.CurrentPageReport}  {FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}"
        // paginatorTemplate = "RowsPerPageOptions PageLinks FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        paginatorTemplate={template}
        // paginatorLeft={paginatorLeft}
        // rows={rows ? rows : data.length}
        rows={defaultRows}
        first={lazyParams.first}
        // paginatorClassName="justify-content-space-even"
        lazy={lazy}
        // onPage={(e) => {setFirst(e.first); setRows(e.rows);setPage(e.page);setPageCount(e.pageCount)}}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyParams.sortField}
        sortOrder={lazyParams.sortOrder}
        rowHover={true}
        editMode={editMode}
        dataKey={dataKey}
        onRowEditInit={onRowEditInit}
        onRowEditCancel={onRowEditCancel}
        onSelectionChange={onRowSelectionChange}
        selection={selection}
        totalRecords={totalRows}
        //rowsPerPageOptions={(rowsOptions)}
        rowClassName={rowClass}
        // selectionMode={"checkbox"}
        stripedRows={stripedRows}
      >
        {multipleSelect && (
          <Column
            selectionMode="multiple"
            filter={true}
            className="deepak"
            headerStyle={{ textAlign: 'left' }}
            style={{ textAlign: 'left' }}
          ></Column>
        )}
        {dynamicColumns}
      </DataTable>
    </div>
  )
}

export default DataTableBasicDemo
