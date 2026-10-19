function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("de")
    .replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u").replace(/ß/g, "ss")
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchesCodingSearch(name: string, query: string) {
  const text = normalizeSearch(name);
  return normalizeSearch(query).split(" ").filter(Boolean).every((term) => text.includes(term));
}
