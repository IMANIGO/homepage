type FlagIconProps = {
  locale: 'de' | 'en';
  className?: string;
};

export function FlagIcon({ locale, className = 'h-3.5 w-5 shrink-0 rounded-sm' }: FlagIconProps) {
  if (locale === 'de') {
    return (
      <svg viewBox="0 0 5 3" className={className} aria-hidden="true">
        <rect width="5" height="1" y="0" fill="#000000" />
        <rect width="5" height="1" y="1" fill="#DD0000" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <clipPath id="uk-flag-clip">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uk-flag-slice">
        <path d="M30,15 h30 v15 z v-30 h-30 z h-30 v15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#uk-flag-slice)" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
