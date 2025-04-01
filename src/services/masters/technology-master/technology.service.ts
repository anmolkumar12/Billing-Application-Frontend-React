import { APIURLS } from '../../../constants/ApiUrls'
// import { AuthService } from '../../auth-service/auth.service'
import { HTTPService } from '../../http-service/http-service'

export class TechnologyMasterService {
  getTechnologyGroupMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_TECHNOLOGY_GROUP_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createTechnologyGroupMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_TECHNOLOGY_GROUP_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateTechnologyGroupMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_TECHNOLOGY_GROUP_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateTechnologyGroupMaster = async (data: any) => {
    try {
      const body = {
        groupId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_TECHNOLOGY_GROUP_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  getTechnologySubGroupMaster = async (techGroupId?: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_TECHNOLOGY_SUBGROUP_MASTER, {
        techGroupId: techGroupId ? techGroupId : null,
      })
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createTechnologySubGroupMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_TECHNOLOGY_SUBGROUP_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateTechnologySubGroupMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_TECHNOLOGY_SUBGROUP_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateTechnologySubGroupMaster = async (data: any) => {
    try {
      const body = {
        subgroupId: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_TECHNOLOGY_SUBGROUP_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }

  getTechnologyMaster = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_TECHNOLOGY_MASTER)
      return response?.data
    } catch (err) {
      return {}
    }
  }

  createTechnologyMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.CREATE_TECHNOLOGY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  updateTechnologyMaster = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_TECHNOLOGY_MASTER,
        formData
      )

      return response?.data
    } catch (error) {
      return error
    }
  }

  deactivateTechnologyMaster = async (data: any) => {
    try {
      const body = {
        id: data.id,
        isActive: !data.isActive,
        updatedBy: data?.loggedInUserId,
      }

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_TECHNOLOGY_STATUS,
        body
      )
      return response?.data
    } catch (err) {
      return {}
    }
  }
}
