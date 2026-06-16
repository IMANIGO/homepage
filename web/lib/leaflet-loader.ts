let leafletPromise: Promise<typeof import('leaflet')> | null = null;
let cartoPreconnectAdded = false;

function ensureCartoPreconnect() {
  if (typeof document === 'undefined' || cartoPreconnectAdded) {
    return;
  }

  cartoPreconnectAdded = true;

  for (const origin of ['https://a.basemaps.cartocdn.com', 'https://b.basemaps.cartocdn.com']) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}

export function loadLeaflet() {
  if (!leafletPromise) {
    leafletPromise = (async () => {
      ensureCartoPreconnect();
      await import('leaflet/dist/leaflet.css');
      return import('leaflet');
    })();
  }

  return leafletPromise;
}
