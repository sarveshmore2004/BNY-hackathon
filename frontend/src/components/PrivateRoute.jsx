import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if(currentUser){
    return <Outlet />;
  }
  return <Navigate to='/sign-in' />;
}