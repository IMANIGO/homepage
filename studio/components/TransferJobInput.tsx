import { useEffect, useRef, useState } from 'react';
import { type ObjectInputProps, set } from 'sanity';
import { computeRouteStats, formatTransferJobTitle } from '../lib/routeStats';

function asStopList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
}

function routeKey(value: Record<string, unknown> | undefined) {
  const tourType = String(value?.tourType ?? 'ab');
  const from = String(value?.routeFrom ?? '').trim();
  const via = String(value?.routeVia ?? '').trim();
  const to = String(value?.routeTo ?? '').trim();
  const hidden = asStopList(value?.hiddenStops).join('~');
  const afterVia = asStopList(value?.hiddenStopsAfterVia).join('~');
  return `${tourType}|${from}|${via}|${to}|${hidden}|${afterVia}`;
}

function isRouteComplete(value: Record<string, unknown> | undefined) {
  const from = String(value?.routeFrom ?? '').trim();
  const to = String(value?.routeTo ?? '').trim();
  const via = String(value?.routeVia ?? '').trim();
  const tourType = String(value?.tourType ?? 'ab');
  if (!from || !to) {
    return false;
  }
  return tourType !== 'abc' || Boolean(via);
}

export function TransferJobInput(props: ObjectInputProps) {
  const value = props.value as Record<string, unknown> | undefined;
  const onChange = props.onChange;
  const [status, setStatus] = useState('');
  const hydrated = useRef(false);
  const appliedKey = useRef('');
  const requestId = useRef(0);

  const applyFromRoute = async (source: Record<string, unknown> | undefined, key: string) => {
    const id = ++requestId.current;
    setStatus('Route wird berechnet …');
    const title = formatTransferJobTitle(
      String(source?.tourType ?? 'ab'),
      String(source?.routeFrom ?? ''),
      String(source?.routeVia ?? ''),
      String(source?.routeTo ?? '')
    );
    const stats = await computeRouteStats({
      tourType: String(source?.tourType ?? 'ab'),
      routeFrom: String(source?.routeFrom ?? ''),
      routeVia: String(source?.routeVia ?? ''),
      routeTo: String(source?.routeTo ?? ''),
      hiddenStops: asStopList(source?.hiddenStops),
      hiddenStopsAfterVia: asStopList(source?.hiddenStopsAfterVia)
    });

    if (id !== requestId.current) {
      return;
    }

    if (!stats) {
      if (title) {
        onChange(set(title, ['title']));
      }
      setStatus('Ort nicht gefunden — Titel übernommen, Strecke/Zeit bitte manuell eintragen.');
      appliedKey.current = key;
      return;
    }

    onChange([
      set(title, ['title']),
      set(stats.distanceKm, ['distanceKm']),
      set(stats.durationHours, ['durationHours'])
    ]);
    appliedKey.current = key;
    setStatus(
      `Übernommen: ${title} · ${stats.distanceKm} km · ${stats.durationHours} h (eine Nachkommastelle). Kann überschrieben werden.`
    );
  };

  useEffect(() => {
    const key = routeKey(value);
    if (!hydrated.current) {
      hydrated.current = true;
      appliedKey.current = isRouteComplete(value) ? key : '';
      return;
    }

    if (!isRouteComplete(value) || key === appliedKey.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void applyFromRoute(value, key);
    }, 800);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.tourType, value?.routeFrom, value?.routeVia, value?.routeTo, value?.hiddenStops, value?.hiddenStopsAfterVia]);

  return (
    <div>
      <div style={{ marginBottom: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            if (!isRouteComplete(value)) {
              setStatus('Bitte zuerst Start und Ziel (bei A-B-C auch Zwischenstopp) eintragen.');
              return;
            }
            appliedKey.current = '';
            void applyFromRoute(value, routeKey(value));
          }}
          style={{
            border: '1px solid #cbd5e1',
            background: '#fff',
            borderRadius: 6,
            padding: '0.35rem 0.7rem',
            cursor: 'pointer'
          }}
        >
          Titel, Strecke und Zeit neu berechnen
        </button>
        {status ? <span style={{ color: '#64748b', fontSize: 13 }}>{status}</span> : null}
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
