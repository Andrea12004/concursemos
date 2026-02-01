import React from 'react';
import { useListaJugadores } from '@/lib/services/Departure/usePlayerList';
import "./css/listplayers.css";

interface Player {
  id: string;
  profileId?: string;
  nickname: string;
  photoUrl?: string;
  score?: number;
  correct_answers?: number;
  pointsAwarded?: number;
  [key: string]: any;
}

interface ListaJugadoresProps {
  timeup: boolean;
  final?: Player[];
  setFinal: (players: Player[]) => void;
}

export const ListaJugadores: React.FC<ListaJugadoresProps> = ({ 
  timeup, 
  setFinal 
}) => {
  
  // Usar el hook que contiene TODA la lógica, incluyendo getImageUrl
 const { players } = useListaJugadores(timeup, setFinal);


  return ( 
    <>
      <div className='container-logo-juagadores-partidas'>
        <img src="/images/Logos/Logo-login.png" alt="Logo del juego" />
      </div>
      <div className='div-jugadores-lista-partida'>
        <div className='header-jugadores-lista-partida'>
          <h3>Jugadores</h3>
        </div>
        {
         players.length > 0 ? players.map((player, index) => 
            <div key={index} className="div-lista-partida">
                <div>
                    <img src={player.photoUrl 
                                ? player.photoUrl.includes('api.backconcursemos.com') 
                                    ? player.photoUrl 
                                    : `https://api.backconcursemos.com${player.photoUrl}` 
                                : "/images/Logos/Logo-login.png"} alt="player" />
                </div>
                <p className='truncate'>{player.nickname}</p>

                <div className="puntaje-lista-jugadores ">
                    <p className="p-puntos-lista-partida-jugadores truncate">
                        {player.score ? player.score : '0'} Puntos
                    </p>
                    <p className="p-aciertos-lista-partida-jugadores !hidden">
                        {player.correct_answers ? player.correct_answers : '0'} aciertos
                    </p>
                </div>
                
            </div>)
                :   <p className='text-white'>No hay jugadores conectados</p>
            }   
                    
        </div>
    </>
    )
}
export default ListaJugadores;