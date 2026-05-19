export default {
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [ { title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' } ], layout: 'dropdown' }
    },
    { name: 'siteTitle', title: 'Site title', type: 'string' },
    { name: 'businessName', title: 'Legal business name', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'email', title: 'Contact email', type: 'string' },
    { name: 'address', title: 'Business address', type: 'string' },
    { name: 'phoneHidden', title: 'Hide phone number', type: 'boolean' }
  ]
};
