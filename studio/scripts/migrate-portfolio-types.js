/**
 * One-off: convert transfer jobs saved as portfolioTransferItem back to plain objects
 * so they match the inline transfer schema (optional — only if Studio still shows errors).
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

function normalizeTransferItem(item) {
  if (!item || item._type !== 'portfolioTransferItem') {
    return item;
  }
  const { _type, ...rest } = item;
  return rest;
}

function normalizeProjects(projects, websitePage) {
  if (!Array.isArray(projects)) {
    return projects;
  }
  if (websitePage !== 'transfer') {
    return projects;
  }
  return projects.map(normalizeTransferItem);
}

async function run() {
  const docs = await client.fetch(
    `*[_type == "servicePage"]{ _id, websitePage, projects }`
  );

  for (const doc of docs) {
    const projects = normalizeProjects(doc.projects, doc.websitePage);
    const changed =
      Array.isArray(doc.projects) &&
      JSON.stringify(doc.projects) !== JSON.stringify(projects);

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
