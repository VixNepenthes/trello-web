import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Column from './Column/Column'
import NoteAdd from '@mui/icons-material/NoteAdd'

function ListColumns({ columns }) {
  return (
    <Box
      sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hiden',
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}>
      {columns?.map((column) => (
        <Column column={column} key={column._id} />
      ))}
      {/* Column 1 */}
      {/* <Column /> */}
      {/* Box add new column */}
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
        <Button
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.5,
            py: 1
          }}
          startIcon={<NoteAdd />}>
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns
