import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { TimeProvider } from './context/TimeContext.jsx'
import './index.css'

const getBasename = () => {
  const viteBase = import.meta.env.BASE_URL
  if (viteBase && viteBase !== '/') {
    return viteBase.replace(/\/$/, '')
  }
  return '/'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename()}>
      <TimeProvider>
        <App />
      </TimeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
