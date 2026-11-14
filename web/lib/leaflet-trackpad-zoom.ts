import type { Map as LeafletMap } from 'leaflet';

type GestureEventLike = Event & { scale: number };

/** Two-finger trackpad scroll and pinch-to-zoom on the map. */
export function enableLeafletTrackpadZoom(map: LeafletMap) {
  map.scrollWheelZoom.enable();

  const container = map.getContainer();
  container.style.touchAction = 'none';

  let pinchBase = map.getZoom();
  const onGestureStart = (event: Event) => {
    event.preventDefault();
    pinchBase = map.getZoom();
  };
  const onGestureChange = (event: Event) => {
    event.preventDefault();
    const scale = (event as GestureEventLike).scale;
    if (!Number.isFinite(scale) || scale <= 0) {
      return;
    }
    map.setZoom(pinchBase + Math.log2(scale), { animate: false });
  };

  container.addEventListener('gesturestart', onGestureStart, { passive: false });
  container.addEventListener('gesturechange', onGestureChange, { passive: false });

  return () => {
    container.removeEventListener('gesturestart', onGestureStart);
    container.removeEventListener('gesturechange', onGestureChange);
  };
}
