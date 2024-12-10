import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { PaymentsModel } from './payments.model'
export class PaymentsService {
  paymentData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.PAYMENT)
      return new PaymentsModel().paymentDataModification(response?.data?.data)
    } catch (err) {
      return {}
    }
  }
  addPayment = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.PAYMENT, data)
      return response
    } catch (error) {
      return {}
    }
  }
  paymentVouchers = async (invoiceNumber: string) => {
    try {
      const response = await HTTPService.getRequest(APIURLS.PAYMENT_VOUCHER, {
        params: { search: 1, _invoiceNumber: invoiceNumber },
      })
      return new PaymentsModel().paymentVoucherModification(
        response?.data?.data?.data
      )
    } catch (error) {
      return {}
    }
  }
}
