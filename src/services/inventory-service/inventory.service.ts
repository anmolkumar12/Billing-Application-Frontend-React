import { APIURLS } from '../../constants/ApiUrls'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { HTTPService } from '../http-service/http-service'
import { InventoryModel } from './inventory.model'

export const InventoryService = {
  getInventory: async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.LOGIN)
      return response?.data
    } catch (err) {
      return {}
    }
  },
  paymentList: async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.VOUCHER_PAYMENT)
      if (
        response?.data?.data?.length &&
        response?.data?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS
      ) {
        response?.data?.data?.forEach((element: any) => {
          element['label'] = element?.invoiceNumber
          element['value'] = element?.id?.toString()
        })
      }
      return response?.data?.data
    } catch (error) {
      return {}
    }
  },
  voucherList: async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.VOUCHERS)
      return new InventoryModel().modifyVoucherList(response?.data?.data?.data)
    } catch (error) {
      return {}
    }
  },
  voucherExcelParse: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.VOUCHER_EXCEL_PARSE,
        data
      )
      return response?.data
    } catch (err: any) {
      return err?.response?.data
    }
  },
  voucherExcelAdd: async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.VOUCHER_EXCEL_ADD,
        data
      )
      return response?.data
    } catch (err: any) {
      return err?.response?.data
    }
  },
  voucherExpiring: async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.VOUCHER_EXPIRING)
      return response?.data
    } catch (error) {
      return {}
    }
  },
  brandWiseInventory: async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.BRAND_WISE_INVENTORY
      )
      return response?.data
    } catch (error) {
      return {}
    }
  },
}
