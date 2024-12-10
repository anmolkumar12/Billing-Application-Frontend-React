import { APIURLS } from './../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'

export class AggregatorManageUserService {
  aggregatorUserData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.AGGREGATOR_USER)
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }
  addUser = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.AGGREGATOR_USER,
        data
      )
      // console.log(response)
      return response
    } catch (error) {
      return {}
    }
  }

  editUser = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.AGGREGATOR_EDIT_USER,
        data
      )
      return response
    } catch (error) {
      return {}
    }
  }
}
