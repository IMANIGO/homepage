let leafletPromise: Promise<typeof import('leaflet')> | null = null;
let tilePreconnectAdded = false;

function ensureTilePreconnect() {
  if (typeof document === 'undefined' || tilePreconnectAdded) {
    return;
  }

  tilePreconnectAdded = true;

  for (const origin of ['https://a.tile.openstreetmap.org', 'https://b.tile.openstreetmap.org']) {
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
      ensureTilePreconnect();
      await import('leaflet/dist/leaflet.css');
      return import('leaflet');
    })();
  }

  return leafletPromise;
}
