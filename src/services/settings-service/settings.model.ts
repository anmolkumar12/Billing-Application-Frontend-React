import moment from 'moment'
import { json } from 'stream/consumers'

export class SettingModel {
  brandData = (data: any) => {
    data.forEach((item: any) => {
      item.createdAt =
        item?.createdAt && moment(item?.createdAt).format('YYYY-MM-DD')
      item.updatedAt =
        item?.updatedAt && moment(item?.updatedAt).format('YYYY-MM-DD')
      item.descriptionData = item?.description?.replace(/(<([^>]+)>)/gi, '')
      item.redemptionInstructionsData = item?.redemptionInstructions?.replace(
        /(<([^>]+)>)/gi,
        ''
      )
      item.termsAndConditionsData = item?.termsAndConditions?.replace(
        /(<([^>]+)>)/gi,
        ''
      )
      // item.minValue = item?.minValue?.toLocaleString('en-US')
      // item.maxValue = item?.maxValue?.toLocaleString('en-US')
    })
    return data
  }

  conversionCurrencyData = (data: any) => {
    data.forEach((element: any) => {
      element.isActive = element.isActive == 1 ? 'Active' : 'Non-Active'
      element.createdDate =
        element?.createdDate &&
        moment(element?.createdDate).format('YYYY-MM-DD HH:MM:SS')
      element.updatedDate =
        element?.updatedDate &&
        moment(element?.updatedDate).format('YYYY-MM-DD HH:MM:SS')
    })
    return data
  }

  modifyEditBrand = (data: any, brandForm: any) => {
    data.code = data?.brandCode
    data.name = data?.brandName
    data.tatInDays = +data?.tatInDays

    const valueTypeIdIndex = brandForm?.valueTypeId?.options?.findIndex(
      (item: any) => item?.configValue1 == data?.valueType
    )
    data.valueTypeId =
      valueTypeIdIndex > -1 &&
      brandForm?.valueTypeId?.options[valueTypeIdIndex].value
    const countryIdIndex = brandForm?.countryId?.options?.findIndex(
      (item: any) => item?.name == data?.countryName
    )
    data.countryId =
      countryIdIndex > -1 && brandForm?.countryId?.options[countryIdIndex].value

    const denominationsIdIndex = brandForm?.denominationsId?.options?.findIndex(
      (item: any) => item?.denominationList == data?.denominationList
    )
    data.denominationsId =
      denominationsIdIndex > -1 &&
      brandForm?.denominationsId?.options[denominationsIdIndex].value

    const deliveryTypeIdIndex = brandForm?.deliveryTypeId?.options?.findIndex(
      (item: any) => item?.configValue1 == data?.deliveryType
    )
    data.deliveryTypeId =
      deliveryTypeIdIndex > -1 &&
      brandForm?.deliveryTypeId?.options[deliveryTypeIdIndex].value

    const usageTypeIdIndex = brandForm?.usageTypeId?.options?.findIndex(
      (item: any) => item?.configValue1 == data?.usageType
    )
    data.usageTypeId =
      usageTypeIdIndex > -1 &&
      brandForm?.usageTypeId?.options[usageTypeIdIndex].value

    if (typeof data?.walletId == 'string') {
      data.walletId = data?.walletId.split(',')
    }
    return data
  }
}
