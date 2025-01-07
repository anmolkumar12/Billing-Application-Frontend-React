import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export default class ProjectServiceMasterService {
  getProjectServiceMasterData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_PROJECT_SERVICE_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createProjectServiceMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_PROJECT_SERVICE_MASTER : APIURLS.CREATE_PROJECT_SERVICE_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  activateDeactivateProjectServiceMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_PROJECT_SERVICE_MASTER_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
