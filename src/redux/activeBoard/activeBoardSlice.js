import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { generatePlacehoderCard } from '~/utils/formatters'
import { isEmpty, update } from 'lodash'
import { mapOder } from '~/utils/sorts'

const initialState = {
  currentActiveBoard: null
}

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
})

// Init slice in redux store
const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      return {
        ...state,
        currentActiveBoard: action.payload
      }
    },
    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload
      const column = state.currentActiveBoard.columns.find((columnItem) => columnItem._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find((cardItem) => cardItem._id === incomingCard._id)
        if (card) {
          Object.keys(incomingCard).forEach((key) => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      const board = action.payload
      board.columns = mapOder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach((column) => {
        // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlacehoderCard(column)]
          column.cardOrderIds = [generatePlacehoderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các comp con
          column.cards = mapOder(column.cards, column.cardOrderIds, '_id')
        }
      })
      return {
        ...state,
        currentActiveBoard: board
      }
    })
  }
})

export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

export function selectCurrentActiveBoard(state) {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer
