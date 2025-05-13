import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateButton() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative inline-block text-left' ref={menuRef}>

      {/*create button*/}
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center gap-2 px-4 py-2 text-white bg-[#2C2C2C] hover:bg-[#12B3A1] rounded-lg transition duration-200'
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Create</span>
      </button>

      {/* dropdown button*/}
      {open && (
        <div className='absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-lg bg-[#1E1E1E] border border-[#2C2C2C] shadow-lg'>
          <button
            onClick={() => navigate("/upload-video")}
            className='block w-full px-4 py-2 text-left text-white hover:bg-[#2C2C2C]'
          >📹 Upload Video</button>

          <button
            onClick={() => navigate("/tweet/create-tweet")}
            className='block w-full px-4 py-2 text-left text-white hover:bg-[#2C2C2C]'
          >✍️ Create Post</button>
        </div>
      )}
    </div>
  )
}

export default CreateButton