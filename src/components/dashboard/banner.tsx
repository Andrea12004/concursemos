import React from "react";
import { Link } from "react-router-dom";
import './css/styles.css';

interface UserProfile {
  id: string;
  nickname: string;
  photoUrl?: string;
  Total_points: number;
  correct_answers: number;
}

interface BannerProps {
  user?: {
    nickname: string;
  };
  profiles?: UserProfile[];
}

export const Banner: React.FC<BannerProps> = ({
  user = { nickname: "Usuario" },
  profiles = [
    {
      id: "1",
      nickname: "JuanitoPro",
      photoUrl: "",
      Total_points: 1500,
      correct_answers: 40,
    },
    {
      id: "2",
      nickname: "MariaQuiz",
      photoUrl: "",
      Total_points: 1200,
      correct_answers: 35,
    },
    {
      id: "3",
      nickname: "CarlosTop",
      photoUrl: "",
      Total_points: 980,
      correct_answers: 29,
    },
  ],
}) => {
  return (
    <div className="div-banner-puntajes">
      {/* BANNER */}
      <div className="div-banner">
        <div className="parrafos-div">
          <h2>Bienvenido, {user.nickname}</h2>
          <p>
            Bienvenido a Concursemos, la plataforma de juego de preguntas donde
            el conocimiento y la diversión se unen. Compite con tus amigos,
            explora categorías como ciencia, historia y entretenimiento, y reta
            tu mente en cada partida.
          </p>
        </div>

        <div className="imagen-banner-div">
          <img src="/images/Imagen-Banner.png" alt="Banner" />
        </div>
      </div>

      {/* PUNTAJES */}
      <div className="div-puntajes">
        <div className="header-puntajes">
          <p>Máximos Puntajes</p>
          <Link to="/usuarios">Ver todo el ranking</Link>
        </div>

        {/* RANKING */}
        <div className="div-ranking">
          {profiles.slice(0, 3).map((item) => (
            <div className="div-user-ranking" key={item.id}>
              <div className="user-ranking">
                <img
                  src={
                    item.photoUrl && item.photoUrl !== ""
                      ? item.photoUrl
                      : "/images/Logos/Logo-login.png"
                  }
                  alt="Foto usuario"
                />
                <p className="truncate">{item.nickname}</p>
              </div>

              <div className="div-puntos">
                <p className="p-puntos">{item.Total_points} Puntos</p>
                <p className="p-preguntas-correctas">
                  {item.correct_answers} preguntas correctas
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* FIN RANKING */}
      </div>
    </div>
  );
};

export default Banner;
