/* eslint-disable no-unexpected-multiline */
// eslint-disable-next-line no-unexpected-multiline
import React, { FormEvent, useEffect, useState } from 'react'
import DataTableBasicDemo from '../../components/ui/table/Table'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, Theme } from '@material-ui/core/styles'
import { ImageUrl } from '../../utils/ImageUrl'
import { MasterService } from '../../services/master-service/master.service'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import { FormComponent } from '../../components/ui/form/form'
import _ from 'lodash'
import { PaymentsService } from '../../services/payments-service/payments.service'
import { ButtonComponent } from '../../components/ui/button/Button'
import moment from 'moment'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { Chip } from 'primereact/chip'
// import './Payments.scss'
import classes from './Payment.module.scss'
import { CONSTANTS } from '../../constants/Constants'
import { APIURLS } from '../../constants/ApiUrls'
import FileViewer from '../../components/ui/file-viewer/FileViewer'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { AuthService } from '../../services/auth-service/auth.service'

const Payments: React.FC = () => {
  const [paymentsData, setPaymentsData] = useState([])
  const [currencyFilter, setcurrencyFilter] = useState([])
  const [brandFilter, setBrandsFilter] = useState([])
  const [bankFilter, setBankFilter] = useState([])
  const [addPaymentPopup, setAddPaymentPopup] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [couponDetailsPopup, setCouponDetailsPopup] = useState(false)
  const [updateOptionsObj, setupdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments]: any = useState([])
  const [paymentInvoice, setPaymentInvoice] = useState(false)
  const [file, setFile] = useState<any>([])
  const [paymentWiseVoucher, setPaymentWiseVoucher] = useState([])
  const [brandsCode, setBrandsCode] = useState([])
  const [brandList, setBrandsList] = useState([])
  useEffect(() => {
    getPaymentsData()
    // getBrandsFilterList()
    // getCountryList()
    // getBankList()

    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setcurrencyFilter(value)
      paymentForm.paidAmountCurrencyId.options = value
      paymentForm.couponAmountCurrencyId.options = value
    })
    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
      paymentForm.brandId.options = value
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandsCode(value)
    })
    AuthService.adminBankList$.subscribe((value: any) => {
      setBankFilter(value)
      paymentForm.bankId.options = value
    })
  }, [])

  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => setAddPaymentPopup(true),
      tooltip: 'Add Payment',
    },
  ]

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

  // const bankBody = (rowData: any) => {
  //   return (
  //     <div className="ctmtbltd">
  //       <HtmlTooltip
  //         title={
  //           <React.Fragment>
  //             <img
  //               crossOrigin="anonymous"
  //               src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.bankLogo}`}
  //               style={{ verticalAlign: 'middle', paddingRight: '2px' }}
  //               width={150}
  //               alt="Bank Logo"
  //             />
  //           </React.Fragment>
  //         }
  //       >
  //         <img
  //           crossOrigin="anonymous"
  //           src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.bankLogo}`}
  //           style={{ verticalAlign: 'middle', paddingRight: '2px' }}
  //           width={25}
  //           alt="Brand Logo"
  //         />
  //       </HtmlTooltip>
  //       <span>{rowData.bankName}</span>
  //     </div>
  //   )
  // }

  const paymentBrandBody = (rowData: any) => {
    if (rowData?.brandName && rowData?.logo) {
      return (
        <div>
          <HtmlTooltip
            title={
              <React.Fragment>
                <img
                  crossOrigin="anonymous"
                  src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.logo}`}
                  style={{ verticalAlign: 'middle', paddingRight: '2px' }}
                  width={150}
                  alt="Brand Logo"
                />
              </React.Fragment>
            }
          >
            <img
              crossOrigin="anonymous"
              src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.logo}`}
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
        <div>
          <span>{rowData.brandName}</span>
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

  const couponBody = (rowData: any) => {
    return (
      <>
        {rowData?.couponCount ? (
          <div
            onClick={() => {
              // setCouponDetailsPopup(true),
              //   voucherDetails(rowData?.invoiceNumber)
            }}
            style={{ cursor: 'pointer', color: '#374baa' }}
          >
            {rowData?.couponCount}
          </div>
        ) : (
          0
        )}
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
        ) : rowData?.commissionEarned == 0 ? (
          <div style={{ color: '#000000' }}>{rowData?.commissionEarned}</div>
        ) : (
          <div style={{ color: 'red' }}>{rowData?.commissionEarned}</div>
        )}
      </>
    )
  }

  const couponUploadedAmountBody = (rowData: any) => {
    return (
      <>{rowData?.couponUploadedAmount ? rowData?.couponUploadedAmount : 0}</>
    )
  }

  const couponPurchaseAmountBody = (rowData: any) => {
    return (
      <>
        <div style={{ color: '#808080' }}>{rowData?.couponPurchaseAmount}</div>
      </>
    )
  }

  const getPaymentsData = () => {
    setPaymentsData([])
    new PaymentsService()
      .paymentData()
      .then((response: any) => {
        setPaymentsData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const [countryList, setCountryFilter] = useState([])

  // const getCountryList = () => {
  //   new MasterService()
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setCountryFilter(response?.country)
  //       setcurrencyFilter(response?.currency)
  //       paymentForm.paidAmountCurrencyId.options = response?.currency
  //       paymentForm.couponAmountCurrencyId.options = response?.currency
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrandsFilter(response.brands)
  //       setBrandsCode(response.brandsCode)
  //       paymentForm.brandId.options = response.brands
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getBankList = () => {
  //   new MasterService()
  //     .adminBankList()
  //     .then((response: any) => {
  //       paymentForm.bankId.options = response
  //       setBankFilter(response)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const paymentsTableColumns = [
    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      sort: true,
      textAlign: 'left',
      filter: true,
      body: paymentBody,
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
      label: 'Paid Amount Currency',
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
        placeholder: 'Currency',
      },
    },
    {
      label: 'Actual Amount Paid',
      fieldName: 'amountActualPaid',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Coupon Purchased Amount',
      fieldName: 'couponPurchaseAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: couponPurchaseAmountBody,
    },
    {
      label: 'Bank',
      fieldName: 'bankName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: bankFilter?.length
          ? bankFilter.map((bank: any) => {
              return bank.label
            })
          : [],
        fieldValue: 'bank',
        changeFilter: true,
        placeholder: 'Bank',
      },
      // body: bankBody,
    },
    {
      label: 'Procured Coupon Count',
      fieldName: 'couponCount',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: couponBody,
    },
    {
      label: 'Purchase Date',
      fieldName: 'purchaseDate',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Available Amount',
      fieldName: 'availableAmount',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Commission Earned',
      fieldName: 'commissionEarned',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: commissionEarnedBody,
    },
    {
      label: 'Coupon Uploaded Amount',
      fieldName: 'couponUploadedAmount',
      textAlign: 'left',
      sort: true,
      filter: true,
      body: couponUploadedAmountBody,
    },
    {
      label: 'Upload Coupon Count',
      fieldName: 'uploadCouponCount',
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
      label: 'Procured By',
      fieldName: 'procuredBy',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Uploaded Date',
      fieldName: 'uploadedDate',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const paymentsVoucherTableColumns = [
    {
      label: 'invoiceNumber',
      fieldName: 'invoiceNumber',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    // {
    //   label: 'Bank',
    //   fieldName: 'bank',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    //   dropDownFilter: {
    //     filterOptions: bankFilter.length
    //       ? bankFilter.map((bank: any) => {
    //           return bank.label
    //         })
    //       : [],
    //     fieldValue: 'bank',
    //     changeFilter: true,
    //     placeholder: 'Bank',
    //   },
    // },
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
      body: paymentBrandBody,
    },
    {
      label: 'Brand Code',
      fieldName: 'brandCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandsCode?.length
          ? brandsCode.map((brandCode: any) => {
              return brandCode.label
            })
          : [],
        fieldValue: 'brandCode',
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
        filterOptions: countryList?.length
          ? countryList.map((country: any) => {
              return country.label
            })
          : [],
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
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
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
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
      label: 'Expiry Date',
      fieldName: 'expiryDate',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Coupon Status',
      fieldName: 'activeStatus',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: ['Active', 'Non-Active'],
        fieldValue: 'activeStatus',
        changeFilter: true,
        placeholder: 'Active',
      },
    },
    {
      label: 'Redeem Status',
      fieldName: 'redeemStatus',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: ['Used', 'Available'],
        fieldValue: 'activeStatus',
        changeFilter: true,
        placeholder: 'Active',
      },
    },
    {
      label: 'Uploaded On',
      fieldName: 'createdAt',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Uploaded By',
      fieldName: 'createdByName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    // {
    //   label: 'Voucher Pin',
    //   fieldName: 'voucherPin',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    {
      label: 'Voucher Type',
      fieldName: 'voucherType',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const paymentFormHandler = (form: FormType) => {
    setPaymentForm(form)
  }

  const paymentFormObj = {
    invoiceNumber: {
      inputType: 'inputtext',
      label: 'Invoice Number',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    brandId: {
      inputType: 'singleSelect',
      label: 'Brand',
      value: null,
      validation: {
        required: true,
      },
      options: brandFilter,
      fieldWidth: 'col-md-4',
    },
    paidAmountCurrencyId: {
      inputType: 'singleSelect',
      label: 'Paid Amount Currency',
      value: null,
      validation: {
        required: true,
      },
      options: currencyFilter,
      fieldWidth: 'col-md-4',
    },
    paidAmount: {
      inputType: 'inputNumber',
      label: 'Paid Amount',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      fieldWidth: 'col-md-4',
    },
    couponAmountCurrencyId: {
      inputType: 'singleSelect',
      label: 'Coupon Amount Currency',
      value: null,
      validation: {
        required: true,
      },
      options: currencyFilter,
      fieldWidth: 'col-md-4',
    },
    couponAmount: {
      inputType: 'inputNumber',
      label: 'Coupon Amount',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      fieldWidth: 'col-md-4',
    },
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
    couponCount: {
      inputType: 'inputNumber',
      label: 'Coupon Count',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    paymentDate: {
      inputType: 'singleDatePicker',
      label: 'Payment Date',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
  }

  const [paymentForm, setPaymentForm] = useState<any>(
    _.cloneDeep(paymentFormObj)
  )
  // TODO: Implement this using model instead of manipulating data over here
  const submitPaymentDetails = (event: FormEvent) => {
    event.preventDefault()
    let paymentValidityFlag = true
    const paymentFormValid: boolean[] = []
    _.each(paymentForm, (item: any) => {
      paymentFormValid.push(item.valid)
      paymentValidityFlag = paymentValidityFlag && item.valid
    })
    setIsFormValid(paymentValidityFlag)
    if (paymentValidityFlag) {
      const formData: any = new FormData()
      const paymentDate: any = paymentForm?.paymentDate?.value
      const obj = {
        paidAmount: paymentForm?.paidAmount?.value,
        couponAmount: paymentForm?.couponAmount?.value,
        invoiceNumber: paymentForm?.invoiceNumber?.value,
        brandId: paymentForm?.brandId?.value,
        paidAmountCurrencyId: paymentForm?.paidAmountCurrencyId?.value,
        couponAmountCurrencyId: paymentForm?.couponAmountCurrencyId?.value,
        paymentDate: moment(paymentDate).format('YYYY-MM-DD'),
        couponCount: paymentForm?.couponCount?.value,
        bankId: paymentForm?.bankId?.value,
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
      new PaymentsService()
        .addPayment(formData)
        .then((response: any) => {
          if (response?.status == HTTP_RESPONSE.SUCCESS) {
            setLoading(false)
            closePaymentPopup()
            getPaymentsData()
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          // console.log(error, 'errrrrrrrr')
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      ToasterService.show('Please Check all the Fields!', CONSTANTS.ERROR)
    }
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

  const voucherDetails = (invoiceNumber: any) => {
    new PaymentsService()
      .paymentVouchers(invoiceNumber)
      .then((response: any) => {
        setPaymentWiseVoucher(response)
      })
      .catch((error) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const closePaymentPopup = () => {
    setAddPaymentPopup(false)
    setPaymentForm(_.cloneDeep(paymentFormObj))
    setAttachments([])
  }

  return (
    <>
      <DataTableBasicDemo
        buttonArr={buttonsArr}
        data={paymentsData}
        column={paymentsTableColumns}
        showGridlines={true}
        resizableColumns={true}
        rows={20}
        paginator={true}
        sortable={true}
        headerRequired={true}
        downloadedfileName={'Payments'}
        scrollHeight={'calc(100vh - 65px)'}
      />

      {addPaymentPopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header ">
              <div
                className="popup-close"
                onClick={() => {
                  closePaymentPopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Add Payment</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closePaymentPopup()
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content" style={{ padding: '1rem 2rem' }}>
              <FormComponent
                form={_.cloneDeep(paymentForm)}
                formUpdateEvent={paymentFormHandler}
                isFormValidFlag={isFormValid}
                updateOptions={updateOptionsObj}
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
                apihitting={loading}
                submitEvent={submitPaymentDetails}
              />
            </div>
          </div>
        </div>
      ) : null}

      {couponDetailsPopup ? (
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
                  setCouponDetailsPopup(false)
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Coupon Details</h4>
              </div>
            </div>
            <div
              className="popup-content"
              style={{ height: 'calc(100vh - 42px)' }}
            >
              <DataTableBasicDemo
                data={paymentWiseVoucher}
                column={paymentsVoucherTableColumns}
                showGridlines={true}
                resizableColumns={true}
                rows={20}
                paginator={true}
                sortable={true}
                headerRequired={true}
                scrollHeight={'calc(100vh - 80px)'}
                downloadedfileName={'PyamentDetails'}
              />
            </div>
          </div>
        </div>
      ) : null}

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
export default Payments
