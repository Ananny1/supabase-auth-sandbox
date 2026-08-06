export function SleepingCat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} role="img" aria-label="A sleeping cartoon cat">
      <ellipse cx="50" cy="55" rx="40" ry="4" fill="currentColor" opacity="0.08" />
      <path
        d="M15 45 Q10 20 35 15 Q60 8 80 25 Q95 38 82 48 Q60 58 35 50 Q18 46 15 45 Z"
        className="fill-orange-300 dark:fill-orange-400"
      />
      <path d="M28 18 L20 6 L38 14 Z" className="fill-orange-300 dark:fill-orange-400" />
      <path d="M22 15 L17 8 L30 13 Z" className="fill-pink-200 dark:fill-pink-300" />
      <path
        d="M30 30 Q34 27 38 30"
        stroke="#2a2a2a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M78 20 Q84 16 90 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="text-orange-400 dark:text-orange-300"
      />
      <path
        d="M84 14 Q90 10 96 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="text-orange-400 dark:text-orange-300"
      />
    </svg>
  )
}

export function PawPrint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="A cat paw print">
      <ellipse cx="20" cy="26" rx="11" ry="9" className="fill-pink-300 dark:fill-pink-400" />
      <ellipse cx="8" cy="14" rx="4" ry="5" className="fill-pink-300 dark:fill-pink-400" />
      <ellipse cx="18" cy="8" rx="4" ry="5" className="fill-pink-300 dark:fill-pink-400" />
      <ellipse cx="28" cy="10" rx="4" ry="5" className="fill-pink-300 dark:fill-pink-400" />
      <ellipse cx="34" cy="18" rx="4" ry="5" className="fill-pink-300 dark:fill-pink-400" />
    </svg>
  )
}
