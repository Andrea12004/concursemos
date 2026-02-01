import { useEffect } from 'react';
import socket from '@/settings/socket';

export const useSalaDeEspera = (roomId: string, roomCode: string, profile: any, onGameEnd: (result: any) => void) => {
  
     useEffect(() => {
        socket.emit('listConnectedProfiles', { roomCode: roomCode });
          socket.on('connectedProfiles', (result) => {
            const profiles = result.profiles; // Perfiles conectados en la sala
            if (profiles && profiles.length > 0) {
              // Seleccionar un perfil al azar
             
              const randomProfile = profiles[0];
              
              // Solo el perfil seleccionado emitirá el evento endGame
              if (randomProfile.id === profile.id) {
                socket.emit('endGame', {
                  roomId: roomId,
                });
              }
            }
          })
    }, []);

    useEffect(() => {
        //console.log('escuchando')
        const handleGameEnded = (result:any) => {
            onGameEnd(result); // Llamar a la función pasada desde el padre
        };

        socket.on('gameEnded', handleGameEnded);
    }, [onGameEnd]);
};