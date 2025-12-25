import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function SimpleSlider() {
  const navigate = useNavigate();

  // Datos simulados mientras no exista backend
  const [match] = useState([
    {
      room_code: "ABC123",
      room_name: "Partida de prueba",
      invitedProfiles: [{ id: 1 }, { id: 2 }],
      number_questions: 10,
      time_question: 30
    }
  ]);

  const goMatch = () => {
    navigate(`/sala/${match[0].room_code}`);
  };

  return (
    <>
      {match.length > 0 ? (
        <div>
          <div>
            <p>
              <strong>
                {match.length ? match[0].room_name : "Cargando..."}
              </strong>
            </p>
            <p>
              <strong>Jugadores: </strong>
              {match.length ? match[0].invitedProfiles.length + 1 : "Cargando..."}{" "}
              de 10
            </p>
          </div>

          <div>
            <p>
              <strong>Preguntas:</strong>{" "}
              {match.length ? match[0].number_questions : "Cargando..."} Preguntas
            </p>
            <p>
              <strong>Tiempo de respuesta:</strong>{" "}
              {match.length ? match[0].time_question : "Cargando..."} Segundos
            </p>
          </div>

          <button type="button" onClick={goMatch}>
            Entrar a la partida{" "}
            <img src="/svg/dashboard/gobutton.svg" alt="Go" />
          </button>
        </div>
      ) : (
        <div>
          <p className="text-white">No tienes partidas programadas en este momento</p>
        </div>
      )}
    </>
  );
}
