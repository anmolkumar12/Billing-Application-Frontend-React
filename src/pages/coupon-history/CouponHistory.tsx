import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import classes from './CouponHistory.module.scss'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, Theme } from '@material-ui/core/styles'
import { CouponHistoryService } from '../../services/coupon-history-service/coupon-history.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { CONSTANTS } from '../../constants/Constants'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { ImageUrl } from '../../utils/ImageUrl'
import { AuthService } from '../../services/auth-service/auth.service'

const CouponHistory: React.FC = () => {
  const [brandWiseReportData, setBrandWiseReportData] = useState([])
  const [denominationWiseReportData, setDenominationWiseReportData] = useState(
    []
  )
  const [redeemedCouponsReportData, setRedeemedCouponsReportData] = useState([])
  const [failedTransactionReportData, setFailedTransactionReportData] =
    useState([])
  const [countryFilter, setCountryFilter] = useState([])
  const [currencyFilter, setcurrencyFilter] = useState([])
  const [brandFilter, setBrandsFilter] = useState([])
  const [brandsCode, setBrandsCode] = useState([])
  const [walletFilter, setWalletFilter] = useState([])
  // const [key, setKey] = useState('brandWiseReport')
  const [toggleState, setToggleState] = useState(1)
  const [aggregatorList, setAdminAggregatorList] = useState([])
  const [allClients, setAllClients] = useState([])
  const [storeDropdownList, setStoreDropdownList] = useState([])

  useEffect(() => {
    getBrandWiseReport()
    // getBrandsFilterList()
    // getWalletList()
    // getCountryList()
    // getDenominationWiseReport()
    // getRedeemCouponReport()
    // getFailedTransactionReport()

    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletFilter(value)
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
    AuthService.adminAggregatorList$.subscribe((value: any) => {
      setAdminAggregatorList(value)
    })
    AuthService.allClientList$.subscribe((value: any) => {
      setAllClients(value)
    })
    AuthService.storeList$.subscribe((value: any) => {
      setStoreDropdownList(value)
    })
  }, [])

  const toggleTab = (index: number) => {
    setToggleState(index)
    index == 1
      ? getBrandWiseReport()
      : index == 2
      ? getDenominationWiseReport()
      : index == 3
      ? getRedeemCouponReport()
      : getFailedTransactionReport()
  }

  // const getWalletList = () => {
  //   new MasterService()
  //     .walletList()
  //     .then((response: any) => {
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

  const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip)

  const orderStatus = (rowData: any) => {
    return (
      <div>
        <span
          style={
            rowData.orderStatus == 'Success'
              ? { color: '#51d352' }
              : { color: '#e52e2f' }
          }
        >
          {rowData.orderStatus}
          {/* {rowData.order_request == 1 ? 'Accepted' : 'Rejected'} */}
        </span>
      </div>
    )
  }

  const getBrandWiseReport = () => {
    new CouponHistoryService()
      .brandWiseReport()
      .then((response: any) => {
        setBrandWiseReportData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const getDenominationWiseReport = () => {
    new CouponHistoryService()
      .denominationWiseReport()
      .then((response: any) => {
        setDenominationWiseReportData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

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

  const getFailedTransactionReport = () => {
    new CouponHistoryService()
      .failedTransactionReport()
      .then((response: any) => {
        setFailedTransactionReportData(response)
        // console.log(failedTransactionReportData, 'failedTransactionReportData')
      })
      .catch((error) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const errorDescriptionBody = (rowData: any) => {
    return (
      <>
        <Tooltip title={rowData?.error}>
          <span className="ellipsis-text-table">{rowData?.error}</span>
        </Tooltip>
      </>
    )
  }

  const reasonBody = (rowData: any) => {
    return (
      <>
        <Tooltip title={rowData?.errorInfo}>
          <span className="ellipsis-text-table">{rowData?.errorInfo}</span>
        </Tooltip>
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

  const brandWiseReportColumn = [
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
        placeholder: 'Brand Name',
      },
      body: brandBody,
    },
    {
      label: 'Brand Code',
      fieldName: 'brandcode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandsCode?.length
          ? brandsCode.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'brandcode',
        changeFilter: true,
        placeholder: 'Brand Code',
      },
    },
    {
      label: 'Country',
      fieldName: 'countryName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: countryFilter?.length
          ? countryFilter.map((country: any) => {
              return country.label
            })
          : [],
        fieldValue: 'countryName',
        changeFilter: true,
        placeholder: 'Country',
      },
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
      label: 'Wallet Name',
      fieldName: 'walletName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Procured Amount',
      fieldName: 'procuredAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Procured Count',
      fieldName: 'procuredCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Redeemed Amount',
      fieldName: 'redeemedAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Redeemed Count',
      fieldName: 'redeemedCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Available Amount',
      fieldName: 'avilableAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Available Count',
      fieldName: 'avilableCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Expire In 30 Days Amount',
      fieldName: 'expireIn30dDaysAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Expire In 30 Days Count',
      fieldName: 'expireIn30dDaysCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const denominationWiseReportColumn = [
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
      label: 'Brand Code',
      fieldName: 'brandcode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandsCode?.length
          ? brandsCode.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'brandcode',
        changeFilter: true,
        placeholder: 'Brand Code',
      },
    },
    {
      label: 'Denomination',
      fieldName: 'denomination',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Country',
      fieldName: 'countryName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: countryFilter?.length
          ? countryFilter.map((country: any) => {
              return country.label
            })
          : [],
        fieldValue: 'countryName',
        changeFilter: true,
        placeholder: 'Country',
      },
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
      label: 'Wallet Name',
      fieldName: 'walletName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Procured Amount',
      fieldName: 'procuredAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Procured Count',
      fieldName: 'procuredCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Redeemed Amount',
      fieldName: 'redeemedAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Redeemed Count',
      fieldName: 'redeemedCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Available Amount',
      fieldName: 'avilableAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Available Count',
      fieldName: 'avilableCount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Expire In 30 Days Amount',
      fieldName: 'expireIn30dDaysAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Expire In 30 Days Count',
      fieldName: 'expireIn30dDaysCount',
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
        filterOptions: allClients?.length
          ? allClients.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Name',
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
        filterOptions: aggregatorList?.length
          ? aggregatorList.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'parentName',
        changeFilter: true,
        placeholder: 'Parent Name',
      },
    },
    {
      label: 'Wallet Name',
      fieldName: 'walletName',
      textAlign: 'left',
      sort: true,
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
      label: 'Amount Charged',
      fieldName: 'amountCharged',
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
      label: 'Discount Percentage',
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
      label: 'Order Status',
      fieldName: 'orderStatus',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: orderStatus,
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
      label: 'Email Delivered At',
      fieldName: 'emailDeliveredOn',
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
      label: 'Recipient Phone',
      fieldName: 'recipientPhone',
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
      label: 'Tag',
      fieldName: 'tag',
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
      label: 'Month',
      fieldName: 'month',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Financial Year',
      fieldName: 'fy',
      textAlign: 'left',
      sort: true,
      filter: true,
    },

    // {
    //   label: 'Created At',
    //   fieldName: 'createdAt',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    // {
    //   label: 'PO Number',
    //   fieldName: 'poNumber',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    // {
    //   label: 'Updated At',
    //   fieldName: 'updatedAt',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    // {
    //   label: 'Updated By',
    //   fieldName: 'updatedBy',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
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

  const failedTransactionTableColumns = [
    {
      label: 'Client Name',
      fieldName: 'aggregatorName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: allClients?.length
          ? allClients.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Name',
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
        filterOptions: aggregatorList?.length
          ? aggregatorList.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'parentName',
        changeFilter: true,
        placeholder: 'Parent Name',
      },
    },
    {
      label: 'Wallet Name',
      fieldName: 'walletName',
      textAlign: 'left',
      sort: true,
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
      label: 'Brand Code',
      fieldName: 'brandCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandsCode?.length
          ? brandsCode.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'brandCode',
        changeFilter: true,
        placeholder: 'Brand Code',
      },
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
      label: 'PO Number',
      fieldName: 'poNumber',
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
    {
      label: 'Reason',
      fieldName: 'errorInfo',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: reasonBody,
    },
    //   {
    //   label: 'Order At',
    //   fieldName: 'orderAt',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    // {
    //   label: 'Error Id',
    //   fieldName: 'errorId',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    {
      label: 'Error Despcription',
      fieldName: 'error',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: errorDescriptionBody,
    },
  ]

  return (
    <>
      <div className={classes['coupon-history-table']}>
        <div className="tab-header">
          <ul>
            <li
              className={toggleState === 1 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(1)}
            >
              Brand Wise Report
            </li>
            <li
              className={toggleState === 2 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(2)}
            >
              Denomination Wise Report
            </li>
            <li
              className={toggleState === 3 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(3)}
            >
              Redeemed Coupons
            </li>
            <li
              className={toggleState === 4 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(4)}
            >
              Failed Transaction
            </li>
          </ul>
        </div>

        <div className="tab-contents">
          <div className={toggleState === 1 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={brandWiseReportData}
              column={brandWiseReportColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={5}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'BrandWiseReport'}
              scrollHeight={'calc(100vh - 110px)'}
            />
          </div>
          <div className={toggleState === 2 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={denominationWiseReportData}
              column={denominationWiseReportColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={5}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'DenominationWiseReport'}
              scrollHeight={'calc(100vh - 110px)'}
            />
          </div>
          <div className={toggleState === 3 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={redeemedCouponsReportData}
              column={redeemVoucherColumn}
              showGridlines={true}
              resizableColumns={true}
              rows={5}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'RedeemedCouponReport'}
              scrollHeight={'calc(100vh - 110px)'}
            />
          </div>
          <div className={toggleState === 4 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              data={failedTransactionReportData}
              column={failedTransactionTableColumns}
              showGridlines={true}
              rows={5}
              paginator={true}
              resizableColumns={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'FailedTransactionReport'}
              scrollHeight={'calc(100vh - 110px)'}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CouponHistory
