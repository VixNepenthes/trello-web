import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login/`, data)
  return response.data
})

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout/`)
    if (showSuccessMessage) {
      toast.success('Logout successfully')
    }
    return response.data
  }
)

// Init slice in redux store
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      return {
        ...state,
        currentUser: action.payload
      }
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      return {
        ...state,
        currentUser: null
      }
    })
  }
})

export function selectCurrentUser(state) {
  return state.user.currentUser
}
export const userReducer = userSlice.reducer
