import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class ClientMasterService {
  getClientMaster = async (clientId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_CLIENT_MASTER, { clientId: clientId ? clientId : null })
      
      return response?.data
    } catch (err) {
      return {}
    }
  }

  getClientBillToMaster = async (clientId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_CLIENT_BILL_TO_MASTER, { clientId: clientId ? clientId : null })
      return response?.data
    } catch (err) {
      return {}
    }
  }
  
  getClientShipToMaster = async (clientId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_CLIENT_SHIP_TO_MASTER, { clientId: clientId ? clientId : null })
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createClientMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CLIENT_MASTER,
        formData
      )
      return response?.data
    } catch (error) {
      return error
    }
  }

  createClientBillToMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CLIENT_BILL_TO_MASTER,
        formData
      )
      return response?.data
    } catch (error) {
      return error
    }
  }

  createClientShipToMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CLIENT_SHIP_TO_MASTER,
        formData
      )
      return response?.data
    } catch (error) {
      return error
    }
  }

  updateClientMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CLIENT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateClientBillToMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CLIENT_BILL_TO_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateClientShipToMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CLIENT_SHIP_TO_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateClientMaster = async (data: any) => {
    try {
      const body = {
        clientId: data.id,
        isActive: !data.isActive,
        updated_by: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CLIENT_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  deactivateClientBillToMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CLIENT_BILL_TO_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  deactivateClientShipToMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CLIENT_SHIP_TO_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }





  // Create Client Group
createClientGroupMaster = async (formData : any) => {
  try {
    const response = await HTTPService.postRequest(
      APIURLS.CREATE_CLIENT_GROUP,
      formData
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

// Update Client Group
updateClientGroupMaster = async (formData : any) => {
  try {
    const response = await HTTPService.postRequest(
      APIURLS.UPDATE_CLIENT_GROUP,
      formData
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

// Activate/Deactivate Client Group
toggleClientGroupStatus = async (data: any) => {
  try {
    const body = {
      id: data.id,
      isActive: !data.isActive,
      updatedBy: data?.loggedInUserId,
    };

    const response = await HTTPService.postRequest(
      APIURLS.TOGGLE_CLIENT_GROUP_STATUS,
      body
    );
    return response?.data;
  } catch (err) {
    return {};
  }
};

// Get All Client Groups
getClientGroupsMaster = async () => {
  try {
    const response = await HTTPService.getRequest(APIURLS.GET_CLIENT_GROUPS);
    return response?.data;
  } catch (error) {
    return error;
  }
};


updateMSAFile = async (formData: any) => {
  try {
    const response = await HTTPService.postRequest(
      APIURLS.UPDATE_MSA_FILE,
      formData
    )
    return response?.data
  } catch (error) {
    return error
  }
}

}
