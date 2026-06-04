import siteSettings from './schemas/siteSettings';
import homePage from './schemas/homePage';
import servicePage from './schemas/servicePage';
import { portfolioSoftwareItem, portfolioSponsoredItem } from './schemas/portfolioItems';
import aboutPage from './schemas/aboutPage';
import contactPage from './schemas/contactPage';
import legalPage from './schemas/legalPage';
import testimonial from './schemas/testimonial';
import metric from './schemas/metric';

export const schema = [
  siteSettings,
  homePage,
  portfolioSoftwareItem,
  portfolioSponsoredItem,
  servicePage,
  aboutPage,
  contactPage,
  legalPage,
  testimonial,
  metric
];
