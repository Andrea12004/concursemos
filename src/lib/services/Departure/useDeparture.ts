import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '@/settings/socket';
import { showNotification } from '@/lib/utils/notify';
import { showAlert } from '@/lib/utils/showAlert';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { getRoomByCodeEndpoint, sendSyncDataEndpoint } from '@/lib/api/rooms';
import { getQuestionsIdEndpoint } from '@/lib/api/Questions';

// Interfaces
interface Player {
  id: string;
  nickname: string;
  photoUrl?: string;
  totalScore?: number;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
  category?: Category;
}

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Category {
  id: string;
  category: string;
  photo_category?: string;
}

interface GameData {
  questions: Question[];
  [key: string]: any;
}

interface UsePartidaReturn {
  // Estados
  isChatVisible: boolean;
  start: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  timeUp: boolean;
  endGame: boolean;
  loader: boolean; // ✅ AGREGADO
  roomId: string;
  token: string;
  profile: any;
  category: Category | null;
  tiempoTranscurrido: number;
  timeQuestion: number | null;
  timeQuestionReconexion: number | null;
  newPlayer: string | null;
  timerKey: number;
  rankingFinal: Player[];
  reportado: boolean;
  respuestasColores: Record<string, string>;
  respuestaSeleccionada: string | null;
  
  // Referencias
  respuestaSeleccionadaRef: React.MutableRefObject<string | null>;
  
  // Funciones
  toggleChat: () => void;
  logout: () => void;
  getRoom: () => Promise<void>;
  getQuestion: (id: string) => Promise<void>;
  report: () => void;
  manejarRespuesta: (respuestaId: string) => void;
  evaluarRespuestas: () => void;
  siguientePregunta: () => void;
  back: () => void;
  handleGameEnd: (result: any) => void;
  sendSyncData: () => Promise<void>;
  setRankingFinal: (players: Player[]) => void; // ✅ AGREGADO
  setTiempoTranscurrido: (tiempo: number) => void; // ✅ AGREGADO
}

