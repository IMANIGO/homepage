import type { VehicleIconType } from '../../lib/vehicle-icon';

const BODY = 'currentColor';
const GLASS = { fill: BODY, fillOpacity: 0.2 } as const;

function WheelCutout({ cx, cy, r = 5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} {...GLASS} />;
}

function ElectricBadge() {
  return (
    <g transform="translate(0 2)">
      <circle cx="104" cy="32" r="5.5" fill={BODY} fillOpacity={0.15} stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M105.5 29.6 102.2 33.6h2.7l-3.1 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function KleinwagenSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M24 34.5 24 27.5 29 21.5 38 18.5 68 18.5 78 21 85 26.5 88 34.5Z"
      />
      <path {...GLASS} d="M38 20.5 52 20.5 56 26 56 30 38 30Z" />
      <path {...GLASS} d="M27 24.5 35 20.5 35 28 27 28Z" />
      <WheelCutout cx={34} cy={34.5} r={4.6} />
      <WheelCutout cx={74} cy={34.5} r={4.6} />
    </g>
  );
}

function LimousineSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M14 34.5 16.5 26.5 26 20.5 38 18 72 18 82 22.5 88 29.5 90 34.5Z"
      />
      <path {...GLASS} d="M32 20 44 20 44 29 32 29Z" />
      <path {...GLASS} d="M48 20 62 20 66 29 48 29Z" />
      <path {...GLASS} d="M74 22.5 84 24.5 82 29 74 27.5Z" />
      <WheelCutout cx={30} cy={34.5} />
      <WheelCutout cx={78} cy={34.5} />
    </g>
  );
}

function KombiSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M12 34.5 14.5 26.5 24 20.5 36 18 52 18 58 18 62 14.5 86 14.5 90 18 90 34.5Z"
      />
      <path {...GLASS} d="M30 20 42 20 42 29 30 29Z" />
      <path {...GLASS} d="M46 20 58 20 58 29 46 29Z" />
      <path {...GLASS} d="M64 18.5 82 18.5 82 29 64 29Z" />
      <path {...GLASS} d="M16 23.5 26 19.5 26 27.5 16 27.5Z" />
      <WheelCutout cx={28} cy={34.5} />
      <WheelCutout cx={76} cy={34.5} />
    </g>
  );
}

function CoupeSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M18 34.5 21 27.5 30 21.5 42 19 58 19 72 24.5 78 34.5Z"
      />
      <path {...GLASS} d="M34 21 52 21 62 33 34 33Z" />
      <WheelCutout cx={30} cy={34.5} r={5} />
      <WheelCutout cx={72} cy={34.5} r={5} />
    </g>
  );
}

function SuvSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M10 34.5 13 25.5 24 19.5 38 17.5 72 17.5 84 21.5 90 28.5 92 34.5Z"
      />
      <path {...GLASS} d="M32 20 46 20 46 30 32 30Z" />
      <path {...GLASS} d="M50 20 66 20 70 30 50 30Z" />
      <path {...GLASS} d="M74 21.5 84 23.5 82 30 74 28Z" />
      <WheelCutout cx={28} cy={34.5} r={5.4} />
      <WheelCutout cx={78} cy={34.5} r={5.4} />
    </g>
  );
}

function CabrioSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M16 34.5 18.5 28.5 28 23.5 40 21.5 64 21.5 76 25.5 82 34.5Z"
      />
      <path {...GLASS} d="M34 23.5 52 23.5 58 33 34 33Z" />
      <path {...GLASS} d="M68 26.5 78 28.5 76 33 68 31Z" />
      <WheelCutout cx={30} cy={34.5} />
      <WheelCutout cx={74} cy={34.5} />
    </g>
  );
}

function PickupSketch() {
  return (
    <g>
      <path fill={BODY} d="M12 34.5 14 27.5 22 24.5 38 24.5 42 34.5Z" />
      <path fill={BODY} d="M42 34.5 42 23.5 92 23.5 96 27.5 96 34.5Z" />
      <path fill={BODY} d="M44 23.5 48 18.5 62 18.5 66 23.5Z" />
      <path {...GLASS} d="M50 20.5 58 20.5 58 27.5 50 27.5Z" />
      <path {...GLASS} d="M62 20.5 70 20.5 70 27.5 62 27.5Z" />
      <path {...GLASS} d="M44 26.5 94 26.5 94 29 44 29Z" />
      <WheelCutout cx={24} cy={34.5} />
      <WheelCutout cx={38} cy={34.5} />
      <WheelCutout cx={82} cy={34.5} />
    </g>
  );
}

function VanSketch() {
  return (
    <g>
      <path
        fill={BODY}
        d="M8 34.5 10.5 25.5 22 19.5 36 17.5 84 17.5 92 22.5 96 28.5 98 34.5Z"
      />
      <path {...GLASS} d="M26 19.5 38 19.5 38 30 26 30Z" />
      <path {...GLASS} d="M42 19.5 54 19.5 54 30 42 30Z" />
      <path {...GLASS} d="M58 19.5 70 19.5 70 30 58 30Z" />
      <path {...GLASS} d="M74 19.5 86 19.5 86 30 74 30Z" />
      <WheelCutout cx={26} cy={34.5} r={5.2} />
      <WheelCutout cx={78} cy={34.5} r={5.2} />
    </g>
  );
}

function TransporterSketch() {
  return (
    <g>
      <path fill={BODY} d="M6 34.5 6 10.5 46 10.5 46 34.5Z" />
      <path fill={BODY} d="M48 34.5 48 24.5 94 24.5 98 28.5 98 34.5Z" />
      <path fill={BODY} d="M50 24.5 54 18.5 68 18.5 72 24.5Z" />
      <path {...GLASS} d="M58 20.5 66 20.5 66 27.5 58 27.5Z" />
      <path {...GLASS} d="M70 20.5 78 20.5 78 27.5 70 27.5Z" />
      <path {...GLASS} d="M10 13.5 40 13.5 40 28.5 10 28.5Z" />
      <WheelCutout cx={22} cy={34.5} r={5.2} />
      <WheelCutout cx={78} cy={34.5} r={5.2} />
    </g>
  );
}

const sketches: Record<VehicleIconType, () => JSX.Element> = {
  transporter: TransporterSketch,
  van: VanSketch,
  suv: SuvSketch,
  cabrio: CabrioSketch,
  pickup: PickupSketch,
  limousine: LimousineSketch,
  kombi: KombiSketch,
  kleinwagen: KleinwagenSketch,
  coupe: CoupeSketch
};

type VehicleIconSketchProps = {
  type: VehicleIconType;
  electric?: boolean;
};

export function VehicleIconSketch({ type, electric = false }: VehicleIconSketchProps) {
  const Sketch = sketches[type];
  return (
    <g>
      <Sketch />
      {electric ? <ElectricBadge /> : null}
    </g>
  );
}
