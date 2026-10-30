// Adjust individual service prices ending in zero; leave free and other prices unchanged.
export function servicePrice(price: number): number {
  return price > 0 && Number.isInteger(price) && price % 10 === 0 ? price - 1 : price;
}
