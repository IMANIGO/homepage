/**
 * Converts legacy softwareType (string) to softwareTypes (array) on software portfolio items.
 */
require('dotenv').config();
const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in environment.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-01-01',
  token,
  useCdn: false
});

function migrateProject(item) {
  if (!item || item._type !== 'portfolioSoftwareItem') {
    return item;
  }
  if (Array.isArray(item.softwareTypes) && item.softwareTypes.length) {
    const { softwareType, ...rest } = item;
    return rest;
  }
  if (typeof item.softwareType === 'string' && item.softwareType) {
    const { softwareType, ...rest } = item;
    return { ...rest, softwareTypes: [softwareType] };
  }
  return item;
}

async function run() {
  const docs = await client.fetch(`*[_type == "servicePage" && websitePage == "software"]{ _id, projects }`);

  for (const doc of docs) {
    const projects = doc.projects?.map(migrateProject);
    const changed =
      Array.isArray(doc.projects) && JSON.stringify(doc.projects) !== JSON.stringify(projects);

    if (!changed) {
      continue;
    }

    console.log('Updating', doc._id);
    await client.patch(doc._id).set({ projects }).commit();
    console.log('  OK');
  }

  console.log('Migration complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
