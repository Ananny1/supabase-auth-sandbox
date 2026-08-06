function CatMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="A cute cartoon cat"
    >
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="currentColor" opacity="0.08" />
      <path d="M32 30 L20 8 L44 22 Z" className="fill-orange-300 dark:fill-orange-400" />
      <path d="M88 30 L100 8 L76 22 Z" className="fill-orange-300 dark:fill-orange-400" />
      <path d="M25 26 L18 12 L36 22 Z" className="fill-pink-200 dark:fill-pink-300" />
      <path d="M95 26 L102 12 L84 22 Z" className="fill-pink-200 dark:fill-pink-300" />
      <circle cx="60" cy="62" r="40" className="fill-orange-300 dark:fill-orange-400" />
      <circle cx="45" cy="58" r="4.5" fill="#2a2a2a" />
      <circle cx="75" cy="58" r="4.5" fill="#2a2a2a" />
      <circle cx="46.3" cy="56.5" r="1.3" fill="#fff" />
      <circle cx="76.3" cy="56.5" r="1.3" fill="#fff" />
      <path
        d="M56 68 Q60 72 64 68"
        stroke="#2a2a2a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M60 63 L56 68 L64 68 Z" fill="#f472b6" />
      <g stroke="#c2410c" strokeWidth="1.4" strokeLinecap="round" opacity="0.6">
        <path d="M30 64 L14 60" />
        <path d="M30 70 L14 72" />
        <path d="M90 64 L106 60" />
        <path d="M90 70 L106 72" />
      </g>
      <ellipse cx="38" cy="76" rx="6" ry="4" className="fill-pink-200 dark:fill-pink-300" opacity="0.7" />
      <ellipse cx="82" cy="76" rx="6" ry="4" className="fill-pink-200 dark:fill-pink-300" opacity="0.7" />
    </svg>
  )
}

export default CatMascot
