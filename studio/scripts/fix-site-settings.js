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

function normalizePhoneHidden(value) {
  if (value === true || value === 'true') {
    return true;
  }
  if (value === false || value === 'false') {
    return false;
  }
  return true;
}

async function run() {
  const docs = await client.fetch(`*[_type == "siteSettings"]{ _id, phone, phoneHidden }`);

  for (const doc of docs) {
    const phoneHidden = normalizePhoneHidden(doc.phoneHidden);
    const phone = typeof doc.phone === 'string' ? doc.phone : '';

    await client
      .patch(doc._id)
      .set({ phone, phoneHidden })
      .commit();

    const draftId = `drafts.${doc._id}`;
    const hasDraft = await client.fetch(`defined(*[_id == $id][0]._id)`, { id: draftId });

    if (hasDraft) {
      await client.patch(draftId).set({ phone, phoneHidden }).commit();
    }

    console.log(`Fixed ${doc._id}: phoneHidden=${phoneHidden}, phone="${phone}"`);
  }

  console.log('Site settings repair complete.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
