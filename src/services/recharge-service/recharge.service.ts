import { RechargeModel } from './recharge.model'
import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { async } from 'rxjs'

const rechargeModel = new RechargeModel()
export class RechargeService {
  recharges = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.RECHARGES)
      return rechargeModel.modifyRechargedata(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  addRecharge = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.ADD_RECHARGE, data)
      return response
    } catch (error) {
      return {}
    }
  }

  lastRecharge = async (data: any) => {
    try {
      const response = await HTTPService.getRequest(APIURLS.LAST_RECHARGE, {
        params: data,
      })
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }

  invoiceNumberList = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.AGGREGATOR_INVOICE_NUMBER
      )
      return rechargeModel.modifyInvoiceNumberList(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  pendingInvoice = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.PENDING_INVOICES)
      return rechargeModel.modifyPendingInvoiceData(response?.data?.data)
    } catch (error) {
      return {}
    }
  }
}
