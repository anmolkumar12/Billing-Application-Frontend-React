import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class AccountsMasterService {
  getAccountsMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_ACCOUNTS_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createAccountsMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_ACCOUNTS_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateAccountsMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_ACCOUNTS_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateAccountsMaster = async (data: any) => {
    try {
      const body = {
        accountId: data.account_id,
        isActive: !data.is_active,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_ACCOUNTS_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
