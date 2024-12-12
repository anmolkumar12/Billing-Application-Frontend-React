import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class ClientMasterService {
  getClientMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_CLIENT_MASTER)
      
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createClientMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CLIENT_MASTER,
        formData
      )      
      return response?.data
    } catch (error) {
      return error
    }
  }

  updateClientMaster = async (formData: any) => {
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

  deactivateClientMaster = async (data: any) => {
    try {
      const body = {
        clientId: data.id,
        isActive: !data.isActive,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CLIENT_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
