import { Link } from "react-router-dom";
import { useAuthData } from "@/lib/hooks/useAuthData";
import "./css/styles.css";

export function Estadisticas() {
  const { user } = useAuthData();
  const datosPerfil = user?.profile;
  const nivel = datosPerfil?.level;
  const preguntasResueltas = datosPerfil?.correct_answers || 0;
  const puntosAcumulados = datosPerfil?.Total_points || 0;
  const loading = !user?.profile;

  return (
    <div className="div-stats">
      <div className="header-stats">
        <p>Tus estadísticas</p>
        <Link to="/perfil">
          <img src="/svg/dashboard/gobutton.svg" alt="Ir al perfil" />
        </Link>
      </div>

      <div className="stats">
        {/* Nivel */}
        <div className="stats-level">
          <p className="stats-title">Nivel</p>
          <img
            src={nivel !== "N/A" ? `/images/niveles/${nivel}.png` : ""}
            alt={`Nivel ${nivel}`}
          />
          <p className="stats-description">{loading ? "Cargando..." : nivel}</p>
        </div>

        {/* Preguntas y puntos */}
        <div className="div-puntos-respuestas">
          <div className="div-preguntas-stats">
            <img src="/svg/dashboard/preguntas-resueltas.svg" alt="Preguntas" />
            <p>
              {loading ? "Cargando..." : preguntasResueltas}
              <br />
              Preguntas
              <br />
              Resueltas
            </p>
          </div>

          <div className="div-puntos-stats">
            <img src="/svg/dashboard/logrostats.svg" alt="Puntos" />
            <p>
              {loading ? "Cargando..." : puntosAcumulados}
              <br />
              Puntos
              <br />
              Acumulados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
