import { APIURLS } from '../../../constants/ApiUrls';
import { HTTPService } from '../../http-service/http-service';

export default class CurrencyMasterService {
  /**
   * Fetches currency master data
   * @returns Currency master records
   */
  getCurrencyMasterData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_CURRENCY_MASTER);
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  /**
   * Creates or updates a currency master record
   * @param formData Form data for currency
   * @returns Created or updated record
   */
  createCurrencyMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_CURRENCY_MASTER : APIURLS.CREATE_CURRENCY_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  /**
   * Activates or deactivates a currency master record
   * @param data Activation or deactivation details
   * @returns Response data
   */
  activateDeactivateCurrencyMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CURRENCY_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
