export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [ { title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' } ], layout: 'dropdown' }
    },
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'author', title: 'Author', type: 'string' },
    { name: 'company', title: 'Company or context', type: 'string' }
  ]
};
