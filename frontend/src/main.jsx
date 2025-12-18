import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// 引入全局样式，确保 Tailwind 生效
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)