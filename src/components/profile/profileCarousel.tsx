
import { useSimpleSliderLogic } from "@/lib/services/Profile/usecarouselProfile";

export default function SimpleSlider() {
  const { match, goMatch } = useSimpleSliderLogic();

  return (
    <>
      {match.length > 0 ? (
        <div>
          <div>
            <p>
              <strong>{match[0].room_name || 'Cargando...'}</strong>
            </p>
            <p>
              <strong>Jugadores: </strong>
              {match[0].invitedProfiles.length + 1} de 10
            </p>
          </div>
          <div>
            <p>
              <strong>Preguntas:</strong> {match[0].number_questions} Preguntas
            </p>
            <p>
              <strong>Tiempo de respuesta:</strong> {match[0].time_question} Segundos
            </p>
          </div>
          <button type="button" onClick={goMatch}>
            Entrar a la partida <img src="/svg/dashboard/gobutton.svg" alt="" />
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