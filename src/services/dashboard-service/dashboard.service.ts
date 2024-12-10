import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { DashboardModel } from './dashboard.model'

export class DashboardService {
  getDashboard = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.INVENTORY_DASHBOARD)
      return new DashboardModel().modifiyDashBoardData(response?.data?.data)
    } catch (err) {
      return {}
    }
  }
  couponWithZeroInventoryData = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.COUPON_WITH_ZERO_INVETORY
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
