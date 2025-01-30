import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { Send, Loader2, Users, Smile, Paperclip, Moon, Sun } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  createdAt: Timestamp;
}

export const ChatApp = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      setMessages(newMessages);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send the message. Please try again.');
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">Please sign in to access the chat.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-12rem)] ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} rounded-xl shadow-lg overflow-hidden border border-gray-100`}>
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Chat Room</h2>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <Users className="w-4 h-4 mr-1" />
            <span>{messages.length} messages</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-700 rounded-full">
            <span className="text-sm text-green-700 dark:text-green-200">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.userId === user.uid ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-end space-x-2">
                {message.userId !== user.uid && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(message.userEmail)}
                  </div>
                )}
                <div
                  className={`max-w-[70%] break-words rounded-2xl px-4 py-2 shadow-sm ${
                    message.userId === user.uid
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.userId === user.uid ? 'You' : message.userEmail}
                  </div>
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${
                    message.userId === user.uid ? 'text-indigo-100' : 'text-gray-400 dark:text-gray-300'
                  }`}>
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
          >
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-200 dark:border-gray-600 px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <button
            type="button"
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
