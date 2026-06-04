const imageField = (title: string, description: string) => ({
  name: 'image',
  title,
  type: 'image',
  description,
  options: { hotspot: true },
  fields: [{ name: 'alt', title: 'Alt text', type: 'string' }]
});

/** Inline transfer jobs (no `_type`) — matches existing Sanity data and Studio behaviour before typed portfolio items. */
export const transferJobFields = [
    { name: 'title', title: 'Title', type: 'string', description: 'Short label for Studio (e.g. station tour).' },
    {
      name: 'tourType',
      title: 'Tour type',
      type: 'string',
      initialValue: 'ab',
      options: {
        list: [
          { title: 'A-B tour', value: 'ab' },
          { title: 'A-B-C tour', value: 'abc' },
          { title: 'Round trip', value: 'round' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'routeFrom',
      title: 'A · Start',
      type: 'string',
      description: 'Start city or station. For round trips, this is also the return point.'
    },
    {
      name: 'routeVia',
      title: 'B · Stop (A-B-C only)',
      type: 'string',
      hidden: ({ parent }) => parent?.tourType !== 'abc',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent;
          if (parent?.tourType === 'abc' && !value) {
            return 'Stop B is required for A-B-C tours';
          }
          return true;
        })
    },
    { name: 'routeTo', title: 'B / C · Destination', type: 'string' },
    { name: 'vehicleModel', title: 'Vehicle model', type: 'string' },
    { name: 'distanceKm', title: 'Distance (km)', type: 'number' },
    { name: 'durationHours', title: 'Duration (hours)', type: 'number' },
    {
      name: 'brand',
      title: 'Customer',
      type: 'string',
      description: 'e.g. ONLOGIST · Sixt München'
    },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'publishedOn', title: 'Details', type: 'string', description: 'e.g. Mai 2026 · 240 km · 1 Tag' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'url', title: 'Link', type: 'url' }
];

export const transferJobObject = {
  type: 'object',
  title: 'Transfer job',
  fields: transferJobFields,
  preview: {
    select: { title: 'title', tourType: 'tourType', routeFrom: 'routeFrom', routeVia: 'routeVia', routeTo: 'routeTo' },
    prepare({ title, tourType, routeFrom, routeVia, routeTo }) {
      const path =
        tourType === 'abc' && routeVia
          ? `${routeFrom} → ${routeVia} → ${routeTo}`
          : tourType === 'round'
            ? `${routeFrom} → ${routeTo} → ${routeFrom}`
            : `${routeFrom} → ${routeTo}`;
      return { title: title || 'Transfer job', subtitle: `${tourType ?? 'ab'} · ${path}` };
    }
  }
};

export const portfolioSoftwareItem = {
  name: 'portfolioSoftwareItem',
  title: 'Software project',
  type: 'object',
  fields: [
    { name: 'title', title: 'Software name', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'softwareTypes',
      title: 'Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Mobile app', value: 'mobile' },
          { title: 'Web app', value: 'web' },
          { title: 'Desktop app', value: 'desktop' },
          { title: 'Other', value: 'other' }
        ],
        layout: 'grid'
      },
      validation: (Rule) => Rule.min(1).error('Select at least one type.')
    },
    { name: 'customer', title: 'Customer', type: 'string', description: 'Client or “Own product”.' },
    {
      name: 'publishPlatforms',
      title: 'Published on',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Platform', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'url', title: 'Link', type: 'url' }
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
            prepare({ title, subtitle }) {
              return { title: title || 'Platform', subtitle: subtitle || 'No link' };
            }
          }
        }
      ],
      description: 'e.g. App Store, Google Play, Web — add a link for each platform where applicable.'
    },
    {
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Private', value: 'private' }
        ],
        layout: 'radio'
      },
      initialValue: 'public'
    },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'year', title: 'Year published', type: 'string' },
    imageField('Logo', 'App icon or product logo if available.'),
    { name: 'tags', title: 'Features', type: 'array', of: [{ type: 'string' }] },
    { name: 'downloadCount', title: 'Downloads', type: 'number' },
    { name: 'rating', title: 'Rating (0–5)', type: 'number', validation: (Rule) => [Rule.min(0), Rule.max(5)] },
    { name: 'premiumSubscriberCount', title: 'Premium subscribers', type: 'number' }
  ],
  preview: {
    select: { title: 'title', softwareTypes: 'softwareTypes', customer: 'customer', year: 'year' },
    prepare({ title, softwareTypes, customer, year }) {
      const types = Array.isArray(softwareTypes) ? softwareTypes.join(', ') : '';
      return {
        title: title || 'Software project',
        subtitle: [types, customer, year].filter(Boolean).join(' · ')
      };
    }
  }
};

export const portfolioSponsoredItem = {
  name: 'portfolioSponsoredItem',
  title: 'Ad / campaign',
  type: 'object',
  fields: [
    { name: 'title', title: 'Campaign title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'adType',
      title: 'Ad type',
      type: 'string',
      options: {
        list: [
          { title: 'Reel / short video', value: 'reel' },
          { title: 'Story', value: 'story' },
          { title: 'Long-form video', value: 'video' },
          { title: 'Feed post', value: 'post' },
          { title: 'Collaboration', value: 'collaboration' },
          { title: 'Other', value: 'other' }
        ],
        layout: 'radio'
      },
      initialValue: 'reel'
    },
    { name: 'company', title: 'Company / brand', type: 'string' },
    imageField(
      'Brand logo / picture',
      'Logo or brand image for the company this ad was for (shown on the website next to the campaign).'
    ),
    { name: 'publishedWhere', title: 'Published where', type: 'string', description: 'e.g. Instagram, YouTube' },
    { name: 'publishedWhen', title: 'Published when', type: 'string', description: 'e.g. March 2025' },
    { name: 'targetAudience', title: 'Target audience', type: 'string' },
    { name: 'description', title: 'Short description', type: 'text' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'viewCount', title: 'Views', type: 'number' },
    { name: 'watchTimeHours', title: 'Watch time (hours)', type: 'number' }
  ],
  preview: {
    select: {
      title: 'title',
      adType: 'adType',
      company: 'company',
      publishedWhere: 'publishedWhere',
      media: 'image'
    },
    prepare({ title, adType, company, publishedWhere, media }) {
      return {
        title: title || 'Ad / campaign',
        subtitle: [adType, company, publishedWhere].filter(Boolean).join(' · '),
        media
      };
    }
  }
};
