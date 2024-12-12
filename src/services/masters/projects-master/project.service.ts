import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class ProjectMasterService {
  getProjectMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_PROJECT_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createProjectMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_PROJECT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateProjectMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_PROJECT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateProjectMaster = async (data: any) => {
    try {
      const body = {
        projectId: data.id,
        isActive: !data.isActive,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_PROJECT_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
