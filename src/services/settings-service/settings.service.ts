import { APIURLS } from '../../constants/ApiUrls'
import { HTTPService } from '../http-service/http-service'
import { SettingModel } from './settings.model'
const settingModel = new SettingModel()
export class SettingService {
  brands = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.BRANDS)
      return settingModel.brandData(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  addBrand = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.BRANDS, data)
      return response
    } catch (error) {
      return {}
    }
  }

  conversion = async () => {
    try {
      const response = await HTTPService.getRequest(APIURLS.CONVERSION)
      return settingModel.conversionCurrencyData(response?.data?.data)
    } catch (error) {
      return {}
    }
  }

  addConversion = async (data: any) => {
    try {
      const response = await HTTPService.postRequest(APIURLS.CONVERSION, data)
      return response?.data
    } catch (error) {
      return {}
    }
  }

  updateBrand = async (data: any) => {
    try {
      const response = HTTPService.putRequest(APIURLS.BRANDS, data)
      return response
    } catch (error) {
      return {}
    }
  }
}
