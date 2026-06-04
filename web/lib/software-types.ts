const typeOrder = ['mobile', 'web', 'desktop', 'other'];

export function normalizeSoftwareTypes(value?: string | string[] | null): string[] {
  if (!value) {
    return [];
  }
  const values = Array.isArray(value) ? value : [value];
  const unique = [...new Set(values.filter(Boolean))];
  return unique.sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b));
}

export function formatSoftwareTypes(
  types: string[],
  labels: Record<string, string>
): string {
  return types.map((type) => labels[type] ?? type).join(' · ');
}
