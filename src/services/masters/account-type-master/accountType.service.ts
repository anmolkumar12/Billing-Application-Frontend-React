import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class AccountTypeMasterService {
  getAccountTypeMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_ACCOUNT_TYPE_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createAccountTypeMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_ACCOUNT_TYPE_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateAccountTypeMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_ACCOUNT_TYPE_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateAccountTypeMaster = async (data: any) => {
    try {
      const body = {
        accountTypeId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_ACCOUNT_TYPE_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
