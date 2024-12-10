import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { AggregatorReportModel } from './aggregator-report.model'

export class AggregatorReportService {
  aggregatorRedeemedCouponsReport = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGRATOR_REDEEMED_COUPONS
      )
      return new AggregatorReportModel().aggregatorRedeemedCouponsData(
        response?.data?.data
      )
    } catch (error) {
      return error
    }
  }
}
