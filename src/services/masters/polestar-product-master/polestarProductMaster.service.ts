import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export default class PolestarProductMasterService {
  getPolestarProductMasterData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_POLESTAR_PRODUCT_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createPolestarProductMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_POLESTAR_PRODUCT_MASTER:APIURLS.CREATE_POLESTAR_PRODUCT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  activateDeactivatePolestarProductMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_POLESTAR_PRODUCT_MASTER_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
