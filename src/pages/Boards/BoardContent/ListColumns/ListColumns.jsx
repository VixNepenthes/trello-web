/* eslint-disable no-console */
import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Column from './Column/Column'
import NoteAdd from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import Close from '@mui/icons-material/Close'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
// import theme from '~/theme'
function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title')
      return
    }

    // Tạo dữ liệu column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    // advance: using redux to bring data Board out to redux global store

    await createNewColumn(newColumnData)

    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
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
          <Column column={column} key={column._id} createNewCard={createNewCard} />
        ))}
        {/* Column 1 */}
        {/* <Column /> */}
        {/* Box add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
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
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
            <TextField
              label="Enter column title"
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                // minWidth: '120px',
                // maxwidth: '180px',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  },
                  '&:hover fieldset': {
                    borderColor: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white'
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}>
                Add Column
              </Button>
              <Close
                onClick={toggleOpenNewColumnForm}
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: (theme) => theme.palette.warning.light }
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
