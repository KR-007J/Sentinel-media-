import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1120',
            color: '#e2e8f8',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '13px',
          },
        }}
      />
    </HashRouter>
  </React.StrictMode>
);
