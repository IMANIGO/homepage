import { normalizeVehicleIcon } from '../../lib/vehicle-icon';
import { VehicleIconSketch } from './vehicle-icon-sketches';

type VehicleSilhouetteProps = {
  vehicleIcon?: string | null;
  vehicleElectric?: boolean | null;
  vehicleModel?: string | null;
  className?: string;
};

export function VehicleSilhouette({
  vehicleIcon,
  vehicleElectric = false,
  vehicleModel,
  className = ''
}: VehicleSilhouetteProps) {
  const iconType = normalizeVehicleIcon(vehicleIcon);
  if (!iconType) {
    return null;
  }

  const label = vehicleModel?.trim() || vehicleIcon || '';

  return (
    <div
      className={`flex h-12 w-full items-center justify-center text-accent sm:h-11 sm:w-44 ${className}`}
      title={label}
      aria-hidden={!label}
    >
      <svg viewBox="0 0 110 38" className="h-full w-full max-w-[12rem]" role="presentation" preserveAspectRatio="xMidYMid meet">
        <VehicleIconSketch type={iconType} electric={Boolean(vehicleElectric)} />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
