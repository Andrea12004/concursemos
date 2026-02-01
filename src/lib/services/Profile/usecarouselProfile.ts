import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/lib/store/hooks";
import { useLogout } from "@/lib/hooks/useLogout";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { getScheduledRoomsEndpoint } from "@/lib/api/rooms";

interface InvitedProfile {
  id: string | number;
  // Agrega más campos según tu estructura
}

interface Match {
  room_code: string;
  room_name: string;
  invitedProfiles: InvitedProfile[];
  number_questions: number;
  time_question: number;
}

export const useSimpleSliderLogic = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();

  // Obtener datos de Redux (como Sidebar)
  const { profile } = useAppSelector((state) => state.auth);

  const [token, setToken] = useState('');
  const [match, setMatch] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener token
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') || '';
    setToken(authToken);
  }, []);

  // Obtener partidas programadas
  const getMatch = useCallback(async () => {
    if (!token || !profile?.id) return;

    setLoading(true);
    try {
      const response = await getScheduledRoomsEndpoint(profile.id, token);
      setMatch(response);
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, profile?.id, logout]);

  useEffect(() => {
    if (token && profile?.id) {
      getMatch();
    }
  }, [token, profile?.id]);

  // Navegar a la partida
  const goMatch = useCallback(() => {
    if (match.length > 0 && match[0].room_code) {
      navigate(`/sala/${match[0].room_code}`);
    }
  }, [match, navigate]);

  return {
    match,
    loading,
    goMatch
  };
};