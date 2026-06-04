type GlowDividerProps = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

export function GlowDivider({ orientation = 'horizontal', className = '' }: GlowDividerProps) {
  const orientationClass = orientation === 'vertical' ? 'glow-divider-vertical' : 'glow-divider-horizontal';

  return <div className={`glow-divider ${orientationClass} ${className}`.trim()} aria-hidden="true" />;
}
