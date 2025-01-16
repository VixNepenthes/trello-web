import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AppsIcon from '@mui/icons-material/Apps'
import HelpOutline from '@mui/icons-material/HelpOutline'
import LibraryAdd from '@mui/icons-material/LibraryAdd'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import { ReactComponent as trelloLogo } from '~/assets/trello.svg'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Profile from './Menus/Profile'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
function AppBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => {
          return theme.trello.appBarHeight
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        backgroundColor: (theme) => {
          return theme.palette.mode === 'dark' ? '#2c3e50' : theme.palette.primary[600]
        }
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to={'/boards'}>
          <Tooltip title="Board List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>

        <Link to={'/'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={trelloLogo} inheritViewBox sx={{ color: 'white' }} />
            <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
              Trello
            </Typography>
          </Box>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Started />
          <Templates />
          <Button sx={{ color: 'white', border: 'none', '&:hover': { border: 'none' } }} variant="outlined" startIcon={<LibraryAdd />}>
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard/>
        <ModeSelect />
        <Notifications />
        <Tooltip title="Help">
          <HelpOutline sx={{ color: 'white', cursor: 'pointer' }} />
        </Tooltip>
        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
