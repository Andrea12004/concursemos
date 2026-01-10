
import {  Link } from 'react-router-dom';
import './css/styles.css';
import { useBanner } from '@/lib/services/Dashboard/useBanner';

export const Banner = () => {

  
  const { user, profiles} = useBanner();

  return (
    <div className="div-banner-puntajes">
      {/* BANNER */}
      <div className="div-banner">
        <div className="parrafos-div">
          <h2>Bienvenido, {user?.nickname ?? "Usuario"}</h2>
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
            <div className="div-user-ranking" key={item.profile.id}>
              <div className="user-ranking">
                <img
                  src={
                    item.profile.photoUrl
                      ? item.profile.photoUrl
                      : "/images/Logos/Logo-login.png"
                  }
                  alt="Foto usuario"
                />
                <p className="truncate">{item.profile.nickname}</p>
              </div>

              <div className="div-puntos">
                <p className="p-puntos">
                  {item.profile.Total_points} Puntos
                </p>
                <p className="p-preguntas-correctas">
                  {item.profile.correct_answers} preguntas correctas
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
