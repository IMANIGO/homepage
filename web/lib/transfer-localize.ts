type TransferJob = {
  title?: string;
  description?: string;
  routeFrom?: string;
  routeVia?: string;
  routeTo?: string;
  vehicleModel?: string;
  publishedOn?: string;
  year?: string;
  tags?: string[];
  brand?: string;
  [key: string]: unknown;
};

const PHRASES: Array<[string, string]> = [
  ['junger Gebrauchtwagen', 'young used car'],
  ['junger Gebrauchter', 'young used car'],
  ['Gebrauchtwagen', 'used car'],
  ['Gebrauchter', 'used car'],
  ['Neuwagen', 'new car'],
  ['Filialfahrt', 'branch transfer'],
  ['Kundenfahrt', 'customer transfer'],
  ['Aussteuerung', 'fleet decommissioning'],
  ['Vollbetankung', 'full tank'],
  ['Übergabeprotokoll', 'handover report'],
  ['Live-Tracking', 'live tracking'],
  [' nach ', ' to ']
];

const PLACES: Array<[string, string]> = [
  ['München Motorworld', 'Munich Motorworld'],
  ['Florenz', 'Florence'],
  ['Unterschleißheim', 'Unterschleissheim'],
  ['Unterschleissheim', 'Unterschleissheim'],
  ['Schweitenkirchen', 'Schweitenkirchen'],
  ['Freilassing', 'Freilassing'],
  ['Ebersberg', 'Ebersberg'],
  ['Brunnthal', 'Brunnthal'],
  ['Wolnzach', 'Wolnzach'],
  ['Rosenheim', 'Rosenheim'],
  ['Freising', 'Freising'],
  ['Berglern', 'Berglern'],
  ['Nürnberg', 'Nuremberg'],
  ['Hannover', 'Hanover'],
  ['München', 'Munich'],
  ['Köln', 'Cologne'],
  ['Wien', 'Vienna']
];

const MONTHS: Array<[string, string]> = [
  ['Januar', 'January'],
  ['Februar', 'February'],
  ['März', 'March'],
  ['April', 'April'],
  ['Mai', 'May'],
  ['Juni', 'June'],
  ['Juli', 'July'],
  ['August', 'August'],
  ['September', 'September'],
  ['Oktober', 'October'],
  ['November', 'November'],
  ['Dezember', 'December']
];

function byLongestFirst(pairs: Array<[string, string]>) {
  return [...pairs].sort((left, right) => right[0].length - left[0].length);
}

const PLACE_REPLACEMENTS = byLongestFirst(PLACES);
const MONTH_REPLACEMENTS = byLongestFirst(MONTHS);
const PHRASE_REPLACEMENTS = byLongestFirst(PHRASES);

function applyPairs(value: string, pairs: Array<[string, string]>) {
  return pairs.reduce((text, [from, to]) => text.split(from).join(to), value);
}

export function localizeTransferText(value: string | null | undefined) {
  if (!value) {
    return value ?? '';
  }
  return applyPairs(applyPairs(applyPairs(value, PHRASE_REPLACEMENTS), PLACE_REPLACEMENTS), MONTH_REPLACEMENTS);
}

export function localizeTransferJob<T extends TransferJob>(job: T): T {
  return {
    ...job,
    title: localizeTransferText(job.title),
    description: job.description ? localizeTransferText(job.description) : job.description,
    routeFrom: job.routeFrom ? localizeTransferText(job.routeFrom) : job.routeFrom,
    routeVia: job.routeVia ? localizeTransferText(job.routeVia) : job.routeVia,
    routeTo: job.routeTo ? localizeTransferText(job.routeTo) : job.routeTo,
    publishedOn: job.publishedOn ? localizeTransferText(job.publishedOn) : job.publishedOn,
    year: job.year ? localizeTransferText(job.year) : job.year,
    tags: Array.isArray(job.tags) ? job.tags.map((tag) => localizeTransferText(tag)) : job.tags
  };
}

export function localizeTransferJobs<T extends TransferJob>(jobs: T[] | null | undefined) {
  return (jobs ?? []).map((job) => localizeTransferJob(job));
}
