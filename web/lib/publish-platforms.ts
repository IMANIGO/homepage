export type PublishPlatform = {
  label: string;
  url?: string;
};

export function normalizePublishPlatforms(
  platforms?: (string | { label?: string; url?: string })[] | null,
  legacyUrl?: string
): PublishPlatform[] {
  const result: PublishPlatform[] = [];

  for (const entry of platforms ?? []) {
    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed) {
        result.push({ label: trimmed });
      }
      continue;
    }

    const label = entry?.label?.trim();
    if (label) {
      result.push({ label, url: entry.url?.trim() || undefined });
    }
  }

  if (!legacyUrl?.trim()) {
    return result;
  }

  const url = legacyUrl.trim();
  const withUrl = result.find((platform) => platform.url === url);
  if (withUrl) {
    return result;
  }

  const webEntry = result.find((platform) => /^web$/i.test(platform.label));
  if (webEntry && !webEntry.url) {
    webEntry.url = url;
    return result;
  }

  if (!webEntry) {
    result.push({ label: 'Web', url });
  }

  return result;
}
