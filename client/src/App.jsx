import { useState } from 'react'
import './App.css'
import { ToastContainer } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [error, setError] = useState('');
  const notify = () => toast("Wow so easy!",{
    position: 'bottom-right',
    autoClose: 3000,
  });
  return (
    <div>
      <h1 className='text-sky-500 text-xl'>TubBit - A full stack project</h1>
      <div className='w-2.5 h-1.5 '>
      <button className='bg-purple-500 hover:cursor-pointer' onClick={notify}>Notify!</button>
      <ToastContainer/>
      </div>
    </div>
  )
}

export default App
