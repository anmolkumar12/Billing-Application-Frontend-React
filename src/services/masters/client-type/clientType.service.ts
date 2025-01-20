import { APIURLS } from '../../../constants/ApiUrls';
import { HTTPService } from '../../http-service/http-service';

export class ClientTypeMasterService {
  getClientTypeMasterData = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_CLIENT_TYPE_MASTER);
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  createClientTypeMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ?APIURLS.UPDATE_CLIENT_TYPE_MASTER:APIURLS.CREATE_CLIENT_TYPE_MASTER,
        formData
      );
      return response?.data;
    } catch (error) {
      return error;
    }
  };

  updateClientTypeMasterData = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CLIENT_TYPE_MASTER,
        formData
      );
      return response?.data;
    } catch (error) {
      return error;
    }
  };

  activateDeactivateClientTypeMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CLIENT_TYPE_MASTER_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
