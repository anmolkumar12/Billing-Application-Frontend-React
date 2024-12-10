/* eslint-disable no-unexpected-multiline */
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import classes from './Inventory.module.scss'
import { FormComponent } from '../../components/ui/form/form'
import * as _ from 'lodash'
import {
  FormType,
  optionsObj,
  submitFormData,
  updateOptionsObj,
} from '../../schemas/FormField'
import { ImageUrl } from '../../utils/ImageUrl'
import moment from 'moment'
import { Dropdown } from 'primereact/dropdown'
import { Chip } from 'primereact/chip'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import {
  checkFormValidity,
  showHideOthersTextField,
} from '../../utils/CheckFormValidity'
import { ExcelService } from '../../services/excel-service/excel-service'
import { InventoryService } from '../../services/inventory-service/inventory.service'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import Label from '../../components/ui/label/Label'
import { NumericFormat } from 'react-number-format'
import DataTableBasicDemo from '../../components/ui/table/Table'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, Theme } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { InputSwitch } from 'primereact/inputswitch'
import ConfigurationCard from '../../components/ui/cards/configuration-card/ConfigurationCard'
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator'
import { Loader } from '../../components/ui/loader/Loader'
import { NoRecord } from '../../components/ui/cards/no-record/NoRecord'
import { AuthService } from '../../services/auth-service/auth.service'

