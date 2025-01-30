import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { ChatApp } from './components/chat/ChatApp';
import { EmailApp } from './components/email/EmailApp';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat/*" element={<ChatApp />} />
          <Route path="email/*" element={<EmailApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;