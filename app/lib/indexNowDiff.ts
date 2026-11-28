export type UrlSnapshot = Record<string, string>;
export function changedUrls(previous: UrlSnapshot, current: UrlSnapshot): string[] {
  return [...new Set([...Object.keys(previous), ...Object.keys(current)])]
    .filter(url => !Object.hasOwn(previous, url) || !Object.hasOwn(current, url) || previous[url] !== current[url])
    .sort();
}
