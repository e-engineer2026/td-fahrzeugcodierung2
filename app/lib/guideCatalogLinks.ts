export function catalogDocumentSlug(model: string, rowId: string): string {
  return "catalog:" + encodeURIComponent(model) + ":" + encodeURIComponent(rowId);
}

export function catalogDocumentHref(slug: string): string {
  return "/codieranleitungen/dokument?produkt=" + encodeURIComponent(slug);
}

export function catalogDownloadHref(slug: string): string {
  return "/api/guide-shop/download/catalog?produkt=" + encodeURIComponent(slug);
}
