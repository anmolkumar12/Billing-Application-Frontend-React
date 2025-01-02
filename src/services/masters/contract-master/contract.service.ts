import { APIURLS } from '../../../constants/ApiUrls'
import { HTTPService } from '../../http-service/http-service'
import { AuthService } from '../../auth-service/auth.service'

export class ContractMasterService {
  getContractMaster = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.GET_CONTRACT_MASTER)
      return response?.data
    } catch (err) {
      return err
    }
  }

  createContractMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_CONTRACT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateContractMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CONTRACT_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateContractMaster = async (data: any) => {
    try {
      const body = {
        ContractId: data.id,
        isActive: !data.isactive,
        updatedBy: data?.loggedInUserId,
      }
      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CONTRACT_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return err
    }
  }
}
