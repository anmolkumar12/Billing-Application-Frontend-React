/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react'
import { Loader } from '../../components/ui/loader/Loader'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { CONSTANTS } from '../../constants/Constants'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { ImageUrl } from '../../utils/ImageUrl'
import classes from './AggregatorDashboard.module.scss'
import { AggregatorDashboardService } from '../../services/aggregator-dashboard-service/aggregator-dashboard.service'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { Theme, Tooltip, withStyles } from '@material-ui/core'
import { RechargeService } from '../../services/recharge-service/recharge.service'
import { AggregatorReportService } from '../../services/aggregrator-report-service/aggregator-report.service'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { APIURLS } from '../../constants/ApiUrls'
import { UtilityService } from '../../services/utility-service/utility.service'
import { AuthService } from '../../services/auth-service/auth.service'
import { Dropdown } from 'primereact/dropdown'
import { PlatformPreferenceService } from '../../services/platform-preference-service/platform-preference-service'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { ButtonComponent } from '../../components/ui/button/Button'
import ConfirmDialogue from '../../components/ui/confirm-dialogue/ConfirmDialogue'

const AggregatorDashboard: React.FC = () => {
  const aggregatorDashboardService = new AggregatorDashboardService()
  const [aggregatorDashboardData, setAggregatorDashboardData] = useState([])
  const [avlbRdmCdtData, setAvlbRdmCdtData] = useState<any>()
  const [loader, setLoader] = useState(false)
  const history = useHistory()
  const [file, setFile] = useState<any>([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [walletFilterList, setWalletFilterList] = useState([])
  const [bankFilterList, setBankFilterList] = useState([])
  const [rechargeData, setRechargeData] = useState([])
  const [redeemedCouponsReportData, setRedeemedCouponsReportData] = useState([])
  const [toggleState, setToggleState] = useState(1)
  const [clientList, setClientList] = useState([])
  const [activateWalletPopup, setActivateWalletPopup] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>()
  const [selectedWallet, setSelectedWallet] = useState<any>()

  const [loading, setLoading] = useState(false)
  const [fileUploaded, setFileUploaded] = useState<any>([])
  // const [clientList, setClientList] = useState([])
  const [walletList, setWalletList] = useState([])
  // const [selectedClient, setSelectedClient] = useState<any>()
  // const [selectedWallet, setSelectedWallet] = useState<any>()
  // const [toggleState, setToggleState] = useState(1)
  const [showActivateWallet, setShowActivateWallet] = useState(false)
  const [token, setToken] = useState<any>()
  const [generateTokenPopup, setGenerateTokenPopup] = useState(false)
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false)
  const [actionPopupToggle, setActionPopupToggle] = useState<any>({
    displayToggle: false,
  })
  const [clientId, setClientId] = useState('')
  const [walletGUIId, setWalletGUIId] = useState('')
  const [secretId, setSecretId] = useState('')

  useEffect(() => {
    // getWalletList()
    // getBankList()
    getAggregatorDashbaordData()
    // getRecharges()
    // getRedeemedCouponsReport()

    AuthService.aaggregatorWalletList$.subscribe((value: any) => {
      setWalletFilterList(value)
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilterList(value)
    })
    AuthService.clientList$.subscribe((value: any) => {
      setClientList(value)
    })
    AuthService.clientList$.subscribe((value: any) => {
      setClientList(value)
    })
    AuthService.aaggregatorWalletList$.subscribe((value: any) => {
      setWalletList(value)
    })
  }, [])

  const toggleTab = (index: number) => {
    setToggleState(index)
    index == 1
      ? getAggregatorDashbaordData()
      : index == 2
      ? getRecharges()
      : getRedeemedCouponsReport()
  }

  const getAggregatorDashbaordData = () => {
    setLoader(true)
    aggregatorDashboardService
      .aggregatorDashboard()
      .then((response: any) => {
        setLoader(false)
        // console.log(' aggregator dashboard response', response)
        setAvlbRdmCdtData(response)
        setAggregatorDashboardData(response[0]?.tabularData)
      })
      .catch((error: any) => {
        setLoader(false)
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const walletInfoBody = (rowData: any) => {
    return (
      <span
        className={
          rowData?.walletCount > 0 ? 'clickable-span' : 'non-clickable-span'
        }
        onClick={() =>
          rowData?.walletCount && navigateToAdminWalletInfo(rowData)
        }
      >
        {rowData?.walletCount}
      </span>
    )
  }

  const navigateToAdminWalletInfo = (rowData: any) => {
    history.push({
      pathname: ROUTE_CONSTANTS.AGGREGATOR_WALLETWISE_INFO,
      state: rowData,
    })
  }

  // const getWalletList = () => {
  //   new MasterService()
  //     .aggregatorWalletList()
  //     .then((response: any) => {
  //       setWalletFilterList(response)
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
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

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

  const getRedeemedCouponsReport = () => {
    new AggregatorReportService()
      .aggregatorRedeemedCouponsReport()
      .then((response: any) => {
        setRedeemedCouponsReportData(response)
        // console.log(response, 'responseeeeeeeee')
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
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

  const descriptionBody = (rowData: any) => {
    return (
      <>
        <Tooltip
          title={new UtilityService().replaceLineBreaks(rowData?.description)}
        >
          <span className="ellipsis-text-table">
            {rowData?.description === 'null' ? (
              <></>
            ) : (
              <>
                {new UtilityService().replaceLineBreaks(rowData?.description)}
              </>
            )}
          </span>
        </Tooltip>
      </>
    )
  }

  const orderStatusBody = (rowData: any) => {
    return (
      <>
        {rowData?.orderStatus == 'Success' ? (
          <span className="spanStyle" style={{ color: '#0EB700' }}>
            {rowData?.orderStatus}
          </span>
        ) : rowData?.orderStatus == 'Pending' ? (
          <span className="spanStyle" style={{ color: '#D98F03' }}>
            {rowData?.orderStatus}
          </span>
        ) : rowData?.orderStatus == 'Failed' ? (
          <span className="spanStyle" style={{ color: '#CB0000' }}>
            {rowData?.orderStatus}
          </span>
        ) : (
          <span className="spanStyle" style={{ color: '#000000' }}>
            {rowData?.orderStatus}
          </span>
        )}
      </>
    )
  }

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

  const aggregatorDashboardColumn = [
    {
      label: 'Name',
      fieldName: 'name',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: clientList?.length
          ? clientList.map((wallet: any) => {
              return wallet.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Name',
      },
    },
    {
      label: 'Email',
      fieldName: 'email',
      textAlign: 'left',
      sort: true,
      filter: true,
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
      label: 'Available Amount',
      fieldName: 'totalAvailableAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Total Credited Amount',
      fieldName: 'totalCreditedAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Total Redeemed Amount',
      fieldName: 'totalRedeemedAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Total Commision',
      fieldName: 'totalCommission',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  // const redeemedCouponsColumn = [
  //   {
  //     label: 'Aggregator Name',
  //     fieldName: 'aggregatorName',
  //     textAlign: 'left',
  //     sort: true,
  //     filter: true,
  //   },
  //   {
  //     label: 'Aggregator Email',
  //     fieldName: 'aggregatorEmail',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Amount Charged',
  //     fieldName: 'amountCharged',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Brand Name',
  //     fieldName: 'brandName',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //     body: brandBody,
  //   },
  //   {
  //     label: 'Created At',
  //     fieldName: 'createdAt',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Currency Code',
  //     fieldName: 'currencyCode',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Currency Value',
  //     fieldName: 'currencyValue',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Delivered At',
  //     fieldName: 'deliveredAt',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Delivery Status',
  //     fieldName: 'deliveryStatus',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Denomaination',
  //     fieldName: 'denomination',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Discount Percent',
  //     fieldName: 'discountPercent',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Email Deliverwd At',
  //     fieldName: 'emailDeliveredAt',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Order Discount',
  //     fieldName: 'orderDiscount',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Order Status',
  //     fieldName: 'orderStatus',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //     body: orderStatusBody,
  //   },
  //   {
  //     label: 'Total Order',
  //     fieldName: 'orderTotal',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'PO Number',
  //     fieldName: 'poNumber',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Quantity',
  //     fieldName: 'quantity',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Recipient Email',
  //     fieldName: 'recipientEmail',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Recipient Phone',
  //     fieldName: 'recipientPhone',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'SMS Delivered At',
  //     fieldName: 'smsDeliveredAt',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Tag',
  //     fieldName: 'tag',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  //   {
  //     label: 'Wallet Name',
  //     fieldName: 'walletName',
  //     frozen: false,
  //     sort: true,
  //     textAlign: 'left',
  //     filter: true,
  //   },
  // ]
  const redeemedCouponsColumn = [
    {
      label: 'Client Name',
      fieldName: 'aggregatorName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Client Email',
      fieldName: 'aggregatorEmail',
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
      dropDownFilter: {
        filterOptions: walletFilterList?.length
          ? walletFilterList.map((wallet: any) => {
              return wallet?.label
            })
          : [],
        fieldValue: 'walletName',
        changeFilter: true,
        placeholder: 'Wallet',
      },
      body: walletBody,
    },
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: brandBody,
    },
    {
      label: 'Denomination',
      fieldName: 'denomination',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Quantity',
      fieldName: 'quantity',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Amount Charged',
      fieldName: 'amountCharged',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Total Order',
      fieldName: 'orderTotal',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Currency Code',
      fieldName: 'currencyCode',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Currency Value',
      fieldName: 'currencyValue',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Discount Percentage',
      fieldName: 'discountPercent',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Order Discount',
      fieldName: 'orderDiscount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Order Status',
      fieldName: 'orderStatus',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: orderStatusBody,
    },
    {
      label: 'Delivery At',
      fieldName: 'deliveredAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Delivery Status',
      fieldName: 'deliveryStatus',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Email Delivery At',
      fieldName: 'emailDeliveredAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'SMS Delivery At',
      fieldName: 'smsDeliveredAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Recipient Phone',
      fieldName: 'recipientPhone',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Recipient Email',
      fieldName: 'recipientEmail',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },

    // {
    //   label: 'Created At',
    //   fieldName: 'createdAt',
    //   frozen: false,
    //   sort: true,
    //   textAlign: 'left',
    //   filter: true,
    // },

    // {
    //   label: 'PO Number',
    //   fieldName: 'poNumber',
    //   frozen: false,
    //   sort: true,
    //   textAlign: 'left',
    //   filter: true,
    // },

    {
      label: 'Tag',
      fieldName: 'tag',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
  ]

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
      label: 'Description',
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
    {
      label: 'Created At',
      fieldName: 'createdAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
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

  const buttonsArr = [
    {
      label: 'Activate Wallet',
      addFunction: () => setActivateWalletPopup(true),
      tooltip: 'Activate Wallet',
    },
  ]

  const closePopup = () => {
    console.log('brandFormObj')
    setActivateWalletPopup(false)
    setSelectedClient(null)
    setSelectedWallet(null)
    setShowActivateWallet(false)
    setClientId('')
    setWalletGUIId('')
    setSecretId('')
  }

  const onClientChange = (e: any) => {
    // console.log('onclientchangesss', e.target.value)
    e?.target?.value && setSelectedClient(e?.target?.value)
    fetchClientDetails(e?.target?.value, selectedWallet)
  }

  const onWalletChange = (e: any) => {
    // console.log('onwalletchangesss', e.target.value)
    e?.target?.value && setSelectedWallet(e?.target?.value)
    fetchClientDetails(selectedClient, e?.target?.value)
  }

  const activateWalletAdd = (event?: any) => {
    event.preventDefault()
    const obj = {
      clientId: selectedClient,
      walletId: selectedWallet,
    }
    // console.log(event, 'submitttttttttt')
    new PlatformPreferenceService()
      .activateWallet(obj)
      .then((response: any) => {
        // console.log(response, 'ressssssss')
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          setShowActivateWallet(false)
          fetchClientDetails()
          ToasterService.show(response?.message, CONSTANTS.SUCCESS)
        }
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const fetchClientDetails = (clientId?: any, walletId?: any) => {
    if (selectedClient && selectedClient) {
      setLoading(true)
      const Obj = {
        clientId: clientId || selectedClient,
        walletId: walletId || selectedWallet,
      }
      new PlatformPreferenceService()
        .rewardApiClientData(Obj)
        .then((response: any) => {
          setLoading(false)
          setShowActivateWallet(false)
          setClientId(response?.data?.[0]?.clientId)
          setWalletGUIId(response?.data?.[0]?.walletGuid)
          setSecretId(response?.data?.[0]?.secretId)
          !response?.data?.length && setShowActivateWallet(true)
          if (response.state === HTTP_RESPONSE.SUCCESS) {
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    }
  }

  const copyToClipboardClientGuiId = () => {
    // console.log('walletGUIId', walletGUIId)
    navigator.clipboard.writeText(walletGUIId)
    ToasterService.show(`Clinet Gui Id Coppied Successfully !`, 'success')
  }

  const copyToClipboardSecretId = () => {
    // console.log('walletGUIId', secretId)
    navigator.clipboard.writeText(secretId)
    ToasterService.show(`Secret Id Coppied Successfully !`, 'success')
  }

  const copyToClipboardClientId = () => {
    // console.log('walletGUIId', clientId)
    navigator.clipboard.writeText(clientId)
    ToasterService.show(`Client Id Coppied Successfully !`, 'success')
  }

  const copyToClipboardToken = () => {
    navigator.clipboard.writeText(
      `{"accessToken": ${token?.accessToken},"refreshToken": ${token?.refreshToken}}`
    )
    ToasterService.show(`Token Coppied Successfully !`, 'success')
  }

  const onTokenGenerateClick = (event?: any) => {
    event.preventDefault()
    // console.log('onTokenGenerateClick')
    setShowConfirmDialogue(true)
    setActionPopupToggle({
      displayToggle: true,
      title: '',
      message:
        'Old token becomes invalid on generation of new token. Are you sure?',
      rejectFunction: onPopUpClose,
      acceptFunction: getGenerateToken,
    })
  }

  const onPopUpClose = (e?: any) => {
    // e?.preventDefault()
    setActionPopupToggle({ displayToggle: false })
    setShowConfirmDialogue(false)
    // setGenerateTokenPopup(false)
  }

  const getGenerateToken = (event?: any) => {
    setGenerateTokenPopup(true)
    event.preventDefault()
    const Obj = {
      walletGuid: walletGUIId,
      clientId: clientId,
      secretId: secretId,
    }
    new PlatformPreferenceService()
      .generateToken(Obj)
      .then((response: any) => {
        setShowConfirmDialogue(false)
        setGenerateTokenPopup(true)
        const tokens: any = []
        // for (const key in response) {
        //   if (Object.prototype.hasOwnProperty.call(response, key)) {
        //     tokens.push(`${key + ': ' + response[key]}`)
        //   }
        // }
        // console.log()
        // setToken(tokens.toString())
        setToken(response)
        // console.log('response generate token', response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const closeGenerateTokenPopup = () => {
    setGenerateTokenPopup(false)
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
              <p className={classes['textWithImg']}>
                Total Available Amount{' '}
                <span>
                  {' '}
                  <img src={ImageUrl.WalletImg} alt="" />
                </span>
              </p>
              <h4>
                {(avlbRdmCdtData &&
                  avlbRdmCdtData[0] &&
                  avlbRdmCdtData[0]?.totalAvailableAmount?.toLocaleString()) ||
                  0}
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
                {(avlbRdmCdtData &&
                  avlbRdmCdtData[0] &&
                  avlbRdmCdtData[0]?.totalRedeemAmount?.toLocaleString()) ||
                  0}
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
                {(avlbRdmCdtData &&
                  avlbRdmCdtData[0] &&
                  avlbRdmCdtData[0]?.totalCreditAmount?.toLocaleString()) ||
                  0}
              </h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 p-0">
            <div
              className={
                classes['coupon-card'] + ' ' + classes['last-recharge-card']
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
                {(avlbRdmCdtData &&
                  avlbRdmCdtData[0] &&
                  avlbRdmCdtData[0]?.lastRecharge[0]?.lastRechargeAmount?.toLocaleString()) ||
                  0}
              </h4>
              <h6>
                Last Recharge Date{' '}
                <span>
                  {moment(
                    avlbRdmCdtData &&
                      avlbRdmCdtData[0] &&
                      avlbRdmCdtData[0]?.lastRecharge[0]?.lastRechargeDate
                  ).format('YYYY-MM-DD')}
                </span>
              </h6>
            </div>
          </div>
        </div>

        <div className={classes['aggregator-dashboard-table']}>
          <div className="tab-header">
            <ul>
              <li
                className={toggleState === 1 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(1)}
              >
                Clients
              </li>
              <li
                className={toggleState === 2 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(2)}
              >
                Wallet Transaction
              </li>
              <li
                className={toggleState === 3 ? 'active-tab' : 'tab'}
                onClick={() => toggleTab(3)}
              >
                Redeemed Transaction
              </li>
            </ul>
          </div>

          <div className="tab-contents">
            <div className={toggleState === 1 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                data={aggregatorDashboardData}
                column={aggregatorDashboardColumn}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'Brands'}
                scrollHeight={'calc(100vh - 228px)'}
              />
            </div>
            <div className={toggleState === 2 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                data={rechargeData}
                column={rechargeColumn}
                buttonArr={buttonsArr}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'Recharge Data'}
                scrollHeight={'calc(100vh - 228px)'}
              />
            </div>
            <div className={toggleState === 3 ? 'active-content' : 'content'}>
              <DataTableBasicDemo
                data={redeemedCouponsReportData}
                column={redeemedCouponsColumn}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'Redeemed Coupon Data'}
                scrollHeight={'calc(100vh - 228px)'}
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

      {activateWalletPopup ? (
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
                  closePopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Activate Wallet</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closePopup()
                }}
              >
                &times;
              </div>
            </div>

            <div className="popup-content" style={{ padding: '1rem 2rem' }}>
              <div className={classes['reward-apiTab']}>
                <form action="">
                  <div className={classes['formItem']}>
                    <div className="row m-0">
                      <div className="col-lg-12 col-md-12 p-0">
                        <div className="row mx-0 my-1">
                          <div className="col-lg-5 col-md-5 p-2">
                            <label> Select Client</label>
                            <Dropdown
                              style={{ width: '100%' }}
                              className="rewardApi-dropdown"
                              value={selectedClient}
                              options={clientList}
                              onChange={(event: any) => {
                                onClientChange(event)
                              }}
                              optionLabel=""
                              placeholder="Select Client"
                            />
                          </div>
                          <div className="col-lg-5 col-md-5 p-2">
                            <label> Select Wallet</label>
                            <Dropdown
                              style={{ width: '100%' }}
                              className="rewardApi-dropdown"
                              value={selectedWallet}
                              options={walletList}
                              onChange={(event: any) => {
                                onWalletChange(event)
                              }}
                              optionLabel=""
                              placeholder="Select Wallet"
                            />
                          </div>
                          {/* <div className="col-lg-2 col-md-2 p-2 d-flex justify-content-end align-items-end">
                          <ButtonComponent
                            label="Fetch Details"
                            icon="pi pi-check"
                            iconPos="right"
                            apihitting={loading}
                            submitEvent={fetchClientDetails}
                          />
                        </div> */}
                          {clientId && (
                            <div className="col-lg-4 col-md-6 p-2">
                              <label>
                                {' '}
                                Client Id{' '}
                                <span
                                  onClick={() => {
                                    copyToClipboardClientId()
                                  }}
                                >
                                  <i className="pi pi-copy"></i>
                                </span>{' '}
                              </label>
                              <InputText
                                value={clientId}
                                // onChange={(e: any) => setClientId(e.target.value)}
                                placeholder="Client Id"
                                disabled={true}
                              />
                            </div>
                          )}

                          {secretId && (
                            <div className="col-lg-4 col-md-6 p-2">
                              <label htmlFor="">
                                Secret Id
                                <span onClick={() => copyToClipboardSecretId()}>
                                  <i className="pi pi-copy"></i>
                                </span>{' '}
                              </label>
                              <Password
                                value={secretId}
                                // onChange={(e: any) => setSecretId(e.target.value)}
                                placeholder="Set Your Secret Id"
                                disabled={true}
                                toggleMask
                              />
                            </div>
                          )}

                          {walletGUIId && (
                            <div className="col-lg-4 col-md-6 p-2">
                              <label htmlFor="">
                                Client GUID{' '}
                                <span
                                  onClick={() => copyToClipboardClientGuiId()}
                                >
                                  <i className="pi pi-copy"></i>
                                </span>{' '}
                              </label>
                              <InputText
                                value={walletGUIId}
                                // onChange={(e: any) =>
                                //   setWalletGUIId(e.target.value)
                                // }
                                placeholder="Client GUID"
                                disabled={true}
                              />
                            </div>
                          )}

                          {showActivateWallet ? (
                            <div
                              className={
                                classes['activate-wallet'] +
                                ' ' +
                                classes['reset-save-sec'] +
                                ' ' +
                                'col-lg-12 col-sm-12 perfect-center-column'
                              }
                            >
                              <h6 className="mb-1">
                                This wallet is not activated yet!{' '}
                                <span>Click Activate Wallet to Activate</span>
                              </h6>
                              <div className="">
                                <ButtonComponent
                                  label="Activate Wallet"
                                  icon="pi pi-check"
                                  iconPos="right"
                                  apihitting={loading}
                                  submitEvent={activateWalletAdd}
                                />
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        {walletGUIId && secretId && clientId ? (
                          <>
                            <h4 className="mt-3">
                              Generate Access Token and Refresh Token
                            </h4>
                            {/* {token} */}
                            {/* <div className="row mx-0 my-3">
                            {token.accessToken && (
                              <div className="col-lg-4 col-md-6 p-2">
                                <label htmlFor="">
                                  Access Token{' '}
                                  <span
                                    onClick={() => copyToClipboardAccessToken()}
                                  >
                                    <i className="pi pi-copy"></i>
                                  </span>{' '}
                                </label>
                                <InputText
                                  value={token?.accessToken}
                                  placeholder="Access Token"
                                  disabled={true}
                                />
                              </div>
                            )}
                            {token.refreshToken && (
                              <div className="col-lg-4 col-md-6 p-2">
                                <label htmlFor="">
                                  Refresh Token{' '}
                                  <span
                                    onClick={() =>
                                      copyToClipboardRefreshToken()
                                    }
                                  >
                                    <i className="pi pi-copy"></i>
                                  </span>{' '}
                                </label>
                                <InputText
                                  value={token.refreshToken}
                                  placeholder="Refresh Token"
                                  disabled={true}
                                />
                              </div>
                            )}
                          </div> */}
                            <button
                              className={classes['formItem-btn']}
                              // onClick={(e: any) => getGenerateToken(e)}
                              onClick={(e: any) => onTokenGenerateClick(e)}
                            >
                              Generate Token
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  {showConfirmDialogue ? (
                    <ConfirmDialogue
                      actionPopupToggle={actionPopupToggle}
                      onCloseFunction={onPopUpClose}
                    />
                  ) : null}
                </form>
              </div>
            </div>

            <div className="popup-lower-btn">
              {/* <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={editBrandPopup ? updateBrand : submitBrand}
              /> */}
            </div>
          </div>
        </div>
      ) : null}

      {generateTokenPopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header">
              <div
                className="popup-close"
                onClick={() => {
                  closeGenerateTokenPopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Token Details</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeGenerateTokenPopup()
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content">
              <p style={{ wordBreak: 'break-all' }}>
                <span>"accessToken":</span>{' '}
                {'"' + `${token?.accessToken}` + '",'}
              </p>

              <p style={{ wordBreak: 'break-all' }}>
                {' '}
                <span>
                  <span>"refreshToken":</span>
                </span>{' '}
                {'"' + `${token?.refreshToken}` + '"'}
              </p>
            </div>
            <div className="popup-lower-btn">
              <button
                className={classes['formItem-btn']}
                onClick={() => copyToClipboardToken()}
              >
                Copy Tokens
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default AggregatorDashboard
