import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class TaxMasterService {
  getTaxMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_TAX_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createTaxMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_TAX_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateTaxMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_TAX_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateTaxMaster = async (data: any) => {
    try {
      const body = {
        taxId: data.id,
        isActive: !data.isActive,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_TAX_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
