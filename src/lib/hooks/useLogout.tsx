import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogout } from '@/lib/store/authSlice';
import { disconnectSocket } from '@/settings/socket'; 

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {

  
    try {

      disconnectSocket();
      dispatch(setLogout());
      localStorage.clear();
    
      navigate("/", { replace: true });
    } catch (error) {
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  return { logout };
};