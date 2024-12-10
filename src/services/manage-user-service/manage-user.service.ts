import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'

export class ManageUserService {
  manageUser = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.MANAGE_USER)
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }

  addUser = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.ADD_USER, data)
      return response
    } catch (error) {
      return {}
    }
  }

  editUser = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.MANAGE_EDIT_USER,
        data
      )
      return response
    } catch (error) {
      return {}
    }
  }

  companyLogo = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.VIEW_COMPANY_LOGO)
      console.log(response, 'companylogooooooo')
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }
}
