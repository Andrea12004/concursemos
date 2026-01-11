// 📁 src/lib/services/Departure/useDeparture.ts
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '@/settings/socket';
import { useLogout } from '@/lib/hooks/useLogout';
import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * ============================================
 * TIPOS DE DATOS
 * ============================================
 */

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Category {
  id: string;
  category: string;
  photo_category: string;
}

export interface Player {
  id: string;
  profileId?: string;
  nickname: string;
  photoUrl?: string;
  score?: number;
  pointsAwarded?: number;
  correct_answers?: number;
  verified?: boolean;
}

export interface PlayerScore {
  id: string;
  nickname: string;
  totalScore: number;
  photoUrl?: string;
}

/**
 * ============================================
 * HOOK: useDeparture
 * ============================================
 */
export const useDeparture = (roomCode: string) => {
  const { logout } = useLogout();
  const navigate = useNavigate();

  // Estados de autenticación
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Estados del juego
  const [roomId, setRoomId] = useState('');
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [timeQuestion, setTimeQuestion] = useState<number>(30);
  const [timeQuestionReconexion, setTimeQuestionReconexion] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [endGame, setEndGame] = useState(false);
  const [rankingFinal, setRankingFinal] = useState<PlayerScore[]>([]);
  const [newPlayer, setNewPlayer] = useState<string | null>(null);

  // Estados de respuestas
  const [timeUp, setTimeUp] = useState(false);
  const [respuestasColores, setRespuestasColores] = useState<Record<string, string>>({});
  const respuestaSeleccionadaRef = useRef<string | null>(null);
  const [tiempoRestanteAlSeleccionar, setTiempoRestanteAlSeleccionar] = useState<number | null>(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  /**
   * 1️⃣ CARGAR DATOS DE AUTENTICACIÓN
   */
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse) {
      setToken(authResponse.accesToken);
      setProfile(authResponse.user?.profile);
      setUser(authResponse.user);
    }

    // Restaurar estado del juego desde localStorage
    const storedGameState = JSON.parse(localStorage.getItem('gameState') || '{}');
    if (storedGameState && storedGameState.roomId === roomCode) {
      setQuestions(storedGameState.questions);
      setStart(true);
    }
  }, [roomCode]);

  /**
   * 2️⃣ OBTENER DATOS DE LA SALA
   */
  useEffect(() => {
    if (!token) return;

    const getRoom = async () => {
      const headers = { cnrsms_token: token };
      try {
        const response = await axios.get(`/rooms/by-code/${roomCode}`, { headers });
        setRoomId(response.data.id);
        setTimeQuestion(response.data.time_question);
      } catch (error: any) {
        if (error.response?.data?.message === 'Token expirado') {
          Swal.fire({
            title: 'Token Expirado',
            text: 'Vuelve a ingresar a la plataforma',
            icon: 'error',
          });
          logout();
        }
      }
    };

    getRoom();
  }, [token, roomCode, logout]);

  /**
   * 3️⃣ UNIRSE A LA SALA
   */
  useEffect(() => {
    if (!roomCode || !profile) return;

    socket.emit('joinSala', {
      profileId: profile.id,
      room_code: roomCode,
    });

    socket.emit('listConnectedProfiles', { roomCode });
  }, [roomCode, profile]);

  /**
   * 4️⃣ SOCKET LISTENERS - INICIO DEL JUEGO
   */
  useEffect(() => {
    const handleGameStarted = (gameData: any) => {
      console.log('🎮 Juego comenzado:', gameData);
      setQuestions(gameData.questions);
      setStart(true);

      localStorage.setItem('gameState', JSON.stringify({
        roomId: roomCode,
        startGame: true,
        questions: gameData.questions,
      }));
    };

    const handleError = (error: any) => {
      console.error('❌ Error:', error);
      if (error.message?.includes('sala no está disponible')) {
        Swal.fire({
          title: 'Error',
          text: 'La sala no está disponible para unirse en este momento.',
          icon: 'error',
        });
      }
    };

    socket.on('gameStarted', handleGameStarted);
    socket.on('error', handleError);

    return () => {
      socket.off('gameStarted', handleGameStarted);
      socket.off('error', handleError);
    };
  }, [roomCode]);

  /**
   * 5️⃣ SOCKET LISTENERS - JUGADORES
   */
  useEffect(() => {
    const handleConnectedProfiles = (data: any) => {
      if (data?.profiles) {
        setPlayers(data.profiles);
      }
    };

    const handlePlayerJoined = (player: any) => {
      console.log('➕ Jugador se unió:', player);
      setNewPlayer(player.profileId);
      socket.emit('listConnectedProfiles', { roomCode });

      // Enviar datos del juego al nuevo jugador (solo jugadores existentes)
      if (player.profileId !== profile?.id && start) {
        sendGameData();
      }
    };

    const handlePlayerLeft = (player: any) => {
      console.log('➖ Jugador salió:', player);
      socket.emit('listConnectedProfiles', { roomCode });
    };

    socket.on('connectedProfiles', handleConnectedProfiles);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerLeft', handlePlayerLeft);

    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
    };
  }, [roomCode, profile, start]);

  /**
   * 6️⃣ SOCKET LISTENERS - RECONEXIÓN
   */
  useEffect(() => {
    const handleDataPlayer = (result: any) => {
      console.log('📥 Datos de reconexión:', result);

      if (result.numberQuestion != null && result.time != null) {
        setCurrentQuestionIndex(result.numberQuestion);
        setTimeQuestionReconexion(result.time);

        if (result.includeQuestions && result.questions?.length > 0) {
          setQuestions(result.questions);
          setStart(true);
        }

        if (newPlayer === profile?.id) {
          setTimerKey(prev => prev + 1);
        }
      }
    };

    socket.on('dataPlayer', handleDataPlayer);

    return () => {
      socket.off('dataPlayer', handleDataPlayer);
    };
  }, [newPlayer, profile]);

  /**
   * 7️⃣ SOCKET LISTENERS - FIN DEL JUEGO
   */
  useEffect(() => {
    const handleGameEnded = (result: any) => {
      console.log('🏆 Juego finalizado:', result);
      localStorage.removeItem('gameState');
      setRankingFinal(result.finalScores.sort((a: any, b: any) => b.totalScore - a.totalScore));
      setEndGame(true);
    };

    socket.on('gameEnded', handleGameEnded);

    return () => {
      socket.off('gameEnded', handleGameEnded);
    };
  }, []);

  /**
   * 8️⃣ OBTENER DATOS DE LA PREGUNTA ACTUAL
   */
  useEffect(() => {
    if (questions.length === 0) return;

    const getQuestion = async () => {
      const headers = { cnrsms_token: token };
      try {
        const response = await axios.get(`/questions/${questions[currentQuestionIndex].id}`, { headers });
        setCategory(response.data);
      } catch (error) {
        console.error('Error obteniendo pregunta:', error);
      }
    };

    getQuestion();

    // Inicializar colores de respuestas
    const nuevosColores: Record<string, string> = {};
    questions[currentQuestionIndex].answers.forEach((answer) => {
      nuevosColores[answer.id] = 'neutral';
    });
    setRespuestasColores(nuevosColores);
  }, [currentQuestionIndex, questions, token]);

  /**
   * ============================================
   * FUNCIONES PÚBLICAS
   * ============================================
   */

  /**
   * Enviar datos del juego a jugadores que se reconectan
   */
  const sendGameData = async () => {
    const headers = { cnrsms_token: token };
    try {
      await axios.post('/rooms/send-data', {
        numberQuestion: currentQuestionIndex,
        time: timeQuestion - tiempoTranscurrido,
        includeQuestions: start,
        roomId: roomId,
      }, { headers });
    } catch (error) {
      console.error('Error enviando datos:', error);
    }
  };

  /**
   * Manejar selección de respuesta
   */
  const manejarRespuesta = (respuesta: string) => {
    if (!timeUp) {
      if (respuestaSeleccionadaRef.current === null) {
        respuestaSeleccionadaRef.current = respuesta;
        const nuevosColores = { ...respuestasColores };
        nuevosColores[respuesta] = 'seleccionada';
        setRespuestasColores(nuevosColores);
        setTiempoRestanteAlSeleccionar((tiempoTranscurrido / timeQuestion) * 100);
      } else if (respuestaSeleccionadaRef.current !== respuesta) {
        const nuevosColores = { ...respuestasColores };
        nuevosColores[respuestaSeleccionadaRef.current] = 'neutral';
        nuevosColores[respuesta] = 'seleccionada';
        setRespuestasColores(nuevosColores);
        respuestaSeleccionadaRef.current = respuesta;
        setTiempoRestanteAlSeleccionar((tiempoTranscurrido / timeQuestion) * 100);
      }
    }
  };

  /**
   * Evaluar respuestas cuando se acaba el tiempo
   */
  const evaluarRespuestas = () => {
    if (timeUp) return;

    const nuevosColores = { ...respuestasColores };
    const respuestaCorrecta = questions[currentQuestionIndex]?.answers.find((answer) => answer.isCorrect);

    if (respuestaSeleccionadaRef.current && respuestaCorrecta) {
      if (respuestaSeleccionadaRef.current === respuestaCorrecta.id) {
        nuevosColores[respuestaSeleccionadaRef.current] = 'correcto';
      } else {
        nuevosColores[respuestaSeleccionadaRef.current] = 'incorrecto';
        nuevosColores[respuestaCorrecta.id] = 'correcto';
      }
    }

    setRespuestasColores(nuevosColores);
    setTimeUp(true);

    // Enviar respuesta al servidor
    socket.emit('answerQuestion', {
      profileId: profile.id,
      questionId: questions[currentQuestionIndex].id,
      selectedAnswerId: respuestaSeleccionadaRef.current,
      roomId: roomId,
      remainingTimePercentage: tiempoRestanteAlSeleccionar ? 100 - tiempoRestanteAlSeleccionar : 0,
    });
  };

  /**
   * Avanzar a siguiente pregunta
   */
  const siguientePregunta = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRespuestasColores({});
      respuestaSeleccionadaRef.current = null;
      setTimeUp(false);
      setTimeQuestionReconexion(null);

      if (newPlayer === profile?.id) {
        setTimerKey(prev => prev + 1);
      }
    } else {
      // Última pregunta - finalizar juego
      socket.emit('endGame', { roomId });
    }
  };

  /**
   * Reportar pregunta
   */
  const reportQuestion = () => {
    socket.emit('reportQuestion', {
      questionId: questions[currentQuestionIndex].id,
      reason: 'Nueva pregunta requiere atención.',
    });
  };

  /**
   * Salir de la sala
   */
  const leaveSala = () => {
    socket.emit('leaveSala', {
      profileId: profile.id,
      room_code: roomCode,
    });
    navigate('/dashboard');
  };

  return {
    // Estados
    start,
    questions,
    currentQuestionIndex,
    category,
    timeQuestion,
    timeQuestionReconexion,
    players,
    endGame,
    rankingFinal,
    timeUp,
    respuestasColores,
    tiempoTranscurrido,
    timerKey,
    newPlayer,
    profile,

    // Setters
    setTimeUp,
    setTiempoTranscurrido,

    // Funciones
    manejarRespuesta,
    evaluarRespuestas,
    siguientePregunta,
    reportQuestion,
    leaveSala,
  };
};