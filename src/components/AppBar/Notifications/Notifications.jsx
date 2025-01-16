import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentNotifications, fetchInvitationsAPI, updateBoardInvitationAPI, addNotification } from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const currentNotifications = useSelector(selectCurrentNotifications)
  const [anchorEl, setAnchorEl] = useState(null)
  const [newNotifications, setNewNotifications] = useState(false)
  const open = Boolean(anchorEl)
  function handleClickNotificationIcon(event) {
    setAnchorEl(event.currentTarget)
    setNewNotifications(false)
  }
  function handleClose() {
    setAnchorEl(null)
  }


  useEffect(() => {
    dispatch(fetchInvitationsAPI())
    // create function to handle real-time update
    function onReceiveNewNotification(invitation) {
      if (invitation?.inviteeId === currentUser?._id) {
        dispatch(addNotification(invitation))
        setNewNotifications(true)
      }
    }
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewNotification)
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewNotification)
    }
  }, [dispatch, currentUser?._id])

  function updateBoardInvitation(status, invitationId) {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then((response) => {
      if (response.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        navigate(`/boards/${response.payload.boardInvitation.boardId}`)
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotifications ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}>
          <NotificationsNoneIcon
            sx={{
              color: newNotifications ? 'yellow' : 'white'
            }}
          />
        </Badge>
      </Tooltip>

      <Menu sx={{ mt: 2 }} id="basic-notification-drop-down" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}>
        {(!currentNotifications || currentNotifications.length === 0) && <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {currentNotifications?.map((notification, index) => (
          <Box key={index}>
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: 'auto'
              }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize="small" />
                  </Box>
                  <Box>
                    <strong>{notification?.inviter?.displayName}</strong> had invited you to join the board <strong>{notification?.board?.title}</strong>
                  </Box>
                </Box>

                {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification?._id)}>
                      Accept
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification?._id)}>
                      Reject
                    </Button>
                  </Box>
                )}

                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED && <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />}
                  {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED && <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />}
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification?.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== currentNotifications.length - 1 && <Divider />}
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default Notifications
