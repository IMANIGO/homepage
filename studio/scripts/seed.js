require('dotenv').config();
const fs = require('fs');
const path = require('path');
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
  const dataDir = path.join(__dirname, '..', 'data');
  const jsonFiles = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'));

  if (!jsonFiles.length) {
    console.error('No JSON data files found in:', dataDir);
    process.exit(1);
  }

  const docs = jsonFiles.flatMap((fileName) => {
    const filePath = path.join(dataDir, fileName);
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  });

  for (const doc of docs) {
    try {
      const prepared = addMissingKeys(doc);
      console.log('Creating/Updating:', prepared._id || prepared._type);
      await client.createOrReplace(prepared);
      console.log('  OK');
    } catch (err) {
      console.error('  Error:', err.message || err);
    }
  }

  console.log('Seeding complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
