import { normalizeTourType } from './transfer-route';

export type TransferPortfolioItem = {
  tourType?: string | null;
  vehicleModel?: string | null;
  distanceKm?: number | null;
  durationHours?: number | null;
  /** @deprecated Legacy field — treated as 8 h per day if durationHours is missing */
  durationDays?: number | null;
};

export type TransferStats = {
  totalJobs: number;
  totalKm: number;
  totalHours: number;
  abTours: number;
  abcTours: number;
  roundTours: number;
  vehicleCount: number;
  jobsWithDistance: number;
  jobsWithDuration: number;
};

function getJobHours(project: TransferPortfolioItem) {
  if (typeof project.durationHours === 'number' && project.durationHours > 0) {
    return project.durationHours;
  }

  if (typeof project.durationDays === 'number' && project.durationDays > 0) {
    return project.durationDays * 8;
  }

  return 0;
}

export function computeTransferStats(projects: TransferPortfolioItem[]): TransferStats {
  const vehicles = new Set<string>();
  let totalKm = 0;
  let totalHours = 0;
  let abTours = 0;
  let abcTours = 0;
  let roundTours = 0;
  let jobsWithDistance = 0;
  let jobsWithDuration = 0;

  for (const project of projects) {
    const tourType = normalizeTourType(project.tourType);

    if (tourType === 'abc') {
      abcTours += 1;
    } else if (tourType === 'round') {
      roundTours += 1;
    } else {
      abTours += 1;
    }

    if (typeof project.distanceKm === 'number' && project.distanceKm > 0) {
      totalKm += project.distanceKm;
      jobsWithDistance += 1;
    }

    const hours = getJobHours(project);
    if (hours > 0) {
      totalHours += hours;
      jobsWithDuration += 1;
    }

    const model = project.vehicleModel?.trim();
    if (model) {
      vehicles.add(model);
    }
  }

  return {
    totalJobs: projects.length,
    totalKm,
    totalHours,
    abTours,
    abcTours,
    roundTours,
    vehicleCount: vehicles.size,
    jobsWithDistance,
    jobsWithDuration
  };
}

export function formatStatNumber(value: number, locale: 'de' | 'en') {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB').format(value);
}
