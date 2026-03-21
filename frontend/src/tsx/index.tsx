import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/index.css';
import '../css/components.css';
import { WizardProvider } from './context/WizardContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';

createRoot(document.getElementById('landing')!).render(
  <StrictMode>
    <AuthProvider>
      <WizardProvider>
        <App />
      </WizardProvider>
    </AuthProvider>
  </StrictMode>,
);
