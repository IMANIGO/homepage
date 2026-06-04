export function buildMailto(email: string, subject: string, body: string) {
  const query = [`subject=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`].join('&');
  return `mailto:${email}?${query}`;
}
