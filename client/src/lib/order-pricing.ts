export function calculateUnitPrice(basePrice: number, requiredChoicePrice = 0, extraPrices: number[] = []) {
  return Number((basePrice + requiredChoicePrice + extraPrices.reduce((total, price) => total + price, 0)).toFixed(2));
}
