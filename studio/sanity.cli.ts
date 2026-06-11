import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID || 'o4554lb2';
const dataset = process.env.SANITY_DATASET || 'production';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: 'jcickdpj78ah2x6wr0j2c7li',
    autoUpdates: true
  }
});
