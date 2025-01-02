import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class CurrencyMasterService {
  getCurrencyMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_CURRENCY_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createCurrencyMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CURRENCY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateCurrencyMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CURRENCY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateCurrencyMaster = async (data: any) => {
    try {
      const body = {
        currencyId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CURRENCY_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return err
    }
  }
}
