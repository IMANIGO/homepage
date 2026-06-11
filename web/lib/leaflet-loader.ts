let leafletPromise: Promise<typeof import('leaflet')> | null = null;

export function loadLeaflet() {
  if (!leafletPromise) {
    leafletPromise = import('leaflet');
  }
  return leafletPromise;
}

export function preloadLeaflet() {
  void loadLeaflet();
}