export const usePartida = (): UsePartidaReturn => {
  const navigate = useNavigate();
  const { id: roomCode } = useParams<{ id: string }>();
  
  // Estados
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [respuestasColores, setRespuestasColores] = useState<Record<string, string>>({});
  const [endGame, setEndgame] = useState(false);
  const [loader, setLoader] = useState(false); // ✅ AGREGADO
  const [tiempoRestanteAlSeleccionar, setTiempoRestanteAlSeleccionar] = useState<number | null>(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [timeQuestion, setTimequestion] = useState<number | null>(null);
  const [timeQuestionReconexion, setTimequestionReconexion] = useState<number | null>(null);
  const [newPlayer, setNewplayer] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [reportado, setReportado] = useState(false);
  const [rankingFinal, setRankingFinal] = useState<Player[]>([]);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  
  // Referencias
  const respuestaSeleccionadaRef = useRef<string | null>(null);
  
  // Toggle del chat
  const toggleChat = useCallback(() => {
    setIsChatVisible(prevState => !prevState);
  }, []);
  
  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("authResponse");
    localStorage.removeItem("gameState");
    navigate("/");
  }, [navigate]);
  
  // Cargar datos del localStorage
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse) {
      setToken(authResponse.accesToken || '');
      setProfile(authResponse.user?.profile || null);
    }
    
    const storedGameState = JSON.parse(localStorage.getItem('gameState') || '{}');
    if (storedGameState && storedGameState.roomId === roomCode) {
      setQuestions(storedGameState.questions || []);
      setStart(true);
    }
  }, [roomCode]);
  
  // Obtener sala
  const getRoom = useCallback(async () => {
    if (!token || !roomCode) return;
    
    try {
      const response = await getRoomByCodeEndpoint(token, roomCode);
      setRoomId(response.id || '');
      setTimequestion(response.time_question || null);
    } catch (error) {
      handleAxiosError(error, logout);
    }
  }, [token, roomCode, logout]);
  
  // Obtener pregunta
  const getQuestion = useCallback(async (id: string) => {
    if (!token) return;
    
    try {
      const response = await getQuestionsIdEndpoint(token, id);
      setCategory(response.data?.category || response.category || null);
    } catch (error) {
      handleAxiosError(error, logout);
    }
  }, [token, logout]);
  
  // Enviar datos de sincronización
  const sendSyncData = useCallback(async () => {
    if (!token || !roomId) return;
    
    try {
      await sendSyncDataEndpoint(token, {
        numberQuestion: currentQuestionIndex,
        time: timeQuestion ? timeQuestion - tiempoTranscurrido : 0,
        includeQuestions: start,
        roomId: roomId
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }, [token, currentQuestionIndex, timeQuestion, tiempoTranscurrido, start, roomId]);
  
  // Escuchar jugadores que se unen
  useEffect(() => {
    if (!roomId || !profile) return;
    
    const handlePlayerJoined = (newPlayer: any) => {
      setNewplayer(newPlayer.profileId);
      if (newPlayer.profileId !== profile.id) {
        sendSyncData();
      }
    };
    
    socket.on('playerJoined', handlePlayerJoined);
    
    return () => {
      socket.off('playerJoined', handlePlayerJoined);
    };
  }, [roomId, profile, sendSyncData]);
  
  // Escuchar errores del socket
  useEffect(() => {
    const handleError = (error: any) => {
      if (error.message === 'La sala no está disponible para unirse en este momento.') {
        showAlert('Error', 'La sala no está disponible para unirse en este momento.', 'error');
      } else if (error.message === 'No hay preguntas disponibles para esta sala.') {
        showAlert('Error', 'No hay suficientes preguntas disponibles para esta sala.', 'error');
      }
    };
    
    socket.on('error', handleError);
    
    return () => {
      socket.off('error', handleError);
    };
  }, []);
  
  // Escuchar inicio del juego
  useEffect(() => {
    const handleGameStarted = (gameData: GameData) => {
      setQuestions(gameData.questions || []);
      setStart(true);
      
      const gameState = {
        roomId: roomCode,
        startGame: true,
        questions: gameData.questions
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    };
    
    socket.on('gameStarted', handleGameStarted);
    
    return () => {
      socket.off('gameStarted', handleGameStarted);
    };
  }, [roomCode]);
  
  // Escuchar datos del jugador (reconexión)
  useEffect(() => {
    const handleDataPlayer = (result: any) => {
      if (result.numberQuestion != null && result.time != null) {
        setCurrentQuestionIndex(result.numberQuestion);
        setTimequestionReconexion(result.time);
        
        if (result.includeQuestions === true && result.questions?.length > 0) {
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
  }, [profile, newPlayer]);
  
  // Inicializar colores de respuestas cuando cambia la pregunta
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const nuevosColores: Record<string, string> = {};
      questions[currentQuestionIndex].answers.forEach((answer) => {
        nuevosColores[answer.id] = 'neutral';
      });
      setRespuestasColores(nuevosColores);
      
      getQuestion(questions[currentQuestionIndex].id);
    }
  }, [currentQuestionIndex, questions, getQuestion]);
  
  // Reportar pregunta
  const report = useCallback(() => {
    if (!questions[currentQuestionIndex]) return;
    
    setReportado(prev => !prev);
    
    socket.emit('reportQuestion', {
      questionId: questions[currentQuestionIndex].id,
      reason: "Nueva pregunta requiere atención."
    });
    
    showNotification({
      message: "Pregunta reportada",
      description: "Se ha reportado una pregunta"
    });
  }, [currentQuestionIndex, questions]);
  
  // Manejar respuesta
  const manejarRespuesta = useCallback((respuestaId: string) => {
    if (timeUp) return;
    
    if (respuestaSeleccionadaRef.current === null) {
      setRespuestaSeleccionada(respuestaId);
      respuestaSeleccionadaRef.current = respuestaId;
      setRespuestasColores(prev => ({ ...prev, [respuestaId]: 'seleccionada' }));
      setTiempoRestanteAlSeleccionar((tiempoTranscurrido / (timeQuestion || 1)) * 100);
    } else if (respuestaSeleccionadaRef.current !== respuestaId) {
      setRespuestaSeleccionada(respuestaId);
      const anteriorId = respuestaSeleccionadaRef.current;
      respuestaSeleccionadaRef.current = respuestaId;
      setRespuestasColores(prev => ({
        ...prev,
        [anteriorId]: 'neutral',
        [respuestaId]: 'seleccionada'
      }));
      setTiempoRestanteAlSeleccionar((tiempoTranscurrido / (timeQuestion || 1)) * 100);
    }
  }, [timeUp, tiempoTranscurrido, timeQuestion]);
  
  // Evaluar respuestas
  const evaluarRespuestas = useCallback(() => {
    if (timeUp || !questions[currentQuestionIndex]) return;
    
    const nuevosColores = { ...respuestasColores };
    const respuestaCorrecta = questions[currentQuestionIndex].answers.find(answer => answer.isCorrect);
    
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
  }, [timeUp, questions, currentQuestionIndex, respuestasColores]);
  
  // Siguiente pregunta
  const siguientePregunta = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setRespuestasColores({});
      setRespuestaSeleccionada(null);
      respuestaSeleccionadaRef.current = null;
      setTimeUp(false);
      setReportado(false);
      setTimequestionReconexion(null);
      
      if (newPlayer === profile?.id) {
        setTimerKey(prev => prev + 1);
      }
    } else {
      // ✅ Mostrar loader antes de finalizar
      setLoader(true);
    }
  }, [currentQuestionIndex, questions.length, newPlayer, profile]);
  
  // Enviar respuesta cuando se acaba el tiempo
  useEffect(() => {
    if (timeUp && questions[currentQuestionIndex]) {
      socket.emit('answerQuestion', {
        profileId: profile?.id,
        questionId: questions[currentQuestionIndex].id,
        selectedAnswerId: respuestaSeleccionadaRef.current,
        roomId: roomId,
        remainingTimePercentage: tiempoRestanteAlSeleccionar ? 100 - tiempoRestanteAlSeleccionar : 0
      });
      
      const timer = setTimeout(() => {
        siguientePregunta();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [timeUp, currentQuestionIndex, questions, profile, roomId, tiempoRestanteAlSeleccionar, siguientePregunta]);
  
  // Salir de la sala
  const back = useCallback(() => {
    socket.emit('leaveSala', { 
      profileId: profile?.id, 
      room_code: roomCode 
    });
    localStorage.removeItem('gameState');
    navigate("/dashboard");
  }, [profile, roomCode, navigate]);
  
  // Escuchar final del juego
  useEffect(() => {
    const handleGameEnded = (result: any) => {
      localStorage.removeItem('gameState');
      const sortedScores = (result.finalScores || []).sort((a: Player, b: Player) => 
        (b.totalScore || 0) - (a.totalScore || 0)
      );
      setRankingFinal(sortedScores);
      setLoader(false); // ✅ Ocultar loader
      setEndgame(true);
    };
    
    socket.on('gameEnded', handleGameEnded);
    
    return () => {
      socket.off('gameEnded', handleGameEnded);
    };
  }, []);
  
  // Manejar fin del juego (desde Loader)
  const handleGameEnd = useCallback((result: any) => {
    localStorage.removeItem('gameState');
    const sortedScores = (result.finalScores || []).sort((a: Player, b: Player) => 
      (b.totalScore || 0) - (a.totalScore || 0)
    );
    setRankingFinal(sortedScores);
    setLoader(false); // ✅ Ocultar loader
    setEndgame(true);
  }, []);
  
  // Inicializar cuando hay token
  useEffect(() => {
    if (token) {
      getRoom();
    }
  }, [token, getRoom]);
  
  return {
    // Estados
    isChatVisible,
    start,
    questions,
    currentQuestionIndex,
    timeUp,
    endGame,
    loader, // ✅ EXPORTAR
    roomId,
    token,
    profile,
    category,
    tiempoTranscurrido,
    timeQuestion,
    timeQuestionReconexion,
    newPlayer,
    timerKey,
    rankingFinal,
    reportado,
    respuestasColores,
    respuestaSeleccionada,
    
    // Referencias
    respuestaSeleccionadaRef,
    
    // Funciones
    toggleChat,
    logout,
    getRoom,
    getQuestion,
    report,
    manejarRespuesta,
    evaluarRespuestas,
    siguientePregunta,
    back,
    handleGameEnd,
    sendSyncData,
    setRankingFinal, // ✅ EXPORTAR
    setTiempoTranscurrido, // ✅ EXPORTAR
  };
};