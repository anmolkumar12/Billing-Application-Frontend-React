import { APIURLS } from "../../../constants/ApiUrls";
import { AuthService } from "../../auth-service/auth.service";
import { HTTPService } from "../../http-service/http-service";

export class StateMasterService {
  getStateMaster = async (countryId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_STATE_MASTER, {
        countryId: countryId ? countryId : null,
      });
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  createStateMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_STATE_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  updateStateMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_STATE_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  deactivateStateMaster = async (data: any) => {
    try {
      const body = {
        regionId: data.id,
        isActive: !data.isactive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_STATE_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
