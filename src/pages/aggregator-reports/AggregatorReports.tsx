import React, { useEffect, useState } from 'react'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { MasterService } from '../../services/master-service/master.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { CONSTANTS } from '../../constants/Constants'
import { ImageUrl } from '../../utils/ImageUrl'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { APIURLS } from '../../constants/ApiUrls'
import { Theme, Tooltip, withStyles } from '@material-ui/core'
import { RechargeService } from '../../services/recharge-service/recharge.service'
import { AggregatorReportService } from '../../services/aggregrator-report-service/aggregator-report.service'
import { AuthService } from '../../services/auth-service/auth.service'
import classes from './AggregatorReports.module.scss'

const AggregatorReports: React.FC = () => {
  // const [key, setKey] = useState('payments')
  const [toggleState, setToggleState] = useState(1)
  const [walletFilter, setWalletFilter] = useState([])
  const [file, setFile] = useState<any>([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [bankFilterList, setBankFilterList] = useState([])
  const [rechargeData, setRechargeData] = useState([])
  const [redeemedCouponsReportData, setRedeemedCouponsReportData] = useState([])
  const [clientList, setClientList] = useState([])

  useEffect(() => {
    getRecharges()
    // getWalletList()
    // getBankList()
    // getRedeemedCouponsReport()
    // getClientList()
    // getLastRecharge()

    AuthService.aaggregatorWalletList$.subscribe((value: any) => {
      setWalletFilter(value)
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilterList(value)
    })
    AuthService.clientList$.subscribe((value: any) => {
      setClientList(value)
    })
  }, [])

  const toggleTab = (index: number) => {
    setToggleState(index)
    index == 1 ? getRecharges() : getRedeemedCouponsReport()
  }

  // const getWalletList = () => {
  //   new MasterService()
  //     .aggregatorWalletList()
  //     .then((response: any) => {
  //       setWalletFilter(response)
  //       // offlineRechargeForm.walletId.options = response
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
  //       // offlineRechargeForm.bankId.options = response
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
        <Tooltip title={rowData?.description}>
          <span className="ellipsis-text-table">{rowData?.description}</span>
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

  const redeemedCouponsColumn = [
    {
      label: 'Aggregator Name',
      fieldName: 'aggregatorName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Aggregator Email',
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
        filterOptions: walletFilter?.length
          ? walletFilter.map((brand: any) => {
              return brand?.label
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
        filterOptions: walletFilter?.length
          ? walletFilter.map((wallet: any) => {
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

  return (
    <>
      <div className={classes['aggregator-reports-table']}>
        <div className="tab-header">
          <ul>
            <li
              className={toggleState === 1 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(1)}
            >
              Wallet Recharge
            </li>
            <li
              className={toggleState === 2 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(2)}
            >
              Redeemed Coupons
            </li>
          </ul>
        </div>

        <div className="tab-contents">
          <div className={toggleState === 1 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={rechargeData}
              column={rechargeColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'RechargeData'}
              scrollHeight={'calc(100vh - 111px)'}
            />
          </div>
          <div className={toggleState === 2 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={redeemedCouponsReportData}
              column={redeemedCouponsColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'Brands'}
              scrollHeight={'calc(100vh - 111px)'}
            />
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
    </>
  )
}
export default AggregatorReports
