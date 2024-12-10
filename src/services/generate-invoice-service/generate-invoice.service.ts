import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { GenerateInvoiceModel } from './generate-invoice.model'

export class GenerateInvoiceService {
  invoiceTableData = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.GENERATE_INVOICE_NUMBER_TABLE_DATA
      )
      return new GenerateInvoiceModel().modifyInvoiceTableData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  submitInvoiceForm = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.INVOICE_FORM_SUBMIT,
        data
      )
      return response
    } catch (error) {
      return {}
    }
  }
}
