// import axios from 'axios'
import { axiosInstance } from './axios'

export const HTTPService = {
  postRequest: (url: string, body?: any) => {
    console.log('url', url, 'body', body)
    return axiosInstance.post(url, body)
  },

  getRequest: (url: string, options?: any) => {
    return axiosInstance.get(url, options)
  },

  deleteRequest: (url: string, body?: any) => {
    return axiosInstance.delete(url, body)
  },

  putRequest: (url: string, body?: any) => {
    return axiosInstance.put(url, body)
  },
}
