// useBanner.ts
import { getAllProfilesEndpoint } from '@/lib/api/profile';
import { useEffect, useState } from 'react';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useAuthData } from '@/lib/hooks/useUser'; 
import {useLogout} from '@/lib/hooks/useLogout';
export const useBanner = () => {

  const { nickname } = useAuthData();
  const { logout } = useLogout(); 
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = { nickname };

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        // Obtener token
        const authResponse = localStorage.getItem('authResponse');
        if (!authResponse) {
          setLoading(false);
          return;
        }
        
        const parsed = JSON.parse(authResponse);
        const token = parsed.accesToken || parsed.accessToken || parsed.token;
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Cargar ranking
        const allProfiles = await getAllProfilesEndpoint(token);
        const sorted = allProfiles.sort((a: any, b: any) => 
          (b.profile?.Total_points || 0) - (a.profile?.Total_points || 0)
        );
        
        setProfiles(sorted);

      } catch (error: any) {
        handleAxiosError(error, logout)
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  return { user, profiles, loading };
};