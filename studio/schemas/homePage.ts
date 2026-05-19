export default {
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [ { title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' } ], layout: 'dropdown' }
    },
    { name: 'heroTitle', title: 'Hero title', type: 'string' },
    { name: 'heroSubtitle', title: 'Hero subtitle', type: 'text' },
    { name: 'aboutSummary', title: 'About summary', type: 'text' },
    { name: 'serviceCards', title: 'Featured services', type: 'array', of: [{ type: 'reference', to: [{ type: 'servicePage' }] }] },
    { name: 'trustPoints', title: 'Trust points', type: 'array', of: [{ type: 'object', fields: [ { name: 'tag', title: 'Tag', type: 'string' }, { name: 'title', title: 'Title', type: 'string' }, { name: 'detail', title: 'Detail', type: 'text' } ]}] },
    { name: 'testimonials', title: 'Testimonials', type: 'array', of: [{ type: 'reference', to: [{ type: 'testimonial' }] }] },
    { name: 'metrics', title: 'Metrics', type: 'array', of: [{ type: 'reference', to: [{ type: 'metric' }] }] }
  ]
};
