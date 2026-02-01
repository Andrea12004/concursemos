// 📁 src/components/departure/waitingRoom.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWaitingRoom } from '@/lib/services/Departure/useWaitingRoom';
import './css/waitingroom.css';

export const WaitingRoom: React.FC = () => {
    const { id: roomCode } = useParams<{ id: string }>();
    const [open, setOpen] = useState<boolean>(true);
    
    // ✅ Hook con toda la lógica y usando tus componentes de API
    const {
        players,
        leaveSala,
    } = useWaitingRoom(roomCode || '');
    
    // Toggle del modal de información
    const toggleInfo = (): void => {
        setOpen(prevOpen => !prevOpen);
    };

    return( 
        <div className='div-sala-de-espera'>
            <div className='container-esperando'>
                {/* Modal de información con transición */}
                <div 
                    className={`movil absolute right-[100px] bottom-[200px] bg-[#1f2336] border shadow-custom border-[#f26a2f] h-[400px] w-[501px] rounded-md p-4 transition-all duration-300 ${
                        open ? 'opacity-100 visible' : 'opacity-0 invisible hidden'
                    }`}
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
                    
                    {/* Tabla de puntos */}
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

                {/* Logo clicable para abrir modal */}
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

                <p className='text-esperando'>
                    Esperando jugadores..
                </p>

                {/* Lista de jugadores conectados */}
                <div className='div-jugadores-espera'>
                    {
                        players.length > 0 ? players.map((player) => 
                            <div key={player.id} className="div-lista-partida-espera">
                                <div>
                                    <img 
                                        src={
                                            player.photoUrl 
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
                    {/* Botón Regresar */}
                    <button 
                        className="px-6 py-3 text-white border border-solid border-[#fff] hover:border-[#134E9D] hover:text-white font-semibold flex gap-2 rounded hover:bg-[#134E9D] transition focus:ring-2 focus:ring-orange-300 iniciar buttons-movil" 
                        onClick={leaveSala}
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
    );
};

export default WaitingRoom;