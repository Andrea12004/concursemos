
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogout } from '@/lib/store/authSlice';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(setLogout());
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  return { logout };
};