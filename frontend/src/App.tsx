import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/test')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error('Erreur:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          MoneyTrack
        </h1>
        <p className="text-gray-600">
          {message || 'Connexion au serveur...'}
        </p>
      </div>
    </div>
  )
}

export default App