import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('IMANIGO Content')
    .items([
      S.listItem()
        .title('Service pages (Software, Transfer, Sponsored)')
        .child(
          S.documentTypeList('servicePage')
            .title('Service pages')
            .defaultOrdering([{ field: 'locale', direction: 'asc' }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() && !['servicePage'].includes(item.getId()!))
    ]);
