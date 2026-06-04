import { portfolioSoftwareItem, portfolioSponsoredItem, transferJobObject } from './portfolioItems';

const portfolioTypeByPage: Record<string, string> = {
  software: 'portfolioSoftwareItem',
  sponsored: 'portfolioSponsoredItem'
};

function isTransferJob(item: { _type?: string; tourType?: string; routeFrom?: string } | null | undefined) {
  if (!item) {
    return false;
  }
  const type = item._type;
  if (!type || type === 'object') {
    return Boolean(item.tourType ?? item.routeFrom);
  }
  return type === 'portfolioTransferItem';
}

export default {
  name: 'servicePage',
  title: 'Service page',
  type: 'document',
  preview: {
    select: { title: 'title', locale: 'locale', websitePage: 'websitePage', slug: 'slug.current' },
    prepare({ title, locale, websitePage, slug }) {
      const route = websitePage ?? slug ?? '…';
      return {
        title: title || 'Service page',
        subtitle: `${locale?.toUpperCase() ?? '?'} · /${route}`
      };
    }
  },
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [{ title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' }], layout: 'dropdown' }
    },
    {
      name: 'websitePage',
      title: 'Website page',
      type: 'string',
      description: 'Which tab on the website this content belongs to. Keep this as Software, Transfer, or Sponsored.',
      options: {
        list: [
          { title: 'Software (/software)', value: 'software' },
          { title: 'Transfer (/transfer)', value: 'transfer' },
          { title: 'Sponsored (/sponsored)', value: 'sponsored' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'eyebrow', title: 'Section eyebrow', type: 'string' },
    { name: 'intro', title: 'Intro', type: 'text' },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'projects',
      title: 'Portfolio items',
      description:
        'Transfer page: add “Transfer job”. Software page: “Software project”. Sponsored page: “Ad / campaign”.',
      type: 'array',
      of: [transferJobObject, { type: 'portfolioSoftwareItem' }, { type: 'portfolioSponsoredItem' }],
      validation: (Rule) =>
        Rule.custom((items, context) => {
          const websitePage = context.document?.websitePage as string | undefined;
          if (!websitePage || !Array.isArray(items)) {
            return true;
          }
          if (websitePage === 'transfer') {
            const wrong = items.find(
              (item) =>
                item?._type === 'portfolioSoftwareItem' || item?._type === 'portfolioSponsoredItem'
            );
            if (wrong) {
              return 'On the transfer page, use only “Transfer job” items.';
            }
            return true;
          }
          const expected = portfolioTypeByPage[websitePage];
          if (!expected) {
            return true;
          }
          const labels: Record<string, string> = {
            portfolioSoftwareItem: 'Software project',
            portfolioSponsoredItem: 'Ad / campaign'
          };
          const wrong = items.find((item) => {
            if (!item?._type) {
              return isTransferJob(item);
            }
            return item._type !== expected;
          });
          if (wrong) {
            return `On this page, add only “${labels[expected] ?? expected}” items.`;
          }
          return true;
        })
    },
    {
      name: 'body',
      title: 'Body sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              description:
                'Plain paragraph. Paste full URLs (https://…) to make links, or [Instagram](https://instagram.com/you). Use sections for lists.'
            },
            {
              name: 'sections',
              title: 'Sections',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Section title', type: 'string' },
                    {
                      name: 'items',
                      title: 'Items',
                      type: 'array',
                      of: [{ type: 'string' }],
                      description:
                        'One line per item. Full URL = clickable link. Or [Label](https://…) for custom link text (e.g. social profiles).'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
