import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class ProductMasterService {
  getProductMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_PRODUCT_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createProductMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_PRODUCT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateProductMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_PRODUCT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateProductMaster = async (data: any) => {
    try {
      const body = {
        productId: data.id,
        isActive: 0,
        updatedBy: AuthService?.userInfo?.value?.userId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_PRODUCT_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
