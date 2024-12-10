import { Dropdown } from 'primereact/dropdown'
import Tooltip from '@material-ui/core/Tooltip'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { ImageUrl } from '../../utils/ImageUrl'
import classes from './Dashboard.module.scss'
import { InputSwitchComponent } from '../../components/ui/input-switch/InputSwitch'
import { DashboardService } from '../../services/dashboard-service/dashboard.service'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { AuthService } from '../../services/auth-service/auth.service'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { Loader } from '../../components/ui/loader/Loader'
import { Theme, withStyles } from '@material-ui/core'
import { NoRecord } from '../../components/ui/cards/no-record/NoRecord'
import moment from 'moment'

const Dashboard: React.FC = () => {
  const [toggleCouponAmt, setToggleCouponAmt] = useState(true)
  const [viewFilters, setViewFilters] = useState(false)
  const [value3, setValue3] = useState('')

  const [countryFilterData, setCountryFilterData] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [financialYearFilterData, setFinancialYearFilterData] = useState([])
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null)
  const [dashboardData, setDashboardData] = useState<any>({})
  const [couponWithZeroInventoryData, setCouponWithZeroInventoryData] =
    useState<any>([])
  const [redeemLineChartData, setRedeemLineChartData] = useState([])
  const [viewAllDenominationTable, setViewAllDenominationTable] =
    useState(false)
  const [viewAllProcuredPaymentTable, setViewAllProcuredPaymentTable] =
    useState(false)
  const [viewAllExpiringSoonTable, setViewAllExpiringSoonTable] =
    useState(false)
  const [denominationsTableData, setDenominationsTableData] = useState([])
  const [procuredPaymentTableData, setProcuredPaymentTableData] = useState([])
  const [expiringSoonTableData, setExpiringSoonTableData] = useState([])
  const [brandFilter, setBrandsFilter] = useState([])
  const [brandsCode, setBrandsCode] = useState([])
  const [loader, setLoader] = useState(false)

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

  const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip)

  const denominationsTableColumns = [
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandFilter?.length
          ? brandFilter.map((brand: any) => {
              return brand.label
            })
          : [],
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
      },
      body: brandBody,
    },
    {
      label: 'Denomination',
      fieldName: 'denomination',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Procured Amount',
      fieldName: 'procuredAmount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Procured Count',
      fieldName: 'procuredCount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Availabe Amount',
      fieldName: 'avilableAmount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Availabe Count',
      fieldName: 'avilableCount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Redeem Amount',
      fieldName: 'redeemedAmount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Redeem Count',
      fieldName: 'redeemedCount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
  ]
  const procuredPaymentTableColumns = [
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandFilter?.length
          ? brandFilter.map((brand: any) => {
              return brand.label
            })
          : [],
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
      },
      body: brandBody,
    },
    {
      label: 'Payment Date',
      fieldName: 'paymentDate',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    // {
    //   label: toggleCouponAmt ? 'Amount' : 'Count',
    //   fieldName: toggleCouponAmt ? 'couponAmount' : 'couponCount' || '',
    //   textAlign: 'left',
    //   frozen: false,
    //   sort: true,
    //   filter: true,
    // },
    {
      label: 'Discount',
      fieldName: 'discount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
  ]
  const expiringSoonTableColumns = [
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandFilter?.length
          ? brandFilter.map((brand: any) => {
              return brand.label
            })
          : [],
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
      },
    },
    {
      label: 'Brand Code',
      fieldName: 'brandCode',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Expiry Date',
      fieldName: 'expiryDate',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Coupon Amount',
      fieldName: 'couponAmount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
    {
      label: 'Coupon Count',
      fieldName: 'couponCount',
      textAlign: 'left',
      frozen: false,
      sort: true,
      filter: true,
    },
  ]
  const onCountryChange = (e: any) => {
    setSelectedCountry(e.target.value)
  }
  const onFinancialYearChange = (e: any) => {
    setSelectedFinancialYear(e.target.value)
  }

  // const masterService = new MasterService()
  const dashboardService = new DashboardService()
  useEffect(() => {
    // getInventoryData()
    // getCouponWithZeroInventoryData()
    // getCountryList()
    // getCalenderList()
    // getBrandsFilterList()

    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilterData(value)
    })
    AuthService.calendarList$.subscribe((value: any) => {
      setFinancialYearFilterData(value)
    })
    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandsCode(value)
    })
  }, [])

  // const getCountryList = () => {
  //   masterService
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setCountryFilterData(response?.country)
  //       // console.log(response, 'countryList')
  //     })
  //     .catch((error: any) => {
  //       // console.log(error, 'CountryList error')
  //     })
  // }

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

  // const getCalenderList = () => {
  //   masterService
  //     .calenderList()
  //     .then((response: any) => {
  //       // console.log('calender list', response)
  //       setFinancialYearFilterData(response)
  //       // console.log('Financial Year List', financialYearFilterData)
  //     })
  //     .catch((error: any) => {
  //       // console.log(error, 'calenderlist error')
  //     })
  // }
  const getInventoryData = () => {
    setLoader(true)
    dashboardService
      .getDashboard()
      .then((response: any) => {
        setDashboardData(response)
        setDenominationsTableData(response?.couponResult?.brandDenominationWise)
        setProcuredPaymentTableData(response?.couponResult?.procuredCouponList)
        setExpiringSoonTableData(response?.couponResult?.brandExpiryWise)
        setRedeemLineChartData(response?.couponResult?.monthWiseInventory)
        const procuredCouponAmount = redeemLineChartData.map(
          (item: any) => item.procuredCouponAmount
        )
        setLoader(false)
        // console.log('redeemLineChartData', redeemLineChartData)
      })
      .catch((error) => {
        setLoader(false)
        return false
      })
  }
  const getCouponWithZeroInventoryData = () => {
    dashboardService
      .couponWithZeroInventoryData()
      .then((response: any) => {
        setCouponWithZeroInventoryData(response?.data)
        // console.log('couponWithZeroInventoryData', response?.data)
      })
      .catch((error) => {
        return false
      })
  }

  const inventoryFlowLineoptions = {
    credits: {
      enabled: false,
    },
    title: { text: '' },
    series: [
      {
        name: 'Procured',
        data: !toggleCouponAmt
          ? redeemLineChartData.map((item: any) => item?.procuredCouponCount)
          : redeemLineChartData.map((item: any) => item?.procuredCouponAmount),
      },
      {
        name: 'Redeemed',
        data: !toggleCouponAmt
          ? redeemLineChartData.map((item: any) => item?.redeemedCouponCount)
          : redeemLineChartData.map((item: any) => item?.redeemedCouponAmount),
      },
    ],
    xAxis: {
      categories: redeemLineChartData.map((item: any) => item?.monthName),
      accessibility: {
        description: 'Months of the year',
      },
    },
    yAxis: {
      title: {
        text: 'Procured Vs Redeeem',
        style: {
          fontFamily: 'Roboto',
          fontSize: '14px',
        },
      },
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br />',
      pointFormat: ' {point.y:,.2f}',
    },
  }

  const onToggleHandleChange = (value: any, id: any) => {
    setToggleCouponAmt(value)
  }
  return loader ? (
    <Loader />
  ) : (
    <>
      <div className="respn-width">
        <div className={classes['sticky-row'] + ' ' + 'row'}>
          <div className={classes['filter-row']}>
            <div className={classes['toggle-amt-qty']}>
              <h6>
                Preference : <i className="pi pi-info-circle"></i>
              </h6>
              <div className={classes['switch-div']}>
                <span
                  className={
                    toggleCouponAmt
                      ? classes['coupon-count']
                      : classes['coupon-count'] +
                        ' ' +
                        classes['coupon-count-active']
                  }
                >
                  Coupon Count
                </span>
                <InputSwitchComponent
                  key=""
                  inputtype="inputSwitch"
                  value={toggleCouponAmt}
                  blurred={false}
                  disable={false}
                  id=""
                  changed={onToggleHandleChange}
                  requiredLabel={false}
                  formName=""
                />{' '}
                <span
                  className={
                    toggleCouponAmt
                      ? classes['coupon-amount'] +
                        ' ' +
                        classes['coupon-amount-active']
                      : classes['coupon-amount']
                  }
                >
                  Coupon Amount
                </span>
              </div>
            </div>
            <div className={classes['filters-sec']}>
              <div className={classes['serach-div']}>
                <span className="p-input-icon-right">
                  <i className="pi pi-search" />
                  <InputText
                    value={value3}
                    onChange={(e) => setValue3(e.target.value)}
                    placeholder="Search"
                  />
                </span>
              </div>
              <div className={classes['dropdown-filter-financial-year']}>
                <Dropdown
                  value={selectedFinancialYear}
                  options={financialYearFilterData}
                  onChange={onFinancialYearChange}
                  optionLabel=""
                  placeholder="Financial Year"
                />
              </div>

              <div className={classes['dropdown-filter-country']}>
                <Dropdown
                  value={selectedCountry}
                  options={countryFilterData}
                  onChange={onCountryChange}
                  optionLabel=""
                  placeholder="Country"
                />
              </div>
              <div className={classes['dropdown-filters-responsive']}>
                <div
                  className={classes['filter-icon']}
                  onClick={() => setViewFilters(!viewFilters)}
                >
                  <span>Select Filters</span>
                  <i className="pi pi-filter"></i>
                </div>
                {viewFilters ? (
                  <>
                    <div className={classes['filter-content-overlay']}>
                      <div
                        className={classes['filter-content'] + 'stretchLeft'}
                      >
                        <div className={classes['filter-content-heading']}>
                          <h4>Filter Content</h4>
                          <div
                            className={classes['close-filter']}
                            onClick={() => setViewFilters(false)}
                          >
                            &times;
                          </div>
                        </div>
                        <div
                          className={classes['dropdown-filter-financial-year']}
                        >
                          <Dropdown
                            value={selectedFinancialYear}
                            options={financialYearFilterData}
                            onChange={onFinancialYearChange}
                            optionLabel="name"
                            placeholder="Financial Year"
                          />
                        </div>

                        <div className={classes['dropdown-filter-country']}>
                          <Dropdown
                            value={selectedCountry}
                            options={countryFilterData}
                            onChange={onCountryChange}
                            optionLabel=""
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0">
          <div className="col-lg-9 col-md-12 px-1 p-sm-0 py-2">
            <div className="row m-0">
              <div className="col-md-3 col-6 px-1 p-sm-0">
                <div
                  className={
                    classes['ctm-card'] + ' ' + classes['total-coupon-card']
                  }
                  style={{ background: '#3CCC9A' }}
                >
                  <div
                    className={classes['ctm-card-img']}
                    style={{ background: '#1D9A6E' }}
                  >
                    <img src={ImageUrl.ExpireSoon} alt="" />
                  </div>
                  <div
                    className={
                      classes['ctm-card-details'] + ' ' + 'perfect-left-column'
                    }
                  >
                    <h5>Total Procured</h5>
                    <h2>
                      {(toggleCouponAmt
                        ? dashboardData?.couponResult?.totalProcuredCouponsAmount?.toLocaleString(
                            'en-US'
                          )
                        : dashboardData?.couponResult?.totalProcuredCouponsCount?.toLocaleString(
                            'en-US'
                          )) || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6 px-1 p-sm-0">
                <div
                  className={classes['ctm-card']}
                  style={{ background: '#6D8DF6' }}
                >
                  <div
                    className={classes['ctm-card-img']}
                    style={{ background: '#4C68C5' }}
                  >
                    <img src={ImageUrl.TotalCoupon} />
                  </div>
                  <div
                    className={
                      classes['ctm-card-details'] + ' ' + 'perfect-left-column'
                    }
                  >
                    <h5>Available Coupon</h5>
                    <h2>
                      {(toggleCouponAmt
                        ? dashboardData?.couponResult?.availableCouponsAmount?.toLocaleString(
                            'en-US'
                          )
                        : dashboardData?.couponResult?.availableCouponsCount?.toLocaleString(
                            'en-US'
                          )) || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6 px-1 p-sm-0">
                <div
                  className={classes['ctm-card']}
                  style={{ background: '#FDB647' }}
                >
                  <div
                    className={classes['ctm-card-img']}
                    style={{ background: '#E88E01' }}
                  >
                    <img src={ImageUrl.RedeemCoupon} />
                  </div>
                  <div
                    className={
                      classes['ctm-card-details'] + ' ' + 'perfect-left-column'
                    }
                  >
                    <h5>Redeem Coupon</h5>
                    <h2>
                      {(toggleCouponAmt
                        ? dashboardData?.couponResult?.redeemedCouponsAmount?.toLocaleString(
                            'en-US'
                          )
                        : dashboardData?.couponResult?.redeemedCouponsCount?.toLocaleString(
                            'en-US'
                          )) || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6 px-1 p-sm-0">
                <div
                  className={classes['ctm-card']}
                  style={{ background: '#F95B7F' }}
                >
                  <div
                    className={classes['ctm-card-img']}
                    style={{ background: '#E32A54' }}
                  >
                    <img src={ImageUrl.ExpireSoon} />
                  </div>
                  <div
                    className={
                      classes['ctm-card-details'] + ' ' + 'perfect-left-column'
                    }
                  >
                    <h5>Expire in 30 days</h5>
                    <h2>
                      {(toggleCouponAmt
                        ? dashboardData?.couponResult?.expiringCouponsAmountInNext30Days?.toLocaleString(
                            'en-US'
                          )
                        : dashboardData?.couponResult?.expiringCouponsCountInNext30Days?.toLocaleString(
                            'en-US'
                          )) || 0}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="row m-0">
              <div className="col-md-12 p-0">
                <div className={classes['home-custom-full-table']}>
                  <div
                    className={
                      classes['brand-section'] + ' ' + classes['box-header']
                    }
                  >
                    <h1>Brand Coupons </h1>
                    {denominationsTableData?.length ? (
                      <span onClick={() => setViewAllDenominationTable(true)}>
                        View All
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={
                      classes['denomination-table'] +
                      ' ' +
                      classes['brand-wise-denomination-table']
                    }
                  >
                    {denominationsTableData?.length ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Brand</th>
                            <th>Denominations</th>
                            <th>Procured</th>
                            <th>Available</th>
                            <th>Redeem</th>
                            <th>Expiring in 30 days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {denominationsTableData?.map(
                            (item: any, index: number) => {
                              return (
                                <tr key={index}>
                                  <td
                                    className={
                                      classes['text-overflow-container']
                                    }
                                  >
                                    <img
                                      crossOrigin="anonymous"
                                      src={`${process.env.REACT_APP_API_BASEURL}/${item?.brandLogo}`}
                                    />{' '}
                                    {item?.brandName}
                                  </td>
                                  <td>
                                    {item?.denomination?.toLocaleString(
                                      'en-US'
                                    )}
                                  </td>
                                  <td>
                                    {' '}
                                    {(toggleCouponAmt
                                      ? item?.procuredAmount?.toLocaleString(
                                          'en-US'
                                        )
                                      : item?.procuredCount?.toLocaleString(
                                          'en-US'
                                        )) || 0}
                                  </td>
                                  <td>
                                    {(toggleCouponAmt
                                      ? item?.avilableAmount?.toLocaleString(
                                          'en-US'
                                        )
                                      : item?.avilableCount?.toLocaleString(
                                          'en-US'
                                        )) || 0}
                                  </td>
                                  <td>
                                    {(toggleCouponAmt
                                      ? item?.redeemedAmount?.toLocaleString(
                                          'en-US'
                                        )
                                      : item?.redeemedCount?.toLocaleString(
                                          'en-US'
                                        )) || 0}
                                  </td>
                                  <td>
                                    {(toggleCouponAmt
                                      ? item?.expireIn30dDaysAmount?.toLocaleString(
                                          'en-US'
                                        )
                                      : item?.expireIn30dDaysCount?.toLocaleString(
                                          'en-US'
                                        )) || 0}
                                  </td>
                                </tr>
                              )
                            }
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <>
                        <NoRecord
                          NoRecordDivHeight={'230px'}
                          NoRecordDivWidth={'100%'}
                        />
                      </>
                    )}

                    {/* <DataTable
                      value={dashboardData?.couponResult?.brandDenominationWise}
                      lazy
                      filterDisplay="row"
                      responsiveLayout="scroll"
                      paginator
                      rows={10}
                      totalRecords={
                        dashboardData?.couponResult?.brandDenominationWise
                          .length
                      }
                    >
                      <Column field="brandName" header="Brand Name" sortable />
                      <Column
                        field="denomination"
                        sortable
                        header="Denomination"
                      />
                      <Column
                        field={
                          toggleCouponAmt ? 'procuredAmount' : 'procuredCount'
                        }
                        sortable
                        header="Procured"
                      />
                      <Column
                        field={
                          toggleCouponAmt ? 'avilableAmount' : 'avilableCount'
                        }
                        sortable
                        header="Available"
                      />
                      <Column
                        field={
                          toggleCouponAmt ? 'redeemedAmount' : 'redeemedCount'
                        }
                        sortable
                        header="Redeemed"
                      />

                      <Column
                        field={
                          toggleCouponAmt
                            ? 'expireIn30dDaysAmount'
                            : 'expireIn30dDaysCount'
                        }NoRecordFound
                        sortable
                        header="Expire in 30 days"
                      />
                    </DataTable> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 px-1 py-2">
            <div className={classes['available-coupon-section']}>
              <h2>Available Coupons</h2>
              <div
                className={
                  classes['available-coupon-row'] + ' ' + classes['thead-row']
                }
              >
                <div className={classes['coupon-type-img']}></div>
                <div className={classes['coupon-qty'] + ' ' + 'perfect-center'}>
                  Qty
                </div>
                <div className={classes['coupon-amt'] + ' ' + 'perfect-center'}>
                  Amount
                </div>
              </div>
              {dashboardData?.couponResult?.walletWiseAvilable?.length ? (
                <>
                  {dashboardData?.couponResult?.walletWiseAvilable.map(
                    (couponType: any, index: number) => {
                      return (
                        <div
                          className={classes['available-coupon-row']}
                          key={index}
                        >
                          <div
                            className={
                              classes['coupon-type-img'] +
                              ' ' +
                              'perfect-left-row'
                            }
                          >
                            <div className={classes['table-img']}>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponType?.image}`}
                              />
                            </div>
                            <span>{couponType?.name}</span>
                          </div>
                          <div
                            className={
                              classes['coupon-qty'] + ' ' + 'perfect-center'
                            }
                          >
                            {couponType?.count?.toLocaleString('en-US')}
                          </div>
                          <div
                            className={
                              classes['coupon-amt'] + ' ' + 'perfect-center'
                            }
                          >
                            ₹{couponType?.amount?.toLocaleString('en-US')}
                          </div>
                        </div>
                      )
                    }
                  )}{' '}
                </>
              ) : (
                <>
                  <NoRecord
                    NoRecordDivHeight={'200px'}
                    NoRecordDivWidth={'100%'}
                  />
                </>
              )}
            </div>
            <div className={classes['topselling-section']}>
              <div className={classes['box-header']}>
                <h2>Top Selling Brands</h2>
                <span> {/* <span>View All</span>{' '} */}</span>
              </div>

              <div className="row m-0">
                {dashboardData?.couponResult?.couponRedeemedList.length ? (
                  <>
                    {dashboardData?.couponResult?.couponRedeemedList.map(
                      (coupon: any, index: number) => {
                        return (
                          index < 2 && (
                            <div
                              className="col-lg-6 col-md-6 p-0 col-6"
                              key={index}
                            >
                              <div className={classes['tp-selling-box']}>
                                <span>
                                  <img
                                    crossOrigin="anonymous"
                                    src={`${process.env.REACT_APP_API_BASEURL}/${coupon?.brandLogo}`}
                                  />
                                </span>
                                <h3 className="ellipsis-text">
                                  {coupon?.brandName}
                                </h3>
                                <p>
                                  {toggleCouponAmt
                                    ? coupon?.amount?.toLocaleString('en-US')
                                    : coupon?.count?.toLocaleString('en-US')}
                                </p>
                              </div>
                            </div>
                          )
                        )
                      }
                    )}
                  </>
                ) : (
                  <>
                    <NoRecord
                      NoRecordDivHeight={'70px'}
                      NoRecordDivWidth={'100%'}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 p-0 p-sm-0 col-sm-12">
            <div className={classes['inventory-flow']}>
              <div className={classes['box-header']}>
                <h2>Inventory Flow</h2>
              </div>
              <div className={classes['flow-content']}>
                {redeemLineChartData?.length ? (
                  <>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={inventoryFlowLineoptions}
                    />
                  </>
                ) : (
                  <>
                    <NoRecord
                      NoRecordDivHeight={'400px'}
                      NoRecordDivWidth={'100%'}
                      NoRecordImg={ImageUrl.NoRecordFounds}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 p-0 col-sm-12">
            <div className={classes['catagory-redemption']}>
              <div className={classes['box-header']}>
                <h2>Category by Redeemption</h2>
                {/* <span>View All</span> */}
              </div>
              <div className={classes['flow-content']}>
                <NoRecord
                  NoRecordDivHeight={'400px'}
                  NoRecordDivWidth={'100%'}
                  NoRecordImg={ImageUrl.NoRecordFounds}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 px-xl-1 col-sm-12  p-0">
            <div
              className={
                classes['home-custom-table'] +
                ' ' +
                'text-center' +
                ' ' +
                classes['coupon-zero-inventory']
              }
            >
              <div className={classes['box-header']}>
                <h2>Coupon with Zero Inventory</h2>
                {/* <span>View All</span> */}
              </div>
              {couponWithZeroInventoryData.length ? (
                <>
                  <div className={classes['box-content']}>
                    <div className={classes['logo-sectn']}>
                      <div className={classes['se1']}>
                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L1']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[0]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[0]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L2']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[1]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[1]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className={classes['se2']}>
                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L3']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[2]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[2]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L4']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[3]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[3]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className={classes['se3']}>
                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L5']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[4]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[4]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L6']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[5]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[5]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className={classes['se4']}>
                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L7']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[6]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[6]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L8']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[7]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[7]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className={classes['se5']}>
                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L9']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[8]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[8]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div
                          className={
                            ' fade-in' +
                            ' ' +
                            classes['logo-box'] +
                            ' ' +
                            classes['L10']
                          }
                        >
                          {couponWithZeroInventoryData &&
                          couponWithZeroInventoryData[9]?.brandLogo ? (
                            <>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${couponWithZeroInventoryData[9]?.brandLogo}`}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      {couponWithZeroInventoryData &&
                      couponWithZeroInventoryData.length > 10 ? (
                        <>
                          <h6 className={classes['ImageLength']}>
                            + {couponWithZeroInventoryData.length - 10} More
                            Coupons
                          </h6>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <>
                    <NoRecord
                      NoRecordDivHeight={'220px'}
                      NoRecordDivWidth={'100%'}
                    />
                  </>
                </>
              )}
            </div>
          </div>

          <div className="col-lg-4 col-md-6 px-xl-1 col-sm-12 p-0">
            <div
              className={
                classes['home-custom-table'] +
                ' ' +
                classes['procured-payment-div']
              }
            >
              <div className={classes['box-header']}>
                <h2>Procured Payment</h2>
                {dashboardData?.couponResult?.procuredCouponList.length > 5 ? (
                  <span onClick={() => setViewAllProcuredPaymentTable(true)}>
                    View All
                  </span>
                ) : (
                  <></>
                )}
              </div>
              <div className={classes['procured-payment-table']}>
                {dashboardData?.couponResult?.procuredCouponList.length ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>Brand Name</th>
                          <th>Payment Date</th>
                          <th>{toggleCouponAmt ? 'Amount' : 'Qty'}</th>
                          <th>Discount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.couponResult?.procuredCouponList.map(
                          (coupon: any, index: number) => {
                            return (
                              index < 6 && (
                                <tr key={index}>
                                  <td>
                                    <img
                                      crossOrigin="anonymous"
                                      src={`${process.env.REACT_APP_API_BASEURL}/${coupon?.brandLogo}`}
                                    />{' '}
                                    {coupon?.brandName}{' '}
                                  </td>
                                  <td>
                                    {/* {moment(coupon?.paymentDate).format(
                                      'DD-MM-YYYY'
                                    )} */}
                                    {coupon?.paymentDate}
                                  </td>
                                  <td>
                                    <span className={classes['vw-all']}>
                                      {toggleCouponAmt
                                        ? coupon?.couponAmount
                                        : coupon?.couponCount}
                                    </span>
                                  </td>
                                  <td>
                                    {' '}
                                    <span
                                      style={{
                                        color:
                                          coupon?.discount < 0
                                            ? 'red'
                                            : 'green',
                                      }}
                                    >
                                      {coupon?.discount.toLocaleString('en-US')}
                                    </span>{' '}
                                  </td>
                                </tr>
                              )
                            )
                          }
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <NoRecord
                      NoRecordDivHeight={'220px'}
                      NoRecordDivWidth={'100%'}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 px-xl-1 col-sm-12 p-0">
            <div
              className={
                classes['home-custom-table'] +
                ' ' +
                classes['expiring-soon-div']
              }
            >
              <div className={classes['box-header']}>
                <h2>
                  Expiring Soon{' '}
                  {dashboardData?.couponResult?.brandExpiryWise.length ? (
                    <>
                      ({dashboardData?.couponResult?.brandExpiryWise.length}){' '}
                    </>
                  ) : (
                    <></>
                  )}
                </h2>
                {dashboardData?.couponResult?.brandExpiryWise.length > 5 ? (
                  <span onClick={() => setViewAllExpiringSoonTable(true)}>
                    View All
                  </span>
                ) : (
                  <></>
                )}
              </div>
              {dashboardData?.couponResult?.brandExpiryWise.length ? (
                <table>
                  <thead>
                    <tr>
                      <th>Brand Name</th>
                      <th>{toggleCouponAmt ? 'Amount' : 'Qty'}</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.couponResult?.brandExpiryWise.map(
                      (coupon: any, index: number) => {
                        return (
                          index < 6 && (
                            <tr key={index}>
                              <td>
                                <img
                                  crossOrigin="anonymous"
                                  src={`${process.env.REACT_APP_API_BASEURL}/${coupon?.brandLogo}`}
                                />{' '}
                                {coupon?.brandName}{' '}
                              </td>
                              <td>
                                {toggleCouponAmt
                                  ? coupon?.couponAmount
                                  : coupon?.couponCount}
                              </td>
                              <td>{coupon?.expiryDate}</td>
                            </tr>
                          )
                        )
                      }
                    )}
                  </tbody>
                </table>
              ) : (
                <>
                  <NoRecord
                    NoRecordDivHeight={'200px'}
                    NoRecordDivWidth={'100%'}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {viewAllDenominationTable ? (
        <>
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
                  onClick={() => setViewAllDenominationTable(false)}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">Coupon Details</h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => setViewAllDenominationTable(false)}
                >
                  &times;
                </div>
              </div>
              <div
                className="popup-content"
                style={{ height: 'calc(100vh - 45px)' }}
              >
                <DataTableBasicDemo
                  data={denominationsTableData}
                  column={denominationsTableColumns}
                  showGridlines={true}
                  resizableColumns={true}
                  rows={20}
                  paginator={true}
                  sortable={true}
                  headerRequired={true}
                  scrollHeight={'calc(100vh - 80px)'}
                  downloadedfileName={'Brandwise_Denomination_table'}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {viewAllProcuredPaymentTable ? (
        <>
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
                  onClick={() => setViewAllProcuredPaymentTable(false)}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">Coupon Details</h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => setViewAllProcuredPaymentTable(false)}
                >
                  &times;
                </div>
              </div>
              <div
                className="popup-content"
                style={{ height: 'calc(100vh - 45px)' }}
              >
                <DataTableBasicDemo
                  data={procuredPaymentTableData}
                  column={procuredPaymentTableColumns}
                  showGridlines={true}
                  resizableColumns={true}
                  rows={20}
                  paginator={true}
                  sortable={true}
                  headerRequired={true}
                  downloadedfileName={'Payments'}
                  scrollHeight={'calc(100vh - 80px)'}
                />
              </div>
              <div className="popup-lower-btn"></div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {viewAllExpiringSoonTable ? (
        <>
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
                  onClick={() => setViewAllExpiringSoonTable(false)}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">Coupon Details</h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => setViewAllExpiringSoonTable(false)}
                >
                  &times;
                </div>
              </div>
              <div
                className="popup-content"
                style={{ height: 'calc(100vh - 45px)' }}
              >
                <DataTableBasicDemo
                  data={expiringSoonTableData}
                  column={expiringSoonTableColumns}
                  showGridlines={true}
                  resizableColumns={true}
                  rows={20}
                  paginator={true}
                  sortable={true}
                  headerRequired={true}
                  downloadedfileName={'Payments'}
                  scrollHeight={'calc(100vh - 80px)'}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default Dashboard
