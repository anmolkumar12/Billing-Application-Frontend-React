import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class IndustryMasterService {
  getIndustryMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_INDUSTRY_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createIndustryMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_INDUSTRY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateIndustryMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_INDUSTRY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateIndustryMaster = async (data: any) => {
    try {
      const body = {
        industryId: data.id,
        isActive: !data.isActive,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_INDUSTRY_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
