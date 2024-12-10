import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { PlatformPreferenceModel } from './platform-preference-model'

export class PlatformPreferenceService {
  profileTabData = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.PLATFORM_PREFERENCE_PROFILE
      )
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }

  addLogo = async (data: any) => {
    try {
      const response = await HTTPService.putRequest(APIURLS.ADD_LOGO, data)
      return response?.data
    } catch (error: any) {
      return {}
    }
  }

  activateWallet = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.ACTIVATE_WALLET,
        data
      )
      return response?.data
    } catch (error: any) {
      return {}
    }
  }

  rewardApiClientData = async (data: any) => {
    // console.log('data', data)

    try {
      const response = await HTTPService.getRequest(APIURLS.ACTIVATE_WALLET, {
        params: data,
      })
      return response?.data
    } catch (error: any) {
      return {}
    }
  }

  generateToken = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.GENERATE_TOKEN,
        data
      )
      return response?.data?.data
    } catch (error: any) {
      return {}
    }
  }

  activatedClientList = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.ACTIVATED_CLIENT_LIST
      )
      return new PlatformPreferenceModel().modifyActivatedClientList(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  deactivateClient = async (data: any) => {
    try {
      const response = await HTTPService.putRequest(
        `${APIURLS.DEACTIVATE_CLIENTS}?clientId=${data}`
        // {
        //   params: data,
        // }
      )
      // return new PlatformPreferenceModel().modifyDeactivateClient(
      //   response?.data?.data
      // )
      return response
    } catch (error) {
      return {}
    }
  }
}
