import { APIURLS } from '../../../constants/ApiUrls'
import { HTTPService } from '../../http-service/http-service'
import { AuthService } from '../../../services/auth-service/auth.service'

export class CompanyMasterService {
  getCompanyMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_COMPANY_MASTER)
      return response?.data
    } catch (err) {
      return err
    }
  }

  createCompanyMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_COMPANY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateCompanyMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_COMPANY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateCompanyMaster = async (data: any) => {
    try {
      const body = {
        companyId: data.id,
        isActive: 0,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }
      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_COMPANY_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return err
    }
  }
}
