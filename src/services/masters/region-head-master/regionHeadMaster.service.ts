import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export default class RegionHeadMasterService {
    getRegionHeadMaster = async (companyId?: any) => {
        try {
            const response = await HTTPService.postRequest(
                APIURLS.GET_REGION_HEAD_MASTER,
                { companyId: companyId ? companyId : null }
            );
            return response?.data;
        } catch (err) {
            return err;
        }
    };

    createRegionHeadMaster = async (formData: any) => {
        try {
            const response = await HTTPService.postRequest(
                APIURLS.CREATE_REGION_HEAD_MASTER,
                formData
            );

            return response?.data;
        } catch (error) {
            return error;
        }
    };

    updateRegionHeadMaster = async (formData: any) => {
        try {
            const response = await HTTPService.postRequest(
                APIURLS.UPDATE_REGION_HEAD_MASTER,
                formData
            );

            return response?.data;
        } catch (error) {
            return error;
        }
    };

    deactivateRegionHeadMaster = async (data: any) => {
        try {
          const body = {
            regionHeadId: data.id,
            isActive: !data.isActive,
            updatedBy: data?.loggedInUserId,
          };
          const response = await HTTPService.postRequest(
            APIURLS.TOGGLE_REGION_HEAD_STATUS,
            body
          );
          return response?.data;
        } catch (err) {
          return err;
        }
      };
}
