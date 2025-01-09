import { APIURLS } from '../../../constants/ApiUrls';
import { AuthService } from '../../auth-service/auth.service';
import { HTTPService } from '../../http-service/http-service';

export default class FinancialYearMasterService {
  /**
   * Fetches financial year master data
   * @returns Financial year master records
   */
  getFinancialYearMasterData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_FINANCIAL_YEAR_MASTER);
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  /**
   * Creates or updates financial year master record
   * @param formData Form data for financial year
   * @returns Created or updated record
   */
  createFinancialYearMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_FINANCIAL_YEAR_MASTER : APIURLS.CREATE_FINANCIAL_YEAR_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  /**
   * Activates or deactivates financial year master record
   * @param data Activation or deactivation details
   * @returns Response data
   */
  activateDeactivateFinancialYearMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_FINANCIAL_YEAR_MASTER_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
