import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import ProfileScreen from '../../screens/ProfileScreen'
import HomeScreen from '../../screens/HomeScreen'
import UserListScreen from '../../screens/UserListScreen'
import UserLogHistoryScreen from '../../screens/LogHistoryScreen'
import NotFound from '../../components/NotFound'
import LoginScreen from '../../screens/LoginScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import RegisterScreen from '../../screens/RegisterScreen'
import ResetPasswordScreen from '../../screens/ResetPasswordScreen'
import LeadListScreen from '../../screens/LeadListScreen'
import TopUpScreen from '../../screens/TopUpScreen'
import MyLeadListScreen from '../../screens/MyLeadListScreen'
import AllLeadListScreen from '../../screens/AllLeadsListScreen'
import AllTopUpScreen from '../../screens/AllTopUpsScreen'

const AppRoutes = () => {
  let userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  let element = useRoutes([
    {
      path: '/',
      element: userInfo ? <HomeScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'profile',
      element: userInfo ? <ProfileScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'topup',
      element: userInfo ? <TopUpScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'my-leads',
      element: userInfo ? <MyLeadListScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'admin/users',
      element: userInfo ? <UserListScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'admin/users/log',
      element: userInfo ? <UserLogHistoryScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'admin/leads/all',
      element: userInfo ? <AllLeadListScreen /> : <Navigate to='/login' />,
    },
    {
      path: 'admin/topups/all',
      element: userInfo ? <AllTopUpScreen /> : <Navigate to='/login' />,
    },

    { path: 'login', element: <LoginScreen /> },
    { path: 'leads', element: <LeadListScreen /> },
    { path: 'forgot', element: <ForgotPasswordScreen /> },
    { path: 'register', element: <RegisterScreen /> },
    { path: 'reset/:resetToken', element: <ResetPasswordScreen /> },

    { path: '*', element: <NotFound /> },
  ])
  return element
}

export default AppRoutes
