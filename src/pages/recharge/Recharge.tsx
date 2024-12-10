import _, { values } from 'lodash'
import React, { FormEvent, useEffect, useState } from 'react'
import { ImageUrl } from '../../utils/ImageUrl'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import classes from './Recharge.module.scss'
import { FormComponent } from '../../components/ui/form/form'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { Chip } from 'primereact/chip'
import { RechargeService } from '../../services/recharge-service/recharge.service'
import { CONSTANTS } from '../../constants/Constants'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { MasterService } from '../../services/master-service/master.service'
import { AuthService } from '../../services/auth-service/auth.service'
import Tooltip from '@material-ui/core/Tooltip'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { APIURLS } from '../../constants/ApiUrls'
import { ButtonComponent } from '../../components/ui/button/Button'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import moment from 'moment'

const Recharge: React.FC = () => {
  const [addRechargePopup, setAddRechargePopup] = useState(false)
  // const [isFormValid, setisFormValid] = useState(true)
  const [rechargeData, setRechargeData] = useState([])
  const [walletFilterList, setWalletFilterList] = useState([])
  const [bankFilterList, setBankFilterList] = useState([])
  const [loading, setLoading] = useState(false)
  const [clientList, setClientList] = useState([])
  const [updateOptionsObj, setupdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [attachments, setAttachments]: any = useState([])
  const [file, setFile] = useState<any>([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [lastRechargeData, setLastRechargeData] = useState<any>([])
  const [invoiceNumberFilterList, setInvoiceNumberFilterList] = useState([])
  const [toggleState, setToggleState] = useState(1)
  const [pendingInvoiceData, setPendingInvoiceData] = useState([])
  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => onOperationClick(),
      tooltip: 'Add',
    },
  ]

  const toggleTab = (index: number) => {
    setToggleState(index)
    if (index == 1) {
      getRecharges()
    } else {
      pendingInvoice()
    }
  }

  const onOperationClick = () => {
    setAddRechargePopup(true)
    // console.log('eeeee')
    // setTimeout((form: FormType) => {

    // }, 0)
  }

  const offlineRechargeFormObj = {
    clientId: {
      inputType: 'singleSelect',
      label: 'Client Name',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
      options: clientList,
    },
    walletId: {
      inputType: 'singleSelect',
      label: 'Wallet Name',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      options: walletFilterList,
      fieldWidth: 'col-md-6',
    },
    bankId: {
      inputType: 'singleSelect',
      label: 'Bank',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      options: bankFilterList,
      fieldWidth: 'col-md-6',
    },
    creditAmount: {
      inputType: 'inputtext',
      label: 'Amount',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
    },
    invoiceId: {
      inputType: 'singleSelect',
      label: 'Invoice Number',
      value: null,
      validation: {
        required: true,
      },
      options: invoiceNumberFilterList,
      fieldWidth: 'col-md-6',
    },
    description: {
      inputType: 'inputtextarea',
      label: 'Additional Info',
      value: null,
      validation: {
        required: false,
        minlength: 2,
        maxlength: 2000,
      },
      fieldWidth: 'col-md-12',
    },
  }

  const [offlineRechargeForm, setOfflineRechargeForm] = useState<any>(
    _.cloneDeep(offlineRechargeFormObj)
  )

  useEffect(() => {
    getRecharges()
    getInvoiceNumberFilterList()
    // getWalletList()
    // getBankList()
    // getClientList()
    // getLastRecharge()

    AuthService.aaggregatorWalletList$.subscribe((value: any) => {
      setWalletFilterList(value)
      offlineRechargeForm.walletId.options = value
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilterList(value)
      offlineRechargeForm.bankId.options = value
    })
    AuthService.clientList$.subscribe((value: any) => {
      setClientList(value)
      offlineRechargeForm.clientId.options = value
    })
  }, [])

  const getRecharges = () => {
    new RechargeService()
      .recharges()
      .then((response: any) => {
        setRechargeData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const pendingInvoice = () => {
    new RechargeService()
      .pendingInvoice()
      .then((response: any) => {
        setPendingInvoiceData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const getLastRecharge = (reqObj: any) => {
    new RechargeService()
      .lastRecharge(reqObj)
      .then((response: any) => {
        setLastRechargeData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const formChanges = (newForm: FormType, oldForm: FormType) => {
    if (
      newForm?.clientId?.value != null &&
      newForm?.walletId?.value != null &&
      (newForm?.clientId?.value != oldForm?.clientId?.value ||
        newForm?.walletId?.value != oldForm?.walletId?.value)
    ) {
      getLastRecharge({
        clientId: newForm?.clientId?.value,
        walletId: newForm?.walletId?.value,
      })
    }
  }

  // const getWalletList = () => {
  //   new MasterService()
  //     .aggregatorWalletList()
  //     .then((response: any) => {
  //       setWalletFilterList(response)
  //       offlineRechargeForm.walletId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getBankList = () => {
  //   new MasterService()
  //     .adminBankList()
  //     .then((response: any) => {
  //       setBankFilterList(response)
  //       offlineRechargeForm.bankId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }
  const getInvoiceNumberFilterList = () => {
    new RechargeService()
      .invoiceNumberList()
      .then((response: any) => {
        console.log(response, 'jjjjjjrrrrrrrrrrr')
        setInvoiceNumberFilterList(response)
        offlineRechargeForm.invoiceId.options = response
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  // const getClientList = () => {
  //   new MasterService()
  //     .clientList()
  //     .then((response: any) => {
  //       setClientList(response)
  //       offlineRechargeForm.clientId.options = response
  //     })
  //     .catch((error: any) => [ToasterService.show(error, CONSTANTS.ERROR)])
  // }

  const offlineRechargeFormHandler = (form: FormType) => {
    setOfflineRechargeForm(form)
    formChanges(form, offlineRechargeForm)
  }

  const selectAttachment = (files: any) => {
    setAttachments([])
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name.split('.')[
            // eslint-disable-next-line no-unexpected-multiline
            eventList.name.split('.').length - 1
          ].toLowerCase() == FILE_TYPES.PDF ||
          eventList.name.split('.')[
            // eslint-disable-next-line no-unexpected-multiline
            eventList.name.split('.').length - 1
          ].toLowerCase() == FILE_TYPES.JPG ||
          eventList.name.split('.')[
            // eslint-disable-next-line no-unexpected-multiline
            eventList.name.split('.').length - 1
          ].toLowerCase() == FILE_TYPES.PNG ||
          eventList.name.split('.')[
            // eslint-disable-next-line no-unexpected-multiline
            eventList.name.split('.').length - 1
          ].toLowerCase() == FILE_TYPES.JPEG
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              'file size is too large, allowed maximum size is 10 MB.',
              'error'
            )
          } else {
            setAttachments((prevVals: any) => [...prevVals, eventList])
          }
        } else {
          ToasterService.show(
            `Invalid file format you can only attach the pdf here!`,
            'error'
          )
          eventList = null
        }
      })
    }
  }

  const removeFileHandler = (index: any) => {
    setAttachments([])
  }

  const statusBody = (rowData: any) => {
    return (
      <>
        {rowData?.status == 'Accepted' ? (
          <span className="spanStyle" style={{ color: '#0EB700' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Pending' ? (
          <span className="spanStyle" style={{ color: '#D98F03' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Rejected' ? (
          <span className="spanStyle" style={{ color: '#CB0000' }}>
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

  const allInvoiceStatusBody = (rowData: any) => {
    return (
      <>
        {rowData?.status == 'Payment Accepted' ? (
          <span className="spanStyle" style={{ color: '#0EB700' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Pending' ? (
          <span className="spanStyle" style={{ color: '#D98F03' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Rejected' ? (
          <span className="spanStyle" style={{ color: '#CB0000' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Partially Completed' ? (
          <span className="spanStyle" style={{ color: 'orange' }}>
            {rowData?.status}
          </span>
        ) : rowData?.status == 'Payment Completed' ? (
          <span className="spanStyle" style={{ color: 'green' }}>
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

  const descriptionBody = (rowData: any) => {
    return (
      <>
        <Tooltip title={rowData?.description}>
          {rowData?.description == (null || 'null') ? (
            <></>
          ) : (
            <>
              {' '}
              <span className="ellipsis-text-table">
                {rowData?.description}
              </span>
            </>
          )}
        </Tooltip>
      </>
    )
  }

  const approverCommentBody = (rowData: any) => {
    return (
      <>
        <Tooltip title={rowData?.approverComment}>
          <span className="ellipsis-text-table">
            {rowData?.approverComment}
          </span>
        </Tooltip>
      </>
    )
  }

  const walletBody = (rowData: any) => {
    return (
      <>
        {rowData?.walletName === 'General' ? (
          <div className="walletTable">
            <div className="walletTableImg">
              <img
                className="generalCoupon-bg"
                src={ImageUrl.GeneralCouponWhiteIcon}
                alt=""
              />
            </div>
            <span>{rowData?.walletName}</span>{' '}
          </div>
        ) : rowData?.walletName === 'Food' ? (
          <div className="walletTable">
            <div className="walletTableImg">
              <img
                className="foodCoupon-bg"
                src={ImageUrl.FoodCouponWhiteIcon}
                alt=""
              />
            </div>
            <span>{rowData?.walletName}</span>{' '}
          </div>
        ) : (
          <div className="walletTable">
            <div className="walletTableImg">
              <img
                className="fuelCoupon-bg"
                src={ImageUrl.FuelCouponWhiteICon}
                alt=""
              />
            </div>
            <span>{rowData?.walletName}</span>{' '}
          </div>
        )}
      </>
    )
  }

  const invoiceBody = (rowData: any) => {
    return (
      <>
        <div
          className="ctmtbltd"
          style={{ cursor: rowData?.path ? 'pointer' : 'text' }}
        >
          {rowData.path ? (
            <img
              crossOrigin="anonymous"
              src={ImageUrl.PdfIcon}
              style={{
                verticalAlign: 'middle',
                paddingRight: '2px',
                padding: '1px',
                borderRadius: '0',
              }}
              width={25}
              alt="File"
              onClick={() => {
                setFile([rowData?.path])
                setPaymentInvoice(true)
              }}
            />
          ) : null}
          <span>{rowData?.invoiceNumber}</span>
        </div>
      </>
    )
  }

  const rechargeColumn = [
    {
      label: 'Client Name',
      fieldName: 'aggregatorName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: clientList?.length
          ? clientList.map((wallet: any) => {
              return wallet.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Client',
      },
    },
    {
      label: 'Wallet',
      fieldName: 'walletName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: walletBody,
      dropDownFilter: {
        filterOptions: walletFilterList?.length
          ? walletFilterList.map((wallet: any) => {
              return wallet.label
            })
          : [],
        fieldValue: 'walletName',
        changeFilter: true,
        placeholder: 'Wallet',
      },
    },
    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: invoiceBody,
    },
    {
      label: 'Credit Amount',
      fieldName: 'creditAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Bank',
      fieldName: 'bankName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: bankFilterList?.length
          ? bankFilterList.map((bank: any) => {
              return bank.label
            })
          : [],
        fieldValue: 'bank',
        changeFilter: true,
        placeholder: 'Bank',
      },
    },
    {
      label: 'Status',
      fieldName: 'status',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: statusBody,
    },
    {
      label: 'Approver Comment',
      fieldName: 'approverComment',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: approverCommentBody,
    },
    {
      label: 'Additional Info',
      fieldName: 'description',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: descriptionBody,
    },
    // {
    //   label: 'Created By',
    //   fieldName: 'createdByName',
    //   frozen: false,
    //   sort: true,
    //   textAlign: 'left',
    //   filter: true,
    // },
    // {
    //   label: 'Created At',
    //   fieldName: 'createdAt',
    //   frozen: false,
    //   sort: true,
    //   textAlign: 'left',
    //   filter: true,
    // },
    {
      label: 'Transaction Type',
      fieldName: 'transactionType',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Transaction From',
      fieldName: 'transactionForm',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
  ]

  const pendingInvoiceColumn = [
    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Invoice Amount',
      fieldName: 'amount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Credit Amount',
      fieldName: 'creditAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Payment Date',
      fieldName: 'paymentDate',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Status',
      fieldName: 'status',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: allInvoiceStatusBody,
    },
  ]

  const addRecharge = (event: FormEvent) => {
    event.preventDefault()
    let reachargeValidityFlag: any = true
    const rechargeFormValid: boolean[] = []
    // console.log('offlineRechargeForm', offlineRechargeForm)
    _.each(offlineRechargeForm, (item: any) => {
      rechargeFormValid.push(item.valid)
      reachargeValidityFlag = reachargeValidityFlag && item.valid
      // console.log(item, reachargeValidityFlag)
    })
    setIsFormValid(reachargeValidityFlag)
    if (reachargeValidityFlag) {
      const formData: any = new FormData()
      const obj = {
        clientId: offlineRechargeForm.clientId.value,
        bankId: offlineRechargeForm.bankId.value,
        walletId: offlineRechargeForm.walletId.value,
        creditAmount: offlineRechargeForm.creditAmount.value,
        invoiceId: offlineRechargeForm.invoiceId.value,
        description: offlineRechargeForm.description.value,
      }
      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      if (attachments?.length) {
        formData.set('file', attachments[0])
      }
      setLoading(true)
      new RechargeService()
        .addRecharge(formData)
        .then((response: any) => {
          if (response?.status == HTTP_RESPONSE.SUCCESS) {
            setLoading(false)
            closePaymentPopup()
            getRecharges()
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      ToasterService.show('Please Check all the Fields!', CONSTANTS.ERROR)
    }
  }

  const closePaymentPopup = () => {
    setAddRechargePopup(false)
    setOfflineRechargeForm(_.cloneDeep(offlineRechargeFormObj))
    setAttachments([])
  }

  return (
    <>
      <div className={classes['aggregator-reports-table']}>
        <div className="tab-header">
          <ul>
            <li
              className={toggleState === 1 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(1)}
            >
              Recharge
            </li>
            <li
              className={toggleState === 2 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(2)}
            >
              All Invoice
            </li>
          </ul>
        </div>
        <div className="tab-contents">
          <div className={toggleState === 1 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              buttonArr={buttonsArr}
              data={rechargeData}
              column={rechargeColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'RechargeData'}
              scrollHeight={'calc(100vh - 72px)'}
            />
          </div>
          <div className={toggleState === 2 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={pendingInvoiceData}
              column={pendingInvoiceColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'pendingInvoiceData'}
              scrollHeight={'calc(100vh - 72px)'}
            />
          </div>
        </div>
      </div>

      {/* <div className={classes['recharge-body']}>
        <div className="row m-0">
          <div className="col-lg-12 p-0">
            <div className={classes['total-transaction-table']}>
             
            </div>
          </div>
        </div>
      </div> */}

      {addRechargePopup ? (
        <div className="popup-overlay">
          <div
            className="popup-body stretchLeft"
            style={{
              left: AuthService?.sideNavCollapse?.value ? '70px' : '200px',
              width: AuthService?.sideNavCollapse?.value
                ? 'calc(100% - 70px)'
                : 'calc(100% - 200px)',
            }}
          >
            <div className="popup-header">
              <div
                className="popup-close"
                onClick={() => {
                  setAddRechargePopup(false)
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Recharge</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  setAddRechargePopup(false)
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content">
              <div className="row mx-0 my-2">
                <div className="col-lg-8 p-0">
                  <div
                    className={
                      classes['offline-reacharge-content'] +
                      ' ' +
                      classes['add-reacharge']
                    }
                  >
                    <FormComponent
                      customClassName={
                        classes['offline-recharge-form'] +
                        ' ' +
                        'boxFieldsss rwm'
                      }
                      form={_.cloneDeep(offlineRechargeForm)}
                      formUpdateEvent={offlineRechargeFormHandler}
                      isFormValidFlag={isFormValid}
                      updateOptions={updateOptionsObj}
                    ></FormComponent>
                    {/* attachment */}
                    <div className={classes['upload-wrapper']}>
                      <label>Upload File</label>
                      <div className="row">
                        <div className="col-md-12">
                          <div className={classes['upload-file-section']}>
                            <div className={classes['upload-file']}>
                              <input
                                type="file"
                                onClick={(event: any) => {
                                  event.target.value = null
                                }}
                                onChange={(e) =>
                                  selectAttachment(e.target.files)
                                }
                                className={classes['upload']}
                              />
                              <img src={ImageUrl.FolderIconImage} />
                              <p>
                                Drag files here <span> or browse</span> <br />
                                <u>Support PDF</u>
                              </p>
                              <div className={classes['chip-tm']}>
                                {attachments?.length
                                  ? attachments.map((item: any, index: any) => {
                                      return (
                                        <Chip
                                          label={item?.name}
                                          removable
                                          onRemove={() =>
                                            removeFileHandler(index)
                                          }
                                          key={index}
                                        />
                                      )
                                    })
                                  : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* attachment */}
                  </div>
                </div>
                <div className="col-lg-4 p-0">
                  <div
                    className={
                      classes['offline-reacharge-content'] +
                      ' ' +
                      classes['wallet-funds']
                    }
                  >
                    <img src={ImageUrl.BlueWalletImg} alt="" />
                    <div className="row mx-0 my-3">
                      <p>Wallet Funds</p>
                      <h3>
                        INR{' '}
                        {lastRechargeData[0]?.totalAvailableAmount.toLocaleString(
                          'en-US'
                        )}
                      </h3>
                    </div>

                    <div className="row mx-0 my-3">
                      <div className="col-6 pl-0">
                        <p>Last Recharge</p>
                        <h5>
                          INR{' '}
                          {(lastRechargeData &&
                            lastRechargeData[0]?.lastRecharge[0]?.lastRechargeAmount.toLocaleString(
                              'en-US'
                            )) ||
                            'N/A'}
                        </h5>
                      </div>
                      <div className="col-6 pl-0">
                        <p>Date</p>
                        <h5>
                          {' '}
                          {(lastRechargeData &&
                            lastRechargeData[0]?.lastRecharge[0]
                              ?.rechargeDate &&
                            moment(
                              lastRechargeData[0]?.lastRecharge[0]?.rechargeDate
                            ).format('YYYY-MM-DD')) ||
                            'N/A'}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="popup-lower-btn">
              {/* <button className="add-funds-btn">All Funds to Wallet</button>
               */}
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                apihitting={loading}
                submitEvent={addRecharge}
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {paymentInvoice ? (
        <FileViewer
          fileArray={file}
          que={APIURLS.VIEW_RECHARGE_ATTACHMENT}
          heading="Attachment File"
          fileViewer={setPaymentInvoice}
          currentFileName={file[0]}
        />
      ) : null}
    </>
  )
}
export default Recharge
