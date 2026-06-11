'use client';

import { useState } from 'react';
import { buildMailto } from '../../lib/mailto';

type EmailLinkProps = {
  email: string;
  subject?: string;
  body?: string;
  className?: string;
  copyLabel: string;
  copiedLabel: string;
  children: React.ReactNode;
};

export function EmailLink({
  email,
  subject = '',
  body = '',
  className = 'btn-primary inline-block',
  copyLabel,
  copiedLabel,
  children
}: EmailLinkProps) {
  const [copied, setCopied] = useState(false);
  const href = buildMailto(email, subject, body);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(copyLabel, email);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <a href={href} className={className} target="_self" rel="noopener noreferrer">
        {children}
      </a>
      <button
        type="button"
        className="text-sm text-slate-400 underline-offset-2 hover:text-accent hover:underline"
        onClick={() => void copyEmail()}
      >
        {copied ? copiedLabel : `${copyLabel} (${email})`}
      </button>
    </div>
  );
}
