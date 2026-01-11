// 📁 src/lib/services/Departure/useChat.ts
import { useState, useEffect } from 'react';
import socket from '@/settings/socket';

export interface Message {
  fromUserId: string;
  text: string;
  nickname: string;
  photoUrl?: string;
}

export const useChat = (roomCode: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<any>(null);

  /**
   * Cargar perfil del usuario
   */
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse?.user?.profile) {
      setProfile(authResponse.user.profile);
    }
  }, []);

  /**
   * Unirse a la sala de chat
   */
  useEffect(() => {
    if (!roomCode || !profile) return;

    socket.emit('joinSala', {
      profileId: profile.id,
      room_code: roomCode,
    });

    console.log(`💬 Chat conectado para sala: ${roomCode}`);
  }, [roomCode, profile]);

  /**
   * Escuchar mensajes entrantes
   */
  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log('📩 Nuevo mensaje:', message);

      // Solo agregar mensajes de otros usuarios
      if (message.profileId !== profile?.id) {
        setMessages(prev => [
          ...prev,
          {
            fromUserId: message.profileId,
            text: message.message,
            nickname: message.nickname,
            photoUrl: message.photoUrl,
          },
        ]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [profile]);

  /**
   * Enviar mensaje
   */
  const sendMessage = (text: string) => {
    if (!text.trim() || !profile) return;

    socket.emit('sendMessage', {
      room_code: roomCode,
      message: text.trim(),
      profileId: profile.id,
    });

    // Agregar mensaje propio a la lista
    setMessages(prev => [
      ...prev,
      {
        fromUserId: profile.id,
        text: text.trim(),
        nickname: profile.nickname,
        photoUrl: profile.photoUrl,
      },
    ]);

    console.log('📤 Mensaje enviado:', text);
  };

  return {
    messages,
    sendMessage,
    profile,
  };
};