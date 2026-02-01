
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useChat } from '@/lib/services/Departure/useChat';
import IconSend from './IconSend';
import "./css/chat.css";

export const Chat: React.FC = () => {
    const { id: roomCode } = useParams<{ id: string }>();
    const [textMessage, setTextMessage] = useState('');
    
    // Hook con toda la lógica del chat
    const {
        messages,
        profile,
        sendMessage,
    } = useChat(roomCode || '');

  
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

  
    const scrollToBottom = () => {
        const element = document.querySelector('.container-space-chat2');
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    };

    
    const sendMessageHandle = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (textMessage.trim()) {
            sendMessage(textMessage);
            setTextMessage('');
        }
    };

    const getPhotoUrl = (photoUrl?: string): string => {
        if (photoUrl) {
            if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
                return photoUrl;
            }
            return `https://api.backconcursemos.com${photoUrl}`;
        }
        return "/images/Logos/Logo-login.png";
    };

    return (
        <div className="panel p-0 flex-1 h-full w-full">
            <div className="relative h-full w-full">
                <PerfectScrollbar className="relative w-full chat-conversation-box container-space-chat">
                    <div className="space-y-5 p-4 w-full container-space-chat2">
                        {messages.map((message, index) => (
                            <div key={index} className="w-full">
                                <div className={`flex items-end gap-3 mensaje-container ${
                                    profile?.id === message.fromUserId ? 'justify-end' : ''
                                }`}>
                                    <div className={`flex-none ${
                                        profile?.id === message.fromUserId ? 'order-2' : ''
                                    }`}>
                                        {profile?.id === message.fromUserId ? (
                                            <img 
                                                src={getPhotoUrl(profile?.photoUrl)} 
                                                className="rounded-full h-10 w-10 object-cover" 
                                                alt={message.nickname}
                                            />
                                        ) : (
                                            <img 
                                                src={getPhotoUrl(message.photoUrl)} 
                                                className="rounded-full h-10 w-10 object-cover" 
                                                alt={message.nickname}
                                            />
                                        )}
                                    </div>
                                    <div className={`${
                                        profile?.id === message.fromUserId 
                                            ? 'container-emisor' 
                                            : 'container-receptor'
                                    }`}>
                                        <div className="name-user-chat">
                                            <p className='truncate m-0'>{message.nickname}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-4 py-2 rounded-md message-text-user">
                                                <p className=''>{message.text}</p>
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
                                onClick={handleSendMessage}
                                disabled={!textMessage.trim()}
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