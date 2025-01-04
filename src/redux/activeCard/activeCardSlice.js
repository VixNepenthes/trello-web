import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      return {
        ...state,
        currentActiveCard: null
      }
    },
    updateCurrentActiveCard: (state, action) => {
      return {
        ...state,
        currentActiveCard: action.payload
      }
    }
  }
})

export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export function selectCurrentActiveCard(state) {
  return state.activeCard.currentActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
