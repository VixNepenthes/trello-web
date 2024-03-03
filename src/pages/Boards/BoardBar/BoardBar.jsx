import Dashboard from '@mui/icons-material/Dashboard'
import VpnLock from '@mui/icons-material/VpnLock'
import AddToDrive from '@mui/icons-material/AddToDrive'
import Bolt from '@mui/icons-material/Bolt'
import FilterList from '@mui/icons-material/FilterList'
import PersonAdd from '@mui/icons-material/PersonAdd'

import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

import avatar from '~/assets/270236317_2954352121449240_2744543041549082339_n-modified.png'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  }
  // '&:hover .MuiSvgIcon-root': {
  //     bgcolor: 'transparent',
  // },
}

function BoardBar() {
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
          return theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
        }
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip sx={MENU_STYLE} icon={<Dashboard />} label="Vĩ Dev" clickable />
        <Chip sx={MENU_STYLE} icon={<VpnLock />} label="Public/Private Workspace" clickable />
        <Chip sx={MENU_STYLE} icon={<AddToDrive />} label="Add to Google Drive" clickable />
        <Chip sx={MENU_STYLE} icon={<Bolt />} label="Automation" clickable />
        <Chip sx={MENU_STYLE} icon={<FilterList />} label="Filter" clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAdd />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}>
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0de'
              }
            }
          }}>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>
          <Tooltip title="Vix Dev">
            <Avatar src={avatar} alt="TienViDev"></Avatar>
          </Tooltip>

          <Avatar src={avatar} alt="TienViDev"></Avatar>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
