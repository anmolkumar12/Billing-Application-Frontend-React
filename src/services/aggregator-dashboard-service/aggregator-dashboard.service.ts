import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { AggregatorDashboardModel } from './aggregator-dashboard.model'

const aggregatorDashboardModel = new AggregatorDashboardModel()
export class AggregatorDashboardService {
  aggregatorDashboard = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_DASHBOARD
      )
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }

  selectedClientWalletDetails = async (data: any) => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_WALLET_DETAILS,
        { params: data }
      )
      return new AggregatorDashboardModel().modifySelectedClientWalletDetails(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  aggregatorRedeemedCouponsReport = async (data: any) => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGRATOR_REDEEMED_COUPONS,
        { params: data }
      )
      return new AggregatorDashboardModel().aggregatorRedeemedCouponsData(
        response?.data?.data
      )
    } catch (error) {
      return error
    }
  }

  recharges = async (data: any) => {
    try {
      const response = await HTTPService.getRequest(APIURLS.RECHARGES, {
        params: data,
      })
      return new AggregatorDashboardModel().modifyRechargedata(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }
}
