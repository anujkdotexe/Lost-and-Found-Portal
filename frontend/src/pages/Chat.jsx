import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';

const Chat = () => {
    const { userId } = useParams(); // The other person's ID
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('itemId');
    const { user } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`/api/chat/${userId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Initialize Socket
        const newSocket = io('/'); // Use proxy in dev, or specific URL
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_room', user._id);
        });

        newSocket.on('receive_message', (msg) => {
            if (msg.sender === userId || msg.receiver === user._id) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => newSocket.disconnect();
    }, [userId, user, navigate]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msgData = {
            receiverId: userId,
            content: newMessage,
            itemId: itemId || null
        };

        try {
            // Save to DB
            const { data } = await axios.post('/api/chat', msgData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // Emit to Socket
            socket.emit('send_message', {
                sender: user._id,
                receiver: userId,
                content: newMessage,
                createdAt: new Date()
            });

            setMessages(prev => [...prev, { ...data, sender: user._id }]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto h-[80vh] flex flex-col bg-white rounded-3xl subtle-shadow border border-gray-100 overflow-hidden animate-fade-in mt-4">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                            U
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 leading-tight">Conversation</h2>
                            <p className="text-xs text-gray-500 font-medium">Safe & secure messaging</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#fcfcfd] flex flex-col gap-3">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                            <Send size={24} className="text-gray-300" />
                        </div>
                        <p className="font-semibold text-gray-500">Say hello! 👋</p>
                        <p className="text-sm">Start the conversation about the item.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender === user?._id;
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${isMe
                                        ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-50 border-none px-4 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-full flex items-center justify-center transition-all ${newMessage.trim()
                                ? 'bg-[var(--color-primary)] text-white hover:shadow-md hover:scale-105'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
