import { getAllProfilesEndpoint } from '@/lib/api/profile';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useAuthData } from '@/lib/hooks/useAuthData';
import { useLogout } from '@/lib/hooks/useLogout';

export const useBanner = () => {
  const { nickname } = useAuthData();
  const { logout } = useLogout();
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
 
  const hasLoaded = useRef(false);

  const token = useMemo(() => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('cnrsms_token') || 
           '';
  }, []);

  const user = { nickname };

  const loadProfiles = useCallback(async () => {
    if (!token) {
    
      setLoading(false);
      return;
    }

    try {
     
      
      const allProfiles = await getAllProfilesEndpoint(token);
      const sorted = allProfiles.sort((a: any, b: any) =>
        (b.profile?.Total_points || 0) - (a.profile?.Total_points || 0)
      );

      setProfiles(sorted);
   

    } catch (error: any) {
  
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Cargar solo UNA vez usando useRef
  useEffect(() => {
    if (hasLoaded.current) return; 
    
    hasLoaded.current = true;
    loadProfiles();
  }, []); 

  return { 
    user, 
    profiles, 
    loading,
    refetchProfiles: loadProfiles // Para refrescar manualmente
  };
};