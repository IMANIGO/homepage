export const vehicleConditionValues = ['new', 'youngUsed', 'used'] as const;

export type VehicleCondition = (typeof vehicleConditionValues)[number];

const conditionFromText: Array<[RegExp, VehicleCondition]> = [
  [/junger\s+gebraucht/i, 'youngUsed'],
  [/neuwagen/i, 'new'],
  [/new\s+car/i, 'new'],
  [/young\s+used/i, 'youngUsed'],
  [/gebraucht/i, 'used'],
  [/used\s+car/i, 'used']
];

export function isVehicleCondition(value: string | null | undefined): value is VehicleCondition {
  return vehicleConditionValues.includes(value as VehicleCondition);
}

export function parseVehicleFields(vehicleModel?: string | null, vehicleCondition?: string | null) {
  if (isVehicleCondition(vehicleCondition)) {
    return { model: vehicleModel?.trim() || '', condition: vehicleCondition };
  }

  const raw = vehicleModel?.trim() ?? '';
  const wrapped = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (wrapped) {
    const condition = conditionFromText.find(([pattern]) => pattern.test(wrapped[2]))?.[1];
    if (condition) {
      return { model: wrapped[1].trim(), condition };
    }
  }

  const fromModel = conditionFromText.find(([pattern]) => pattern.test(raw))?.[1];
  return { model: raw, condition: fromModel };
}

export function formatVehicleLabel(
  vehicleModel: string | null | undefined,
  vehicleCondition: string | null | undefined,
  labels: Record<VehicleCondition, string>
) {
  const { model, condition } = parseVehicleFields(vehicleModel, vehicleCondition);
  const conditionLabel = condition ? labels[condition] : '';
  if (model && conditionLabel) {
    return `${model} (${conditionLabel})`;
  }
  return model || conditionLabel;
}
