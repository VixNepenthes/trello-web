import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use(
  function (config) {
    interceptorLoadingElements(true)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

authorizedAxiosInstance.interceptors.response.use(
  function (response) {
    interceptorLoadingElements(false)

    return response
  },
  function (error) {
    interceptorLoadingElements(false)

    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    if (error?.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
