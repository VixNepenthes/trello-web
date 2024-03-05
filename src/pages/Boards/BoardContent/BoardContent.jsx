import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOder } from '~/utils/sorts'
function BoardContent(props) {
  const orderedColumns = mapOder(
    board?.columns,
    board?.columnOrderIds,
    '_id'
  )
  const { board } = props
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,

        bgcolor: (theme) => {
          return theme.palette.mode === 'dark'
            ? '#34495e'
            : '#1976d2'
        },
        p: '10px 0'
      }}>
      <ListColumns columns={orderedColumns} />
    </Box>
  )
}

export default BoardContent
