// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Renders the primary routing component
import { AuthProvider } from './components/Authcontext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);