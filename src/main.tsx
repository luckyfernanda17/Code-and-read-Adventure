import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register the service worker for offline classroom usage
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Versi baru game Code & Read Adventure tersedia.');
  },
  onOfflineReady() {
    console.log('Game Code & Read Adventure kini siap dimainkan secara offline di kelas!');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
