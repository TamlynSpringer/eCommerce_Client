import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../context/Store';

const AdminRoutes = ({children}) => {
  const { state } = useContext(Store);
  const { userInfo} = state;
  return (
    userInfo && userInfo.isAdmin ? children : <Navigate to='/login' />
  )
};

export default AdminRoutes;