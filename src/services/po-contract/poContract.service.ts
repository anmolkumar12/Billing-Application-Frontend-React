import { APIURLS } from '../../constants/ApiUrls';
import { HTTPService } from '../http-service/http-service';

export class PoContractService {
  // Fetch all PO Contracts
  getPoContractsData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_PO_CONTRACTS);
      return response?.data;
    } catch (err) {
      console.error('Error fetching PO Contracts:', err);
      return {};
    }
  };

  // Create a new PO Contract
  createPoContract = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_PO_CONTRACT,
        formData
      );
      return response?.data;
    } catch (error) {
      console.error('Error creating PO Contract:', error);
      return error;
    }
  };

  // Update an existing PO Contract
  updatePoContract = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_PO_CONTRACT,
        formData
      );
      return response?.data;
    } catch (error) {
      console.error('Error updating PO Contract:', error);
      return error;
    }
  };

  // Activate/Deactivate a PO Contract
  activateDeactivatePoContract = async (data: any) => {
    try {
      const body = {
        contractId: data.id, // Assuming `id` represents the PO Contract ID
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_PO_CONTRACT_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      console.error('Error activating/deactivating PO Contract:', err);
      return {};
    }
  };
  getPoContractConfiguration = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_PO_CONTRACT_CONFIGURATION, {})
      return response?.data
    } catch (err) {
      return {}
    }
  }
  getPOContractMasterConfigData  = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_PO_MASTER_CONFIG_DATA, {})
      return response
    } catch (err) {
      return {}
    }
  }

  getPOContractMasterCascadingData  = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_PO_CONTRACT_CASCADING_DATA, {})
      return response
    } catch (err) {
      return {}
    }
  }
  
  
}
