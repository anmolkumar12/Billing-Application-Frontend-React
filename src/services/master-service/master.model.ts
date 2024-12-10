import _ from 'lodash'
export class MasterModel {
  modifyCountryAndCurrency = (data: any) => {
    const country = JSON.parse(JSON.stringify(data))
    const currency = JSON.parse(JSON.stringify(data))
    country.forEach((element: any) => {
      element.value = element?.id.toString()
      element.label = element?.name
    })
    currency.forEach((element: any) => {
      element.value = element.id.toString()
      element.label = element.sortName
    })
    return { country: country, currency: currency }
  }

  modifyCities = (data: any) => {
    data.forEach((element: any) => {
      element.value = element?.id.toString()
      element.label = element?.name
    })
    return data
  }

  modifyStates = (data: any) => {
    data.forEach((element: any) => {
      element.value = element?.id.toString()
      element.label = element?.name
    })
    return data
  }

  brandAndBrandCodeFilter = (data: any) => {
    const brands = JSON.parse(JSON.stringify(data))
    const brandsCode = JSON.parse(JSON.stringify(data))
    brands.forEach((element: any) => {
      element.label = element.brandName
      element.value = element.brandId.toString()
    })
    brandsCode.forEach((element: any) => {
      element.label = element.brandCode
      element.value = element.brandCode
    })
    return { brandsCode: brandsCode, brands: brands }
  }

  modifyCalendarList = (data: any) => {
    const groupedData = _.groupBy(data, 'financialYear')
    const list: any = []
    Object.entries(groupedData).forEach(([key, value]) => {
      list.push({ label: key, value: key })
    })
    return list
  }

  modifyBankList = (data: any) => {
    data.forEach((element: any) => {
      element.value = element?.bankId.toString()
      element.label = element?.bankName
    })
    return data
  }

  modifyWalletList = (data: any) => {
    data.forEach((element: any) => {
      element.label = element.walletName
      element.value = element.walletId.toString()
    })
    return data
  }

  modifyDropDownList = (data: any) => {
    const groupedData = _.groupBy(data, 'configcode')
    for (const key in groupedData) {
      if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
        const element = groupedData[key]
        element.forEach((item: any) => {
          item.label = item.configValue1
          item.value = item.id.toString()
        })
      }
    }
    return groupedData
  }

  modifyDenominationList = (data: any) => {
    data.forEach((element: any) => {
      element.value = element.id.toString()
      element.label = element.denominationList
    })
    return data
  }

  modifyClientList = (data: any) => {
    data.forEach((element: any) => {
      element.value = element.clientId.toString()
      element.label = element.clientName
    })
    return data
  }

  modifyAllClientList = (data: any) => {
    data.forEach((element: any) => {
      element.value = element?.ClientId
      element.label = element?.name
    })
    return data
  }

  modifyAdminAggregatorList = (data: any) => {
    data.forEach((element: any) => {
      element.label = element?.name
      element.value = element?.ClientId
    })
    return data
  }

  modifyStoreList = (data: any) => {
    data.forEach((element: any) => {
      element.value = element?.id.toString()
      element.label = element?.storeName
    })
    return data
  }
}