const Inventory: React.FC = () => {
  const history = useHistory()
  // const jsondata = [
  //   { 'Coupon Code': '' },
  //   { Denomination: '' },
  //   { 'Coupon PIN': '' },
  //   { 'Expiry Date': '' },
  // ]

  const downloadTemplate = () => {
    new ExcelService().exportExcel(
      [
        { 'Coupon Code': '' },
        { Denomination: '' },
        { 'Coupon PIN': '' },
        { 'Expiry Date': '' },
      ],
      'coupon_upload_template'
    )
  }

  const [walletFilter, setWalletFilter] = useState([])
  const [loader, setLoader] = useState(false)
  const [denominationList, setDenominationList] = useState<any>([])

  const denominationOptions = [
    { label: '100', value: '100' },
    { label: '200', value: '200' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '2000', value: '2000' },
    { label: 'Others', value: 'Others' },
  ]

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
  // const getDenominationList = () => {
  //   new MasterService.denominationList()
  //     .then((response: any) => {
  //       setDenominationList(response)
  //       couponForm.denomination_id.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const couponFormObj: FormType = {
    denomination_id: {
      inputType: 'singleSelect',
      label: 'Denomination',
      validation: {
        required: true,
      },
      value: null,
      fieldWidth: 'col-md-3',
      options: [],
    },
    denominationText: {
      inputType: 'inputNumber',
      label: 'Custom Denomination',
      validation: {
        required: true,
      },
      inputNumberOptions: {
        min: 0,
        max: 1000000,
      },
      value: null,
      // customMask:'0*.00',
      fieldWidth: 'col-md-3',
      hideField: true,
      // maskPlaceholder: '﹘﹘﹘﹘',
    },
    expiryDate: {
      inputType: 'singleDatePicker',
      label: 'Expiry Date',
      value: null,
      validation: {
        required: true,
      },
      min: moment().subtract(0, 'days').format('YYYY-MM-DD'),
      fieldWidth: 'col-md-3',
    },
    voucherCode: {
      inputType: 'inputtext',
      label: 'Voucher Code',
      validation: {
        required: true,
        maxlength: 200,
      },
      value: null,
      fieldWidth: 'col-md-4',
    },
    voucherPin: {
      inputType: 'inputtext',
      label: 'Voucher Pin',
      validation: {
        maxlength: 200,
      },
      value: null,
      fieldWidth: 'col-md-2',
    },
  }

  const [couponForm, setcouponForm] = useState<FormType[]>(
    _.cloneDeep([couponFormObj])
  )
  const [couponFormValid, setcouponIsFormValid] = useState<boolean[]>([true])
  const [updateOptionsObjArr, setupdateOptionsObj] = useState<
    [updateOptionsObj[]]
  >([[]])
  const updatedFormRef = useRef<ReferenceForm>({ couponRef: [{}] })

  interface ReferenceForm {
    couponRef: FormType[]
  }

  const updatecouponHandler = (form: FormType, index: number) => {
    showHideOthersTextField(
      couponForm[index],
      form,
      'denomination_id',
      'denominationText',
      groupedObj.current.denomination
    )
    couponForm[index] = _.cloneDeep(form)
    updatedFormRef.current.couponRef[index] = _.cloneDeep(form)
    setcouponForm(couponForm)
  }

  const groupedObj = useRef<MasterGrouped>({
    denomination: [],
  })

  interface MasterGrouped {
    denomination: optionsObj[]
  }

  const setOptionsArr = (index: number) => {
    const temp = _.cloneDeep(updateOptionsObjArr)
    //console.log(groupedObj.current, 'groupedObjgroupedObj')
    temp[index] = [
      {
        fieldKey: 'denomination_id',
        options: _.cloneDeep(groupedObj.current.denomination),
      },
    ]
    setupdateOptionsObj(temp)
  }

  useEffect(() => {
    groupedObj.current.denomination = denominationOptions
    setOptionsArr(0)
    getVoucherExpiring()
    getBrandWiseInventory()
    getPaymentList()
    getVoucherList()
    // getBrandsFilterList()
    // getCountryList()
    // getWalletList()

    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletFilter(value)
    })
    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandCodeFilter(value)
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setcurrencyFilter(value)
    })
  }, [])

  const deleteInFormArray = (index: number) => {
    deleteCoupon(index)
  }

  const deleteCoupon = (index: number) => {
    const tempForm = _.cloneDeep(updatedFormRef.current.couponRef)
    tempForm.splice(index, 1)
    setcouponForm(tempForm)
    updatedFormRef.current.couponRef = _.cloneDeep(tempForm)
  }

  function resetCoupon() {
    if (couponForm?.length) {
      _.forEach(couponForm, (item, index) => {
        const tempForm = _.cloneDeep(updatedFormRef.current.couponRef)
        tempForm.splice(index, 1)
        setcouponForm(tempForm)
        updatedFormRef.current.couponRef = _.cloneDeep(tempForm)
      })
    }
    setdisplayParseDataPopup(false)
    setdisplayPopup(false)
    setdisplayUploadPopup(false)
    setcouponForm(_.cloneDeep([couponFormObj]))
    setselectedPayment(null)
    setpropertyAttachments([])
  }

  const addInFormArray = () => {
    const tempForm = _.cloneDeep(updatedFormRef.current.couponRef)
    tempForm.push(_.cloneDeep(couponFormObj))
    setcouponForm(tempForm)
    setOptionsArr(tempForm.length - 1)
    updatedFormRef.current.couponRef = _.cloneDeep(tempForm)
    const tempIsFormValid = _.cloneDeep(couponFormValid)
    tempIsFormValid.push(true)
    setcouponIsFormValid(tempIsFormValid)
  }

  const [displayPopup, setdisplayPopup] = useState<boolean>(false)

  const [displayUploadPopup, setdisplayUploadPopup] = useState<boolean>(false)

  const [propertyAttachments, setpropertyAttachments]: any = useState([])
  const [allowedFormats, setallowedFormats] = useState(['xls', 'xlsx'])

  const onFilesChange = (files: any) => {
    //console.log(files)
    setpropertyAttachments([])
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          allowedFormats.indexOf(
            eventList.name
              .split('.')
              [eventList.name.split('.').length - 1].toLowerCase()
          ) > -1
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              'file size is too large, allowed maximum size is 10 MB.',
              'error'
            )
          } else {
            setpropertyAttachments((prevVals: any) => [...prevVals, eventList])
          }
        } else {
          //console.log('invalis files')

          ToasterService.show(
            `Invalid file format.The allowed file format are ${allowedFormats.toString()}`,
            'error'
          )
          eventList = null
        }
      })
    }
  }

  const removeFileHandler = (index: any) => {
    setpropertyAttachments([])
  }

  const submitHandler = (event: FormEvent) => {
    event.preventDefault()
    let couponValidityFlag = true
    const tempcouponValid: boolean[] = []
    _.each(couponForm, (item) => {
      tempcouponValid.push(checkFormValidity(item))
      couponValidityFlag = couponValidityFlag && checkFormValidity(item)
    })
    setcouponIsFormValid(tempcouponValid)
    if (couponValidityFlag) {
      // const formData: submitFormData = {}
      const couponFormData: submitFormData[] = []
      _.each(couponForm, (item, index) => {
        const formDataItem: submitFormData = {}
        Object.entries(item).forEach(([key, value]) => {
          // formDataItem[key] = value.value
          if (key == 'voucherPin')
            formDataItem['Coupon PIN'] = value.value || 'N/A'
          else if (key == 'voucherCode')
            formDataItem['Coupon Code'] = value.value
          else if (key == 'expiryDate') {
            formDataItem['Expiry Date'] = value?.value
            // formDataItem['Expiry Date'] = value.value
            //   ? moment(value?.value?.toString()).format('DD/MM/YYYY')
            //   : value.value
          } else if (key == 'denomination_id' && value?.value != 'Others')
            formDataItem['Denomination'] = value.value
          else if (key == 'denominationText' && value?.value)
            formDataItem['Denomination'] = value.value
        })
        couponFormData.push(formDataItem)
      })
      //console.log('couponFormData ', couponFormData)
      setparseData(couponFormData)
      voucherAdd(couponFormData)
    }
  }

  const [paymentOptions, setpaymentOptions]: any = useState()
  const [selectedPayment, setselectedPayment]: any = useState()
  const [selPaymentObj, setselPaymentObj]: any = useState()
  const onPaymentChange = (value: any) => {
    const obj = _.find(paymentOptions, { id: parseInt(value) })
    //console.log(value, obj)
    setselPaymentObj(obj)
  }

  const [parseData, setparseData]: any = useState([])
  const uploadTemplate = () => {
    if (!selectedPayment) {
      return ToasterService.show('Please select payment!', 'error')
    }
    if (!propertyAttachments?.length) {
      return ToasterService.show('Please upload file!', 'error')
    }
    const formData = new FormData()
    formData.set('voucherPaymentId', selPaymentObj?.id)
    formData.set('brandId', selPaymentObj?.brandId)
    formData.set('voucherType', 'Coupon')
    if (propertyAttachments?.length) {
      formData.set('file', propertyAttachments[0])
    }

    InventoryService.voucherExcelParse(formData).then((response) => {
      //console.log(response)
      if (
        response?.statusCode == HTTP_RESPONSE.RESPONSE_ERROR &&
        response?.data?.length &&
        displayUploadPopup
      ) {
        new ExcelService().exportExcel(response.data, 'Error')
      } else if (response?.data?.data) {
        setparseData(response?.data?.data)
        setdisplayParseDataPopup(true)
      }
    })
  }

  const voucherAdd = (voucherArr?: any) => {
    const obj = {
      voucherPaymentId: selPaymentObj?.id,
      brandId: selPaymentObj?.brandId,
      voucherType: 'Coupon',
      voucherData: voucherArr?.length ? voucherArr : parseData,
    }
    InventoryService.voucherExcelAdd(obj).then((response) => {
      //console.log('final response', response)
      if (
        response?.statusCode == HTTP_RESPONSE.RESPONSE_ERROR &&
        response?.data?.length
      ) {
        new ExcelService().exportExcel(response.data, 'Error')
      } else if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
        resetCoupon()
        getPaymentList()
        getVoucherList()
        ToasterService.show('Vouchers added successfully.')
        window.location.reload()
      }
    })
  }

  const [displayParseDataPopup, setdisplayParseDataPopup] =
    useState<boolean>(false)

  const getPaymentList = () => {
    setpaymentOptions([])
    InventoryService.paymentList().then((response: any) => {
      if (response?.length) {
        setpaymentOptions(response)
      }
    })
  }

  const [voucherTableData, setvoucherTableData]: any = useState([])
  const getVoucherList = () => {
    setvoucherTableData([])
    setLoader(true)
    InventoryService.voucherList().then((response) => {
      setLoader(false)
      //console.log('vouchers', response)
      // if (
      //   response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS &&
      //   response?.data?.data?.length
      // ) {
      // _.each(response.data.data, (element, index) => {
      //   element['sno'] = index + 1
      //   element['isActive'] = element['isActive'] ? 'Active' : 'Inactive'
      //   element['isRedeemed'] = element['isRedeemed'] ? 'Redeem' : 'Available'
      //   element['expiryDate'] = element['expiryDate']
      //     ? moment(element['expiryDate']).format('ll')
      //     : ''
      //   element['createdAt'] = element['createdAt']
      //     ? moment(element['createdAt']).format('lll')
      //     : ''
      // })
      setvoucherTableData(response)
      // setLoader(false)
      // }
    })
  }

  const buttonsArr = [
    {
      label: 'Upload',
      addFunction: () => onOperationClick('Import Coupon'),
      tooltip: 'Export',
      icon: 'pi pi-upload',
    },
    {
      label: 'Add Coupons to Inventory',
      addFunction: () => onOperationClick('Add Coupon'),
      tooltip: 'Add Payment',
    },
  ]

  const onOperationClick = (type: string) => {
    if (type == 'Import Coupon') {
      setdisplayUploadPopup(true)
    } else if (type == 'Add Coupon') {
      setdisplayPopup(true)
    }
  }

  const [brandFilter, setBrandsFilter] = useState([])
  const [brandCodeFilter, setBrandCodeFilter] = useState([])
  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrandsFilter(response.brands)
  //       setBrandCodeFilter(response.brandsCode)
  //     })
  //     .catch((error: any) => {
  //       return {}
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

  const brandBody = (rowData: any) => {
    if (rowData?.brandName && rowData?.logo) {
      return (
        <div className="ctmtbltd">
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
        <div className="ctmtbltd">
          <span>{rowData?.brandName}</span>
        </div>
      )
    }
  }

  const denominationBody = (rowData: any) => {
    return rowData?.denomination?.toLocaleString('en-US')
  }

  const [currencyFilter, setcurrencyFilter] = useState([])
  // const getCountryList = () => {
  //   new MasterService()
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setcurrencyFilter(response?.currency)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const isRedeemedBody = (rowData: any) => {
    return (
      <>
        <span
          style={{
            color: rowData?.isRedeemed === 'Available' ? 'green' : 'red',
          }}
        >
          {rowData?.isRedeemed}
        </span>
      </>
    )
  }

  const isActiveBody = (rowData: any) => {
    return (
      <>
        <span
          style={{
            color: rowData?.isActive === 'Active' ? 'green' : 'red',
          }}
        >
          {rowData?.isActive}
        </span>
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

  const voucherTableColumns = [
    {
      label: 'SNo.',
      fieldName: 'sno',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandFilter?.map((brand: any) => {
          return brand.label
        }),
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
      },
      // padding: '8px', // width:'300px',
      body: brandBody,
    },

    {
      label: 'Brand Code',
      fieldName: 'brandCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandCodeFilter?.map((brand: any) => {
          return brand.label
        }),
        fieldValue: 'brandCode',
        changeFilter: true,
        placeholder: 'Brand Code',
      },
      // padding: '8px', // width:'300px'
    },

    {
      label: 'Denomination',
      fieldName: 'denomination',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
      body: denominationBody,
    },

    {
      label: 'Currency Code',
      fieldName: 'currencyCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: currencyFilter?.map((country: any) => {
          return country.label
        }),
        fieldValue: 'currency',
        changeFilter: true,
        placeholder: 'Currency',
      },
      // padding: '8px', // width:'300px'
    },

    {
      label: 'Expiry Date',
      fieldName: 'expiryDate',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Wallet',
      fieldName: 'walletName',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
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
      label: 'Coupon Status',
      fieldName: 'isActive',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
      body: isActiveBody,
    },

    {
      label: 'Redeem Status',
      fieldName: 'isRedeemed',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
      body: isRedeemedBody,
    },

    {
      label: 'Commission Earned',
      fieldName: 'commission',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Uploaded Date',
      fieldName: 'createdAt',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Uploaded By',
      fieldName: 'createdByName',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Type',
      fieldName: 'voucherType',
      width: '140px',
      frozen: false,
      sort: true,
      // padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },
  ]

  const [voucherExpData, setvoucherExpData]: any = useState([])
  const getVoucherExpiring = () => {
    InventoryService.voucherExpiring().then((response) => {
      //console.log('expiring', response)
      if (
        response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS &&
        response?.data?.length
      ) {
        const arr = response.data.splice(4)
        setvoucherExpData(response.data)
      }
    })
  }
  const getInventoryBg = (index: number) => {
    const bgArray = [
      '#137BD5',
      '#F95B7F',
      '#F89624',
      '#2FAC80',
      '#CB202D',
      '#529DF8',
    ]
    return bgArray[index % 4]
  }

  const [brandWiseData, setbrandWiseData]: any = useState([])
  const getBrandWiseInventory = () => {
    InventoryService.brandWiseInventory().then((response) => {
      //console.log('response brand', response)
      if (
        response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS &&
        response?.data?.length
      ) {
        _.each(response?.data, (element, index: number) => {
          element['currIndex'] = 0
          element['borderLeftColor'] = getInventoryBg(index)
        })
        setbrandWiseData(response?.data)
      }
    })
  }

  const [cardView, setcardView] = useState<boolean>(true)
  const [srchVal, setsrchVal]: any = useState()

  const [basicFirst, setBasicFirst] = useState(0)
  const [basicRows, setBasicRows] = useState(9)

  const onBasicPageChange = (event: any) => {
    setBasicFirst(event.first)
    setBasicRows(event.rows)
  }

  return loader ? (
    <Loader />
  ) : (
    <>
      <div className={classes['inventory-body']}>
        <div className={classes['box-heading']}>
          <h6 style={{ display: 'flex' }}>
            Coupons Will be Expiring Soon(In next 30 days)
          </h6>

          <div className={classes['toggleView'] + ' ' + 'perfect-center'}>
            <div className={classes['spanText']}>
              <span
                onClick={() => {
                  history.push(ROUTE_CONSTANTS.ALL_COUPONS)
                }}
              >
                View All
              </span>
            </div>
            <div className={classes['toggleSec'] + ' ' + 'perfect-center'}>
              <span style={{ color: cardView ? 'black' : '#6366f1' }}>
                Table View{' '}
              </span>

              <InputSwitch
                checked={cardView}
                onChange={(e) => setcardView(e.value)}
                style={{ transform: 'scale(0.8)' }}
              />

              <span style={{ color: !cardView ? 'black' : '#6366f1' }}>
                Card View
              </span>
            </div>
          </div>
        </div>
        <div className={classes['toggleSecMObile'] + ' ' + 'perfect-right-row'}>
          <span style={{ color: cardView ? 'black' : '#6366f1' }}>
            Table View{' '}
          </span>

          <InputSwitch
            checked={cardView}
            onChange={(e) => setcardView(e.value)}
            style={{ transform: 'scale(0.8)' }}
          />

          <span style={{ color: !cardView ? 'black' : '#6366f1' }}>
            Card View
          </span>
        </div>
        <div className={'row mx-0 my-1' + ' ' + classes['inventory-card-row']}>
          {voucherExpData?.length ? (
            <>
              {voucherExpData?.map((element: any, index: any) => {
                return (
                  <div className="col-md-3 p-0" key={index}>
                    <div
                      className={classes['inventory-card']}
                      style={{ backgroundColor: getInventoryBg(index) }}
                    >
                      <div className={classes['brand-name-logo']}>
                        <div className={classes['brand-logo']}>
                          {element?.brandLogo ? (
                            <img
                              crossOrigin="anonymous"
                              src={`${process.env.REACT_APP_API_BASEURL}/${element?.brandLogo}`}
                              alt=""
                            />
                          ) : (
                            <>
                              <img src={ImageUrl.GeneralBrandLogo} alt="" />
                            </>
                          )}
                        </div>
                        <h6 className="ellipsis-text">{element?.brandName}</h6>
                        {/* <h6 style={{ padding: '1px 1px' }}>
                      {element?.brandDenominationWiseCount} Coupons
                    </h6> */}
                      </div>
                      <div className={classes['brand-details']}>
                        <h3>
                          <div>
                            {' '}
                            {element?.currencySymbol}{' '}
                            {(+element?.denominationWiseAmount).toLocaleString(
                              'en-US'
                            )}
                          </div>
                          <div className={classes['denom-qty']}>
                            Qty :
                            {element?.brandDenominationWiseCount.toLocaleString()}
                          </div>
                        </h3>
                        <span>{element?.denomination.toLocaleString()}</span>
                        <p>Denomination</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <>
              <NoRecord NoRecordDivHeight={'105px'} NoRecordDivWidth={'100%'} />{' '}
            </>
          )}
        </div>
        {cardView ? (
          <>
            <div className={classes['cardView-header']}>
              <div className={classes['card-button'] + ' ' + 'd-flex'}>
                <button
                  className={classes['inUploadcouponbtn']}
                  onClick={() => {
                    onOperationClick('Import Coupon')
                  }}
                >
                  <i className="pi pi-upload"></i>
                  <span>Upload Coupon</span>
                </button>
                <button
                  className={classes['inAddcouponbtn']}
                  onClick={() => {
                    onOperationClick('Add Coupon')
                  }}
                >
                  <i className="pi pi-plus"></i>
                  <span>Add Coupon</span>
                </button>
              </div>
              <div className={classes['search-div']}>
                <span className="p-input-icon-right">
                  <i className="pi pi-search" />
                  <InputText
                    value={srchVal}
                    onChange={(e) => setsrchVal(e.target.value)}
                    placeholder="Search"
                  />
                </span>
              </div>
            </div>
            <div className={classes['card-view-layout']}>
              {brandWiseData?.length ? (
                <>
                  <div className="row m-0">
                    {brandWiseData?.map((element: any, index: any) => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <div className="col-md-4 p-0" key={index}>
                          <ConfigurationCard cardDetail={element} />
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  <NoRecord
                    NoRecordDivHeight={'calc(100vh - 305px)'}
                    NoRecordDivWidth={'100%'}
                  />
                </>
              )}
            </div>
            <div className={classes['paginator-class']}>
              <Paginator
                first={basicFirst}
                rows={basicRows}
                totalRecords={brandWiseData?.length}
                rowsPerPageOptions={[9, 18, 36]}
                onPageChange={onBasicPageChange}
              ></Paginator>
            </div>
          </>
        ) : (
          <>
            <DataTableBasicDemo
              buttonArr={buttonsArr}
              data={voucherTableData}
              column={voucherTableColumns}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'Brands'}
              scrollHeight={'calc(100vh - 215px)'}
            />
          </>
        )}

        {displayUploadPopup ? (
          <div className="popup-overlay">
            <div className="popup-body stretchLeft">
              <div className="popup-header">
                <div
                  className="popup-close"
                  onClick={() => {
                    resetCoupon()
                  }}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">Coupon Bulk Upload</h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => {
                    resetCoupon()
                  }}
                >
                  &times;
                </div>
              </div>
              <div className="popup-content">
                <div className="row m-0">
                  <div className="col-md-12 col-12 p-0 mb-1">
                    <Label label="Payment" />
                    <div className="inventoryPaymentDropdown">
                      <Dropdown
                        value={selectedPayment}
                        options={paymentOptions}
                        onChange={(event) => {
                          onPaymentChange(event?.value)
                          setselectedPayment(event?.value)
                        }}
                        placeholder="Choose Payment"
                      />
                    </div>
                  </div>
                  <div className="col-md-2"></div>
                </div>

                {selectedPayment ? (
                  <div
                    className={
                      classes['custome-table'] +
                      ' ' +
                      classes['selected-payment-table']
                    }
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Brand</th>
                          <th>Available Amount</th>
                          <th>Created Date</th>
                          <th>Country</th>
                          <th>Currency</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img
                              crossOrigin="anonymous"
                              src={`${process.env.REACT_APP_API_BASEURL}/${selPaymentObj?.brandLogo}`}
                              alt=""
                              style={{ width: '2rem' }}
                            />{' '}
                            {selPaymentObj?.brandName}
                          </td>
                          <td>
                            <NumericFormat
                              value={selPaymentObj?.availableAmount}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={selPaymentObj?.currencyCode + ' '}
                            />
                          </td>
                          <td>
                            {moment(selPaymentObj?.createdAt).format('lll')}
                          </td>
                          <td>{selPaymentObj?.countryName}</td>
                          <td>{selPaymentObj?.currencyCode}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {displayParseDataPopup ? (
                  <div className={classes['custome-table']}>
                    <table>
                      <thead>
                        <tr>
                          <th>Denomination</th>
                          <th>Expiry Date</th>
                          <th>Voucher Code</th>
                          <th>Voucher Pin</th>
                        </tr>
                      </thead>
                      {parseData?.length ? (
                        <>
                          <tbody>
                            {parseData?.map((item: any, index: any) => {
                              return (
                                <tr key={index}>
                                  <td>{item?.Denomination}</td>
                                  <td>{item['Expiry Date']}</td>
                                  <td>{item['Coupon Code']}</td>
                                  <td>{item['Coupon PIN']}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </>
                      ) : (
                        <></>
                      )}
                    </table>
                  </div>
                ) : (
                  <div className={classes['upload-inn-section']}>
                    <div className={classes['fileUpload']}>
                      <span>
                        <img src={ImageUrl.FolderIconImage} />
                      </span>
                      <input
                        type="file"
                        onClick={(event: any) => {
                          event.target.value = null
                        }}
                        onChange={(e) => onFilesChange(e.target.files)}
                        className={classes['upload']}
                      />
                      <p>
                        Drag files here <b> or browse</b>
                        <u>Support XLS, XLSX</u>
                      </p>
                      <div className={classes['chip-tm']}>
                        {propertyAttachments?.length
                          ? propertyAttachments.map((item: any, index: any) => {
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
                )}

                <div className="row m-0">
                  <div className="col-md-9"></div>
                  <div className="col-md-3 pr-0">
                    <div className={classes['inventory-btn']}>
                      {displayParseDataPopup ? (
                        <button
                          className={
                            classes['tm-btn'] + ' ' + classes['add-coupon-icon']
                          }
                          style={{ background: '#e5336d' }}
                          onClick={() => {
                            setdisplayParseDataPopup(false)
                          }}
                        >
                          {displayParseDataPopup ? 'Back' : 'Back'}
                        </button>
                      ) : (
                        <button
                          className={
                            classes['tm-btn'] +
                            ' ' +
                            classes['add-dwnload-icon']
                          }
                          style={{ background: 'rgb(97 209 77)' }}
                          onClick={() => {
                            downloadTemplate()
                          }}
                        >
                          <i className="pi pi-download"></i>
                          {'  '}
                          Template
                        </button>
                      )}

                      <button
                        className={
                          classes['tm-btn'] + ' ' + classes['add-coupon-icon']
                        }
                        onClick={() => {
                          displayParseDataPopup
                            ? voucherAdd()
                            : uploadTemplate()
                        }}
                      >
                        <i className="pi pi-upload"></i>

                        {displayParseDataPopup ? 'Submit' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {displayPopup ? (
          <div className="popup-overlay">
            <div className="popup-body stretchLeft">
              <div className="popup-header">
                <div
                  className="popup-close"
                  onClick={() => {
                    resetCoupon()
                  }}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">Add Coupons</h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => {
                    resetCoupon()
                  }}
                >
                  &times;
                </div>
              </div>
              <div className="popup-content">
                <div className="repeat-seciton" style={{ display: 'block' }}>
                  <div className="row">
                    <div className="col-md-12">
                      <Label label="Payment" />
                      <div className="inventoryPaymentDropdown">
                        <Dropdown
                          value={selectedPayment}
                          options={paymentOptions}
                          onChange={(event) => {
                            onPaymentChange(event?.value)
                            setselectedPayment(event?.value)
                          }}
                          placeholder="Choose Payment"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      {' '}
                      {/* {selectedPayment ? (
                        <div>
                          <div
                            className="dynamic-common-form"
                            style={{ margin: '5px' }}
                          >
                            <div
                              className="log-input"
                              style={{ textAlign: 'right' }}
                            >
                              <button
                                className="tm-btn add-coupon-icon"
                                onClick={addInFormArray}
                              >
                                <i className="fas fa-plus"></i> Add More
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null} */}
                    </div>
                  </div>

                  {selectedPayment ? (
                    <div className={classes['custome-table']}>
                      <table>
                        <thead>
                          <tr>
                            <th>Brand</th>
                            <th>Available Amount</th>
                            <th>Created Date</th>
                            <th>Country</th>
                            <th>Currency</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${selPaymentObj?.brandLogo}`}
                                alt=""
                                style={{ width: '2rem' }}
                              />{' '}
                              {selPaymentObj?.brandName}
                            </td>
                            <td>
                              <NumericFormat
                                value={selPaymentObj?.availableAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={selPaymentObj?.currencyCode + ' '}
                              />
                            </td>
                            <td>
                              {moment(selPaymentObj?.createdAt).format('lll')}
                            </td>
                            <td>{selPaymentObj?.countryName}</td>
                            <td>{selPaymentObj?.currencyCode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : null}

                  {selectedPayment &&
                    couponForm.map((item: FormType, index: number) => {
                      return (
                        <div
                          className={classes['addbox-inventory']}
                          key={index}
                        >
                          <div
                            className={'col-md-12' + ' ' + classes['date-icon']}
                          >
                            <FormComponent
                              form={_.cloneDeep(item)}
                              formUpdateEvent={(e: FormType) =>
                                updatecouponHandler(e, index)
                              }
                              isFormValidFlag={couponFormValid[index]}
                              formName={'couponForm' + index}
                              updateOptions={updateOptionsObjArr[index]}
                            ></FormComponent>
                          </div>
                          <div className="col-md-12">
                            {index > 0 ? (
                              <div>
                                <div className={classes['inv-add-section']}>
                                  <div className={classes['log-input']}>
                                    <button
                                      className={
                                        classes['tm-btn'] +
                                        ' ' +
                                        classes['inv-delte-btn']
                                      }
                                      onClick={() => deleteInFormArray(index)}
                                    >
                                      <i className="pi pi-times"></i>{' '}
                                      <span>Delete</span>{' '}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      )
                    })}

                  {selectedPayment ? (
                    <div
                      className={
                        classes['dynamic-common-form'] +
                        ' ' +
                        'd-flex justify-content-end align-items-center'
                      }
                      style={{ margin: '5px' }}
                    >
                      <div className={classes['inv-add-section']}>
                        <div className={classes['log-input']}>
                          <button
                            className={
                              classes['tm-btn'] + ' ' + classes['inv-add-btn']
                            }
                            onClick={addInFormArray}
                            style={{ height: '34px', marginRight: '10px' }}
                          >
                            <i className="fas fa-plus"></i> <span>Add</span>{' '}
                          </button>
                        </div>
                      </div>
                      <div
                        className={classes['log-input']}
                        style={{ textAlign: 'right' }}
                      >
                        <button
                          className={
                            classes['tm-btn'] + ' ' + classes['add-coupon-icon']
                          }
                          onClick={submitHandler}
                        >
                          {' '}
                          Submit
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default Inventory
