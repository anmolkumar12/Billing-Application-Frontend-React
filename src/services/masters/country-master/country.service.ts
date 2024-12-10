import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class CountryMasterService {
  getCountryMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_COUNTRY_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }
  // deactivateAccountsMaster = async (data: any) => {
  //   try {
  //     const body = {
  //       accountId: data.account_id,
  //       isActive: 0,
  //       updatedBy: AuthService?.userInfo?.value?.userId,
  //     }

  //     const response = await HTTPService.postRequest(
  //       APIURLS.TOGGLE_ACCOUNTS_STATUS,
  //       body
  //     )
  //     return response?.data
  //   } catch (err) {
  //     return {}
  //   }
  // }
}
