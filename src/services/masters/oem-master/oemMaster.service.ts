import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export default class OemMasterService {
  getOemMasterData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_OEM_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createOemMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_OEM_MASTER:APIURLS.CREATE_OEM_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  activateDeactivateOemMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_OEM_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
