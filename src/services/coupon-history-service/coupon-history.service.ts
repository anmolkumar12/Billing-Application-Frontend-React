import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { CouponHistoryModel } from './coupon-history.model'

export class CouponHistoryService {
  brandWiseReport = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.BRAND_WISE_REPORT)
      return response?.data?.data
    } catch (err) {
      return {}
    }
  }

  denominationWiseReport = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.DENOMINATION_WISE_REPORT
      )
      return response?.data?.data
    } catch (err) {
      return {}
    }
  }

  redeemedCouponReport = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.REDEEMED_COUPONS)
      return new CouponHistoryModel().modifyRedeemedCoupon(response?.data?.data)
    } catch (err) {
      return {}
    }
  }

  failedTransactionReport = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.ORDERS_FAILED)
      return new CouponHistoryModel().modifyFailedTransactionData(
        response?.data?.data
      )
    } catch (err) {
      return {}
    }
  }
}
