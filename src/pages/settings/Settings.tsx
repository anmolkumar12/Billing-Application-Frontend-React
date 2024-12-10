/* eslint-disable no-unexpected-multiline */
import React, { useEffect, useState } from 'react'
import classes from './Settings.module.scss'
import './Settings.scss'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { Theme, Tooltip, withStyles } from '@material-ui/core'
import { SettingService } from '../../services/settings-service/settings.service'
import { ImageUrl } from '../../utils/ImageUrl'
import { MasterService } from '../../services/master-service/master.service'
import { FormComponent } from '../../components/ui/form/form'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import _, { values } from 'lodash'
import { ButtonComponent } from '../../components/ui/button/Button'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { CONSTANTS } from '../../constants/Constants'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { Chip } from 'primereact/chip'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { AuthService } from '../../services/auth-service/auth.service'
import { patchForm } from '../../utils/PatchForm'
import { SettingModel } from '../../services/settings-service/settings.model'
import { UtilityService } from '../../services/utility-service/utility.service'

const settingService = new SettingService()
const masterService = new MasterService()
const Settings: React.FC = () => {
  const [brandsData, setBrandsData] = useState([])
  const [conversionCurrencyData, setConversionCurrencyData] = useState([])
  const [brandsFilter, setBrandsFilter] = useState([])
  const [brandPopup, setBrandPopup] = useState(false)
  const [conversionPopup, setConversionPopup] = useState(false)
  const [isFormValid, setisFormValid] = useState(true)
  const [updateOptionsObj, setupdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [countryFilter, setCountryFilter] = useState([])
  const [currencyFilter, setCurrencyFilter] = useState([])
  const [brandCode, setBrandCode] = useState([])
  const [attachments, setAttachments] = useState<any>([])
  const [dropDownList, setDropDownList] = useState<any>([])
  const [denominationList, setDenominationList] = useState<any>([])
  const [editBrandPopup, setEditBrandPopup] = useState(false)
  const [rowData, setRowData] = useState<any>()
  const [walletDropdownList, setWalletDropdownList] = useState([])
  const [toggleState, setToggleState] = useState(1)
  const [fileUploaded, setFileUploaded] = useState<any>([])
  const [storeDropdownList, setStoreDropdownList] = useState([])

  useEffect(() => {
    getBrandsTableData()

    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
      brandForm.name.options = value
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandCode(value)
    })
    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
      brandForm.countryId.options = value
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setCurrencyFilter(value)
      conversionForm.baseCurrencyId.options = value
      conversionForm.toCurrencyId.options = value
    })
    AuthService.adminWalletList$.subscribe((value: any) => {
      setWalletDropdownList(value)
      brandForm.walletId.options = value
    })
    AuthService.dropdownList$.subscribe((value: any) => {
      setDropDownList(value)
    })
    AuthService.valueType$.subscribe((value: any) => {
      brandForm.valueTypeId.options = value
    })
    AuthService.usageType$.subscribe((value: any) => {
      brandForm.usageTypeId.options = value
    })
    AuthService.deliveryType$.subscribe((value: any) => {
      brandForm.deliveryTypeId.options = value
    })
    AuthService.denominationList$.subscribe((value: any) => {
      setDenominationList(value)
      brandForm.denominationsId.options = value
    })
    AuthService.storeList$.subscribe((value: any) => {
      setStoreDropdownList(value)
    })
  }, [])

  const toggleTab = (index: number) => {
    setToggleState(index)
    index == 1 ? getBrandsTableData() : getConversionCurrencyData()
  }

  const getBrandsTableData = () => {
    settingService
      .brands()
      .then((response: any) => {
        setBrandsData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }
  const getConversionCurrencyData = () => {
    settingService
      .conversion()
      .then((response: any) => {
        setConversionCurrencyData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrandsFilter(response?.brands)
  //       setBrandCode(response?.brandsCode)
  //       brandForm.name.options = response.brands
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const descriptionBody = (rowData: any) => {
    return (
      <>
        <Tooltip
          title={new UtilityService().replaceLineBreaks(
            rowData?.descriptionData
          )}
        >
          <span className="ellipsis-text-table">
            {new UtilityService().replaceLineBreaks(rowData?.descriptionData)}
          </span>
        </Tooltip>
      </>
    )
  }

  const redemptionInstructions = (rowData: any) => {
    return (
      <>
        <Tooltip
          title={new UtilityService().replaceLineBreaks(
            rowData?.redemptionInstructionsData
          )}
        >
          <span className="ellipsis-text-table">
            {new UtilityService().replaceLineBreaks(
              rowData?.redemptionInstructionsData
            )}
          </span>
        </Tooltip>
      </>
    )
  }

  const termsAndConditions = (rowData: any) => {
    return (
      <>
        <Tooltip
          title={new UtilityService().replaceLineBreaks(
            rowData?.termsAndConditionsData
          )}
        >
          <span className="ellipsis-text-table">
            {new UtilityService().replaceLineBreaks(
              rowData?.termsAndConditionsData
            )}
          </span>
        </Tooltip>
      </>
    )
  }

  const isActive = (rowData: any) => {
    return (
      <>
        <span
          className="ellipsis-data"
          style={{
            color: rowData?.isActive === 'Active' ? 'green' : 'red',
          }}
        >
          {rowData?.isActive}
        </span>
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

  const actionBody = (rowData: any) => {
    return (
      <>
        <img
          className="actionPencilImg"
          src={ImageUrl.ActionPencil}
          alt=""
          onClick={() => {
            OnActionClick(rowData)
          }}
        />
      </>
    )
  }

  const OnActionClick = (rowData: any) => {
    console.log(rowData, 'rowDataaaa')
    // brandForm.walletId.options = walletDropdownList
    setEditBrandPopup(true)
    setBrandPopup(true)
    patchForm(brandForm, new SettingModel().modifyEditBrand(rowData, brandForm))
    setRowData(rowData)
  }

  const removeLogoFromRowData = () => {
    const data: any = JSON.parse(JSON.stringify(rowData))
    data.brandLogo = null
    setRowData(data)
    // console.log('rowData.brandLogo', rowData.brandLogo)
    rowData.brandLogo = null
  }

  const brandTableColumns = [
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
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandsFilter?.length
          ? brandsFilter.map((brand: any) => {
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
      label: 'Brand Code',
      fieldName: 'brandCode',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: brandCode?.length
          ? brandCode.map((brand: any) => {
              return brand.label
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
      frozen: false,
      sort: true,
      textAlign: 'left',
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
      frozen: false,
      sort: true,
      textAlign: 'left',
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
      label: 'Currency Name',
      fieldName: 'currencyName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Description',
      fieldName: 'descriptionData',
      body: descriptionBody,
      textAlign: 'left',
      sort: true,
      frozen: false,
      flexGrow: 1,
      filter: true,
    },
    {
      label: 'Domain',
      fieldName: 'domain',
      frozen: false,
      sort: true,
      filter: true,
      textAlign: 'left',
    },
    {
      label: 'Redemption Instructions',
      fieldName: 'redemptionInstructionsData',
      body: redemptionInstructions,
      frozen: false,
      sort: true,
      textAlign: 'left',
      flexGrow: 1,
      filter: true,
    },
    {
      label: 'Terms & Conditions',
      fieldName: 'termsAndConditionsData',
      body: termsAndConditions,
      frozen: false,
      sort: true,
      textAlign: 'left',
      flexGrow: 1,
      filter: true,
    },
    {
      label: 'Value Type',
      fieldName: 'valueType',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: dropDownList?.valueType?.length
          ? dropDownList?.valueType.map((valueTypeItem: any) => {
              return valueTypeItem.label
            })
          : [],
        fieldValue: 'valueType',
        changeFilter: true,
        placeholder: 'Value Type',
      },
    },
    {
      label: 'Denomination Code',
      fieldName: 'denominationCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: denominationList?.length
          ? denominationList.map((denominationItem: any) => {
              return denominationItem.label
            })
          : [],
        fieldValue: 'denominationCode',
        changeFilter: true,
        placeholder: 'Denomination Code',
      },
    },
    {
      label: 'Denomination List',
      fieldName: 'denominationList',
      textAlign: 'left',
      sort: true,
      filter: true,
      // dropDownFilter: {
      //   filterOptions: brandsFilter?.length
      //     ? brandsFilter.map((brand: any) => {
      //         return brand.label
      //       })
      //     : [],
      //   fieldValue: 'denominationCode',
      //   changeFilter: true,
      //   placeholder: 'Denomination Code',
      // },
    },
    {
      label: 'Min Amount',
      fieldName: 'minValue',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Max Amount',
      fieldName: 'maxValue',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Delivery Type',
      fieldName: 'deliveryType',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: dropDownList?.deliveryType?.length
          ? dropDownList?.deliveryType.map((deliveryTypeItem: any) => {
              return deliveryTypeItem.label
            })
          : [],
        fieldValue: 'deliveryType',
        changeFilter: true,
        placeholder: 'Delivery Type',
      },
    },
    {
      label: 'TAT In Days',
      fieldName: 'tatInDays',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Uses Type',
      fieldName: 'usageType',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: dropDownList?.usageType?.length
          ? dropDownList?.usageType?.map((usageItem: any) => {
              return usageItem.label
            })
          : [],
        fieldValue: 'usesType',
        changeFilter: true,
        placeholder: 'Uses Type',
      },
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

  const conversionCurrencyColumn = [
    {
      label: 'Base Currency',
      fieldName: 'baseCurrencyName',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'To Currency',
      fieldName: 'toCurrencyName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Base Country',
      fieldName: 'baseCountryName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: countryFilter?.length
          ? countryFilter.map((country: any) => {
              return country.label
            })
          : [],
        fieldValue: 'baseCountryName',
        changeFilter: true,
        placeholder: 'Country',
      },
    },
    {
      label: 'To Country',
      fieldName: 'toCountryName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: countryFilter?.length
          ? countryFilter.map((country: any) => {
              return country.label
            })
          : [],
        fieldValue: 'toCountryName',
        changeFilter: true,
        placeholder: 'Country',
      },
    },
    {
      label: 'Conversion Rate',
      fieldName: 'conversionRate',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Created Date',
      fieldName: 'createdDate',
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
    {
      label: 'Active',
      fieldName: 'isActive',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      body: isActive,
    },
    // {
    //   label: 'Updated Date',
    //   fieldName: 'updatedDate',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
    // {
    //   label: 'Updated By',
    //   fieldName: 'updatedDate',
    //   textAlign: 'left',
    //   sort: true,
    //   filter: true,
    // },
  ]

  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => onOperationClick(),
      tooltip: 'Add',
    },
  ]

  const conversionButtonsArr = [
    {
      label: 'add',
      addFunction: () => onConversionOperationClick(),
      tooltip: 'Add',
    },
  ]

  const onOperationClick = () => {
    // brandForm.walletId.options = walletDropdownList
    setBrandPopup(true)
  }

  const onConversionOperationClick = () => {
    setConversionPopup(true)
  }

  const closePopup = () => {
    setEditBrandPopup(false)
    // console.log(brandFormObj, 'brandFormObj')
    setBrandPopup(false)
    // selectAttachment([])
    setAttachments([])
    setFileUploaded([])
    setRowData({})
    setBrandForm(_.cloneDeep(brandFormObj))
  }

  const closeConversionPopup = () => {
    setConversionPopup(false)
    setConversionForm(_.cloneDeep(conversionFormObj))
  }

  const brandFormHandler = (form: FormType) => {
    setBrandForm(form)
  }

  const conversionFormHandler = (form: FormType) => {
    setConversionForm(form)
  }

  // const getCountryList = () => {
  //   masterService
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setCountryFilter(response?.country)
  //       setCurrencyFilter(response?.currency)
  //       brandForm.countryId.options = response?.country
  //       conversionForm.baseCurrencyId.options = response?.currency
  //       conversionForm.toCurrencyId.options = response?.currency
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getWalletList = () => {
  //   masterService
  //     .walletList()
  //     .then((response: any) => {
  //       setWalletDropdownList(response)
  //       brandForm.walletId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getDropDownList = () => {
  //   masterService
  //     .dropDownMaster()
  //     .then((response: any) => {
  //       setDropDownList(response)
  //       brandForm.valueTypeId.options = response?.valueType
  //       brandForm.usageTypeId.options = response?.usageType
  //       brandForm.deliveryTypeId.options = response?.deliveryType
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getDenominationList = () => {
  //   masterService
  //     .denominationList()
  //     .then((response: any) => {
  //       setDenominationList(response)
  //       brandForm.denominationsId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const brandFormObj = {
    code: {
      inputType: 'inputtext',
      label: 'Code',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    name: {
      inputType: 'inputtext',
      label: 'Name',
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
    expiryAndValidity: {
      inputType: 'inputtext',
      label: 'Expiry & Validity',
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
    walletId: {
      inputType: 'multiSelect',
      label: 'Wallet',
      options: walletDropdownList,
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
    countryId: {
      inputType: 'singleSelect',
      label: 'Country',
      value: null,
      validation: {
        required: true,
      },
      options: countryFilter,
      fieldWidth: 'col-md-4',
    },
    valueTypeId: {
      inputType: 'singleSelect',
      label: 'Value Type',
      value: null,
      validation: {
        // required: true,
      },
      options: dropDownList?.valueType,
      fieldWidth: 'col-md-4',
    },
    denominationsId: {
      inputType: 'singleSelect',
      label: 'Denomination',
      value: null,
      validation: {
        required: true,
      },
      options: denominationList,
      fieldWidth: 'col-md-4',
    },
    minValue: {
      inputType: 'inputNumber',
      label: 'Min Amount',
      value: null,
      validation: {
        // required: true,
      },
      fieldWidth: 'col-md-4',
    },
    maxValue: {
      inputType: 'inputNumber',
      label: 'Max Amount',
      value: null,
      validation: {
        // required: true,
      },
      fieldWidth: 'col-md-4',
    },
    deliveryTypeId: {
      inputType: 'singleSelect',
      label: 'Delivery Type',
      value: null,
      validation: {
        // required: true,
      },
      options: dropDownList?.deliveryType,
      fieldWidth: 'col-md-4',
    },
    tatInDays: {
      inputType: 'inputNumber',
      label: 'TAT In Days',
      value: null,
      validation: {
        // required: true,
      },
      options: countryFilter,
      fieldWidth: 'col-md-4',
    },
    usageTypeId: {
      inputType: 'singleSelect',
      label: 'Uses Type',
      value: null,
      validation: {
        // required: true,
      },
      options: dropDownList?.usageType,
      fieldWidth: 'col-md-4',
    },
    domain: {
      inputType: 'inputtext',
      label: 'Domain',
      value: null,
      fieldWidth: 'col-md-12',
      validation: {
        // required: true,
      },
    },
    logoUrl: {
      inputType: 'inputtext',
      label: 'Logo URL',
      value: null,
      fieldWidth: 'col-md-12',
      validation: {
        // required: true,
      },
    },
    description: {
      inputType: 'inputtextarea',
      label: 'Description',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 200000,
      },
      fieldWidth: 'col-md-4',
    },
    termsAndConditions: {
      inputType: 'inputtextarea',
      label: 'Terms & Conditions',
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
    redemptionInstructions: {
      inputType: 'inputtextarea',
      label: 'Redemption Instructions',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 200000,
      },
      fieldWidth: 'col-md-4',
    },
  }

  const conversionFormObj = {
    baseCurrencyId: {
      inputType: 'singleSelect',
      label: 'Base Currency',
      value: null,
      validation: {
        required: true,
      },
      options: currencyFilter,
      fieldWidth: 'col-md-4',
    },
    toCurrencyId: {
      inputType: 'singleSelect',
      label: 'To Currency',
      value: null,
      validation: {
        required: true,
      },
      options: currencyFilter,
      fieldWidth: 'col-md-4',
    },
    conversionRate: {
      inputType: 'inputNumber',
      label: 'Conversion Rate',
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
  }

  const [brandForm, setBrandForm] = useState<any>(_.cloneDeep(brandFormObj))

  const [conversionForm, setConversionForm] = useState<any>(
    _.cloneDeep(conversionFormObj)
  )

  const submitBrand = () => {
    if (!attachments.length && !brandForm?.logoUrl?.value) {
      return ToasterService.show(
        'Please provide a Logo or Logo URL',
        CONSTANTS.ERROR
      )
    }
    const obj = {
      code: brandForm?.code?.value,
      name: brandForm?.name?.value,
      domain: brandForm?.domain?.value,
      termsAndConditions: brandForm?.termsAndConditions?.value,
      redemptionInstructions: brandForm?.redemptionInstructions?.value,
      description: brandForm?.description?.value,
      countryId: brandForm?.countryId?.value,
      expiryAndValidity: brandForm?.expiryAndValidity?.value,
      walletId: brandForm?.walletId?.value,
      minValue: brandForm?.minValue?.value,
      maxValue: brandForm?.maxValue?.value,
      tatInDays: brandForm?.tatInDays?.value,
      usageTypeId: brandForm?.usageTypeId?.value || null,
      valueTypeId: brandForm?.valueTypeId?.value || null,
      denominationsId: brandForm?.denominationsId?.value,
      deliveryTypeId: brandForm?.deliveryTypeId?.value || null,
      logoUrl: brandForm?.logoUrl?.value,
    }

    let brandValidityFlag = true
    const brandValid: boolean[] = []
    _.each(brandForm, (item: any) => {
      if (item.required) {
        brandValid.push(item.valid)
        brandValidityFlag = brandValidityFlag && item.valid
      }
    })

    if (brandValidityFlag) {
      const formData: any = new FormData()
      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      // if (!attachments?.length) {
      //   return ToasterService.show('Please Upload Logo', CONSTANTS.ERROR)
      // }
      attachments?.length && formData.set('file', attachments[0])
      new SettingService()
        .addBrand(formData)
        .then((response: any) => {
          if (response?.data?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
            closePopup()
            getBrandsTableData()
          }
        })
        .catch((error: any) => {
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      return ToasterService.show('Please Check the field!', 'error')
    }
  }

  const updateBrand = () => {
    const obj = {
      brandId: rowData?.brandId,
      code: brandForm?.code?.value,
      name: brandForm?.name?.value,
      domain: brandForm?.domain?.value,
      termsAndConditions: brandForm?.termsAndConditions?.value,
      redemptionInstructions: brandForm?.redemptionInstructions?.value,
      description: brandForm?.description?.value,
      countryId: brandForm?.countryId?.value,
      expiryAndValidity: brandForm?.expiryAndValidity?.value,
      walletId: brandForm?.walletId?.value,
      minValue: brandForm?.minValue?.value,
      maxValue: brandForm?.maxValue?.value,
      tatInDays: brandForm?.tatInDays?.value,
      usageTypeId: brandForm?.usageTypeId?.value || null,
      valueTypeId: brandForm?.valueTypeId?.value || null,
      denominationsId: brandForm?.denominationsId?.value,
      deliveryTypeId: brandForm?.deliveryTypeId?.value || null,
    }
    // console.log('brandform', obj)
    let brandValidityFlag = true
    const brandValid: boolean[] = []
    _.each(brandForm, (item: any) => {
      brandValid.push(item.valid)
      brandValidityFlag = brandValidityFlag && item.valid
      // console.log(item, brandValidityFlag)
    })

    if (brandValidityFlag) {
      const formData: any = new FormData()
      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      if (!attachments?.length && !rowData?.brandLogo) {
        return ToasterService.show('Please Upload Logo', CONSTANTS.ERROR)
      }
      if (attachments?.length) {
        formData.set('file', attachments[0])
      } else {
        formData.set('logo', rowData?.brandLogo)
      }
      // console.log('formData', formData)

      new SettingService()
        .updateBrand(formData)
        .then((response: any) => {
          if (response?.data?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
            closePopup()
            getBrandsTableData()
            setRowData(null)
            setEditBrandPopup(false)
          }
        })
        .catch((error: any) => {
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      return ToasterService.show('Please Check the field!', 'error')
    }
  }

  const selectAttachment = (event1: any, event: any) => {
    const newEvent: any = [],
      newEvent1: any = []
    Array.prototype.push.apply(newEvent, event)
    Array.prototype.push.apply(newEvent1, event1.target.files)

    if (event && event1) {
      const fileType = event[0].name
        .split('.')
        [event[0].name.split('.').length - 1].toLowerCase()
      if (
        FILE_TYPES.SVG != fileType &&
        FILE_TYPES.JPEG != fileType &&
        FILE_TYPES.JPG != fileType &&
        FILE_TYPES.PNG != fileType
      ) {
        ToasterService.show(
          `Invalid logo format.The allowed logo format is jpeg,jpg,png`,
          CONSTANTS.ERROR
        )
        newEvent.splice(0, 1)
        newEvent1.splice(0, 1)
        return true
      }
      const invalidSizeIndex = _.findIndex(event, (item: any) => {
        return item.size > 10485760
      })

      if (invalidSizeIndex > -1) {
        ToasterService.show(
          `File size is too large for file ${
            invalidSizeIndex + 1
          }, allowed maximum size is 5 MB.`,
          'error'
        )
        newEvent.splice(invalidSizeIndex, 1)
        newEvent1.splice(invalidSizeIndex, 1)
      }
      if (newEvent1 && newEvent1.length) {
        const filesAmount = newEvent1.length
        for (let i = 0; i < filesAmount; i++) {
          const reader = new FileReader()
          reader.onload = (event: any) => {
            setFileUploaded([event['target'].result])
          }
          reader.readAsDataURL(newEvent1[i])
        }
      }

      _.values(newEvent).map((item) => {
        setAttachments([item])
      })
    }
  }

  const removeFileHandler = () => {
    rowData.brandLogo = null
    setAttachments([])
    setFileUploaded([])
  }

  const submitConversion = () => {
    const obj = {
      baseCurrencyId: conversionForm?.baseCurrencyId?.value,
      toCurrencyId: conversionForm?.toCurrencyId?.value,
      conversionRate: conversionForm?.conversionRate?.value,
    }
    new SettingService()
      .addConversion(obj)
      .then((response: any) => {
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          closeConversionPopup()
          getConversionCurrencyData()
          ToasterService.show(response?.message, CONSTANTS.SUCCESS)
        }
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }

  return (
    <>
      <div className={classes['settings-table']}>
        <div className="tab-header">
          <ul>
            <li
              className={toggleState === 1 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(1)}
            >
              Brand
            </li>
            <li
              className={toggleState === 2 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(2)}
            >
              Currency
            </li>
          </ul>
        </div>

        <div className="tab-contents">
          <div className={toggleState === 1 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              customClass="brandTable"
              data={brandsData}
              column={brandTableColumns}
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
              rowClass={'settings-table'}
              data={conversionCurrencyData}
              column={conversionCurrencyColumn}
              buttonArr={conversionButtonsArr}
              showGridlines={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              scrollHeight={'calc(100vh - 105px)'}
            />
          </div>
        </div>
      </div>

      {/* <div className="settings-body">
        <Tabs
          activeKey={key}
          transition={true}
          onSelect={(k: any) => setKey(k)}
          className="mb-1"
        >
          <Tab eventKey="brand" title="Brand">
            <DataTableBasicDemo
              data={brandsData}
              column={brandTableColumns}
              buttonArr={buttonsArr}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={false}
              downloadedfileName={'Brands'}
              scrollHeight={'calc(100vh - 127px)'}
            />
          </Tab>
          <Tab eventKey="currency" title="Currency">
            <DataTableBasicDemo
              data={conversionCurrencyData}
              column={conversionCurrencyColumn}
              buttonArr={conversionButtonsArr}
              showGridlines={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={false}
              scrollHeight={'calc(100vh - 127px)'}
            />
          </Tab>
        </Tabs>
      </div> */}

      {brandPopup ? (
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
                <h4 className="popup-heading">
                  {editBrandPopup ? 'Edit Brands' : 'Add Brands'}
                </h4>
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
              <FormComponent
                customClassName="boxFieldsss rwm"
                form={_.cloneDeep(brandForm)}
                formUpdateEvent={brandFormHandler}
                isFormValidFlag={isFormValid}
                updateOptions={updateOptionsObj}
              ></FormComponent>
              {/* attachment */}
              <div className={classes['upload-wrapper']}>
                <label htmlFor="">
                  Upload Logo
                  {/* <span style={{ color: 'red' }}>*</span> */}
                </label>
                <div className="row mx-0 my-2">
                  <div className="col-md-12 p-0">
                    <div
                      className={
                        classes['upload-file-section'] + ' ' + 'd-flex p-4'
                      }
                    >
                      <div className={classes['upload-file'] + ' ' + 'pl-2'}>
                        <input
                          type="file"
                          onClick={(event: any) => {
                            event.target.value = null
                          }}
                          onChange={(e) => selectAttachment(e, e.target.files)}
                        />
                        <p>
                          Drag files here <br />
                          <u>
                            Support 240px width * 80px height. File type: JPEG
                            or PNG
                          </u>
                        </p>
                      </div>
                      <div className={classes['chip-tm']}>
                        {fileUploaded?.length ? (
                          <div className={classes['img-preview']}>
                            {fileUploaded.map((item: any) => {
                              return (
                                <>
                                  <img
                                    crossOrigin="anonymous"
                                    src={item}
                                    alt="Brand Logo"
                                  />
                                  <div
                                    className={classes['close-img-preview']}
                                    onClick={() => removeFileHandler()}
                                  >
                                    &times;
                                  </div>
                                </>
                              )
                            })}
                          </div>
                        ) : editBrandPopup && rowData?.brandLogo ? (
                          <div className={classes['img-preview']}>
                            <img
                              crossOrigin="anonymous"
                              src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.brandLogo}`}
                              style={{
                                verticalAlign: 'middle',
                                paddingRight: '2px',
                              }}
                              width={150}
                              alt="Brand Logo"
                            />
                            <div
                              className={classes['close-img-preview']}
                              onClick={() => removeLogoFromRowData()}
                            >
                              &times;
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={classes['img-preview']}>
                              <img src={ImageUrl.AttachmentClip} alt="" />
                            </div>
                          </>
                        )}
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
                submitEvent={editBrandPopup ? updateBrand : submitBrand}
              />
            </div>
          </div>
        </div>
      ) : null}

      {conversionPopup ? (
        <div className="popup-overlay">
          <div className="popup-body stretchLeft">
            <div className="popup-header">
              <div
                className="popup-close"
                onClick={() => {
                  closeConversionPopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Add Conversion</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeConversionPopup()
                }}
              >
                &times;
              </div>
            </div>

            <div className="popup-content">
              <FormComponent
                customClassName="boxFieldsss rwm"
                form={_.cloneDeep(conversionForm)}
                formUpdateEvent={conversionFormHandler}
                isFormValidFlag={isFormValid}
                updateOptions={updateOptionsObj}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={submitConversion}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* {editBrandPopup ? (
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
                  onClick={() => setEditBrandPopup(false)}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">Edit Brand</h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => setEditBrandPopup(false)}
                >
                  &times;
                </div>
              </div>
              <div className="popup-content"></div>
              <div className="popup-lower-btn"></div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )} */}
    </>
  )
}
export default Settings
