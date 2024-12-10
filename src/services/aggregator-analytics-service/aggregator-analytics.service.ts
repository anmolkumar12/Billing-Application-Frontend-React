import { HTTPService } from './../http-service/http-service'
import { APIURLS } from '../../constants/ApiUrls'
import { AggregatorAnalyticsModel } from './aggregator-analytics.model'

export class AggregatorAnalyticsService {
  paymentData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.AGGREGATOR_PAYMENT)
      return new AggregatorAnalyticsModel().aggregatorPaymentData(
        response?.data?.data
      )
    } catch (error) {
      return error
    }
  }

  clientData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.AGGREGATOR)
      return new AggregatorAnalyticsModel().clientDashboardData(
        response?.data?.data[0]
      )
    } catch (error) {
      return error
    }
  }

  clientWalletData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.AGGREGATOR)
      return response?.data?.data[0]?.walletData
    } catch (error) {
      return error
    }
  }

  rechargeRequestData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.RECHARGE_REQUEST)
      return new AggregatorAnalyticsModel().modifyRechargeRequestData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  approveRejectRechargeRequest = async (data: any) => {
    try {
      const response = await HTTPService.putRequest(
        APIURLS.APPROVE_REJECT_RECHARGE_REQUEST,
        data
      )
      return response
    } catch (error) {
      return {}
    }
  }

  addRecharge = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.AGGREGATOR_OFFLINE_RECHARGE,
        data
      )
      return response?.data
    } catch (error) {
      return {}
    }
  }

  clientInfo = async (data: any) => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_CLIENT_INFO,
        {
          params: data,
        }
      )
      return new AggregatorAnalyticsModel().modifyClientInfoData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  clientWiseRedeemInfo = async (data: any) => {
    // console.log('redeem', data)
    try {
      const response = await HTTPService.getRequest(APIURLS.REDEEMED_COUPONS, {
        params: data,
      })
      return new AggregatorAnalyticsModel().modifyClientInfoData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  clientWisePaymentInfo = async (data: any) => {
    // console.log('payment', data)
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_PAYMENT,
        {
          params: data,
        }
      )
      return new AggregatorAnalyticsModel().modifyWalletInfoData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  walletInfo = async (data: any) => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_WALLET_INFO,
        {
          params: data,
        }
      )
      return new AggregatorAnalyticsModel().modifyWalletInfoData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  invoiceNumberList = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_INVOICE_NUMBER
      )
      return new AggregatorAnalyticsModel().modifyInvoiceNumberList(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }
}
