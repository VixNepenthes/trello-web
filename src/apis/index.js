import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

// Board
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  //   Axios will return result through its property: data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //   Axios will return result through its property: data
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  //   Axios will return result through its property: data
  return response.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  //   Axios will return result through its property: data
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  //   Axios will return result through its property: data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  //   Axios will return result through its property: data
  return response.data
}

// Card
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  //   Axios will return result through its property: data
  return response.data
}

export const registerUserAPI = async (newUserData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, newUserData)
  toast.success('Register successfully! Please check your email to verify account.', {
    theme: 'colored'
  })
  //   Axios will return result through its property: data
  return response.data
}

export const verifyUserAPI = async (verifyData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, verifyData)
  toast.success('Verify successfully! Please login to continue.', { theme: 'colored' })
  //   Axios will return result through its property: data
  return response.data
}
