require('dotenv').config();
const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_API_TOKEN.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-01-01',
  token,
  useCdn: false
});

const defaultsByModel = [
  { pattern: /transit/i, icon: 'transporter', electric: false },
  { pattern: /multivan/i, icon: 'van', electric: false },
  { pattern: /touran/i, icon: 'van', electric: false },
  { pattern: /corsa/i, icon: 'kleinwagen', electric: false },
  { pattern: /bigster/i, icon: 'suv', electric: false },
  { pattern: /tayron/i, icon: 'suv', electric: false },
  { pattern: /polestar/i, icon: 'suv', electric: true },
  { pattern: /nio\s*et5/i, icon: 'limousine', electric: true },
  { pattern: /xc90/i, icon: 'suv', electric: true }
];

function guessIcon(vehicleModel) {
  const model = vehicleModel?.trim() ?? '';
  for (const entry of defaultsByModel) {
    if (entry.pattern.test(model)) {
      return { vehicleIcon: entry.icon, vehicleElectric: entry.electric };
    }
  }
  return { vehicleIcon: 'limousine', vehicleElectric: /\b(e-|elektro|electric|phev|plug-?in|ev)\b/i.test(model) };
}

async function run() {
  const pages = await client.fetch(
    `*[_type == 'servicePage' && websitePage == 'transfer']{ _id, locale, projects }`
  );

  for (const page of pages) {
    let changed = false;
    const projects = (page.projects ?? []).map((project) => {
      if (project.vehicleIcon) {
        return project;
      }
      if (!project.vehicleModel) {
        return project;
      }

      changed = true;
      return { ...project, ...guessIcon(project.vehicleModel) };
    });

    if (!changed) {
      console.log('No changes:', page._id, page.locale);
      continue;
    }

    await client.patch(page._id).set({ projects }).commit();
    console.log('Updated:', page._id, page.locale);
  }

  console.log('Vehicle icon migration complete.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
