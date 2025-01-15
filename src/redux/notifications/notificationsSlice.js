import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

export const fetchInvitationsAPI = createAsyncThunk('notifications/fetchInvitationsAPI', async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`)
  return response.data
})

export const updateBoardInvitationAPI = createAsyncThunk('notifications/updateBoardInvitationAPI', async ({ status, invitationId }) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
  return response.data
})

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      state.currentNotifications.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      const incomingInvitations = action.payload
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations?.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      const getInvitation = state.currentNotifications.find((notification) => notification._id === incomingInvitation._id)
      if (getInvitation) {
        getInvitation.boardInvitation = incomingInvitation.boardInvitation
      }
    })
  }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions
export function selectCurrentNotifications(state) {
  return state.notifications.currentNotifications
}
export const notificationsReducer = notificationsSlice.reducer
