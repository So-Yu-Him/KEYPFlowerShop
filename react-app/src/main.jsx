import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Mount the React app into <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing (React Router v6) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
