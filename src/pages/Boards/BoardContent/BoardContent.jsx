import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
function BoardContent(props) {
  const { board } = props
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

  useEffect(() => {
    setOrderedColumns(
      mapOder(board?.columns, board?.columnOrderIds, '_id')
    )
  }, [board])
  const handleDragEnd = (e) => {
    console.log('handleDragEnd: ', e)
    const { active, over } = e
    if (!over) return

    //Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy vị trí cũ từ thằng active
      const oldIndex = orderedColumns.findIndex(
        (c) => c._id === active.id
      )

      // Lấy vị trí mới từ thằng active
      const newIndex = orderedColumns.findIndex(
        (c) => c._id === over.id
      )
      const dndOrderedColumns = arrayMove(
        orderedColumns,
        oldIndex,
        newIndex
      )

      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          width: '100%',
          height: (theme) =>
            theme.trello.boardContentHeight,

          bgcolor: (theme) => {
            return theme.palette.mode === 'dark'
              ? '#34495e'
              : '#1976d2'
          },
          p: '10px 0'
        }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
