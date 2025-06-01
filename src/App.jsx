import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'
import Base from './pages/Base'
import Dashboard from './pages/dashboard'
import Classroom from './pages/Classroom'
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/base" replace={true} />} />
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/base" element={<Base />} />
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
        <Route path="/tms" element={<Dashboard />}>
          <Route path="classrooms" element={<Classroom />} />
          <Route path="students" element={<Dashboard />} />
          <Route path="teachers" element={<Dashboard />} />
          <Route path="payments" element={<Dashboard />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
