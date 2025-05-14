import React, { useEffect, useRef, useState } from 'react'

function Notification() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

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
    <div className='relative' ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className='relative p-2 rounded-full text-white hover:bg-[#2C2C2C] transition'
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg shadow-lg z-10">
          <div className="p-4 text-white text-sm font-semibold border-b border-[#2C2C2C]">
            Notifications
          </div>
          <ul className="max-h-60 overflow-y-auto text-white text-sm divide-y divide-[#2C2C2C]">
            {/* Placeholder items - replace with dynamic data */}
          </ul>
          <div className="p-2 text-center text-sm text-[#12B3A1] hover:underline cursor-pointer">
            View all
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification