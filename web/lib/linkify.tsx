import { Fragment, type ReactNode } from 'react';

const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi;
const urlPattern = /(https?:\/\/[^\s<]+[^\s<.,;:!?'")\]}>]|www\.[^\s<]+[^\s<.,;:!?'")\]}>])/gi;

const linkClassName = 'text-accent underline-offset-2 hover:underline';

function normalizeHref(url: string) {
  return url.startsWith('www.') ? `https://${url}` : url;
}

function linkNode(key: number, href: string, label: string) {
  return (
    <a key={key} href={href} className={linkClassName} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

function linkifySegment(segment: string, keyStart: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = keyStart;
  let match: RegExpExecArray | null;

  urlPattern.lastIndex = 0;
  while ((match = urlPattern.exec(segment)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(segment.slice(lastIndex, match.index));
    }
    const url = match[0];
    nodes.push(linkNode(key++, normalizeHref(url), url));
    lastIndex = match.index + url.length;
  }

  if (lastIndex < segment.length) {
    nodes.push(segment.slice(lastIndex));
  }

  return nodes.length ? nodes : [segment];
}

export function linkifyText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  markdownLinkPattern.lastIndex = 0;
  while ((match = markdownLinkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...linkifySegment(text.slice(lastIndex, match.index), key));
      key += 32;
    }
    parts.push(linkNode(key++, match[2], match[1]));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(...linkifySegment(text.slice(lastIndex), key));
  }

  if (!parts.length) {
    return text;
  }

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}
