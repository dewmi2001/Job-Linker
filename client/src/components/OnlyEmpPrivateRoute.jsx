import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyEmpPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isEmp ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' />
  );
}