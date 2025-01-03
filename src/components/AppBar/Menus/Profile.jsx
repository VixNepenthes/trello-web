import Logout from '@mui/icons-material/Logout'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/PersonAdd'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import avatar from '~/assets/270236317_2954352121449240_2744543041549082339_n-modified.png'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'
function Profile() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const confirmLogout = useConfirm()
  function handleLogout() {
    confirmLogout({
      title: 'Are you sure you want to logout?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        dispatch(logoutUserAPI())
      })
      .catch(() => {})
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} size="small" sx={{ padding: 0 }} aria-controls={open ? 'basic-menu-profiles' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
          <Avatar sx={{ width: 30, height: 30 }} src={currentUser?.avatar} alt="TienViDev"></Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}>
        <Link to={'/settings/account'} style={{ color: 'inherit' }}>
          <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
            <Avatar sx={{ width: 34, height: 34, mr: 2 }} src={currentUser?.avatar} alt="TienViDev" />
            Profile
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            '&:hover': {
              color: 'warning.dark',
              '& .logout-icon': {
                color: 'warning.dark'
              }
            }
          }}>
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile
