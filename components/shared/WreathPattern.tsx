export function WreathPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.14]"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 40 + i * 38
        const sway = Math.sin(i * 0.7) * 30
        return (
          <path
            key={`l-${i}`}
            d={`M ${-20} ${y} Q ${60 + sway} ${y - 20} ${140} ${y}`}
            stroke="#1E7A3E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 40 + i * 38
        const sway = Math.sin(i * 0.7) * 30
        return (
          <path
            key={`r-${i}`}
            d={`M ${420} ${y} Q ${340 - sway} ${y - 20} ${260} ${y}`}
            stroke="#1E7A3E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}