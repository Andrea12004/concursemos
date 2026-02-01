import React from "react";
import { useParams } from "react-router-dom";
import { usePartida } from "@/lib/services/Departure/useDeparture";
import ListaJugadores from "../components/departure/playerList";
import Timer from "../components/departure/timer";
import Chat from "../components/departure/chat";
import Espera from "../components/departure/waitingRoom";
import EndGame from "../components/departure/End";
import Loader from "../components/departure/loaderEnd";
import "@/css/departure.css";
import ImageButton from "@/components/UI/Button/ImageButton";

const Partida: React.FC = () => {
  const {
    // Estados
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
    
    // Funciones
    toggleChat,
    manejarRespuesta,
    evaluarRespuestas,
    report,
    back,
    handleGameEnd,
    setRankingFinal, // ✅ AGREGADO
    setTiempoTranscurrido, // ✅ AGREGADO
  } = usePartida();

  const { id: roomCode } = useParams<{ id: string }>();

  // ✅ Determinar qué componente mostrar
  if (!start) {
    return <Espera />;
  }

  // ✅ Mostrar loader cuando termine el juego
  if (loader && !endGame) {
    return (
      <Loader 
        onGameEnd={handleGameEnd} 
        roomId={roomId} 
        roomCode={roomCode || ''} 
        profile={profile}
      />
    );
  }

  // ✅ Mostrar pantalla final
  if (endGame) {
    return <EndGame jugadores={rankingFinal} name={roomCode?.replaceAll('-', ' ') || ''} />;
  }

  // ✅ Juego en curso
  return (
    <div className="all-match">
      {/* Lista de jugadores */}
      <div className="container-jugadores-partida">
        <ListaJugadores 
          timeup={timeUp} 
          final={rankingFinal} 
          setFinal={setRankingFinal}
        />
        
        <button className='button-salir-partida' onClick={back}>
          <img src="/svg/partida/salir.svg" alt="Salir" />
          <p>Salir de la partida</p>
        </button>
      </div>

      {/* Contenido principal de la partida */}
      <div className="container-partida">
        <div className="content-partida">
          {/* Header con contador */}
          <div className="header-contador-partida">
            <h2>{roomCode?.replaceAll('-', ' ')}</h2>
            <div className="div-posicion-contador">
              <p>
                Pregunta <strong>{currentQuestionIndex + 1}</strong> de{' '}
                <strong>{questions.length}</strong>
              </p>
              <Timer 
                key={timerKey}
                onTimeUp={evaluarRespuestas} 
                resetTimer={timeUp} 
                duration={
                  timeQuestionReconexion !== null && newPlayer === profile?.id 
                    ? timeQuestionReconexion 
                    : (timeQuestion || 30)
                } 
                onTimeUpdate={setTiempoTranscurrido}
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="category-partida">
            <img 
              src={category?.photo_category || "/images/Example-category.png"} 
              alt={category?.category || "Categoría"} 
            />
            <p>{category?.category || ''}</p>
          </div>

          {/* Pregunta y respuestas */}
          <div className="pregunta-respuesta">
            <p>{questions[currentQuestionIndex]?.text}</p>
            
            {questions[currentQuestionIndex]?.answers.map((answer) => (
              <div 
                className={`respuestas ${respuestasColores[answer.id] || 'neutral'} ${
                  respuestaSeleccionada === answer.id ? 'seleccionada' : ''
                }`} 
                key={answer.id}
                onClick={() => manejarRespuesta(answer.id)}
                style={{ cursor: timeUp ? 'default' : 'pointer' }}
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
            
            {/* Botón para reportar pregunta */}
            <button
              className="button-report"
              style={{ color: reportado ? '#ff9144' : '#fff' }}
              onClick={report}
            >
              Reportar pregunta
              <img
                src={`/svg/partida/${reportado ? 'reportado.svg' : 'reportar.svg'}`}
                alt="Reportar"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div
        className={`container-chat ${
          isChatVisible ? "container-chat" : "container-chat-hidden"
        }`}
      >
        {isChatVisible && (
          <ImageButton
            className="movil-chat-inside icon-sm"
            onClick={toggleChat}
            aria-label="Cerrar chat"
          >
            <img src="/svg/modals/close.svg" alt="Cerrar" />
          </ImageButton>
        )}
        <Chat />
      </div>

      {/* Botón móvil para abrir/cerrar chat */}
      <ImageButton
        className="movil-chat icon-md"
        onClick={toggleChat}
        aria-label={isChatVisible ? "Cerrar chat" : "Abrir chat"}
      >
        <img
          src={
            isChatVisible ? "/svg/modals/close.svg" : "/svg/chat/chat.svg"
          }
          alt={isChatVisible ? "Cerrar" : "Chat"}
        />
      </ImageButton>
    </div>
  );
};

export default Partida;