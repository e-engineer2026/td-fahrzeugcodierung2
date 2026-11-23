/**
 * Merge the statically configured guide products with catalog products discovered
 * from document/draft records. Each product and slug must appear only once.
 * Prefer the configured entry; never mutate document or purchase data.
 */
export function uniqueGuideAdminDocuments<T extends { productId: string; slug: string }>(documents: readonly T[]): T[] {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  return documents.filter(document => {
    if (ids.has(document.productId) || slugs.has(document.slug)) return false;
    ids.add(document.productId);
    slugs.add(document.slug);
    return true;
  });
}
