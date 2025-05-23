import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  function moveColumn(dndOrderedColumns) {
    // Update data state board full
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)

    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  function moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, columnId) {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /* When moving card to another column:
  1. cập nhật mảng cardorderids của column ban đầu ( xoá _id card khỏi mảng)
  2. cập nhật mảng cardorderids của column tiếp theo (thêm _id vào mảng)
  3. cập nhật lại columnId mới của card đã kéo => thêm 1 api riêng
  */
  function moveCardToDifferentColumn(currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) {
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)

    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lý phía BE
    // xử lý vấn đề khi kéo card cuối ra khỏi column rỗng, khi column rỗng sẽ có placeholdercard
    // cần xoá nó đi trước khi gửi lên BE
    let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading board..." />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <ActiveCard />
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} moveColumn={moveColumn} moveCardInTheSameColumn={moveCardInTheSameColumn} moveCardToDifferentColumn={moveCardToDifferentColumn} />
    </Container>
  )
}

export default Board
