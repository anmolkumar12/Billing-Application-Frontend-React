import moment from "moment";
import { APIURLS } from "../../../constants/ApiUrls";
import { AuthService } from "../../auth-service/auth.service";
import { HTTPService } from "../../http-service/http-service";

export class SalesMasterService {
  getSalesMaster = async (countryId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_SALES_MASTER, {
        countryId: countryId ? countryId : null,
      });
      return response?.data;
    } catch (err) {
      return {};
    }
  };

  createSalesMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_SALES_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  updateSalesMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_SALES_MASTER,
        formData
      );

      return response?.data;
    } catch (error) {
      return error;
    }
  };

  deactivateSalesMaster = async (data: any) => {
    try {
      const body = {
        salesManagerId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
        deactivationDate:data?.deactivationDate?moment(new Date(data?.deactivationDate)).format('YYYY-MM-DD'): null
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_SALES_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  };
}
