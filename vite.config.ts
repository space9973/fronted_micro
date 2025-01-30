import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
  name: 'host-app',
  remotes: {
    chatApp: '/chat/remoteEntry.js',
    emailApp: '/email/remoteEntry.js', // Ensure this path is correct and reachable
  },
  shared: ['react', 'react-dom', 'zustand'],
})

  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});