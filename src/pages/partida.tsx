import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ListaJugadores from "../components/partida/lista-jugadores";
import Timer from "../components/partida/timer";
import Chat from "../components/partida/chat";
import Espera from "../components/partida/espera";
import EndGame from "../components/partida/final";
import Loader from "../components/partida/loader-final";
import "@/css/departure.css";
import { useAuth } from "@/lib/auth";

import type {
  Question,
  Category,
  GameState,
  PlayerScore,
} from "@/lib/types/partida";

const Partida: React.FC = () => {
  // Estados principales
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [reportado, setReportado] = useState<boolean>(false);
  const { id: roomCode } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const auth = useAuth();

  // Estados del juego
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  const [respuestasColores, setRespuestasColores] = useState<
    Record<string, string>
  >({});
  const [endGame, setEndgame] = useState<boolean>(false);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState<number>(0);

  // Estados auxiliares
  const [category, setCategory] = useState<Category | null>(null);
  const [timeQuestion, setTimequestion] = useState<number>(30); // Valor por defecto: 30 segundos
  const [start, setStart] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [rankingFinal, setRankingFinal] = useState<PlayerScore[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  // Referencias y estado de selección
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<
    string | null
  >(null);
  const respuestaSeleccionadaRef = useRef<string | null>(null);
  const tiempoRestanteAlSeleccionarRef = useRef<number | null>(null);

  // Datos de usuario simulados para la maqueta
  const mockProfile = {
    id: "user-123",
    nickname: "Tú",
    photoUrl: "/images/Logos/Logo-login.png",
  };

  const toggleChat = (): void => {
    setIsChatVisible((prevState) => !prevState);
  };

  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const back = (): void => {
    navigate("/dashboard");
  };

  // Cargar datos iniciales (simulados para maqueta)
  useEffect(() => {
    // Simular carga de estado del juego desde localStorage
    const mockGameState: GameState = {
      roomId: roomCode || "demo-room",
      startGame: false,
      questions: generateMockQuestions(2),
    };

    // Para la demo, comenzar inmediatamente
    setTimeout(() => {
      setQuestions(mockGameState.questions);
      setStart(true);
    }, 10000);

    // Simular carga de categoría
    setCategory({
      category: "Cultura General",
      photo_category: "/images/Example-category.png",
    });
  }, [roomCode]);

  // Generar preguntas de ejemplo
  const generateMockQuestions = (count: number): Question[] => {
    const questions: Question[] = [];

    for (let i = 1; i <= count; i++) {
      questions.push({
        id: `question-${i}`,
        text: `¿Esta es la pregunta de ejemplo número ${i}?`,
        answers: [
          { id: `q${i}-a`, text: "Respuesta A", isCorrect: i % 3 === 0 },
          { id: `q${i}-b`, text: "Respuesta B", isCorrect: i % 3 === 1 },
          { id: `q${i}-c`, text: "Respuesta C", isCorrect: i % 3 === 2 },
          { id: `q${i}-d`, text: "Respuesta D", isCorrect: false },
        ],
      });
    }

    return questions;
  };

  // Inicializar colores de respuestas para la pregunta actual
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const nuevosColores: Record<string, string> = {};
      questions[currentQuestionIndex].answers.forEach((answer) => {
        nuevosColores[answer.id] = "neutral";
      });
      setRespuestasColores(nuevosColores);
    }
  }, [currentQuestionIndex, questions]);

  // Manejar selección de respuesta
  const manejarRespuesta = (respuestaId: string): void => {
    if (!timeUp && respuestaSeleccionadaRef.current === null) {
      respuestaSeleccionadaRef.current = respuestaId;
      setRespuestaSeleccionada(respuestaId);
      const nuevosColores = { ...respuestasColores };
      nuevosColores[respuestaId] = "seleccionada";
      setRespuestasColores(nuevosColores);

      // Calcular porcentaje de tiempo restante
      const porcentajeTranscurrido = (tiempoTranscurrido / timeQuestion) * 100;
      tiempoRestanteAlSeleccionarRef.current = porcentajeTranscurrido;

      console.log(
        `Respuesta seleccionada: ${respuestaId} al ${porcentajeTranscurrido.toFixed(
          1
        )}% del tiempo`
      );
    }
  };

  // Evaluar respuestas al finalizar el tiempo
  const evaluarRespuestas = (): void => {
    if (timeUp) return;

    const nuevosColores = { ...respuestasColores };
    const preguntaActual = questions[currentQuestionIndex];
    const respuestaCorrecta = preguntaActual?.answers.find(
      (answer) => answer.isCorrect
    );

    // Mostrar respuesta correcta e incorrecta
    if (respuestaSeleccionadaRef.current && respuestaCorrecta) {
      nuevosColores[respuestaSeleccionadaRef.current] = "incorrecto";
      nuevosColores[respuestaCorrecta.id] = "correcto";

      // Si el jugador acertó, mostrar como correcta
      if (respuestaSeleccionadaRef.current === respuestaCorrecta.id) {
        nuevosColores[respuestaSeleccionadaRef.current] = "correcto";
      }
    } else if (respuestaCorrecta) {
      // Si no se seleccionó respuesta, solo mostrar la correcta
      nuevosColores[respuestaCorrecta.id] = "correcto";
    }

    setRespuestasColores(nuevosColores);
    setTimeUp(true);

    // Generar puntuación simulada
    const puntuacion =
      respuestaSeleccionadaRef.current === respuestaCorrecta?.id
        ? Math.floor(100 + (tiempoRestanteAlSeleccionarRef.current || 0) * 0.5)
        : Math.floor(Math.random() * 50);

    console.log(
      `Puntuación para pregunta ${currentQuestionIndex + 1}: ${puntuacion}`
    );

    // Limpiar referencia y estado
    respuestaSeleccionadaRef.current = null;
    setRespuestaSeleccionada(null);
    tiempoRestanteAlSeleccionarRef.current = null;
  };

  // Avanzar a la siguiente pregunta
  const siguientePregunta = (): void => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setRespuestasColores({});
      setTimeUp(false);
      setReportado(false);
      setTimerKey((prev) => prev + 1);

      // Simular cambio de categoría cada 2 preguntas
      if ((currentQuestionIndex + 1) % 2 === 0) {
        const categories = [
          {
            category: "Ciencia",
            photo_category: "/images/science-category.png",
          },
          {
            category: "Historia",
            photo_category: "/images/history-category.png",
          },
          {
            category: "Deportes",
            photo_category: "/images/sports-category.png",
          },
          { category: "Arte", photo_category: "/images/art-category.png" },
        ];
        setCategory(categories[Math.floor(Math.random() * categories.length)]);
      }
    } else {
      // Finalizar juego después de la última pregunta
      finalizarJuego();
    }
  };

  // Simular final del juego
  const finalizarJuego = (): void => {
    console.log("🎮 Finalizando juego...");
    setLoader(true);

    // Simular cálculo de resultados
    setTimeout(() => {
      const mockFinalScores: PlayerScore[] = [
        {
          id: "player-1",
          nickname: "Campeón",
          totalScore: 850,
          photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Winner",
        },
        {
          id: "player-2",
          nickname: "Segundo",
          totalScore: 720,
          photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Second",
        },
        {
          id: "player-3",
          nickname: "Tercero",
          totalScore: 680,
          photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Third",
        },
        {
          id: mockProfile.id,
          nickname: mockProfile.nickname,
          totalScore: 620,
          photoUrl: mockProfile.photoUrl,
        },
        {
          id: "player-5",
          nickname: "Jugador5",
          totalScore: 580,
          photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Player5",
        },
      ].sort((a, b) => b.totalScore - a.totalScore);

      setRankingFinal(mockFinalScores);
      setLoader(false);
      setEndgame(true);
      localStorage.removeItem("gameState");

      console.log("🏆 Resultados finales:", mockFinalScores);
    }, 2000);
  };

  // Manejar fin del juego desde Loader (admite diferentes formas de resultado)
  const handleGameEnd = (result: any): void => {
    // Si viene con 'finalScores' (estructura antigua/esperada)
    if (result?.finalScores) {
      setRankingFinal(
        result.finalScores.sort(
          (a: PlayerScore, b: PlayerScore) => b.totalScore - a.totalScore
        )
      );
    }

    // Si viene desde el loader (winner + scores)
    else if (result?.scores) {
      const mapped: PlayerScore[] = result.scores.map(
        (s: { profileId: string; score: number }) => ({
          id: s.profileId,
          nickname: s.profileId,
          totalScore: s.score,
        })
      );
      setRankingFinal(
        mapped.sort(
          (a: PlayerScore, b: PlayerScore) => b.totalScore - a.totalScore
        )
      );
    }

    setEndgame(true);
  };

  // Manejar reporte de pregunta
  const report = (): void => {
    setReportado(!reportado);
    console.log(`Pregunta reportada: ${questions[currentQuestionIndex]?.id}`);

    // Simular notificación
    const notification = new Notification("Pregunta Reportada", {
      body: `Se ha reportado la pregunta "${questions[
        currentQuestionIndex
      ]?.text.substring(0, 50)}..."`,
      icon: "/images/Logo-login.png",
    });
  };

  // Efecto para avanzar automáticamente después de tiempo agotado
  useEffect(() => {
    if (timeUp) {
      setTimeout(() => {
        siguientePregunta();
      }, 2000);
    }
  }, [timeUp]);

  // Solicitar permisos de notificación al iniciar
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Renderizado principal
  if (!start) {
    return <Espera />;
  }

  if (loader && !endGame) {
    return <Loader onGameEnd={handleGameEnd} roomId={roomCode} />;
  }

  if (endGame) {
    return (
      <EndGame
        jugadores={rankingFinal}
        name={roomCode?.replaceAll("-", " ") || "Partida Demo"}
      />
    );
  }

  return (
    <div className="all-match">
      {loader && !endGame ? (
        <Loader onGameEnd={handleGameEnd} roomId={roomCode}></Loader>
      ) : endGame ? (
        <EndGame
          jugadores={rankingFinal}
          name={roomCode ? roomCode.replaceAll("-", " ") : "Partida Demo"}
        />
      ) : (
        <>
          <div className="container-jugadores-partida">
            <ListaJugadores
              timeup={timeUp}
              final={rankingFinal}
              setFinal={(players) => setRankingFinal(players)}
            />

            <button className="button-salir-partida" onClick={back}>
              <img src="/svg/partida/salir.svg" alt="" />
              <p>Salir de la partida</p>
            </button>
          </div>

          <div className="container-partida">
            <div className="content-partida">
              <div className="header-contador-partida">
                <h2>{roomCode?.replaceAll("-", " ")}</h2>
                <div className="div-posicion-contador">
                  <p>
                    Pregunta <strong>{currentQuestionIndex + 1}</strong> de{" "}
                    <strong>{questions.length}</strong>
                  </p>
                  <Timer
                    key={timerKey}
                    onTimeUp={evaluarRespuestas}
                    resetTimer={timeUp}
                    duration={timeQuestion}
                    onTimeUpdate={(time) => setTiempoTranscurrido(time)}
                  />
                </div>
              </div>

              <div className="category-partida">
                <img
                  src={
                    category
                      ? category.photo_category
                      : "/images/Example-category.png"
                  }
                  alt=""
                />
                <p>{category ? category.category : ""}</p>
              </div>

              <div className="pregunta-respuesta">
                <p>{questions[currentQuestionIndex]?.text}</p>
                {questions[currentQuestionIndex]?.answers.map((answer) => (
                  <div
                    className={`respuestas ${
                      respuestasColores[answer.id] || "neutral"
                    } ${
                      respuestaSeleccionada === answer.id ? "seleccionada" : ""
                    }`}
                    key={answer.id}
                    onClick={() => manejarRespuesta(answer.id)}
                  >
                    <p
                      className={`${
                        respuestasColores[answer.id] || "neutral"
                      } ${
                        respuestaSeleccionada === answer.id
                          ? "seleccionada"
                          : ""
                      }`}
                    >
                      {answer.text}
                    </p>
                  </div>
                ))}

                <button
                  className="button-report"
                  style={{ color: reportado ? "#ff9144" : "#fff" }}
                  onClick={report}
                >
                  Reportar pregunta
                  <img
                    src={`/svg/partida/${
                      reportado ? "reportado.svg" : "reportar.svg"
                    }`}
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`container-chat ${
              isChatVisible ? "container-chat" : "container-chat-hidden"
            }`}
          >
            {/* Close button inside chat (visible when chat is open) */}
            {isChatVisible && (
              <button
                className="movil-chat-inside"
                onClick={toggleChat}
                aria-label="Cerrar chat"
              >
                <img src="/svg/modals/close.svg" alt="Cerrar" />
              </button>
            )}
            <Chat />
          </div>

          {/* Botón móvil fuera del contenedor para abrir el chat (visible siempre) */}
          <button
            className="movil-chat"
            onClick={toggleChat}
            aria-label={isChatVisible ? "Cerrar chat" : "Abrir chat"}
          >
            <img
              src={
                isChatVisible ? "/svg/modals/close.svg" : "/svg/chat/chat.svg"
              }
              alt={isChatVisible ? "Cerrar" : "Chat"}
            />
          </button>
        </>
      )}
    </div>
  );
};

export default Partida;
