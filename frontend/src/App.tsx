import { useState } from 'react'
import './App.css'
// import tailwindcss from '@tailwindcss/vite' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='text-center font-bold text-black text-2xl'>MoneyTrack</div>
    </>
  )
}

export default App
