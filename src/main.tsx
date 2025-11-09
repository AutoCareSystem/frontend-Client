import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MockDataProvider } from './context/MockDataContext';
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockDataProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MockDataProvider>
  </StrictMode>,
)