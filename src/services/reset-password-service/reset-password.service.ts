import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'

export class AuthService {
  getDashboard = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.LOGIN, data)
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
