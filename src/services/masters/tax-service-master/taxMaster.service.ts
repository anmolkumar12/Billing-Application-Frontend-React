import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class TaxMasterService {
  getTax = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_TAXES)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createTax = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id?APIURLS.UPDATE_TAXES:APIURLS.CREATE_TAXES,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateTax = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_TAXES,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  activatedeactivateTax = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
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

  formatDate = async (dateString: any) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    } catch (error: any) {
      return error.message;
    }
  }
}
