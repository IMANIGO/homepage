export default {
  name: 'metric',
  title: 'Metric',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [ { title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' } ], layout: 'dropdown' }
    },
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'value', title: 'Value', type: 'string' },
    { name: 'detail', title: 'Detail text', type: 'text' }
  ]
};
