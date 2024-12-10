import { Theme, withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { Dropdown } from 'primereact/dropdown'
import React, { useEffect, useRef, useState } from 'react'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { Loader } from '../../components/ui/loader/Loader'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { APIURLS } from '../../constants/ApiUrls'
import { CONSTANTS } from '../../constants/Constants'
import { AggregatorAnalyticsService } from '../../services/aggregator-analytics-service/aggregator-analytics.service'
import { CouponHistoryService } from '../../services/coupon-history-service/coupon-history.service'
import { MasterService } from '../../services/master-service/master.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { ImageUrl } from '../../utils/ImageUrl'
import './AggregatorAnalytics.scss'
import classes from './AggregatorAnalytics.module.scss'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { InputText } from 'primereact/inputtext'
import { ButtonComponent } from '../../components/ui/button/Button'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import moment from 'moment'
import { FormComponent } from '../../components/ui/form/form'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import _, { values } from 'lodash'
import { Chip } from 'primereact/chip'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { AuthService } from '../../services/auth-service/auth.service'

// const [toggleState, setToggleState] = useState(1)

const AggregatorAnalytics: React.FC = () => {
  const history = useHistory()
  const [toggleState, setToggleState] = useState(1)
  const [brandFilter, setBrandsFilter] = useState([])
  const [brandsCode, setBrandsCode] = useState([])
  const [currencyFilter, setcurrencyFilter] = useState([])
  const [countryFilter, setCountryFilter] = useState([])
  const [redeemedCouponsReportData, setRedeemedCouponsReportData] = useState([])
  const [paymentData, setPaymentData] = useState([])
  const [aggregatorData, setAggregatorData] = useState([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [rechargeRequestInvoice, setRechargeRequestInvoice] = useState(false)
  const [file, setFile] = useState<any>([])
  const [isFormValid, setIsFormValid] = useState(true)
  const [selectedClient, setSelectedClient] = useState(null)
  const [avlbRdmCdtData, setAvlbRdmCdtData] = useState<any>()
  const [walletTypeData, setWalletTypeData] = useState([])
  const [loader, setLoader] = useState(false)
  const [rechargeRequestData, setRechargeRequestData] = useState([])
  const [actionDiv, setActionDiv] = useState(false)
  const [rowData, setRowData] = useState<any>()
  const [approverCommentPopup, setApproverCommentPopup] = useState(false)
  const [approverComment, setApproverComment] = useState<any>(null)
  const [isApprovedRecharge, setIsApprovedRecharge] = useState(false)
  const menu = useRef<any>()
  const [bankFilter, setBankFilter] = useState([])
  const [aggregatorFilter, setAggregatorFilter] = useState([])
  const [walletFilter, setWalletFilter] = useState([])
  const [addAggregatorRechargePopup, setAddAggregatorRechargePopup] =
    useState(false)
  const [attachments, setAttachments]: any = useState([])
  const [loading, setLoading] = useState(false)
  const [updateOptionsObj, setupdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [clientFilter, setAllClientFilter] = useState([])
  const [adminAggregatorList, setAdminAggregatorList] = useState([])
  const [invoiceNumberFilterList, setInvoiceNumberFilterList] = useState([])
  const [storeDropdownList, setStoreDropdownList] = useState([])

  useEffect(() => {
    // getBrandsFilterList()
    // getCountryList()
    getAggregatorData()
    getInvoiceNumberFilterList()
    // getBankList()
    // getAllClientList()
    // getAggregatorList()
    // getWalletList()
    AuthService.adminAggregatorList$.subscribe((value: any) => {
      setAdminAggregatorList(value)
    })
    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setcurrencyFilter(value)
    })
    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandsCode(value)
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilter(value)
      addRechargeForm.bankId.options = value
    })
    AuthService.adminAggregatorList$.subscribe((value: any) => {
      setAggregatorFilter(value)
      addRechargeForm.aggregatorId.options = value
    })
    AuthService.allClientList$.subscribe((value: any) => {
      setAllClientFilter(value)
    })
    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletFilter(value)
      addRechargeForm.walletId.options = value
    })
    AuthService.storeList$.subscribe((value: any) => {
      setStoreDropdownList(value)
    })
  }, [])

  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrandsFilter(response.brands)
  //       setBrandsCode(response.brandsCode)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getBankList = () => {
  //   new MasterService()
  //     .adminBankList()
  //     .then((response: any) => {
  //       setBankFilter(response)
  //       addRechargeForm.bankId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getAggregatorList = () => {
  //   new MasterService()
  //     .adminAggregatorList()
  //     .then((response: any) => {
  //       addRechargeForm.aggregatorId.options = response
  //       setAggregatorFilter(response)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getAllClientList = () => {
  //   new MasterService()
  //     .allClientList()
  //     .then((response: any) => {
  //       setAllClientFilter(response)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getWalletList = () => {
  //   new MasterService()
  //     .walletList()
  //     .then((response: any) => {
  //       addRechargeForm.walletId.options = response
  //       setWalletFilter(response)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getCountryList = () => {
  //   new MasterService()
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setCountryFilter(response?.country)
  //       setcurrencyFilter(response?.currency)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const getRedeemCouponReport = () => {
    new CouponHistoryService()
      .redeemedCouponReport()
      .then((response: any) => {
        setRedeemedCouponsReportData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const getPaymentData = () => {
    new AggregatorAnalyticsService()
      .paymentData()
      .then((response: any) => {
        setPaymentData(response)
      })
      .catch((error: any) => ToasterService.show(error, CONSTANTS.ERROR))
  }

  const getAggregatorData = () => {
    new AggregatorAnalyticsService()
      .clientData()
      .then((response: any) => {
        setAvlbRdmCdtData(response)
        setAggregatorData(response?.tabularData)
        setWalletTypeData(response?.walletData)
      })
      .catch((error: any) => ToasterService.show(error, CONSTANTS.ERROR))
  }

  const getRecahrgeRequestData = () => {
    new AggregatorAnalyticsService()
      .rechargeRequestData()
      .then((response: any) => {
        setRechargeRequestData(response)
      })
      .catch((error) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const getInvoiceNumberFilterList = () => {
    new AggregatorAnalyticsService()
      .invoiceNumberList()
      .then((response: any) => {
        setInvoiceNumberFilterList(response)
        addRechargeForm.invoiceId.options = response
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const approveRejectRecharge = () => {
    new AggregatorAnalyticsService()
      .approveRejectRechargeRequest({
        rechargeId: rowData?.rechargeId,
        isApproved: isApprovedRecharge ? 1 : 0,
        clientId: rowData?.clientId,
        approverComment: approverComment,
      })
      .then((response: any) => {
        if (response?.data?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          getRecahrgeRequestData()
          setApproverComment(null)
        }
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
    setApproverCommentPopup(false)
    getAggregatorData()
  }

  const items = [
    {
      label: 'Approve',
      icon: 'pi pi-check',
      command: () => {
        setApproverCommentPopup(true)
        setIsApprovedRecharge(true)
      },
    },
    {
      label: 'Reject',
      icon: 'pi pi-times',
      command: () => {
        setApproverCommentPopup(true)
        setIsApprovedRecharge(false)
      },
    },
  ]

  const actionBody = (rowData: any) => {
    return (
      <>
        <div className="actionMenuDiv">
          <Menu model={items} popup ref={menu} id="popup_ActionMenu" />
          <i
            className=" pi pi-ellipsis-v actionMenuBtn"
            onClick={(event: any) => {
              menu.current.toggle(event)
              setRowData(rowData)
            }}
            aria-controls="popup_ActionMenu"
            aria-haspopup
          />
        </div>
      </>
    )
  }
  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => onOperationClick(),
      tooltip: 'Add',
    },
  ]

  const onOperationClick = () => {
    setAddAggregatorRechargePopup(true)
  }
  // const addRechargeBody = (rowData: any) => {
  //   return (
  //     <>
  //       <div
  //         className="add-recharge-div"
  //         onClick={() => setAddAggregatorRechargePopup(true)}
  //       >
  //         <div className="plus-icon">
  //           <i className=" pi pi-plus"></i>
  //         </div>
  //         <span>Add Recharge</span>
  //       </div>
  //     </>
  //   )
  // }

  const addRechargeFormHandler = (form: FormType) => {
    setAddRechargeForm(form)
    formChanges(form, addRechargeForm)
  }

  const formChanges = async (newForm: FormType, oldForm: FormType) => {
    if (
      newForm?.aggregatorId?.value &&
      newForm?.aggregatorId?.value != oldForm?.aggregatorId?.value
    ) {
      newForm.clientId.disable = false
      const filteredClientList = clientFilter.filter(
        (item: any) => item.aggregatorId == newForm.aggregatorId.value
      )
      newForm.clientId.options = filteredClientList
      // let response = []
      // try {
      //   response = await new MasterService().adminClientList({
      //     clientId: newForm?.aggregatorId?.value,
      //   })
      // } catch (error: any) {
      //   return {}
      // } finally {
      //   console.log(response, newForm.clientId.options, 'finally')
      //   newForm.clientId.disable = false
      //   newForm.clientId.options = response
      // }
    }
  }

  const addRechargeFormObj = {
    aggregatorId: {
      inputType: 'singleSelect',
      label: 'Select Aggregator',
      value: null,
      validation: {
        required: true,
      },
      options: aggregatorFilter,
      placeholder: 'Select Aggregator',
      fieldWidth: 'col-md-6',
    },
    clientId: {
      inputType: 'singleSelect',
      label: 'Select Client',
      value: null,
      validation: {
        required: true,
      },
      options: [],
      placeholder: 'Select Client',
      fieldWidth: 'col-md-6',
      disable: true,
    },
    walletId: {
      inputType: 'singleSelect',
      label: 'Select Wallet',
      value: null,
      validation: {
        required: true,
      },
      options: walletFilter,
      placeholder: 'Select Wallet',
      fieldWidth: 'col-md-6',
    },
    creditAmount: {
      inputType: 'inputNumber',
      label: 'Enter Amount',
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-6',
    },
    bankId: {
      inputType: 'singleSelect',
      label: 'Bank Name',
      value: null,
      validation: {
        required: true,
      },
      options: bankFilter,
      fieldWidth: 'col-md-6',
    },
    // invoiceNumber: {
    //   inputType: 'inputtext',
    //   label: 'Invoice Number',
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   // options: [],
    //   fieldWidth: 'col-md-6',
    // },
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
      },
      fieldWidth: 'col-md-6',
    },
  }

  const [addRechargeForm, setAddRechargeForm] = useState<any>(
    _.cloneDeep(addRechargeFormObj)
  )

  const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip)

  const brandBody = (rowData: any) => {
    if (rowData?.brandName && rowData?.brandLogo) {
      return (
        <div className="ctmtbltd">
          <HtmlTooltip
            title={
              <React.Fragment>
                <img
                  crossOrigin="anonymous"
                  src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.brandLogo}`}
                  style={{ verticalAlign: 'middle', paddingRight: '2px' }}
                  width={150}
                  alt="Brand Logo"
                />
              </React.Fragment>
            }
          >
            <img
              crossOrigin="anonymous"
              src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.brandLogo}`}
              style={{ verticalAlign: 'middle', paddingRight: '2px' }}
              width={25}
              alt="Brand Logo"
            />
          </HtmlTooltip>
          <span>{rowData.brandName}</span>
        </div>
      )
    } else if (rowData?.brandName) {
      return (
        <div className="ctmtbltd">
          <span>{rowData?.brandName}</span>
        </div>
      )
    }
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
          onClick={() => {
            if (rowData?.path) {
              setFile([rowData?.path])
              setPaymentInvoice(true)
            }
          }}
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
            />
          ) : null}
          <span>{rowData?.invoiceNumber}</span>
        </div>
      </>
    )
  }

  const rechargeRequestInvoiceBody = (rowData: any) => {
    return (
      <>
        <div
          className="ctmtbltd"
          style={{ cursor: rowData?.path ? 'pointer' : 'text' }}
          onClick={() => {
            if (rowData?.path) {
              setFile([rowData?.path])
              setRechargeRequestInvoice(true)
            }
          }}
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
            />
          ) : null}
          <span>{rowData?.invoiceNumber}</span>
        </div>
      </>
    )
  }

  const selectAttachment = (files: any) => {
    setAttachments([])
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name.split('.')[
            // eslint-disable-next-line no-unexpected-multiline
            eventList.name.split('.').length - 1
          ].toLowerCase() == FILE_TYPES.PDF
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

  const submitAddRecharge = (event: any) => {
    event.preventDefault()
    let addRechargeValidityFlag = true
    const addRechargeValid: boolean[] = []
    _.each((element: any) => {
      if (element.required) {
        addRechargeValid.push(element.valid)
        addRechargeValidityFlag = addRechargeValidityFlag && element.valid
      }
    })
    setIsFormValid(addRechargeValidityFlag)
    if (addRechargeValidityFlag) {
      const formdata: any = new FormData()
      const Obj = {
        clientId: addRechargeForm?.clientId?.value,
        walletId: addRechargeForm?.walletId?.value,
        creditAmount: addRechargeForm?.creditAmount?.value,
        bankId: addRechargeForm?.bankId?.value,
        // invoiceNumber: addRechargeForm?.invoiceNumber?.value,
        invoiceId: addRechargeForm?.invoiceId?.value,
        description: addRechargeForm?.description?.value,
      }
      Object.entries(Obj).forEach(([key, value]: any) => {
        formdata.set(key, value)
      })
      if (attachments?.length) {
        formdata.set('file', attachments[0])
      }
      setLoading(true)
      new AggregatorAnalyticsService()
        .addRecharge(formdata)
        .then((response: any) => {
          // console.log('success', response)
          if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
            // console.log('success-if')
            getPaymentData()
            closeAddRechargePopup()
            setLoading(false)
            ToasterService.show(response?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
      setAddAggregatorRechargePopup(false)
    }
  }

  const pushtoAggregatorInfo = (navigateTo: string, rowData: any) => {
    history.push({
      pathname:
        navigateTo === 'client'
          ? ROUTE_CONSTANTS.AGGREGATOR_CLENT_INFO
          : ROUTE_CONSTANTS.AGGREGATOR_WALLET_INFO,
      state: rowData,
    })
  }

  const clientCountBody = (rowData: any) => {
    return (
      <>
        <span
          className={
            rowData?.clientCount > 0 ? 'clickable-span' : 'non-clickable-span'
          }
          onClick={() => {
            rowData?.clientCount && pushtoAggregatorInfo('client', rowData)
          }}
        >
          {rowData?.clientCount}
        </span>
      </>
    )
  }

  const walletInfoBody = (rowData: any) => {
    return (
      <>
        <span
          className={
            rowData?.walletCount > 0 ? 'clickable-span' : 'non-clickable-span'
          }
          onClick={() => {
            rowData?.walletCount && pushtoAggregatorInfo('wallet', rowData)
          }}
        >
          {rowData?.walletCount}
        </span>
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
            <span className="ellipsis-text-table">{rowData?.description}</span>
          )}
        </Tooltip>
      </>
    )
  }

  const aggregatorColumn = [
    {
      label: 'Aggregator Name ',
      fieldName: 'name',
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
        placeholder: 'Client',
      },
    },
    {
      label: 'Aggregator Email',
      fieldName: 'email',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Parent Name',
      fieldName: 'parentName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: adminAggregatorList?.length
          ? adminAggregatorList.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'parentName',
        changeFilter: true,
        placeholder: 'Parent Name',
      },
    },
    {
      label: 'Phone Number',
      fieldName: 'phoneNumber',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Total Credited Amount',
      fieldName: 'totalCreditedAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Total Redeemed Amount',
      fieldName: 'totalRedeemedAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Client Count',
      fieldName: 'clientCount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: clientCountBody,
    },
    {
      label: 'Wallet Count',
      fieldName: 'walletCount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: walletInfoBody,
    },
    {
      label: 'Total Commission',
      fieldName: 'totalCommission',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Total Available Amount',
      fieldName: 'totalAvailableAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
  ]

  const paymentColumn = [
    {
      label: 'Bank Name',
      fieldName: 'bankName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: bankFilter?.length
          ? bankFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'bankName',
        changeFilter: true,
        placeholder: 'Bank',
      },
    },
    {
      label: 'Client Name',
      fieldName: 'clientName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: clientFilter?.length
          ? clientFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Client',
      },
    },
    {
      label: 'Client Email',
      fieldName: 'clientEmail',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Parent Name',
      fieldName: 'parentName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: adminAggregatorList?.length
          ? adminAggregatorList.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'Parent Name',
        changeFilter: true,
        placeholder: 'Parent Name',
      },
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
      label: 'Wallet Name',
      fieldName: 'walletName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: walletBody,
      dropDownFilter: {
        filterOptions: walletFilter?.length
          ? walletFilter.map((brand: any) => {
              return brand?.label
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
      label: 'Payment Date',
      fieldName: 'createdAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Created By',
      fieldName: 'createdByName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const redeemVoucherColumn = [
    {
      label: 'Client Name',
      fieldName: 'aggregatorName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: clientFilter?.length
          ? clientFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Client',
      },
    },
    {
      label: 'Client Email',
      fieldName: 'aggregatorEmail',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Parent Name',
      fieldName: 'parentName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: adminAggregatorList?.length
          ? adminAggregatorList.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'parentName',
        changeFilter: true,
        placeholder: 'Parent Name',
      },
    },
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandFilter?.length
          ? brandFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand',
      },
      body: brandBody,
    },

    {
      label: 'Amount Charged',
      fieldName: 'amountCharged',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Currency Code',
      fieldName: 'currencyCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: currencyFilter?.length
          ? currencyFilter.map((currency: any) => {
              return currency.label
            })
          : [],
        fieldValue: 'currencyCode',
        changeFilter: true,
        placeholder: 'Currency Code',
      },
    },
    {
      label: 'Currency Value',
      fieldName: 'currencyValue',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Denomination',
      fieldName: 'denomination',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Quantity',
      fieldName: 'quantity',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Total Order',
      fieldName: 'orderTotal',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Discount Percent',
      fieldName: 'discountPercent',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Order Discount',
      fieldName: 'orderDiscount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Wallet Name',
      fieldName: 'walletName',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: walletBody,
      dropDownFilter: {
        filterOptions: walletFilter?.length
          ? walletFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'walletName',
        changeFilter: true,
        placeholder: 'Wallet',
      },
    },
    {
      label: 'Created At',
      fieldName: 'createdAt',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Order Id',
      fieldName: 'orderId',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Order Status',
      fieldName: 'orderStatus',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Recipient Email',
      fieldName: 'recipientEmail',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Email Delivered At',
      fieldName: 'emailDeliveredOn',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Recipient Phone',
      fieldName: 'recipientPhone',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'SMS Delivered At',
      fieldName: 'smsDeliveredAt',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Tag',
      fieldName: 'tag',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Delivery Status',
      fieldName: 'deliveryStatus',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'PO Number',
      fieldName: 'poNumber',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Store Name',
      fieldName: 'storeName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: storeDropdownList?.length
          ? storeDropdownList.map((storeItem: any) => {
              return storeItem.label
            })
          : [],
        fieldValue: 'storeName',
        changeFilter: true,
        placeholder: 'Store Name',
      },
    },
  ]

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

  const rechargeRequestColumn = [
    {
      label: 'Action',
      fieldName: 'icon',
      textAlign: 'center',
      sort: false,
      filter: false,
      frozen: false,
      body: actionBody,
    },
    {
      label: 'Client Name',
      fieldName: 'aggregatorName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: clientFilter?.length
          ? clientFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Client',
      },
    },
    {
      label: 'Client Email',
      fieldName: 'clientEmail',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Parent Name',
      fieldName: 'createdByName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: aggregatorFilter?.length
          ? aggregatorFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'createdByName',
        changeFilter: true,
        placeholder: 'Parent Name',
      },
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
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: rechargeRequestInvoiceBody,
    },
    {
      label: 'Wallet Name',
      fieldName: 'walletName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: walletBody,
      dropDownFilter: {
        filterOptions: walletFilter?.length
          ? walletFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'walletName',
        changeFilter: true,
        placeholder: 'Wallet',
      },
    },
    {
      label: 'Bank Name',
      fieldName: 'bankName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: bankFilter?.length
          ? bankFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'bankName',
        changeFilter: true,
        placeholder: 'Bank',
      },
    },
    {
      label: 'Payment Date',
      fieldName: 'createdAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Created By',
      fieldName: 'createdByName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Description',
      fieldName: 'description',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: descriptionBody,
    },
  ]

  const toggleTab = (index: number) => {
    setToggleState(index)
    index == 1
      ? getAggregatorData()
      : index == 2
      ? getPaymentData()
      : index == 3
      ? getRedeemCouponReport()
      : getRecahrgeRequestData()
  }

  const closeAddRechargePopup = () => {
    setAttachments([])
    setAddRechargeForm(_.cloneDeep(addRechargeFormObj))
    setAddAggregatorRechargePopup(false)
  }

  const closeApproverCommentPopup = () => {
    setApproverCommentPopup(false)
    setApproverComment(null)
  }

  return loader ? (
    <Loader />
  ) : (
    <>
      <div className={classes['aggregator-dashboard']}>
        <div className="row mx-0 mb-1">
          <div className="col-lg-3 col-md-3 p-0">
            <div
              className={
                classes['coupon-card'] + ' ' + classes['available-card']
              }
            >
              <p className={classes['textWithImg']}>Total Available Amount </p>
              <span>
                {' '}
                <img src={ImageUrl.WalletImg} alt="" />
              </span>
              <h4>
                {avlbRdmCdtData?.totalAvailableAmount?.toLocaleString() || 0}
              </h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 p-0">
            <div
              className={
                classes['coupon-card'] + ' ' + classes['reedemed-amount-card']
              }
            >
              <p className={classes['textWithImg']}>
                Reedemed Amount{' '}
                <span>
                  {' '}
                  <img src={ImageUrl.MagicWand} alt="" />
                </span>
              </p>
              <h4>
                {avlbRdmCdtData?.totalRedeemAmount?.toLocaleString() || 0}
              </h4>
            </div>
          </div>

          <div className="col-lg-3 col-md-3 p-0">
            <div
              className={
                classes['coupon-card'] + ' ' + classes['credit-amount-card']
              }
            >
              <p className={classes['textWithImg']}>
                Credit Amount{' '}
                <span>
                  {' '}
                  <img src={ImageUrl.CreditImg} alt="" />
                </span>
              </p>
              <h4>
                {avlbRdmCdtData?.totalCreditAmount?.toLocaleString() || 0}
              </h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 p-0">
            <div
              className={
                classes['last-recharge-card'] + ' ' + classes['coupon-card']
              }
            >
              <p className={classes['textWithImg']}>
                Last Recharge{' '}
                <span>
                  {' '}
                  <img src={ImageUrl.Calendar} alt="" />
                </span>
              </p>
              <h4>
                {avlbRdmCdtData?.lastRecharge[0]?.lastRechargeAmount?.toLocaleString() ||
                  0}
              </h4>
              <h6>
                Last Recharge Date{' '}
                <span>
                  {(avlbRdmCdtData?.lastRecharge[0]?.lastRechargeDate &&
                    moment(
                      avlbRdmCdtData?.lastRecharge[0]?.lastRechargeDate
                    ).format('YYYY-MM-DD')) ||
                    'N/A'}
                </span>
              </h6>
            </div>
          </div>
        </div>

        {/* <div className="row wallet-row m-0">
          <h4>Wallet</h4>
          {walletTypeData?.length ? (
            <>
              {walletTypeData.map((wallet: any, index: number) => {
                return wallet?.name === 'General' ? (
                  <div className="col-lg-4 col-md-4 p-0" key={index}>
                    <div className="wallet-card general-wallet-card ml-0">
                      <div className="perfect-center-column card-logo">
                        <div className="card-logo-circle perfect-center">
                          <img src={ImageUrl.GeneralCoupon} alt="" />
                        </div>
                        <p>{wallet?.name}</p>
                      </div>
                      <div className="wallet-details perfect-right-column general-wallet-details">
                        <h5>
                          INR{' '}
                          {wallet?.availableAmount ? (
                            <>{wallet?.availableAmount.toLocaleString()}</>
                          ) : (
                            <>0</>
                          )}{' '}
                        </h5>

                        <p>
                          Credit:
                          <span className="text-success">
                            {wallet?.totalCreditedAmount ? (
                              <>
                                {wallet?.totalCreditedAmount.toLocaleString()}
                              </>
                            ) : (
                              <>0</>
                            )}
                          </span>
                        </p>
                        <p>
                          Reedemed:
                          <span className="text-danger">
                            {wallet?.totalRedeemedAmount ? (
                              <>
                                {wallet?.totalRedeemedAmount.toLocaleString()}
                              </>
                            ) : (
                              <>0</>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : wallet?.name === 'Food' ? (
                  <div className="col-lg-4 col-md-4 p-0" key={index}>
                    <div className="wallet-card food-wallet-card ml-0">
                      <div className="perfect-center-column card-logo">
                        <div className="card-logo-circle perfect-center">
                          <img src={ImageUrl.FoodCoupon} alt="" />
                        </div>
                        <p>{wallet?.name}</p>
                      </div>
                      <div className="wallet-details perfect-right-column food-wallet-details">
                        <h5>
                          INR{' '}
                          {wallet?.availableAmount ? (
                            <>{wallet?.availableAmount.toLocaleString()}</>
                          ) : (
                            <>0</>
                          )}{' '}
                        </h5>

                        <p>
                          Credit:
                          <span className="text-success">
                            {wallet?.totalCreditedAmount ? (
                              <>
                                {wallet?.totalCreditedAmount.toLocaleString()}
                              </>
                            ) : (
                              <>0</>
                            )}
                          </span>
                        </p>
                        <p>
                          Reedemed:
                          <span className="text-danger">
                            {wallet?.totalRedeemedAmount ? (
                              <>
                                {wallet?.totalRedeemedAmount.toLocaleString()}
                              </>
                            ) : (
                              <>0</>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-lg-4 col-md-4 p-0" key={index}>
                    <div className="wallet-card fuel-wallet-card ml-0">
                      <div className="perfect-center-column card-logo">
                        <div className="card-logo-circle perfect-center">
                          <img src={ImageUrl.FuelCoupon} alt="" />
                        </div>
                        <p>{wallet?.name}</p>
                      </div>
                      <div className="wallet-details perfect-right-column fuel-wallet-details">
                        <h5>
                          INR{' '}
                          {wallet?.availableAmount ? (
                            <>{wallet?.availableAmount.toLocaleString()}</>
                          ) : (
                            <>0</>
                          )}{' '}
                        </h5>

                        <p>
                          Credit:
                          <span className="text-success">
                            {wallet?.totalCreditedAmount ? (
                              <>
                                {wallet?.totalCreditedAmount.toLocaleString()}
                              </>
                            ) : (
                              <>0</>
                            )}
                          </span>
                        </p>
                        <p>
                          Reedemed:
                          <span className="text-danger">
                            {wallet?.totalRedeemedAmount ? (
                              <>
                                {wallet?.totalRedeemedAmount.toLocaleString()}
                              </>
                            ) : (
                              <>0</>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <>
              <NoRecord NoRecordDivHeight={'70px'} NoRecordDivWidth={'100%'} />
            </>
          )}
        </div> */}

        <div className={classes['aggregator-analytics-table']}>
          <div className="tab-header">
            <ul>
              <li
                className={toggleState === 1 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(1)}
              >
                Aggregator
              </li>
              <li
                className={toggleState === 2 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(2)}
              >
                Wallet Recharge
              </li>
              <li
                className={toggleState === 3 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(3)}
              >
                Redeem Report
              </li>
              <li
                className={toggleState === 4 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(4)}
              >
                Recharge Request
              </li>
              {/* <div className="dropdown-filter-country">
                <Dropdown
                  value={selectedClient}
                  // options={clientFilterData}
                  onChange={onClientChange}
                  optionLabel=""
                  placeholder="Client"
                />
              </div> */}
            </ul>
          </div>

          <div className="tab-contents">
            <div className={toggleState === 1 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                data={aggregatorData}
                column={aggregatorColumn}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'AggregatorTableData'}
                scrollHeight={'calc(100vh - 225px)'}
              />
            </div>
            <div className={toggleState === 2 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                buttonArr={buttonsArr}
                data={paymentData}
                column={paymentColumn}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'PaymentsData'}
                scrollHeight={'calc(100vh - 225px)'}
              />
            </div>
            <div className={toggleState === 3 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                data={redeemedCouponsReportData}
                column={redeemVoucherColumn}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'RedeemedCouponsData'}
                scrollHeight={'calc(100vh - 225px)'}
              />
            </div>
            <div className={toggleState === 4 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                customClass="rechargeRequestTable"
                data={rechargeRequestData}
                column={rechargeRequestColumn}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'RechargeRequestData'}
                scrollHeight={'calc(100vh - 225px)'}
              />
            </div>
          </div>
        </div>
      </div>

      {paymentInvoice ? (
        <FileViewer
          fileArray={file}
          que={APIURLS.VIEW_RECHARGE_ATTACHMENT}
          heading="Attachment File"
          fileViewer={setPaymentInvoice}
          currentFileName={file[0]}
        />
      ) : null}

      {rechargeRequestInvoice ? (
        <FileViewer
          fileArray={file}
          que={APIURLS.VIEW_RECHARGE_ATTACHMENT}
          heading="Attachment File"
          fileViewer={setRechargeRequestInvoice}
          currentFileName={file[0]}
        />
      ) : null}

      {approverCommentPopup ? (
        <>
          <div className="sm-popup-overlay">
            <div className="sm-popup-body">
              <div
                className="sm-popup-close"
                onClick={closeApproverCommentPopup}
              >
                <i className="pi pi-times"></i>
              </div>
              <div className="sm-popup-content">
                <h6>Approver Comment</h6>
                <InputText
                  value={approverComment}
                  onChange={(e: any) => setApproverComment(e.target.value)}
                  placeholder="Approver Comment"
                />
                <ButtonComponent
                  label="Submit"
                  icon="pi pi-check"
                  iconPos="right"
                  submitEvent={approveRejectRecharge}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {addAggregatorRechargePopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header ">
              <div
                className="popup-close"
                onClick={() => {
                  closeAddRechargePopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Add Recharge</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeAddRechargePopup()
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content add-recharge-content">
              <FormComponent
                customClassName="boxFieldsss add-recharge-form"
                form={_.cloneDeep(addRechargeForm)}
                formUpdateEvent={addRechargeFormHandler}
                isFormValidFlag={isFormValid}
                updateOptions={updateOptionsObj}
              ></FormComponent>
              {/* attachment */}
              <div className="upload-wrapper">
                {/* <label>
                  Upload Invoice <span style={{ color: 'red' }}>*</span>
                </label> */}
                <div className="row">
                  <div className="col-md-12">
                    <div className={classes['upload-file-section']}>
                      <div className={classes['upload-file']}>
                        <input
                          type="file"
                          onClick={(event: any) => {
                            event.target.value = null
                          }}
                          onChange={(e) => selectAttachment(e.target.files)}
                          className={classes['upload']}
                        />
                        <img src={ImageUrl.FolderIconImage} alt="" />
                        <p>
                          Drag files here <span> or browse</span> <br />
                          <u>Support PDF</u>
                        </p>
                        <div
                          className={
                            classes['chip-tm'] + ' ' + classes['cstm-chip']
                          }
                        >
                          {attachments?.length
                            ? attachments.map((item: any, index: any) => {
                                return (
                                  <Chip
                                    label={item?.name}
                                    removable
                                    onRemove={() => removeFileHandler(index)}
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

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                apihitting={loading}
                submitEvent={submitAddRecharge}
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default AggregatorAnalytics
