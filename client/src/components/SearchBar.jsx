import React, { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log('Searching for:', query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center w-full px-4 py-4 bg-[#121212]"
    >
      <div className="flex w-full max-w-xl">
        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-grow px-4 py-2 text-sm text-white placeholder-gray-400 bg-[#1E1E1E] border border-[#2C2C2C] rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#12B3A1]"
        />

        {/* Button */}
        <button
          type="submit"
          className="flex items-center justify-center w-12 bg-[#2C2C2C] border border-l-0 border-[#2C2C2C] rounded-r-full hover:bg-[#12B3A1] transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
