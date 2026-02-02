// 📁 src/lib/services/Departure/useChat.ts
import { useState, useEffect } from 'react';
import socket from '@/settings/socket';
import { useAuthData } from '@/lib/hooks/useAuthData';

interface Message {
  fromUserId: string;
  text: string;
  nickname: string;
  photoUrl: string | null;
}

export const useChat = (roomCode: string) => {
  const { profile } = useAuthData();
  
  const [messages, setMessages] = useState<Message[]>([]);

  // ✅ 1. ESCUCHAR MENSAJES ENTRANTES
  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log('[useChat] Mensaje recibido:', message);

      // Solo añadir mensajes de OTROS usuarios
      if (message.profileId !== profile?.id) {
        setMessages(prev => [
          ...prev,
          {
            fromUserId: message.profileId,
            text: message.message,
            nickname: message.nickname,
            photoUrl: message.photoUrl || null
          }
        ]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [profile?.id]);

  // ✅ 2. FUNCIÓN PARA ENVIAR MENSAJES
  const sendMessage = (text: string) => {
    if (!text.trim() || !profile?.id || !roomCode) return;

    console.log('[useChat] Enviando mensaje:', text);

    socket.emit('sendMessage', {
      room_code: roomCode,
      message: text,
      profileId: profile.id
    });

    // Añadir PROPIO mensaje a la lista
    setMessages(prev => [
      ...prev,
      {
        fromUserId: profile.id,
        text,
        nickname: profile.nickname || 'Tú',
        photoUrl: profile.photoUrl || null
      }
    ]);
  };

  return {
    messages,
    profile,
    sendMessage
  };
};