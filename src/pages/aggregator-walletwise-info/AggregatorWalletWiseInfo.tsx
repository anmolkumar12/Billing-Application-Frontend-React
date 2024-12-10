import { Theme, Tooltip, withStyles } from '@material-ui/core'
import { Dropdown } from 'primereact/dropdown'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { APIURLS } from '../../constants/ApiUrls'
import { CONSTANTS } from '../../constants/Constants'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { AggregatorDashboardService } from '../../services/aggregator-dashboard-service/aggregator-dashboard.service'
import { AuthService } from '../../services/auth-service/auth.service'
import { MasterService } from '../../services/master-service/master.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { ImageUrl } from '../../utils/ImageUrl'
import './AggregatorWalletWiseInfo.scss'
import classes from './AggregatorWalletWiseInfo.module.scss'

const AggregatorWalletWiseInfo: React.FC = () => {
  const location: any = useLocation()
  const [clickedRechargedWalletDetails, setClickedRechargedWalletDetails] =
    useState<any>(null)
  const [aggregatorWallets, setAggregatorWallets] = useState([])
  const [file, setFile] = useState<any>([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [key, setKey] = useState('paymentInfo')
  const [walletFilterList, setWalletFilterList] = useState([])
  const [bankFilterList, setBankFilterList] = useState([])
  const [rechargeData, setRechargeData] = useState([])
  const [redeemedCouponsReportData, setRedeemedCouponsReportData] = useState([])
  const [selectedWallet, setSelectedWallet] = useState([])
  const [selectedWalletObj, setSelectedWalletObj] = useState<any>()

  const history = useHistory()

  useEffect(() => {
    if (location.state) {
      setClickedRechargedWalletDetails(location.state)
      getSelectedClientWalletData(location.state.clientId)
    } else {
      history.push(ROUTE_CONSTANTS.AGGREGATOR_DASHBOARD)
    }
    // getWalletList()
    // getBankList()
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilterList(value)
    })
    AuthService.aaggregatorWalletList$.subscribe((value: any) => {
      setWalletFilterList(value)
    })
  }, [])

  const getSelectedClientWalletData = (clientId: string) => {
    new AggregatorDashboardService()
      .selectedClientWalletDetails({ clientId: clientId })
      .then((response: any) => {
        setAggregatorWallets(response)
        // console.log('aggregator wallet details', response)
        // setSelectedWallet(response[0].value)
        // setSelectedWalletObj(response[0])
        // getRecharges(response[0].clientId, response[0].walletId)
        getRecharges()
      })
      .catch((err: any) => {
        ToasterService.show(CONSTANTS.ERROR)
      })
  }
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

  const getRecharges = (clientId?: string, walletId?: string) => {
    new AggregatorDashboardService()
      .recharges({
        clientId: clientId || location.state.clientId,
        walletId: walletId,
      })
      .then((response: any) => {
        setRechargeData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const getRedeemedCouponsReport = (clientId: string, walletId: string) => {
    new AggregatorDashboardService()
      .aggregatorRedeemedCouponsReport({
        clientId: clientId || location.state.clientId,
        walletId: walletId,
      })
      .then((response: any) => {
        setRedeemedCouponsReportData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const SliderNextArrow = (props: any) => {
    const { className, style, onClick } = props
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <i className="pi pi-angle-right"></i>
      </div>
    )
  }

  const SliderPrevArrow = (props: any) => {
    const { className, style, onClick } = props
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <i className="pi pi-angle-left"></i>
      </div>
    )
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SliderNextArrow className={'next-arrow'} />,
    prevArrow: <SliderPrevArrow className={'prev-arrow'} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
      label: 'Amount Charged',
      fieldName: 'amountCharged',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
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
      label: 'Created At',
      fieldName: 'createdAt',
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
      label: 'Delivered At',
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
      label: 'Denomaination',
      fieldName: 'denomination',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Discount Percent',
      fieldName: 'discountPercent',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Email Deliverwd At',
      fieldName: 'emailDeliveredAt',
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
      label: 'Total Order',
      fieldName: 'orderTotal',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'PO Number',
      fieldName: 'poNumber',
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
      label: 'Recipient Email',
      fieldName: 'recipientEmail',
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
      label: 'SMS Delivered At',
      fieldName: 'smsDeliveredAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Tag',
      fieldName: 'tag',
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
    {
      label: 'Created By',
      fieldName: 'createdByName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
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

  const onWalletChange = (event?: any) => {
    // console.log('eveeeenttttt', event?.target?.value, aggregatorWallets)
    setSelectedWallet(event?.target?.value || null)
    let selClientObj: any
    if (event?.target?.value) {
      // console.log('in if')
      selClientObj = aggregatorWallets.find(
        (item: any) => item?.value == event?.target?.value
      )
    } else {
      // console.log('in else')
      selClientObj = aggregatorWallets.find(
        (item: any) => item?.value == selectedWallet
      )
    }

    console.log('setClientObj', selClientObj)
    setSelectedWalletObj(selClientObj)
    key == 'paymentInfo'
      ? getRecharges(selClientObj?.clientId, selClientObj?.walletId)
      : getRedeemedCouponsReport(selClientObj?.clientId, selClientObj?.walletId)
  }

  const toggleTab = (toggleName: string) => {
    setKey(toggleName)
    toggleName === 'paymentInfo'
      ? getRecharges(selectedWalletObj?.clientId, selectedWalletObj?.walletId)
      : getRedeemedCouponsReport(
          selectedWalletObj?.clientId,
          selectedWalletObj?.walletId
        )
  }

  return (
    <>
      <div className={classes['wallet-info-body']}>
        {/* <h4 className="content-header">Aggregator Info</h4> */}

        <div className="row m-0">
          <div className={'col-lg-3 col-3 px-2' + ' ' + classes['top-sec-li']}>
            <div className={classes['aggregatorInfo-top-sec']}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                {clickedRechargedWalletDetails?.profilePic ? (
                  <>
                    <img
                      crossOrigin="anonymous"
                      src={`${process.env.REACT_APP_API_BASEURL}/${clickedRechargedWalletDetails?.profilePic}`}
                      style={{
                        height: '40px',
                        width: '40px',
                        border: '1px solid #ddd',
                        borderRadius: '50%',
                        objectFit: 'contain',
                        boxShadow: '0px 3px 6px #00000029',
                      }}
                      width={50}
                      alt="Brand Logo"
                    />
                  </>
                ) : null}
                <h6
                  style={{
                    paddingLeft: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    margin: 0,
                    color: 'black',
                  }}
                >
                  {clickedRechargedWalletDetails?.name}
                </h6>
              </div>

              <ul style={{ paddingTop: '0.75rem' }}>
                <li>
                  <h5>
                    <span>Email:</span> {clickedRechargedWalletDetails?.email}
                  </h5>
                </li>
                <li>
                  <h5 style={{ margin: 0 }}>
                    <span>Wallet Count:</span>
                    {clickedRechargedWalletDetails?.walletCount}
                  </h5>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 px-2">
            <div
              className={
                classes['budget-sec'] + ' ' + classes['aggregatorInfo-top-sec']
              }
            >
              <ul>
                <li>
                  <div
                    className={
                      classes['budget-sec-card'] +
                      ' ' +
                      classes['credit-amt-card']
                    }
                  >
                    <img src={ImageUrl.creditAmountImg} alt="" />
                    <h6>
                      Credit Amount:{' '}
                      <span>
                        {(
                          clickedRechargedWalletDetails?.totalCreditedAmount ||
                          0
                        ).toLocaleString('en-US')}
                      </span>
                    </h6>
                  </div>
                </li>
                <li>
                  <div
                    className={
                      classes['budget-sec-card'] +
                      ' ' +
                      classes['redeemed-amt-card']
                    }
                  >
                    <img src={ImageUrl.redeemedAmtImg} alt="" />
                    <h6>
                      Redeemed Amount:{' '}
                      <span>
                        {(
                          +clickedRechargedWalletDetails?.totalRedeemedAmount ||
                          0
                        ).toLocaleString('en-US')}
                      </span>
                    </h6>
                  </div>
                </li>
                <li>
                  <div
                    className={
                      classes['budget-sec-card'] +
                      ' ' +
                      classes['available-amt-card']
                    }
                  >
                    <img src={ImageUrl.AvailabalbeAmountImg} alt="" />
                    <h6>
                      Total Available Amount:{' '}
                      <span>
                        {(
                          +clickedRechargedWalletDetails?.totalAvailableAmount ||
                          0
                        ).toLocaleString('en-US')}
                      </span>
                    </h6>
                  </div>
                </li>
                <li>
                  <div
                    className={
                      classes['budget-sec-card'] +
                      ' ' +
                      classes['commision-earned']
                    }
                  >
                    <img src={ImageUrl.CommissionEarnedImg} alt="" />
                    <h6>
                      Commission Earned:{' '}
                      <span>
                        {(
                          +clickedRechargedWalletDetails?.totalCommission || 0
                        ).toLocaleString('en-US')}
                      </span>
                    </h6>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h4 className={classes['content-header']}>
          Wallets (<span>{aggregatorWallets?.length}</span>)
        </h4>
        <div className={classes['client-info-sec']}>
          <div className="row m-0">
            <Slider {...settings}>
              {aggregatorWallets.map((client: any, index: number) => {
                return (
                  <div className="col-md-12 p-0" key={index}>
                    <div
                      className={classes['wallet-info-card']}
                      style={{
                        backgroundColor:
                          client?.walletName === 'General'
                            ? '#42c78c50'
                            : client?.walletName === 'Food'
                            ? '#fb8a3450'
                            : '#477bfb50',
                      }}
                    >
                      <div
                        className={classes['wallet-info-details']}
                        style={{
                          backgroundColor:
                            client?.walletName === 'General'
                              ? '#42c78c'
                              : client?.walletName === 'Food'
                              ? '#fb8a34'
                              : '#477bfb',
                        }}
                      >
                        {client?.walletName === 'Food' ? (
                          <>
                            <div className={classes['card-details-img']}>
                              <img src={ImageUrl.FoodCoupon} alt="" />
                            </div>
                            <h6>Food</h6>
                          </>
                        ) : client?.walletName === 'General' ? (
                          <>
                            <div className={classes['card-details-img']}>
                              <img src={ImageUrl.GeneralCoupon} alt="" />
                            </div>
                            <h6>General </h6>
                          </>
                        ) : (
                          <>
                            <div className={classes['card-details-img']}>
                              <img src={ImageUrl.FuelCoupon} alt="" />
                            </div>
                            <h6>Fuel</h6>
                          </>
                        )}
                      </div>
                      <div
                        className={
                          classes['wallet-transaction-details'] +
                          ' ' +
                          'space-bw-left-row'
                        }
                      >
                        <ul>
                          <li>
                            <div className={classes['details-div']}>
                              <h6>
                                Available{' '}
                                <span style={{ color: '#0A1653' }}>
                                  {(
                                    client?.availableAmount || 0
                                  ).toLocaleString('en-US')}
                                </span>
                              </h6>
                            </div>
                          </li>
                          <li>
                            <div className={classes['details-div']}>
                              <h6>
                                Credit{' '}
                                <span style={{ color: '#1BB71F' }}>
                                  {(client?.creditAmount || 0).toLocaleString(
                                    'en-US'
                                  )}
                                </span>
                              </h6>
                            </div>
                          </li>
                          <li>
                            <div className={classes['details-div']}>
                              <h6>
                                Redeemed{' '}
                                <span style={{ color: '#CB0814' }}>
                                  {(
                                    client?.totalRedeemedAmount || 0
                                  ).toLocaleString('en-US')}
                                </span>
                              </h6>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div
                        className={classes['client-name-div']}
                        style={{
                          backgroundColor:
                            client?.walletName === 'General'
                              ? '#42c78c'
                              : client?.walletName === 'Food'
                              ? '#fb8a34'
                              : '#477bfb',
                        }}
                      >
                        <h6>Client Name</h6>
                        <p>{client?.clientName}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>

        <div className={classes['aggregator-walletwiseInfo-table']}>
          <div className="tab-header">
            <ul>
              <li
                className={key === 'paymentInfo' ? 'active-tab' : 'tab'}
                onClick={() => toggleTab('paymentInfo')}
              >
                Payment Info
              </li>
              <li
                className={key === 'redeemInfo' ? 'active-tab' : 'tab'}
                onClick={() => toggleTab('redeemInfo')}
              >
                Redeemed Info
              </li>
              <li className={classes['dropdownFilterLi']}>
                <div className={classes['dropdownFilter']}>
                  <Dropdown
                    className="walletWiseInfo-dropdown"
                    value={selectedWallet}
                    options={aggregatorWallets}
                    onChange={(e: any) => onWalletChange(e)}
                    optionLabel=""
                    placeholder="Select Wallet"
                  />
                </div>
              </li>
            </ul>
          </div>

          <div className="tab-contents">
            <div
              className={key === 'paymentInfo' ? 'active-content' : 'content'}
            >
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
                scrollHeight={'calc(100vh - 72px)'}
              />
            </div>
            <div
              className={key === 'redeemInfo' ? 'active-content' : 'content'}
            >
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
                scrollHeight={'calc(100vh - 123px)'}
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
    </>
  )
}

export default AggregatorWalletWiseInfo
