import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import './css/end.css';

// Definición de tipos
interface Jugador {
  id: string;
  nickname: string;
  photoUrl?: string;
  totalScore?: number;
}

interface EndMatchProps {
  jugadores: Jugador[];
  name: string;
}

export const EndMatch: React.FC<EndMatchProps> = ({ jugadores, name }) => {
  
  return( 
    <div className='div-fin-partida'>
        <Sidebar/>
        <div className='tops-div'>
            <p className='text-white font-bold w-full text-center text-[24px] pt-10'>Ranking de la partida: {name.replaceAll('-',' ')}</p>
            <div className={`top3-div ${jugadores.length < 3 ? '!flex-col-reverse mt-20' : ''}`}>
                <div className={`top-2 ${jugadores.length < 3 ? ' mt-20' : ''}`}>
                    <img src="/images/plata.png" alt="" />
                    <div className='div-jugador-final'>
                        <img src={jugadores.length > 1 && jugadores[1].photoUrl ? `${jugadores[1].photoUrl}` : "/images/Logos/Logo-login.png"} alt=""  className='img-jugador-final'/>
                        <p className='nickname-final truncate'>{jugadores.length > 1 && jugadores[1].nickname ? jugadores[1].nickname : ''}</p>
                        <div>
                            <p className='puntos-final'>{jugadores.length > 1 && jugadores[1].totalScore ? jugadores[1].totalScore : ''} Puntos</p>
                        </div>
                    </div>
                </div>
                <div className='top-1'>
                    <img src={`${jugadores.length < 3 ? '/images/oro-grande.png' : '/images/oro.png'}`} />
                    <div className='div-jugador-final'>
                        <img src={jugadores.length > 0 && jugadores[0].photoUrl 
                                        ? jugadores[0].photoUrl.includes('api.backconcursemos.com') 
                                            ? jugadores[0].photoUrl 
                                            : `https://api.backconcursemos.com${jugadores[0].photoUrl}` 
                                        : "/images/Logos/Logo-login.png"} alt=""  className='img-jugador-final'/>
                        <p className='nickname-final truncate'>{jugadores.length > 0 && jugadores[0].nickname ? jugadores[0].nickname : ''}</p>
                        <div>
                            <p className='puntos-final'>{jugadores.length > 0 && jugadores[0].totalScore ? jugadores[0].totalScore : ''} Puntos</p>
                        </div>
                    </div>
                </div>
                <div className={`top-3 ${jugadores.length < 3 ? '!hidden' : ''}`}>
                    <img src="/images/bronce.png" alt="" />
                    <div className='div-jugador-final'>
                        <img src={jugadores.length > 2 && jugadores[2].photoUrl 
                                        ? jugadores[2].photoUrl.includes('api.backconcursemos.com') 
                                            ? jugadores[2].photoUrl 
                                            : `https://api.backconcursemos.com${jugadores[2].photoUrl}` 
                                        : "/images/Logos/Logo-login.png"} alt=""  className='img-jugador-final'/>
                        <p className='nickname-final truncate'>{jugadores.length > 2 && jugadores[2].nickname ? jugadores[2].nickname : ''}</p>
                        <div>
                            <p className='puntos-final'>{jugadores.length > 2 && jugadores[2].totalScore ? jugadores[2].totalScore : ''} Puntos</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='rest-tops-div'>
                {
                    jugadores.length > 3 ? jugadores.map((item,index) => 
                    <div className='div-jugadores-final-index' key={index}>
                        <p className='nickname-final'>{index + 1}</p>    
                        <div className='div-jugador-final'>
                            <img src={item.photoUrl 
                                            ? item.photoUrl.includes('api.backconcursemos.com') 
                                            ? item.photoUrl 
                                            : `https://api.backconcursemos.com${item.photoUrl}` 
                                            : "/images/Logos/Logo-login.png"} alt=""  className='img-jugador-final'/>
                            <p className='nickname-final truncate'>{item.nickname ? item.nickname : ''}</p>
                            <div>
                                <p className='puntos-final'>{item.totalScore ? item.totalScore : ''} Puntos</p>
                            </div>
                        </div>
                    </div>).slice(3,12) : <p></p>
                }
            </div>
        </div>
    </div>
    );
};

export default EndMatch;