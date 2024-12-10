import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { ManageStoreModel } from './manage-store.model'
export class ManageStoreService {
  storeRechargeTableData = async () => {
    try {
      const response = await HTTPService.getRequest(
        APIURLS.STORE_RECHARGE_TABLE_DATA
      )
      return new ManageStoreModel().modifyStoreRechargeTableData(
        response?.data?.data
      )
    } catch (error) {
      return {}
    }
  }

  addStoreRechage = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.ADD_STORE_RECHARGE,
        data
      )
      return response
    } catch (error) {
      return {}
    }
  }

  storeCardData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.STORE_CARD_DATA)
      return response?.data?.data
    } catch (error) {
      return {}
    }
  }
}
