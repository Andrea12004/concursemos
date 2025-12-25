import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/waitingroom.css'

// Definición de tipos
interface Player {
  id: string;
  photoUrl?: string;
  nickname: string;
  verified?: boolean;
}

export const Saladeespera: React.FC = () => {
    const { id: roomCode } = useParams<{ id: string }>();
    const [open, setOpen] = useState<boolean>(true);
    const [token, setToken] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([
        { id: '1', nickname: 'Jugador 1', verified: true },
        { id: '2', nickname: 'Jugador 2', verified: false },
        { id: '3', nickname: 'Invitado' },
    ]);
    const navigate = useNavigate();
    
    // Función para alternar el modal de información
    const toggleInfo = (): void => {
        setOpen(prevOpen => !prevOpen);
    };

    const back = (): void => {
        navigate("/dashboard");
    }

    const startMatch = (): void => {
        alert('¡Partida iniciada!');
    }

    // Simular la llegada de nuevos jugadores cada 5 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            if (players.length < 6) {
                const newPlayer: Player = {
                    id: `player-${Date.now()}`,
                    nickname: `Jugador ${players.length + 1}`,
                    verified: Math.random() > 0.5
                };
                setPlayers(prev => [...prev, newPlayer]);
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [players.length]);

    // Simular un jugador que se desconecta después de 8 segundos
    useEffect(() => {
        if (players.length > 3) {
            const timer = setTimeout(() => {
                setPlayers(prev => prev.slice(0, -1));
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [players.length]);

    const getPhotoUrl = (player: Player): string => {
        if (player.photoUrl) {
            return player.photoUrl;
        }
        const avatars = [
            '/images/Logos/Logo-login.png',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=' + player.nickname,
            'https://api.dicebear.com/7.x/bottts/svg?seed=' + player.nickname
        ];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    return( 
        <div className='div-sala-de-espera'>
            <div className='container-esperando'>
                {/* Modal de información con transición */}
                <div 
                    className={`movil absolute right-[100px] bottom-[200px] bg-[#1f2336] border shadow-custom border-[#f26a2f] h-[400px] w-[501px] rounded-md p-4 transition-all duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible hidden'}`}
                >
                    <div className='flex w-full justify-between mb-2 items-start'>
                        <p className='text-[#F26A2F] font-bold w-[80%] text-left text-[24px]'>
                            ¿Cómo se dan los puntos en la partida?
                        </p>
                        <img 
                            src="/svg/partida/cerrar.svg" 
                            className="cursor-pointer hover:scale-110 transition-transform" 
                            onClick={toggleInfo}
                            alt="Cerrar"
                        />
                    </div>
                    <div className='flex w-full justify-between'>
                        <p className='text-white text-[24px] font-bold w-[50%] text-left'>Puntos</p>
                        <p className='text-white text-[24px] font-bold w-[50%] text-right'>Tiempo</p>
                    </div>
                    <div className='flex w-full justify-between'>
                        <p className='text-white font-medium w-[50%] text-left'>190 pts</p>
                        <p className='text-white font-medium w-[50%] text-right'>0% - 10%</p>
                    </div>
                    <div className='flex w-full justify-between'>
                        <p className='text-white font-medium w-[50%] text-left'>180 pts</p>
                        <p className='text-white font-medium w-[50%] text-right'>11% - 20%</p>
                    </div>
                    <div className='flex w-full justify-between'>
                        <p className='text-white font-medium w-[50%] text-left'>100 pts</p>
                        <p className='text-white font-medium w-[50%] text-right'>21% al 100%</p>
                    </div>
                    <div className='flex w-full justify-center mt-10'>
                        <p className='text-[#F26A2F] font-bold text-[24px] w-[80%] text-center'>
                            ¿Quién gana la partida?
                        </p>
                    </div>
                    <div className='flex w-full justify-center mt-2'>
                        <p className='text-white font-medium w-[90%] text-center'>
                            La partida la ganará la persona que mayor puntaje tenga de acuerdo a la tabla de puntos antes presentada
                        </p>
                    </div>
                </div>

                {/* Logo clicable para abrir el modal */}
                <div className='div-logo-espera cursor-pointer' onClick={toggleInfo}>
                    <img src="/images/Logos/Logo-login.png" alt="Logo" />
                </div>

                {/* Loader animado */}
                <div>
                    <div className="loader">
                        <div className="react-star">
                            <div className="nucleus"></div>
                            <div className="electron electron1"></div>
                            <div className="electron electron2"></div>
                            <div className="electron electron3"></div>
                        </div>
                    </div>
                </div>

                <p className='text-esperando'>Esperando jugadores...</p>

                {/* Lista de jugadores */}
                <div className='div-jugadores-espera'>
                    {
                        players.length > 0 ? players.map((player, index) => 
                            <div key={player.id} className="div-lista-partida-espera">
                                <div>
                                    <img 
                                        src={player.photoUrl 
                                            ? player.photoUrl.includes('https://api.backconcursemos.com') 
                                                ? player.photoUrl 
                                                : `https://api.backconcursemos.com${player.photoUrl}` 
                                            : "/images/Logos/Logo-login.png"
                                        } 
                                        alt={`Avatar de ${player.nickname}`} 
                                    />
                                </div>
                                <p className='flex items-center gap-2 truncate'>
                                    <span className='w-[80%] truncate'>{player.nickname}</span>
                                    {player.verified === true && (
                                        <img 
                                            src='/images/verfied.png' 
                                            className="w-[18px]"
                                            alt="Verificado"
                                        />
                                    )}
                                </p>
                            </div>
                        ) : (
                            <p className='text-white'>No hay jugadores conectados</p>
                        )
                    }     
                </div>

                {/* Botones de acción */}
                <div className="flex justify-center gap-4 font-montserrat">
                    <button 
                        className="px-6 py-3 text-white border border-solid border-[#fff] hover:border-[#134E9D] hover:text-white font-semibold flex gap-2 rounded hover:bg-[#134E9D] transition focus:ring-2 focus:ring-orange-300 iniciar buttons-movil" 
                        onClick={back}
                    >
                        <img 
                            src="/svg/link/ajusteshover.svg" 
                            alt="Regresar" 
                            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                        />
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Saladeespera;