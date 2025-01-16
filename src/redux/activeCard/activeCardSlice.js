import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      return {
        ...state,
        isShowModalActiveCard: true
      }
    },
    clearAndHideCurrentActiveCard: (state) => {
      return {
        ...state,
        currentActiveCard: null,
        isShowModalActiveCard: false
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

export const { clearAndHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

export function selectCurrentActiveCard(state) {
  return state.activeCard.currentActiveCard
}

export function selectIsShowModalActiveCard(state) {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
