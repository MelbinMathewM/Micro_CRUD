import { useContext } from 'react';
import './App.css';
import { AdminProvider, AdminContext, contextType as AdminContextType } from './context/adminContext';
import { UserProvider, UserContext, contextType as UserContextType } from './context/userContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import Users from './Pages/Admin/User/User';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import Login from './Pages/Admin/Login/Login';
import ULogin from './Pages/Users/Login/Login';
import Home from './Pages/Users/Home/Home';
import Add from './Pages/Admin/Add/Add';

function App() {
  return (
    <>
      <Routes>
        {/* user side */}
        <Route path='/*' element={
          <UserProvider>
            <UserRoutes />
          </UserProvider>
        } />

        {/* admin side */}
        <Route path='/admin/*' element={
          <AdminProvider>
            <AdminRoutes />
          </AdminProvider>
        } />
      </Routes>
    </>
  );
}

const UserRoutes = () => {

  const userContext: UserContextType | null = useContext(UserContext)

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={userContext?.isAuth ? <Navigate to='/home' /> : <ULogin />} />
      <Route path='/home' element={userContext?.isAuth ? <Home /> : <Navigate to='/login' />} />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}


const AdminRoutes = () => {

  const adminContext: AdminContextType | null = useContext(AdminContext)

  return (
    <Routes>
      <Route path='' element={<Navigate to={'/admin/login'} />} />
      <Route path='login' element={adminContext?.isAuth? <Navigate to={'/admin/dashboard'}/> : <Login />} />
      <Route path='dashboard' element={adminContext?.isAuth? <Dashboard/> : <Navigate to={'/admin/login'}/>}  />
      <Route path='users' element={adminContext?.isAuth? <Users/> : <Navigate to={'/admin/login'}/>}  />
      <Route path='add' element={adminContext?.isAuth? <Add/> : <Navigate to={'/admin/add'}/> } />
    </Routes>
  )
}

export default App
