/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Theme, Tooltip, withStyles } from '@material-ui/core'
import _ from 'lodash'
import moment from 'moment'
import { Chip } from 'primereact/chip'
import React from 'react'
import { FormEvent, useEffect, useState } from 'react'
import { ButtonComponent } from '../../components/ui/button/Button'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { FormComponent } from '../../components/ui/form/form'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { APIURLS } from '../../constants/ApiUrls'
import { CONSTANTS } from '../../constants/Constants'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { FormType } from '../../schemas/FormField'
import { AuthService } from '../../services/auth-service/auth.service'
import { CouponHistoryService } from '../../services/coupon-history-service/coupon-history.service'
import { ManageStoreService } from '../../services/manage-store-service/manage-store.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { UtilityService } from '../../services/utility-service/utility.service'
import { ImageUrl } from '../../utils/ImageUrl'
import classes from './ManageStore.module.scss'

const ManageStore: React.FC = () => {
  const [toggleState, setToggleState] = useState(1)
  const [storeRechargePopup, setStoreRechargePopup] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [attachments, setAttachments]: any = useState([])
  const [walletDropdownList, setWalletDropdownList] = useState([])
  const [bankFilter, setBankFilter] = useState([])
  const [storeDropdownList, setStoreDropdownList] = useState([])
  const [storeRechargeTableData, setStoreRechargeTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<any>([])
  const [storeInvoice, setStoreInvoice] = useState(false)
  const [storeCardsData, setStoreCardsData] = useState<any>([])
  const [redeemedCouponsReportData, setRedeemedCouponsReportData] = useState([])
  const [brandFilter, setBrandsFilter] = useState([])
  const [brandsCode, setBrandsCode] = useState([])
  const [countryFilter, setCountryFilter] = useState([])
  const [currencyFilter, setcurrencyFilter] = useState([])
  const [allClients, setAllClients] = useState([])
  const [aggregatorList, setAdminAggregatorList] = useState([])
  const [walletFilter, setWalletFilter] = useState([])

  useEffect(() => {
    getStoreRechargeTableData()
    getStoreCardData()
    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletDropdownList(value)
      storeRechargeForm.walletId.options = value
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilter(value)
      storeRechargeForm.bankId.options = value
    })
    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandsCode(value)
    })
    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setcurrencyFilter(value)
    })
    AuthService.allClientList$.subscribe((value: any) => {
      console.log('alll', value)
      setAllClients(value)
    })
    AuthService.adminAggregatorList$.subscribe((value: any) => {
      setAdminAggregatorList(value)
    })
    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletFilter(value)
    })
    AuthService.storeList$.subscribe((value: any) => {
      setStoreDropdownList(value)
      storeRechargeForm.storeId.options = value
    })
    // getStoreList()
  }, [])

  const toggleTab = (index: number) => {
    setToggleState(index)
    index == 1 ? getStoreRechargeTableData() : getRedeemCouponReport()
  }

  const getStoreRechargeTableData = () => {
    new ManageStoreService()
      .storeRechargeTableData()
      .then((response: any) => {
        console.log(response, 'resssssssss')
        setStoreRechargeTableData(response)
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }

  const manageStoreImgArr = [
    ImageUrl.manageStoreVectorOne,
    ImageUrl.manageStoreVectorTwo,
    ImageUrl.manageStoreVectorThree,
  ]
  // console.log('manageStoreImgArr', manageStoreImgArr)

  const getStoreCardData = () => {
    new ManageStoreService()
      .storeCardData()
      .then((response: any) => {
        console.log(response, 'jjjjjjresss')
        setStoreCardsData(response)
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }

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

  const storeBody = (rowData: any) => {
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
                setStoreInvoice(true)
              }}
            />
          ) : null}
          <span>{rowData?.invoiceNumber}</span>
        </div>
      </>
    )
  }

  const additionalInfoBody = (rowData: any) => {
    return (
      <>
        <Tooltip
          title={new UtilityService().replaceLineBreaks(
            rowData?.additionalInfo
          )}
        >
          <span className="ellipsis-text-table">
            {new UtilityService().replaceLineBreaks(rowData?.additionalInfo)}
          </span>
        </Tooltip>
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
    if (rowData.brandName && rowData.brandLogo) {
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

  const storeRechargeTableColumns = [
    {
      label: 'Store Name',
      fieldName: 'storeName',
      frozen: false,
      sort: true,
      textAlign: 'left',
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
    // {
    //   label: 'Wallet Name',
    //   fieldName: 'name',
    //   textAlign: 'left',
    //   sort: true,
    //   frozen: false,
    //   flexGrow: 1,
    //   filter: true,
    //   dropDownFilter: {
    //     filterOptions: walletDropdownList?.length
    //       ? walletDropdownList.map((storeItem: any) => {
    //           return storeItem.label
    //         })
    //       : [],
    //     fieldValue: 'name',
    //     changeFilter: true,
    //     placeholder: 'Wallet Name',
    //   },
    // },
    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      frozen: false,
      sort: true,
      filter: true,
      textAlign: 'left',
      body: storeBody,
    },
    {
      label: 'Credit Amount',
      fieldName: 'creditAmount',
      textAlign: 'left',
      sort: true,
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
      label: 'Bank Name',
      fieldName: 'bankName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: bankFilter?.length
          ? bankFilter.map((storeItem: any) => {
              return storeItem.label
            })
          : [],
        fieldValue: 'bankName',
        changeFilter: true,
        placeholder: 'Bank Name',
      },
    },
    {
      label: 'Additional Info',
      fieldName: 'additionalInfo',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: additionalInfoBody,
    },
    {
      label: 'Created Date',
      fieldName: 'createdAt',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Created By',
      fieldName: 'createdByName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
  ]

  const redeemVoucherColumn = [
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
      label: 'Amount Charged',
      fieldName: 'amountCharged',
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
      label: 'Email Delivered On',
      fieldName: 'emailDeliveredOn',
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
      body: orderStatus,
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
    },
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
  ]

  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => setStoreRechargePopup(true),
      tooltip: 'Add',
    },
  ]

  const storeRechargeFormObj = {
    storeId: {
      inputType: 'singleSelect',
      label: 'Store Name',
      options: storeDropdownList,
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
    // walletId: {
    //   inputType: 'multiSelect',
    //   label: 'Wallet',
    //   options: walletDropdownList,
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: 'col-md-4',
    // },
    bankId: {
      inputType: 'singleSelect',
      label: 'Bank Name',
      value: null,
      validation: {
        required: true,
      },
      options: bankFilter,
      fieldWidth: 'col-md-4',
    },
    creditAmount: {
      inputType: 'inputNumber',
      label: 'Credit Amount',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
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
    paymentDate: {
      inputType: 'singleDatePicker',
      label: 'Payment Date',
      value: null,
      validation: {
        required: false,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
    },
    additionalInfo: {
      inputType: 'inputtextarea',
      label: 'Additional Info',
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: 'col-md-12',
    },
  }

  const [storeRechargeForm, setStoreRechargeForm] = useState<any>(
    _.cloneDeep(storeRechargeFormObj)
  )

  // const getStoreList = () => {
  //   new ManageStoreService()
  //     .storeList()
  //     .then((response: any) => {
  //       setStoreDropdownList(response)
  //       storeRechargeForm.storeId.options = response
  //     })
  //     .catch((err: any) => {
  //       ToasterService.show(err, CONSTANTS.ERROR)
  //     })
  // }

  const closeStoraRechargePopup = () => {
    setStoreRechargePopup(false)
    setStoreRechargeForm(_.cloneDeep(storeRechargeFormObj))
    setAttachments([])
  }

  const invoiceFormHandler = (form: FormType) => {
    setStoreRechargeForm(form)
  }

  const selectAttachment = (files: any) => {
    setAttachments([])
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name
            .split('.')
            [eventList.name.split('.').length - 1].toLowerCase() ==
          FILE_TYPES.PDF
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

  const submitStoreRechargeDetails = (event: FormEvent) => {
    event.preventDefault()
    let storeRechargeValidityFlag = true
    const storeRechargeFormValid: boolean[] = []
    _.each(storeRechargeForm, (item: any) => {
      console.log(item, item.valid, item?.validation?.required)
      if (item?.validation?.required) {
        storeRechargeFormValid.push(item.valid)
        storeRechargeValidityFlag = storeRechargeValidityFlag && item.valid
      }
    })
    setIsFormValid(storeRechargeValidityFlag)
    if (storeRechargeValidityFlag) {
      const formData: any = new FormData()
      const obj = {
        creditAmount: storeRechargeForm?.creditAmount?.value,
        invoiceNumber: storeRechargeForm?.invoiceNumber?.value,
        storeId: storeRechargeForm?.storeId?.value,
        bankId: storeRechargeForm?.bankId?.value,
        // walletId: storeRechargeForm?.walletId?.value.toString(),
        paymentDate:
          (storeRechargeForm?.paymentDate?.value &&
            moment(storeRechargeForm?.paymentDate?.value).format(
              'YYYY-MM-DD'
            )) ||
          null,
        additionalInfo: storeRechargeForm?.additionalInfo?.value,
      }
      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      // if (!attachments?.length) {
      //   return ToasterService.show('Please Upload attachment', CONSTANTS.ERROR)
      // }
      if (attachments?.length) {
        formData.set('file', attachments[0])
      }
      setLoading(true)
      new ManageStoreService()
        .addStoreRechage(formData)
        .then((response: any) => {
          if (response?.status == HTTP_RESPONSE.SUCCESS) {
            setLoading(false)
            closeStoraRechargePopup()
            getStoreRechargeTableData()
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      ToasterService.show('Please Check all the Fields!', CONSTANTS.ERROR)
    }
  }

  return (
    <>
      <div className="row m-0">
        {storeCardsData.map((item: any, index: number) => {
          return (
            <>
              <div className="col-md-4 col-6 px-1 p-sm-0" key={index}>
                <div
                  className={
                    classes['ctm-card'] + ' ' + classes['total-coupon-card']
                  }
                  style={{
                    background: new UtilityService().getRandomColor(index),
                  }}
                >
                  <div
                    className={
                      classes['ctm-card-details'] + ' ' + 'perfect-left-column'
                    }
                  >
                    <h5>{item?.storeName}</h5>
                    <h2>
                      Total Amount :&nbsp;
                      {item?.totalAmount?.toLocaleString('en-US') || 0}
                    </h2>
                    <h2>
                      Available Amount :&nbsp;
                      {item?.availableAmount?.toLocaleString('en-US') || 0}
                    </h2>
                    <h2>
                      Discount :&nbsp;
                      {item?.discount?.toLocaleString('en-US') || 0}
                    </h2>
                    <h2>
                      Redeem Amount :&nbsp;
                      {item?.redeemAmount?.toLocaleString('en-US') || 0}
                    </h2>
                  </div>
                  <div className={classes['cardImg']}>
                    <img src={manageStoreImgArr[index % 3]} alt="" />
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>

      <div className={classes['settings-table']}>
        <div className="tab-header">
          <ul>
            <li
              className={toggleState === 1 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(1)}
            >
              Store Recharge
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
              customClass="brandTable"
              data={storeRechargeTableData}
              column={storeRechargeTableColumns}
              buttonArr={buttonsArr}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'Brands'}
              scrollHeight={'calc(100vh - 105px)'}
            />
          </div>
          <div className={toggleState === 2 ? 'active-content' : 'content'}>
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
        </div>
      </div>

      {storeRechargePopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header ">
              <div
                className="popup-close"
                onClick={() => {
                  closeStoraRechargePopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Recharge Store</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeStoraRechargePopup()
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content" style={{ padding: '1rem 2rem' }}>
              <FormComponent
                form={_.cloneDeep(storeRechargeForm)}
                formUpdateEvent={invoiceFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>

              {/* attachment */}
              <div className={classes['upload-wrapper']}>
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
                // apihitting={loading}
                submitEvent={submitStoreRechargeDetails}
              />
            </div>
          </div>
        </div>
      ) : null}

      {storeInvoice ? (
        <FileViewer
          fileArray={file}
          que={APIURLS.VIEW_STORE_INVOICE}
          heading="Attachment File"
          fileViewer={setStoreInvoice}
          currentFileName={file[0]}
        />
      ) : null}
    </>
  )
}

export default ManageStore
