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

function randomKey() {
  return Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
}

function addMissingKeys(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
        const keyed = addMissingKeys(entry);
        return keyed._key ? keyed : { _key: randomKey(), ...keyed };
      }
      return entry;
    });
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, addMissingKeys(nested)]));
  }

  return value;
}

async function run() {
  const docs = await client.fetch(`*[_type in ['servicePage', 'homePage', 'aboutPage', 'contactPage', 'legalPage']]{...}`);

  for (const doc of docs) {
    const { _id, _rev, _createdAt, _updatedAt, _type, ...fields } = doc;
    const prepared = addMissingKeys(fields);

    console.log('Fixing keys:', _id);
    await client.patch(_id).set(prepared).commit();
    console.log('  OK');
  }

  console.log('Key fix complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
