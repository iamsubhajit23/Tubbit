
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const padded = (n) => String(n).padStart(2, "0");

  return h > 0
    ? `${padded(h)}:${padded(m)}:${padded(s)}`
    : `${padded(m)}:${padded(s)}`;
};

export default formatDuration;
