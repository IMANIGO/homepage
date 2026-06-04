import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from './schema';
import { structure } from './structure';

const projectId = process.env.SANITY_PROJECT_ID || 'o4554lb2';
const dataset = process.env.SANITY_DATASET || 'production';

export default defineConfig({
  name: 'imanigo-studio',
  title: 'IMANIGO Content Studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schema
  },
  studio: {
    components: {}
  }
});
