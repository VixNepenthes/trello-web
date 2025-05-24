import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

// Custom styled grid item for system blocks
const SystemBlock = styled(Grid)(({ theme }) => ({
  height: '400px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'scale(0.98)'
  }
}))

function Base() {
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/path-to-your-logo.png" alt="MindX Logo" style={{ height: 40 }} />
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'black',
              '&:hover': { bgcolor: 'grey.900' }
            }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          {/* Trello Block */}
          <Grid item xs={12} md={6}>
            <SystemBlock
              onClick={() => navigate('/boards')}
              sx={{
                bgcolor: '#026AA7',
                '&:hover': { bgcolor: '#01579B' }
              }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                Trello
              </Typography>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Project Management Tool
              </Typography>
            </SystemBlock>
          </Grid>

          {/* TMS Block */}
          <Grid item xs={12} md={6}>
            <SystemBlock
              onClick={() => navigate('/tms')}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#388E3C' }
              }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                TMS
              </Typography>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Tuition Management System
              </Typography>
            </SystemBlock>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Base
