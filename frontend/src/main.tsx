import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from './components/ui/Toast';
import App from './App.tsx';
import './index.css';
import './styles/wp-admin.css';
import './i18n';

const GOOGLE_CLIENT_ID = '184550669669-1r9ic298uuq6hljges5p1vc4i88ieqk6.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
