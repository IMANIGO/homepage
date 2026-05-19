export default {
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [ { title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' } ], layout: 'dropdown' }
    },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'eyebrow', title: 'Section eyebrow', type: 'string' },
    { name: 'intro', title: 'Intro', type: 'text' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'body', title: 'Body sections', type: 'array', of: [{ type: 'object', fields: [ { name: 'heading', title: 'Heading', type: 'string' }, { name: 'text', title: 'Text', type: 'text' } ] }] }
  ]
};
