/**
 * Merge configured PDFs with catalog entries discovered in the private database.
 * Prefer the configured product record and keep each product/slug exactly once.
 * Do not modify document data, publication state, or purchases.
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
