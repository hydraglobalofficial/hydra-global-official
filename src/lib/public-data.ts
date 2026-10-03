/** Cap how much inventory signal leaves the server for storefront/API clients. */
export const PUBLIC_STOCK_CAP = 12;

export function publicStock(stock: number) {
  if (!Number.isFinite(stock) || stock <= 0) return 0;
  return Math.min(Math.floor(stock), PUBLIC_STOCK_CAP);
}

export function publicProductCard<T extends { stock: number }>(product: T): T {
  return { ...product, stock: publicStock(product.stock) };
}
