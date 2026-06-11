export const vehicleIconTypes = [
  'transporter',
  'van',
  'suv',
  'cabrio',
  'pickup',
  'limousine',
  'kombi',
  'kleinwagen',
  'coupe'
] as const;

export type VehicleIconType = (typeof vehicleIconTypes)[number];

export function isVehicleIconType(value?: string | null): value is VehicleIconType {
  return Boolean(value && vehicleIconTypes.includes(value as VehicleIconType));
}

export function normalizeVehicleIcon(value?: string | null): VehicleIconType | null {
  return isVehicleIconType(value) ? value : null;
}
