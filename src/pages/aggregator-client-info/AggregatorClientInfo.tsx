import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { CONSTANTS } from '../../constants/Constants'
import { AggregatorAnalyticsService } from '../../services/aggregator-analytics-service/aggregator-analytics.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import classes from './AggregatorClientInfo.module.scss'
import './AggregatorClientInfo.scss'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, Theme } from '@material-ui/core/styles'
import { ImageUrl } from '../../utils/ImageUrl'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { APIURLS } from '../../constants/ApiUrls'
import { MasterService } from '../../services/master-service/master.service'
import Slider from 'react-slick'
import { Dropdown } from 'primereact/dropdown'
import { AuthService } from '../../services/auth-service/auth.service'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'

const AggregatorClientInfo: React.FC = () => {
  const location: any = useLocation()
  // console.log('location', location)
  const [clickedRowData, setClickedRowData] = useState<any>()
  const [key, setKey] = useState('WalletRecharge')
  const [clientInfo, setClientInfo] = useState<any>([])
  const [file, setFile] = useState<any>([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [clientWisePaymentsData, setClientWisePaymentsData] = useState([])
  const [clientWiseRedeemData, setClientWiseRedeemData] = useState([])
  const [bankFilter, setBankFilter] = useState([])
  const [currencyFilter, setcurrencyFilter] = useState([])
  const [countryFilter, setCountryFilter] = useState([])
  const [walletFilterList, setWalletFilterList] = useState([])
  const [brandFilter, setBrandsFilter] = useState([])
  const [selectedClient, setSelectedClient] = useState()
  const [selectedClientObj, setSelectedClientObj] = useState<any>()
  const history = useHistory()

  useEffect(() => {
    // getBankList()
    // getWalletFilterList()
    // getCountryList()
    // getBrandsFilterList()
    if (location?.state) {
      setClickedRowData(location?.state)
      aggregatorClientInfo(location?.state?.clientId)
    } else {
      history.push(ROUTE_CONSTANTS.AGGREGATOR_ANALYTICS)
    }

    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
    })
    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
    })
    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setcurrencyFilter(value)
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilter(value)
    })
    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletFilterList(value)
    })
  }, [])

  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrandsFilter(response.brands)
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
  // const getWalletFilterList = () => {
  //   new MasterService()
  //     .walletList()
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
  //       setBankFilter(response)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const aggregatorClientInfo = (clientId: string) => {
    new AggregatorAnalyticsService()
      .clientInfo({ clientId: clientId })
      .then((response: any) => {
        setClientInfo(response)
        setSelectedClient(response[0].value)
        setSelectedClientObj(response[0].value)
        // getClientWiseRedeemInfo(response[0].clientId)
        getClientWisePaymentInfo(response[0].clientId)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const getClientWiseRedeemInfo = (clientId: string) => {
    new AggregatorAnalyticsService()
      .clientWiseRedeemInfo({ clientId: clientId })
      .then((response: any) => {
        setClientWiseRedeemData(response)
      })
      .catch((error: any) => [ToasterService.show(error, CONSTANTS.ERROR)])
  }

  const getClientWisePaymentInfo = (clientId: string) => {
    // console.log('hi')
    new AggregatorAnalyticsService()
      .clientWisePaymentInfo({ clientId: clientId })
      .then((response: any) => {
        // console.log('get Client wise Paymennt info', response)
        setClientWisePaymentsData(response)
      })
      .catch((error: any) => [ToasterService.show(error, CONSTANTS.ERROR)])
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

  const paymentBody = (rowData: any) => {
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

  const couponPurchaseAmountBody = (rowData: any) => {
    return (
      <>
        <div style={{ color: '#808080' }}>{rowData?.couponPurchaseAmount}</div>
      </>
    )
  }

  const statusBody = (rowData: any) => {
    return (
      <>
        {rowData?.status == 'Partially Uploaded' ? (
          <div style={{ color: '#ff9800' }}>{rowData?.status}</div>
        ) : rowData?.status == 'Coupon Uploaded' ? (
          <div style={{ color: 'green' }}>{rowData?.status}</div>
        ) : rowData?.status == 'Not Uploaded' ? (
          <div style={{ color: '#00FF00' }}>{rowData?.status}</div>
        ) : (
          <div style={{ color: '#000000' }}>{rowData?.status}</div>
        )}
      </>
    )
  }

  const commissionEarnedBody = (rowData: any) => {
    return (
      <>
        {rowData?.commissionEarned > 0 ? (
          <div style={{ color: 'green' }}>{rowData?.commissionEarned}</div>
        ) : (
          <div style={{ color: 'red' }}>{rowData?.commissionEarned}</div>
        )}
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

  const tagBody = (rowData: any) => {
    return (
      <>
        <Tooltip title={rowData?.tag}>
          <span className="ellipsis-text-table">{rowData?.tag}</span>
        </Tooltip>
      </>
    )
  }

  const couponUploadedAmountBody = (rowData: any) => {
    return (
      <>{rowData?.couponUploadedAmount ? rowData?.couponUploadedAmount : 0}</>
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

  const paymentStatusBody = (rowData: any) => {
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

  const clientWisePaymentsColumns = [
    {
      label: 'Client Name',
      fieldName: 'clientName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      // dropDownFilter: {
      //   filterOptions: aggregatorFilter?.length
      //     ? aggregatorFilter.map((brand: any) => {
      //         return brand?.label
      //       })
      //     : [],
      //   fieldValue: 'aggregatorName',
      //   changeFilter: true,
      //   placeholder: 'Client',
      // },
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
      body: invoiceBody,
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
        filterOptions: walletFilterList?.length
          ? walletFilterList.map((wallet: any) => {
              return wallet?.label
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
      label: 'Status',
      fieldName: 'status',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: paymentStatusBody,
    },
    {
      label: 'Created By',
      fieldName: 'createdByName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const clientWiseRedeemColumns = [
    {
      label: 'Email',
      fieldName: 'aggregatorEmail',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Aggregator Name',
      fieldName: 'aggregatorName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Amount Charged',
      fieldName: 'amountCharged',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Wallet',
      fieldName: 'walletName',
      textAlign: 'left',
      sort: true,
      filter: true,
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
      body: walletBody,
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
      label: 'Created At',
      fieldName: 'createdAt',
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
      label: 'Delivered At',
      fieldName: 'deliveredAt',
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
      label: 'Denomination',
      fieldName: 'denomination',
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
      label: 'Email Delivered At',
      fieldName: 'emailDeliveredAt',
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
      label: 'Order Total',
      fieldName: 'orderTotal',
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
      label: 'Quantity',
      fieldName: 'quantity',
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
      body: tagBody,
    },
  ]

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
    nextArrow: <SliderNextArrow className={classes['next-arrow']} />,
    prevArrow: <SliderPrevArrow className={classes['prev-arrow']} />,
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

  const onClientChange = (e?: any) => {
    // console.log(key, e.target.value, 'clinetchange')

    e?.target?.value && setSelectedClient(e?.target?.value)
    setSelectedClientObj(e?.target?.value || selectedClient)
    key === 'WalletRecharge'
      ? getClientWisePaymentInfo(e?.target?.value || selectedClient)
      : getClientWiseRedeemInfo(e?.target?.value || selectedClient)
  }

  const toggleTab = (toggleName: string) => {
    setKey(toggleName)
    toggleName === 'WalletRecharge'
      ? getClientWisePaymentInfo(selectedClientObj)
      : getClientWiseRedeemInfo(selectedClientObj)
  }

  return (
    <>
      <div className={classes['clientInfo-body']}>
        <div className="row m-0">
          <div className={'col-lg-3 col-3 px-2' + ' ' + classes['top-sec-li']}>
            <div className={classes['aggregatorInfo-top-sec']}>
              <ul>
                <li>
                  <h5>
                    <span>Name:</span> {clickedRowData?.name}
                  </h5>
                </li>
                <li>
                  <h5>
                    {' '}
                    <span>Email:</span> {clickedRowData?.email}
                  </h5>
                </li>
                <li>
                  <h5>
                    <span> Client Count:</span> {clickedRowData?.clientCount}
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
                          clickedRowData?.totalCreditedAmount || 0
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
                          +clickedRowData?.totalRedeemedAmount || 0
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
                      Available Amount:{' '}
                      <span>
                        {(
                          +clickedRowData?.totalAvailableAmount || 0
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
                        {(+clickedRowData?.totalCommission || 0).toLocaleString(
                          'en-US'
                        )}
                      </span>
                    </h6>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h4 className={classes['content-header']}>
          Client List (<span>{clientInfo.length}</span>)
        </h4>
        <div className={classes['client-info-sec']}>
          <div className="row m-0">
            <Slider {...settings}>
              {clientInfo.map((client: any, index: number) => {
                return (
                  <div className="col-md-12 p-0" key={index}>
                    <div className={classes['client-info-card']}>
                      <div className={classes['client-details']}>
                        <div className="clinetImg" style={{ width: '50px' }}>
                          <img
                            crossOrigin="anonymous"
                            src={`${process.env.REACT_APP_API_BASEURL}/${client?.companyLogo}`}
                            style={{
                              height: '40px',
                              width: '40px',
                              border: '1px solid #ddd',
                              borderRadius: '50%',
                              objectFit: 'contain',
                              boxShadow: '0px 3px 6px #00000029',
                            }}
                            width={150}
                            alt="Brand Logo"
                          />
                        </div>
                        <div
                          style={{
                            width: ' calc(100% - 50px',
                            paddingLeft: '5px',
                          }}
                        >
                          <h4>{client?.clientName}</h4>
                          <h6>{client?.clientEmail}</h6>
                        </div>
                      </div>
                      <div className={classes['client-transaction-details']}>
                        <ul>
                          <li>
                            <div className={classes['details-div']}>
                              <h6>
                                Available Amount
                                <span style={{ color: '#1FB977' }}>
                                  {client?.availableAmount?.toLocaleString(
                                    'en-US'
                                  )}
                                </span>
                              </h6>
                            </div>
                          </li>
                          <li>
                            <div className={classes['details-div']}>
                              <h6>
                                Credit Amount
                                <span style={{ color: '#789CF4' }}>
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
                                Redeemed Amount
                                <span style={{ color: '#D65E1B' }}>
                                  {(
                                    client?.totalRedeemedAmount || 0
                                  ).toLocaleString('en-US')}
                                </span>
                              </h6>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>

        <div className={classes['aggregator-clientInfo-table']}>
          <div className="tab-header">
            <ul>
              <li
                className={key === 'WalletRecharge' ? 'active-tab' : 'tab'}
                onClick={() => toggleTab('WalletRecharge')}
              >
                Wallet Recharge
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
                    className="clientInfo-dropdown"
                    value={selectedClient}
                    options={clientInfo}
                    onChange={onClientChange}
                    optionLabel=""
                    placeholder="Select Client"
                  />
                </div>
              </li>
            </ul>
          </div>

          <div className="tab-contents">
            <div
              className={
                key === 'WalletRecharge' ? 'active-content' : 'content'
              }
            >
              <DataTableBasicDemo
                data={clientWisePaymentsData}
                column={clientWisePaymentsColumns}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'ClientWiseRedeemPaymentInfo'}
                scrollHeight={'calc(100vh - 300px)'}
              />
            </div>
            <div
              className={key === 'redeemInfo' ? 'active-content' : 'content'}
            >
              <DataTableBasicDemo
                data={clientWiseRedeemData}
                column={clientWiseRedeemColumns}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                downloadedfileName={'ClientWiseRedeemPaymentInfo'}
                scrollHeight={'calc(100vh - 300px)'}
              />
            </div>
          </div>
        </div>
      </div>
      {paymentInvoice ? (
        <FileViewer
          fileArray={file}
          que={APIURLS.VOUCHER_LIST}
          heading="Attachment File"
          fileViewer={setPaymentInvoice}
          currentFileName={file[0]}
        />
      ) : null}
    </>
  )
}
export default AggregatorClientInfo
