import moment from "moment";
import { APIURLS } from "../../../constants/ApiUrls";
import { AuthService } from "../../auth-service/auth.service";
import { HTTPService } from "../../http-service/http-service";

export class AccountMasterService {
  getAccountMaster = async (countryId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_ACCOUNT_MANAGER_MASTER, {
        countryId: countryId ? countryId : null,
      });
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  createAccountMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_ACCOUNT_MANAGER_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  updateAccountMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_ACCOUNT_MANAGER_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  deactivateAccountMaster = async (data: any) => {
    try {
      const body = {
        salesManagerId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
        deactivationDate:data?.deactivationDate?moment(new Date(data?.deactivationDate)).format('YYYY-MM-DD'): null
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_ACCOUNT_MANAGER_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
