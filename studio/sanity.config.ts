import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schema } from './schema';

const projectId = process.env.SANITY_PROJECT_ID || 'o4554lb2';
const dataset = process.env.SANITY_DATASET || 'production';

export default defineConfig({
  name: 'imanigo-studio',
  title: 'IMANIGO Content Studio',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schema
  },
  studio: {
    components: {}
  }
});
