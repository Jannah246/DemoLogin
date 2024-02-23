import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// import all comonents
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';

// auth middleware 
import { AuthorizeAdmin, AuthorizeUser, ProtectRoute } from './middleware/auth';
import Dashboard from './components/admin/Dashboard';
import AdminLogin from './components/admin/AdminLogin';

// Root routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Username />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/password',
    element: <ProtectRoute> <Password /> </ProtectRoute> 
  },
  {
    path: '/profile',
    element: <AuthorizeUser> <Profile /> </AuthorizeUser>
  },
  {
    path: '/recovery',
    element: <Recovery />
  },
  {
    path: '/reset',
    element: <Reset />
  },
  {
    path: '/admin-login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AuthorizeAdmin > <Dashboard /> </AuthorizeAdmin>
  },
  {
    path: '*',
    element: <PageNotFound />
  },
])

function App() {
  return (
    <main>
      <RouterProvider router={router} ></RouterProvider>
    </main>
  );
}

export default App;
