import moment from 'moment'
import { APIURLS } from '../../../constants/ApiUrls'
import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class IndustryMasterService {
  getProductionTypeMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_PRODUCTION_TYPE_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createProductionTypeMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_PRODUCTION_TYPE_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateProductionTypeMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_PRODUCTION_TYPE_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateProductionTypeMaster = async (data: any) => {
    try {
      const body = {
        productionTypeId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
        
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_PRODUCTION_TYPE_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  getIndustryMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_INDUSTRY_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createIndustryMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_INDUSTRY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateIndustryMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_INDUSTRY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateIndustryMaster = async (data: any) => {
    try {
      const body = {
        industryMasterId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_INDUSTRY_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  getIndustryGroupMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_INDUSTRY_GROUP_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createIndustryGroupMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_INDUSTRY_GROUP_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateIndustryGroupMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_INDUSTRY_GROUP_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateIndustryGroupMaster = async (data: any) => {
    try {
      const body = {
        groupIndustryId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_INDUSTRY_GROUP_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  getIndustryHeadMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_INDUSTRY_HEAD_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createIndustryHeadMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_INDUSTRY_HEAD_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateIndustryHeadMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_INDUSTRY_HEAD_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateIndustryHeadMaster = async (data: any) => {
    try {
      const body = {
        industryHeadId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_INDUSTRY_HEAD_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
