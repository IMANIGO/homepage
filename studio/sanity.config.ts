import { defineConfig } from 'sanity';
import { deskTool } from '@sanity/desk-tool';
import { visionTool } from '@sanity/vision';
import { schema } from './schema';

export default defineConfig({
  name: 'imanigo-studio',
  title: 'IMANIGO Content Studio',
  projectId: process.env.SANITY_PROJECT_ID || 'yourProjectId',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schema
  },
  studio: {
    components: {}
  }
});
