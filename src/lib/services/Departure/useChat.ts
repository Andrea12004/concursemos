// 📁 src/lib/services/Departure/useChat.ts
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [user, setUser] = useState<any>(null);
  
  // Refs para evitar dependencias circulares
  const hasJoinedRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);

  /**
   * ============================================
   * 1️⃣ CARGAR PERFIL DEL USUARIO - SOLO UNA VEZ
   * ============================================
   */
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse?.user?.profile) {
      setProfile(authResponse.user.profile);
      setUser(authResponse.user);
    }
  }, []); // ✅ Solo al montar

  /**
   * ============================================
   * 2️⃣ UNIRSE A LA SALA DE CHAT - SOLO UNA VEZ
   * ============================================
   */
  useEffect(() => {
    if (!roomCode || !profile?.id || hasJoinedRef.current) return;

    console.log(`💬 Uniéndose al chat de sala: ${roomCode}`);

    socket.emit('joinSala', {
      profileId: profile.id,
      room_code: roomCode,
    });

    hasJoinedRef.current = true;

  }, [roomCode, profile?.id]);

  /**
   * ============================================
   * 3️⃣ ESCUCHAR MENSAJES ENTRANTES - SIN messages EN DEPS
   * ============================================
   */
  useEffect(() => {
    if (!profile?.id) return;

    /**
     * Manejar mensajes recibidos
     */
    const handleReceiveMessage = (message: any) => {
      console.log('📩 Nuevo mensaje:', message);

      // Solo agregar mensajes de OTROS usuarios
      if (message.profileId !== profile.id) {
        const newMessage: Message = {
          fromUserId: message.profileId,
          text: message.message,
          nickname: message.nickname,
          photoUrl: message.photoUrl,
        };

        setMessages(prev => [...prev, newMessage]);
        messagesRef.current = [...messagesRef.current, newMessage];
      }
    };

    // Registrar listener
    socket.on('receiveMessage', handleReceiveMessage);

    // Cleanup
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [profile?.id]); // ✅ SOLO profile.id - NO messages

  /**
   * ============================================
   * FUNCIÓN PARA ENVIAR MENSAJES
   * ============================================
   */
  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || !profile || !roomCode) return;

    console.log('📤 Enviando mensaje:', text);

    // Emitir al servidor
    socket.emit('sendMessage', {
      room_code: roomCode,
      message: text.trim(),
      profileId: profile.id,
    });

    // Agregar mensaje propio a la lista
    const newMessage: Message = {
      fromUserId: profile.id,
      text: text.trim(),
      nickname: profile.nickname,
      photoUrl: profile.photoUrl,
    };

    setMessages(prev => [...prev, newMessage]);
    messagesRef.current = [...messagesRef.current, newMessage];

  }, [profile, roomCode]); // ✅ Solo profile y roomCode

  /**
   * ============================================
   * RETORNO DEL HOOK
   * ============================================
   */
  return {
    // Estados
    messages,
    profile,
    user,
    
    // Funciones
    sendMessage,
  };
};