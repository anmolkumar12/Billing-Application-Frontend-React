import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { MasterModel } from './master.model'

export class MasterService {
  countryAndCurencyList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.COUNTRY)
      return new MasterModel().modifyCountryAndCurrency(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  cityList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.CITIES)
      return new MasterModel().modifyCities(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  stateList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.STATES)
      return new MasterModel().modifyStates(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  calenderList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.CALENDER)
      return new MasterModel().modifyCalendarList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  brandAndBrandCodeFilter = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.BRAND_FILTERS)
      return new MasterModel().brandAndBrandCodeFilter(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  denominationList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.DENOMINATION)
      return new MasterModel().modifyDenominationList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  //
  // aggregatorBankList = async () => {
  //   try {
  //     const response = await HTTPService.getRequest(
  //       APIURLS.AGGREGATOR_BANK_LIST
  //     )
  //     return new MasterModel().modifyBankList(response?.data?.data)
  //   } catch (error) {
  //     return {}
  //   }
  // }

  adminBankList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.ADMIN_BANK_LIST)
      return new MasterModel().modifyBankList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  walletList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.WALLETS)
      return new MasterModel().modifyWalletList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  aggregatorWalletList = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_WALLET_LIST
      )
      return new MasterModel().modifyWalletList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  dropDownMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.DROPDOWN_MASTER)
      return new MasterModel().modifyDropDownList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  adminAggregatorList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.ADMIN_CLIENT_LIST)
      return new MasterModel().modifyAdminAggregatorList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  // adminClientList = async (data: any) => {
  //   try {
  //     const response = await HTTPService.getRequest(APIURLS.ADMIN_CLIENT_LIST, {
  //       params: data,
  //     })
  //     return new MasterModel().modifyAdminAggregatorList(response?.data?.data)
  //   } catch (error) {
  //     return {}
  //   }
  // }

  clientList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.CLIENT_LIST)
      return new MasterModel().modifyClientList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  allClientList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.ALL_CLIENTS)
      return new MasterModel().modifyAllClientList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  storeList = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.STORE_DROPDOWN_LIST)
      return new MasterModel().modifyStoreList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }
}
