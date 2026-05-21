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
      console.log('Creating/Updating:', doc._id || doc._type);
      await client.createOrReplace(doc);
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
