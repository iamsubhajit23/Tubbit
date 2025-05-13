import React from 'react';

function Logo() {
  return (
    <div className="flex items-center">
      <svg
        width="140"
        height="50"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-auto"
      >
        <style>
          {`
            .play-icon-bg { fill: #11B0A4; }
            .text { fill: #121212; font-family: 'Segoe UI', sans-serif; font-size: 36px; font-weight: bold; }
          `}
        </style>
        <g transform="translate(10,10)">
          <path className="play-icon-bg" d="M0 20c0-11 9-20 20-20h30c11 0 20 9 20 20v30c0 11-9 20-20 20h-20l-10 10v-10c-11 0-20-9-20-20V20z"/>
          <polygon fill="#ffffff" points="25,22 45,35 25,48" />
          <text className="text" x="80" y="45">Tubbit</text>
        </g>
      </svg>
    </div>
  );
}

export default Logo;
