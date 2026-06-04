const allowedLegalSlugs = ['impressum', 'datenschutz', 'nutzungsbedingungen', 'cookie-preferences'];

async function isLegalSlugUniquePerLocale(
  slug: string,
  context: { document?: { _id?: string; locale?: string }; getClient: (options: { apiVersion: string }) => { fetch: (query: string, params: Record<string, string>) => Promise<boolean> } }
) {
  const locale = context.document?.locale;
  if (!slug || !locale) {
    return true;
  }

  const client = context.getClient({ apiVersion: '2026-01-01' });
  const id = (context.document?._id ?? '').replace(/^drafts\./, '');
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    locale
  };

  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    _type == "legalPage" &&
    slug.current == $slug &&
    locale == $locale
  ][0]._id)`;

  return client.fetch(query, params);
}

export default {
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      description: 'Set this first. German and English pages can share the same URL slug (e.g. impressum).',
      options: { list: [ { title: 'Deutsch', value: 'de' }, { title: 'English', value: 'en' } ], layout: 'dropdown' },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description:
        'Same slug for DE and EN is allowed (e.g. both use impressum). Must match the website path — do not add -de/-en here.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isLegalSlugUniquePerLocale
      },
      validation: (Rule) =>
        Rule.custom((value) => {
          const slug = value?.current;
          if (!slug || allowedLegalSlugs.includes(slug)) {
            return true;
          }
          return `Use one of: ${allowed.join(', ')}`;
        })
    },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'eyebrow', title: 'Section eyebrow', type: 'string' },
    { name: 'intro', title: 'Intro', type: 'text' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'body', title: 'Body sections', type: 'array', of: [{ type: 'object', fields: [ { name: 'heading', title: 'Heading', type: 'string' }, { name: 'text', title: 'Text', type: 'text' } ] }] }
  ]
};
