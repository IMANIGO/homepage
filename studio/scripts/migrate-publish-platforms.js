/**
 * Converts string publishPlatforms + optional url into { label, url } objects.
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

  const platforms = Array.isArray(item.publishPlatforms) ? item.publishPlatforms : [];
  const hasObjects = platforms.some((entry) => entry && typeof entry === 'object' && entry.label);
  let publishPlatforms = platforms;

  if (!hasObjects && platforms.length) {
    publishPlatforms = platforms
      .filter((entry) => typeof entry === 'string' && entry.trim())
      .map((label) => ({ label: label.trim() }));
  }

  if (typeof item.url === 'string' && item.url.trim()) {
    const url = item.url.trim();
    const list = [...publishPlatforms];
    const web = list.find((entry) => entry?.label && /^web$/i.test(entry.label));
    if (web && !web.url) {
      web.url = url;
    } else if (!list.some((entry) => entry?.url === url)) {
      list.push({ label: 'Web', url });
    }
    publishPlatforms = list;
  }

  const { url, ...rest } = item;
  return { ...rest, publishPlatforms };
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
