import Dashboard from '@mui/icons-material/Dashboard'
import VpnLock from '@mui/icons-material/VpnLock'
import AddToDrive from '@mui/icons-material/AddToDrive'
import Bolt from '@mui/icons-material/Bolt'
import FilterList from '@mui/icons-material/FilterList'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  }
  //   '&:hover.MuiSvgIcon-root': {
  //     bgcolor: 'primary.200'
  //   }
}

function BoardBar(props) {
  const { board } = props
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => {
          return theme.trello.boardBarHeight
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 2,
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => {
          return theme.palette.mode === 'dark' ? '#34495e' : theme.palette.primary[500]
        }
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
        <Tooltip title={board?.description}>
          <Chip sx={MENU_STYLE} icon={<Dashboard />} label={board?.title} clickable />
        </Tooltip>
        <Chip sx={MENU_STYLE} icon={<VpnLock />} label={capitalizeFirstLetter(board?.type)} clickable />
        <Chip sx={MENU_STYLE} icon={<AddToDrive />} label="Add to Google Drive" clickable />
        <Chip sx={MENU_STYLE} icon={<Bolt />} label="Automation" clickable />
        <Chip sx={MENU_STYLE} icon={<FilterList />} label="Filter" clickable />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
        <InviteBoardUser boardId={board?._id} />
        <BoardUserGroup boardUsers={board?.allUsersInBoard} />
      </Box>
    </Box>
  )
}

export default BoardBar
