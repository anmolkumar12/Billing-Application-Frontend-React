import { BehaviorSubject } from 'rxjs'
import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'

export const AuthService = {
  sideNavCollapse: new BehaviorSubject<any>(false),
  userInfo: new BehaviorSubject<any>({}),
  currentRole: new BehaviorSubject<any>(null),
  currencyList$: new BehaviorSubject<any>(null),
  countryList$: new BehaviorSubject<any>(null),
  cityList$: new BehaviorSubject<any>(null),
  stateList$: new BehaviorSubject<any>(null),
  calendarList$: new BehaviorSubject<any>(null),
  brandsNameList$: new BehaviorSubject<any>(null),
  brandsCodeList$: new BehaviorSubject<any>(null),
  denominationList$: new BehaviorSubject<any>(null),
  adminBankList$: new BehaviorSubject<any>(null),
  adminWalletList$: new BehaviorSubject<any>(null),
  aaggregatorWalletList$: new BehaviorSubject<any>(null),
  valueType$: new BehaviorSubject<any>(null),
  usageType$: new BehaviorSubject<any>(null),
  deliveryType$: new BehaviorSubject<any>(null),
  adminAggregatorList$: new BehaviorSubject<any>(null),
  clientList$: new BehaviorSubject<any>(null),
  allClientList$: new BehaviorSubject<any>(null),
  dropdownList$: new BehaviorSubject<any>(null),
  systemRole$: new BehaviorSubject<any>(null),
  storeList$: new BehaviorSubject<any>(null),
  login: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.LOGIN, data)
      return response?.data
    } catch (err) {
      return {}
    }
  },

  changePassword: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CHANGE_PASSWORD,
        data
      )
      return response?.data
    } catch (err) {
      return {}
    }
  },

  setNewPassword: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.RESET_PASSWORD,
        data
      )
      return response?.data
    } catch (error) {
      return {}
    }
  },

  forgetPassword: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.FORGET_PASSWORD,
        data
      )
      return response?.data
    } catch (err) {
      return {}
    }
  },

  validateToken: async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.VERIFY_TOKEN)
      return response.data
    } catch (err) {
      return {}
    }
  },

  logOut: async () => {
    try {
      const response = await HTTPService.deleteRequest(APIURLS.LOGOUT)
      return response.data
    } catch (err) {
      return {}
    }
  },

  logOutAllDevice: async () => {
    try {
      const response = await HTTPService.deleteRequest(APIURLS.LOGOUT_ALL)
      return response.data
    } catch (err) {
      return {}
    }
  },

  getTokenFromRefreshToken: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.REFRESH_TOKEN,
        data
      )
      return response.data
    } catch (err) {
      return {}
    }
  },
}
