import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { fetchBoardsAPI } from '~/apis'

import { styled } from '@mui/material/styles'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary[50],
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#fff',
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.primary[100]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#fff',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary[200]
  }
}))

function Boards() {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  function updateStateBoard(result) {
    setBoards(result?.boards || [])
    setTotalBoards(result?.totalBoards || 0)
  }

  useEffect(() => {
    fetchBoardsAPI(location.search).then(updateStateBoard)
  }, [location.search])

  function afterCreateNewBoard() {
    fetchBoardsAPI(location.search).then(updateStateBoard)
  }

  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
            </Stack>
          </Grid>

          <Grid justifyContent={{ xs: 'center', sm: 'flex-start' }} xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your boards:
            </Typography>
            {boards?.length === 0 && (
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}
            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map((board) => (
                  <Grid xs={2} sm={3} md={4} key={board._id}>
                    <Card sx={{ width: '250px' }}>
                      {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                      <Box sx={{ height: '50px', backgroundColor: randomColor() }}></Box>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {board?.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {board?.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${board._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}>
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {totalBoards > 0 && (
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => <PaginationItem component={Link} to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`} {...item} />}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
