import ExpandMore from '@mui/icons-material/ExpandMore'
import AddCard from '@mui/icons-material/AddCard'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForever from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import DragHandle from '@mui/icons-material/DragHandle'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Close from '@mui/icons-material/Close'

import { useState } from 'react'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
function Column({ column }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column?._id,
    data: { ...column }
  })
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  function toggleOpenNewCardForm() {
    setOpenNewCardForm(!openNewCardForm)
  }
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  async function addNewCard() {
    if (!newCardTitle) {
      toast.error('Please enter Card title', { position: 'bottom-right' })
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn = useConfirm()
  function handleDeleteColumn() {
    confirmDeleteColumn({
      title: 'Delete column',
      description: 'This action will permanently delete your column and its cards. Confirm ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // allowClose: false,
      // dialogProps: {
      //   maxWidth: 'xs'
      // },
      // confirmationButtonProps: {
      //   color: 'secondary',
      //   variant: 'outlined'
      // },
      // cancellationButtonProps: {
      //   color: 'inherit'
      // },
      // confirmationKeyword: 'videv'
    })
      .then(() => {
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter((columnItem) => columnItem._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== column._id)
        dispatch(updateCurrentActiveBoard(newBoard))

        deleteColumnDetailsAPI(column._id).then((res) => {
          toast.success(res?.deleteResult)
        })
      })
      .catch(() => {})
  }

  function onUpdateColumnTitle(newTitle) {
    const newColumnData = {
      title: newTitle
    }
    updateColumnDetailsAPI(column._id, newColumnData).then(() => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find((columnItem) => columnItem._id === column._id)
      if (columnToUpdate) {
        columnToUpdate.title = newTitle
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => {
            return theme.palette.mode === 'dark' ? '#333643' : theme.palette.primary[50]
          },
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <ToggleFocusInput value={column?.title} onChangedValue={onUpdateColumnTitle} data-no-dnd="true" />
          <Box>
            <Tooltip title="More Options">
              <ExpandMore
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer'
                }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}>
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {
                      color: 'success.light'
                    }
                  }
                }}
                onClick={toggleOpenNewCardForm}>
                <ListItemIcon>
                  <AddCard fontSize="small" className="add-card-icon" />
                </ListItemIcon>
                <ListItemText>Add new Card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}>
                <ListItemIcon>
                  <DeleteForever fontSize="small" className="delete-forever-icon" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <ListCards cards={orderedCards} />
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}>
          {!openNewCardForm ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%'
              }}>
              <Button startIcon={<AddCard />} onClick={toggleOpenNewCardForm}>
                Add new Card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandle sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
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
                  flexDirection: 'row',
                  gap: 1
                }}>
                <TextField
                  label="Enter card title"
                  type="text"
                  size="small"
                  variant="outlined"
                  autoFocus
                  data-no-dnd="true"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  sx={{
                    '& label': { color: 'text.primary' },
                    '& input': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: (theme) => theme.palette.primary.main
                      },
                      '&:hover fieldset': {
                        borderColor: (theme) => theme.palette.primary.main
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: (theme) => theme.palette.primary.main
                      },
                      '& .MuiOutlinedInput-input': {
                        borderRadius: 1
                      }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    className="interceptor-loading"
                    onClick={addNewCard}
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                    }}>
                    Add
                  </Button>
                  <Close
                    onClick={toggleOpenNewCardForm}
                    fontSize="small"
                    sx={{
                      color: (theme) => theme.palette.warning.light,
                      cursor: 'pointer'
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
