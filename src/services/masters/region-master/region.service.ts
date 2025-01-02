import { APIURLS } from "../../../constants/ApiUrls";
import { AuthService } from "../../auth-service/auth.service";
import { HTTPService } from "../../http-service/http-service";

export class RegionMasterService {
  getRegionMaster = async (countryId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_REGION_MASTER, {
        countryId: countryId ? countryId : null,
      });
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  createRegionMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_REGION_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  updateRegionMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_REGION_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  deactivateRegionMaster = async (data: any) => {
    try {
      const body = {
        stateId: data.id,
        isActive: !data.isactive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_REGION_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
