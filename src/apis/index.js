import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

// Board
export async function fetchBoardDetailsAPI(boardId) {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  //   Axios will return result through its property: data
  return response.data
}

export async function updateBoardDetailsAPI(boardId, updateData) {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //   Axios will return result through its property: data
  return response.data
}

export async function moveCardToDifferentColumnAPI(updateData) {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  //   Axios will return result through its property: data
  return response.data
}

// Column
export async function createNewColumnAPI(newColumnData) {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  //   Axios will return result through its property: data
  return response.data
}

export async function updateColumnDetailsAPI(columnId, updateData) {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  //   Axios will return result through its property: data
  return response.data
}

export async function deleteColumnDetailsAPI(columnId) {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  //   Axios will return result through its property: data
  return response.data
}

// Card
export async function createNewCardAPI(newCardData) {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  //   Axios will return result through its property: data
  return response.data
}

export async function registerUserAPI(newUserData) {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, newUserData)
  //   Axios will return result through its property: data
  return response.data
}

export async function verifyUserAPI(verifyData) {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, verifyData)
  toast.success('Verify successfully! Please login to continue.', { theme: 'colored' })
  //   Axios will return result through its property: data
  return response.data
}

export async function refreshTokenAPI() {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh-token`)
  return response.data
}

export async function fetchBoardsAPI(searchPath) {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export async function createNewBoardAPI(data) {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  return response.data
}
