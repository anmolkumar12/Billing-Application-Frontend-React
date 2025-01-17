import { APIURLS } from "../../../constants/ApiUrls";
import { AuthService } from "../../auth-service/auth.service";
import { HTTPService } from "../../http-service/http-service";

export class ClientContactMasterService {
  getClientContactMaster = async (clientContactId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_CLIENT_CONTACT_MASTER, {
        clientContactId: clientContactId ? clientContactId : null,
      });
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  createClientContactMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CLIENT_CONTACT_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  updateClientContactMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CLIENT_CONTACT_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  deactivateClientContactMaster = async (data: any) => {
    try {
      const body = {
        clientContactId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CLIENT_CONTACT_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
