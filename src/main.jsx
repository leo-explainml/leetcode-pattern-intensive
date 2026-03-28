import React from 'react'
import ReactDOM from 'react-dom/client'
import LeetCodeTracker from './App.jsx'

// Shim window.storage with localStorage
window.storage = {
  get: (key) => {
    const value = localStorage.getItem(key);
    return value !== null ? { value } : null;
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LeetCodeTracker />
  </React.StrictMode>
)
