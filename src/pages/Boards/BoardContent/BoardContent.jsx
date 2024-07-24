import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOder } from '~/utils/sorts'
import {
  DndContext,
  DragOverlay,
  // MouseSensor,
  PointerSensor,
  // TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensor'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generatePlacehoderCard } from '~/utils/formatters'
const ACTIVE_DRAP_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAP_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAP_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // Yêu cầu chuột di chuyển 10px mới kích hoạt event kéo thả
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }
  })
  // Yêu cầu chuột di chuyển 10px thì kích hoạt event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  // Nhấn giữ 250ms và dung sai của cảm ứng 500 thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 }
  })
  // Ưu tiên sử dụng kết hợp 2 loại sensors là touch và mouse sensor để có thể trải nghiệm trên mobile tốt nhất.
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  // Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // điểm va chạm cuối cùng trước đó ( xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // Tìm một cái Column theo CardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nếu dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver
    // chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }
  // Function chung xử lý việc cậP nhật lại state trong trường hợp di chuyển card giữa các column
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)
      // Logic tính toán 'cardIndex mới ' (trên hoặc dướI của overCard) từ thư viện DndKit
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại
      // OrderedColumnsState mớI
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)
      // nextActiveColumn: column cũ
      if (nextActiveColumn) {
        // Xoá card ở cái column active (cũng có thể hiểu là column cũ), lúc kéo card ra khỏi column cũ sang column mới
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )

        // Thêm Placeholder Card nếu mảng column bị rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlacehoderCard(nextActiveColumn)]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }
      // nextOverColumn: column mới
      if (nextOverColumn) {
        //Kiểm tra xem card đang kéo nó có tồn tạ ở overColumn chưa, nếu có thì cần xoá nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        // Đối với trường hợp drapEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi
        // kéo card giữa 2 column khác nhau.
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Tiếp theo ta cần thêm card đang kéo vào overColumn theo vị trí index mới
        // array.tospliced(index,deleteCount,data)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        // Xoá cái Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard)
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }
      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAP_ITEM_TYPE.CARD
        : ACTIVE_DRAP_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // Trigger trong quá trình kéo một phần tử
  const handleDragOver = (e) => {
    // Không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các column
    // console.log('handleDragOver', e)
    const { active, over } = e
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì -> tránh crash trang
    if (!active || !over) return
    // activeDraggingCard: là cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    // overcard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column khi đang kéo thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return
    //Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau,
    //còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì ở đây đang là đoạn xử lý lúc kéo (handleDragOver)
    // còn xử lý kéo xong xuôi thì nó lại là vấn đề khác ở lúc thả (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  // Trigger trong quá trình thả một phần tử
  const handleDragEnd = (e) => {
    // console.log('handleDragEnd: ', e)
    const { active, over } = e

    if (!active || !over) return

    // Xử lí kéo thả card

    if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.CARD) {
      // activeDraggingCard: là cái card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      // overcard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
      const { id: overCardId } = over

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column khi đang kéo thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Lấy vị trí cũ từ thằng oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )

        // Lấy vị trí mới từ thằng overColumn
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId)
        // Dùng arrayMove vì kéo card trong một column thì tương tự logic kéo column trong một board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard, oldCardIndex, newCardIndex)
        setOrderedColumns((prevColumns) => {
          // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại
          // OrderedColumnsState mớI
          const nextColumns = cloneDeep(prevColumns)

          // Tìm tới cái column mà chúng ta đang thả
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)

          // Trả về giá trị state mới
          return nextColumns
        })
      }
    }
    // Xử lí kéo thả column
    if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) {
      //Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ từ thằng active
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)

        // Lấy vị trí mới từ thằng active
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemData(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setOldColumnWhenDraggingCard(null)
  }
  /**
   * Animation khi thả phần tử
   */
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  // Chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều column
  // vì khi kéo card ở giữa column sẽ bị flickering
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)
      // eslint-disable-next-line no-extra-boolean-cast
      if (!pointerIntersections?.length) return

      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args)

      // Tìm overId trong đám pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        const checkColumn = orderedColumns.find((column) => column._id === overId)
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      // Nếu overId là null thì trả về mãng rỗng - tránh crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )
  return (
    <DndContext
      // Cảm biến
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có nó thì card vs cover lớn sẽ không kéo qua column được
      // vì lúc này nó đang bị conflict giữa card và column), sử dụng closestCorners thay vì closestCenter
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,

          bgcolor: (theme) => {
            return theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
          },
          p: '10px 0'
        }}>
        <ListColumns
          columns={orderedColumns}
          createNewCard={createNewCard}
          createNewColumn={createNewColumn}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemId || !activeDragItemType) && null}
          {activeDragItemId && activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemId && activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
