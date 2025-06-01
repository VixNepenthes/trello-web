import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { useNavigate, useLocation } from 'react-router-dom';

const mainListItems = [
  { text: 'Lớp học', path: 'classrooms', icon: <HomeRoundedIcon /> },
  { text: 'Học sinh', path: 'students', icon: <AnalyticsRoundedIcon /> },
  { text: 'Giáo viên', path: 'teachers', icon: <PeopleRoundedIcon /> },
  { text: 'Thanh toán', path: 'payments', icon: <AssignmentRoundedIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
const currentPath = location.pathname;
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', height: '40px', fontSize: '14px' }}>
            <ListItemButton onClick={() => navigate(`/tms/${item.path}`)} selected={currentPath === `/tms/${item.path}`}>
              <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <ListItemText sx={{ fontSize: '20px' }} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
