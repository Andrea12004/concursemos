// 📁 src/lib/services/Departure/useDeparture.ts
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '@/settings/socket';
import { useAuthData } from '@/lib/hooks/useAuthData';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface GameState {
  roomId: string;
  startGame: boolean;
  questions: Question[];
}

export const usePartida = () => {
  const { id: roomCode } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthData();

  const [isChatVisible, setIsChatVisible] = useState(true);
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [respuestasColores, setRespuestasColores] = useState<Record<string, string>>({});
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [endGame, setEndgame] = useState(false);
  const [loader, setLoader] = useState(false);
  const [reportado, setReportado] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [timeQuestion, setTimequestion] = useState<number>(30);
  const [timeQuestionReconexion, setTimequestionReconexion] = useState<number | null>(null);
  const [newPlayer, setNewplayer] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  const [rankingFinal, setRankingFinal] = useState<any[]>([]);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [tiempoRestanteAlSeleccionar, setTiempoRestanteAlSeleccionar] = useState<number | null>(null);

  const respuestaSeleccionadaRef = useRef<string | null>(null);

  const token = useMemo(() => {
    return localStorage.getItem('authToken') || localStorage.getItem('cnrsms_token') || '';
  }, []);

  // ✅ 1. CARGAR ESTADO DEL JUEGO DESDE localStorage
  useEffect(() => {
    const storedGameState = localStorage.getItem('gameState');

    if (storedGameState) {
      try {
        const gameState: GameState = JSON.parse(storedGameState);

        if (gameState.roomId === roomCode) {
          console.log('[useDeparture] Restaurando estado del juego');
          setQuestions(gameState.questions);
          setStart(true);
        }
      } catch (error) {
        console.error('[useDeparture] Error al parsear gameState:', error);
      }
    }
  }, [roomCode]);

  // ✅ 2. OBTENER DATOS DE LA SALA
  useEffect(() => {
    if (!token || !roomCode) return;

    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/rooms/by-code/${roomCode}`, {
          headers: { cnrsms_token: token }
        });

        setRoomId(response.data.id);
        setTimequestion(response.data.time_question);
      } catch (error: any) {
        console.error('[useDeparture] Error al obtener sala:', error);

        if (error.response?.data?.message === 'Token expirado') {
          Swal.fire({
            title: 'Token Expirado',
            text: 'Vuelve a ingresar a la plataforma',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          navigate('/');
        }
      }
    };

    fetchRoom();
  }, [token, roomCode, navigate]);

  // ✅ 3. ESCUCHAR INICIO DEL JUEGO
  useEffect(() => {
    const handleGameStarted = (gameData: any) => {
      console.log('[useDeparture] Juego comenzado:', gameData);

      setQuestions(gameData.questions);
      setStart(true);

      localStorage.setItem('gameState', JSON.stringify({
        roomId: roomCode,
        startGame: true,
        questions: gameData.questions
      }));
    };

    const handleError = (error: any) => {
      console.error('[useDeparture] Error:', error);

      if (error.message === 'La sala no está disponible para unirse en este momento.') {
        Swal.fire({
          title: 'Error',
          text: 'La sala no está disponible para unirse en este momento.',
          icon: 'error',
          confirmButtonText: 'Ok'
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

  // ✅ 4. SINCRONIZACIÓN PARA RECONEXIÓN (dataPlayer)
  useEffect(() => {
    const handleDataPlayer = (result: any) => {
      console.log('[useDeparture] Datos de reconexión:', result);

      if (result.numberQuestion != null && result.time != null) {
        setCurrentQuestionIndex(result.numberQuestion);
        setTimequestionReconexion(result.time);

        if (result.includeQuestions && result.questions && result.questions.length > 0) {
          setQuestions(result.questions);
          setStart(true);
        }

        if (newPlayer === profile?.id) {
          console.log('[useDeparture] Reiniciando timer para jugador reconectado');
          setTimerKey(prev => prev + 1);
        }
      }
    };

    socket.on('dataPlayer', handleDataPlayer);

    return () => {
      socket.off('dataPlayer', handleDataPlayer);
    };
  }, [newPlayer, profile?.id]);

  // ✅ 5. ESCUCHAR NUEVOS JUGADORES
  useEffect(() => {
    const handlePlayerJoined = (newPlayer: any) => {
      console.log('[useDeparture] Nuevo jugador:', newPlayer);
      setNewplayer(newPlayer.profileId);

      // Si NO es el jugador actual, enviar datos de sincronización
      if (newPlayer.profileId !== profile?.id && start) {
        sendDataToPlayer();
      }
    };

    socket.on('playerJoined', handlePlayerJoined);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
    };
  }, [profile?.id, start, currentQuestionIndex, timeQuestion, tiempoTranscurrido]);

  // ✅ 6. FUNCIÓN PARA ENVIAR DATOS DE SINCRONIZACIÓN
  const sendDataToPlayer = async () => {
    if (!token || !roomId) return;

    try {
      await axios.post('/rooms/send-data', {
        numberQuestion: currentQuestionIndex,
        time: timeQuestion - tiempoTranscurrido,
        includeQuestions: start,
        roomId: roomId
      }, {
        headers: { cnrsms_token: token }
      });
    } catch (error) {
      console.error('[useDeparture] Error enviando datos:', error);
    }
  };

  // ✅ 7. OBTENER CATEGORÍA DE LA PREGUNTA
  useEffect(() => {
    if (questions.length > 0 && token) {
      const fetchQuestion = async () => {
        try {
          const response = await axios.get(`/questions/${questions[currentQuestionIndex].id}`, {
            headers: { cnrsms_token: token }
          });
          setCategory(response.data.category);
        } catch (error) {
          console.error('[useDeparture] Error al obtener pregunta:', error);
        }
      };

      fetchQuestion();
    }
  }, [currentQuestionIndex, questions, token]);

  // ✅ 8. INICIALIZAR COLORES DE RESPUESTAS
  useEffect(() => {
    if (questions.length > 0) {
      const nuevosColores: Record<string, string> = {};
      questions[currentQuestionIndex].answers.forEach((answer) => {
        nuevosColores[answer.id] = 'neutral';
      });
      setRespuestasColores(nuevosColores);
    }
  }, [currentQuestionIndex, questions]);

  // ✅ 9. MANEJAR SELECCIÓN DE RESPUESTA
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

  // ✅ 10. EVALUAR RESPUESTAS AL TERMINAR EL TIEMPO
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
    } else if (respuestaCorrecta) {
      nuevosColores[respuestaCorrecta.id] = 'correcto';
    }

    setRespuestasColores(nuevosColores);
    setTimeUp(true);
  };

  // ✅ 11. ENVIAR RESPUESTA AL BACKEND
  useEffect(() => {
    if (timeUp && profile?.id && roomId && questions.length > 0) {
      console.log('[useDeparture] Enviando respuesta al backend');

      socket.emit('answerQuestion', {
        profileId: profile.id,
        questionId: questions[currentQuestionIndex].id,
        selectedAnswerId: respuestaSeleccionadaRef.current,
        roomId: roomId,
        remainingTimePercentage: (100 - (tiempoRestanteAlSeleccionar || 0))
      });

      setTimeout(() => {
        setReportado(false);
        siguientePregunta();
        setTimeUp(false);
        respuestaSeleccionadaRef.current = null;
      }, 2000);
    }
  }, [timeUp, profile?.id, roomId, questions]);

  // ✅ 12. SIGUIENTE PREGUNTA O TERMINAR JUEGO
  const siguientePregunta = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRespuestasColores({});
      setRespuestaSeleccionada(null);
      setTimeUp(false);
      setTimequestionReconexion(null);

      if (newPlayer === profile?.id) {
        setTimerKey(prev => prev + 1);
      }
    } else {
      console.log('[useDeparture] Juego terminado, emitiendo endGame');
      socket.emit('endGame', { roomId });
      setLoader(true);
    }
  };

  // ✅ 13. ESCUCHAR FIN DEL JUEGO
  useEffect(() => {
    const handleGameEnded = (result: any) => {
      console.log('[useDeparture] Juego terminado:', result);

      localStorage.removeItem('gameState');
      setRankingFinal(result.finalScores.sort((a: any, b: any) => b.totalScore - a.totalScore));
      setEndgame(true);
      setLoader(false);
    };

    socket.on('gameEnded', handleGameEnded);

    return () => {
      socket.off('gameEnded', handleGameEnded);
    };
  }, []);

  // ✅ 14. REPORTAR PREGUNTA
  const report = () => {
    setReportado(prev => !prev);

    socket.emit('reportQuestion', {
      questionId: questions[currentQuestionIndex].id,
      reason: 'Nueva pregunta requiere atención.'
    });

    console.log('[useDeparture] Pregunta reportada');
  };

  // ✅ 15. SALIR DE LA PARTIDA
  const back = () => {
    if (profile?.id && roomCode) {
      socket.emit('leaveSala', { profileId: profile.id, room_code: roomCode });
      navigate('/dashboard');
    }
  };

  // ✅ 16. MANEJAR FIN DEL JUEGO DESDE LOADER
  const handleGameEnd = (result: any) => {
    console.log('[useDeparture] Manejando fin del juego:', result);
    localStorage.removeItem('gameState');
    setRankingFinal(result.finalScores.sort((a: any, b: any) => b.totalScore - a.totalScore));
    setEndgame(true);
  };

  const toggleChat = () => setIsChatVisible(prev => !prev);

  return {
    isChatVisible,
    start,
    questions,
    currentQuestionIndex,
    timeUp,
    endGame,
    loader,
    roomId,
    profile,
    category,
    timeQuestion,
    timeQuestionReconexion,
    newPlayer,
    timerKey,
    rankingFinal,
    reportado,
    respuestasColores,
    respuestaSeleccionada,
    toggleChat,
    manejarRespuesta,
    evaluarRespuestas,
    report,
    back,
    handleGameEnd,
    setRankingFinal,
    setTiempoTranscurrido
  };
};