import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ButtonComponent } from '../../components/ui/button/Button'
import { FormComponent } from '../../components/ui/form/form'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { CONSTANTS } from '../../constants/Constants'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { FormType } from '../../schemas/FormField'
import { AuthService } from '../../services/auth-service/auth.service'
import { GenerateInvoiceService } from '../../services/generate-invoice-service/generate-invoice.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import classes from './GenerateInvoice.module.scss'

const GenerateInvoice: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [aggregatorFilter, setAggregatorFilter] = useState([])
  const [invoiceTableData, setInvoiceTableData] = useState([])

  useEffect(() => {
    getInvoiceTableData()
    AuthService.adminAggregatorList$.subscribe((value: any) => {
      setAggregatorFilter(value)
      invoiceForm.aggregatorId.options = value
    })
  }, [])

  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => setInvoiceNumber(true),
      tooltip: 'Add Invoice',
    },
  ]

  const statusBody = (rowData: any) => {
    return (
      <>
        {rowData?.status == 'Payment Completed' ? (
          <span className="spanStyle" style={{ color: 'green' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Pending' ? (
          <span className="spanStyle" style={{ color: '#D98F03' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Rejected' ? (
          <span className="spanStyle" style={{ color: 'red' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Partially Completed' ? (
          <span className="spanStyle" style={{ color: 'orange' }}>
            {rowData?.status}
          </span>
        ) : (
          <span className="spanStyle" style={{ color: '#000000' }}>
            {rowData?.status}
          </span>
        )}
      </>
    )
  }

  const invoiceTableColumn = [
    {
      label: 'Aggregator Name',
      fieldName: 'aggregatorName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: aggregatorFilter?.length
          ? aggregatorFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Aggregator Name',
      },
    },
    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Amount',
      fieldName: 'amount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Status',
      fieldName: 'status',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: statusBody,
    },
    {
      label: 'Pending Amount',
      fieldName: 'pendingAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Payment Date',
      fieldName: 'paymentDate',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const invoiceFormObj = {
    aggregatorId: {
      inputType: 'singleSelect',
      label: 'Aggregator Name',
      value: null,
      validation: {
        required: true,
      },
      options: aggregatorFilter,
      fieldWidth: 'col-md-6',
    },
    invoiceNumber: {
      inputType: 'inputtext',
      label: 'Invoice Number',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
    },

    paidAmount: {
      inputType: 'inputNumber',
      label: 'Amount',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      fieldWidth: 'col-md-6',
    },
    paymentDate: {
      inputType: 'singleDatePicker',
      label: 'Payment Date',
      value: null,
      validation: {
        // required: true,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
    },
  }

  const [invoiceForm, setInvoiceForm] = useState<any>(
    _.cloneDeep(invoiceFormObj)
  )

  const closeInvoicePopup = () => {
    setInvoiceNumber(false)
    setInvoiceForm(_.cloneDeep(invoiceFormObj))
  }

  const getInvoiceTableData = () => {
    new GenerateInvoiceService()
      .invoiceTableData()
      .then((response: any) => {
        console.log(response, 'jjjjjjjjttttttttt')
        setInvoiceTableData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const submitInvoiceDetails = () => {
    const obj = {
      clientId: invoiceForm?.aggregatorId?.value,
      invoiceNumber: invoiceForm?.invoiceNumber?.value,
      amount: invoiceForm?.paidAmount?.value,
      paymentDate:
        (invoiceForm?.paymentDate?.value &&
          moment(invoiceForm?.paymentDate?.value).format(
            'YYYY-MM-DD HH:MM:SS'
          )) ||
        null,
    }
    new GenerateInvoiceService()
      .submitInvoiceForm(obj)
      .then((response: any) => {
        if (response?.data?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          closeInvoicePopup()
          getInvoiceTableData()
          ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
        }
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }

  const invoiceFormHandler = (form: FormType) => {
    setInvoiceForm(form)
  }

  return (
    <>
      <DataTableBasicDemo
        buttonArr={buttonsArr}
        data={invoiceTableData}
        column={invoiceTableColumn}
        showGridlines={true}
        resizableColumns={true}
        rows={20}
        paginator={true}
        sortable={true}
        headerRequired={true}
        downloadedfileName={'Invoice'}
        scrollHeight={'calc(100vh - 65px)'}
      />

      {invoiceNumber ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header ">
              <div
                className="popup-close"
                onClick={() => {
                  closeInvoicePopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Generate Invoice</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeInvoicePopup()
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content" style={{ padding: '1rem 2rem' }}>
              <FormComponent
                form={_.cloneDeep(invoiceForm)}
                formUpdateEvent={invoiceFormHandler}
                isFormValidFlag={isFormValid}
                // updateOptions={updateOptionsObj}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                apihitting={loading}
                submitEvent={submitInvoiceDetails}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default GenerateInvoice
