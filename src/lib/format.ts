/** Approximate Colombian Peso conversion rate (1 USD ≈ 4,150 COP) */
export const USD_TO_COP_RATE = 4150;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Converts USD price to rounded COP (nearest 100 COP) */
export function usdToCop(usd: number): number {
  return Math.round((usd * USD_TO_COP_RATE) / 100) * 100;
}

/** Formats as Colombian Pesos: e.g. "$ 46.900 COP" */
export function formatCOP(copValue: number): string {
  return `${copFormatter.format(copValue)} COP`;
}

/** Formats as USD: e.g. "$11.50 USD" */
export function formatUSD(usdValue: number): string {
  return `${usdFormatter.format(usdValue)} USD`;
}

/** Default price formatter for catalog (displays COP prominently, matching DracoStore) */
export function formatPrice(usdValue: number): string {
  const cop = usdToCop(usdValue);
  return formatCOP(cop);
}
