import React, { useState, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import IconSend from "./IconSend";
import "./css/chat.css";

// Definición de tipos
interface Profile {
  id: string;
  nickname: string;
  photoUrl?: string;
}

interface User {
  id: string;
  profile: Profile;
}

interface AuthResponse {
  accesToken: string;
  user: User;
}

interface Message {
  fromUserId: string;
  text: string;
  nickname: string;
  photoUrl?: string;
}

interface SelectedUser {
  messages: Message[];
  userId: string | null;
  name: string;
  path: string;
}

const Chat: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [token, setToken] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<SelectedUser>({
    messages: [],
    userId: null,
    name: "Sala de Chat",
    path: "",
  });
  const [textMessage, setTextMessage] = useState<string>("");

  // Cargar los datos del localStorage (simulado para maqueta)
  useEffect(() => {
    // Para la maqueta, creamos un perfil falso
    const mockProfile: Profile = {
      id: "user-123",
      nickname: "Tú",
      photoUrl: "/images/Logos/Logo-login.png",
    };

    const mockUser: User = {
      id: "user-123",
      profile: mockProfile,
    };

    setProfile(mockProfile);
    setUser(mockUser);

    // Si quieres simular el localStorage:
    // const authResponse: AuthResponse = {
    //     accesToken: 'mock-token',
    //     user: mockUser
    // };
    // localStorage.setItem('authResponse', JSON.stringify(authResponse));
  }, []);

  // Simular mensajes recibidos (para maqueta)
  useEffect(() => {
    // Mensajes iniciales para la demo
    const initialMessages: Message[] = [
      {
        fromUserId: "bot-001",
        text: "¡Bienvenido a la sala de chat!",
        nickname: "Sistema",
        photoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=system",
      },
      {
        fromUserId: "player-001",
        text: "Hola a todos, ¿listos para jugar?",
        nickname: "Jugador1",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jugador1",
      },
      {
        fromUserId: "player-002",
        text: "¡Sí, vamos a ganar!",
        nickname: "Jugador2",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jugador2",
      },
    ];

    setSelectedUser((prev) => ({
      ...prev,
      messages: initialMessages,
    }));

    // Simular mensajes entrantes periódicamente
    const interval = setInterval(() => {
      const randomMessages = [
        "¿Alguien quiere ser mi compañero?",
        "¡Buena suerte a todos!",
        "¿Qué categoría toca ahora?",
        "¡Vamos equipo!",
        "Estoy nervioso 😅",
      ];

      const randomUsers = [
        { id: "player-003", nickname: "Jugador3" },
        { id: "player-004", nickname: "Jugador4" },
        { id: "player-005", nickname: "Jugador5" },
      ];

      const randomUser =
        randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const randomMessage =
        randomMessages[Math.floor(Math.random() * randomMessages.length)];

      const newMessage: Message = {
        fromUserId: randomUser.id,
        text: randomMessage,
        nickname: randomUser.nickname,
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomUser.nickname}`,
      };

      setSelectedUser((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    }, 10000); // Nuevo mensaje cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  // Enviar el mensaje (simulado para maqueta)
  const sendMessage = (): void => {
    if (textMessage.trim() && profile) {
      const newMessage: Message = {
        fromUserId: profile.id,
        text: textMessage,
        nickname: profile.nickname,
        photoUrl: profile.photoUrl,
      };

      setSelectedUser((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, newMessage],
      }));

      setTextMessage("");

      // Simular respuesta automática después de 2 segundos
      setTimeout(() => {
        const autoResponses = [
          "¡Buena pregunta!",
          "Estoy de acuerdo contigo",
          "¿Alguien más opina lo mismo?",
          "¡Excelente punto!",
          "Vamos a ver qué pasa",
        ];

        const randomResponse =
          autoResponses[Math.floor(Math.random() * autoResponses.length)];
        const randomBotUser = {
          id: "bot-" + Date.now(),
          nickname: ["BotHelper", "AutoRespuesta", "Asistente"][
            Math.floor(Math.random() * 3)
          ],
        };

        const botMessage: Message = {
          fromUserId: randomBotUser.id,
          text: randomResponse,
          nickname: randomBotUser.nickname,
          photoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=bot",
        };

        setSelectedUser((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }, 2000);
    }
  };

  // Mover la vista al final del chat
  const scrollToBottom = (): void => {
    const element = document.querySelector(".container-space-chat2");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser.messages]);

  const sendMessageHandle = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  //revisar
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTextMessage(e.target.value);
  };

  const getPhotoUrl = (message: Message): string => {
    if (message.photoUrl) {
      return message.photoUrl;
    }
    return "/images/Logos/Logo-login.png";
  };

  const isOwnMessage = (fromUserId: string): boolean => {
    return profile?.id === fromUserId;
  };

  return (
    <div className="panel p-0 flex-1 h-full w-full">
      <div className="relative h-full w-full">
        <PerfectScrollbar className="relative w-full chat-conversation-box container-space-chat">
          <div className="space-y-5 p-4 w-full container-space-chat2">
            {selectedUser.messages.map((message, index) => (
              <div key={index} className="w-full">
                {/** Use isOwnMessage to avoid accessing profile when null */}
                <div
                  className={`flex items-end gap-3 mensaje-container ${
                    isOwnMessage(message.fromUserId) ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`flex-none ${
                      isOwnMessage(message.fromUserId) ? "order-2" : ""
                    }`}
                  >
                    {isOwnMessage(message.fromUserId) ? (
                      <img
                        src={profile?.photoUrl ?? "/images/Logo-login.png"}
                        className="rounded-full h-10 w-10 object-cover"
                        alt=""
                      />
                    ) : (
                      <img
                        src={
                          message.photoUrl
                            ? `https://api.backconcursemos.com${message.photoUrl}`
                            : "/images/Logo-login.png"
                        }
                        className="rounded-full h-10 w-10 object-cover"
                        alt=""
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      isOwnMessage(message.fromUserId)
                        ? "container-emisor"
                        : "container-receptor"
                    }`}
                  >
                    <div className="name-user-chat">
                      <p className="truncate m-0">{message.nickname}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-4 py-2 rounded-md message-text-user`}>
                        <p className="">{message.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PerfectScrollbar>
        <div className="p-4 absolute bottom-0 left-0 w-full rounded-b-[20px] bg-[#F7F8FA]">
          <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center">
            <div className="relative flex-1 w-full">
              <input
                className="form-input rounded-full border-0 bg-[#f4f4f4] px-6 focus:outline-none py-2 w-4/5"
                placeholder="Escribe acá tu mensaje"
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyUp={sendMessageHandle}
              />
              <button
                type="button"
                className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 hover:text-primary"
                onClick={() => sendMessage()}
                disabled={!textMessage.trim()} // Deshabilitar el botón si no hay texto
              >
                <IconSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
