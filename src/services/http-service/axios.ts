import axios from 'axios'
import { TokenService } from '../token-service/token-service'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { ToasterService } from '../toaster-service/toaster-service'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'

const baseUrl = `${process.env.REACT_APP_API_BASEURL}/`
const apiKey = 'aqowf9iavo2hoig0fyi0w3q4mzw7nopic858xbuc'

export let axiosInstance: any
// eslint-disable-next-line prefer-const
axiosInstance = axios.create({
  baseURL: baseUrl,
})
axiosInstance.defaults.headers.common['x-api-key'] = apiKey
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = TokenService().getAccessToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    const domain = TokenService().getDomain()
    if (domain) {
      config.headers['x-subdomain'] = domain
    }
    const origin = TokenService().getOrigin()
    if (origin) {
      config.headers['x-origin'] = origin
    }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response
  },
  (error: any) => {
    if (
      error?.response?.data?.message &&
      typeof error?.response?.data?.message === 'string'
    ) {
      ToasterService.show(error?.response?.data?.message, 'error')
    }
    if (error?.response?.status === HTTP_RESPONSE.UNAUTHORIZED) {
      useHistory().replace(ROUTE_CONSTANTS.LOGIN)
    }
    return Promise.reject(error)
  }
)
