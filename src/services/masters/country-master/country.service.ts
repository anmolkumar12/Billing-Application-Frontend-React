import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class CountryMasterService {
  getCountryMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_COUNTRY_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }
  createCountryMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_COUNTRY,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateCountryMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_COUNTRY,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }
  deactivateCountryMaster = async (data: any) => {
    try {
      const body = {
        countryId: data.id,
        isActive: !data.isactive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_COUNTRY,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
