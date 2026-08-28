import { describe, expect, it } from "vitest";
import { calculateUnitPrice } from "./order-pricing";

describe("calculateUnitPrice", () => {
  it("conserve le prix de base quand aucun modificateur n’est sélectionné", () => {
    expect(calculateUnitPrice(16.5)).toBe(16.5);
  });

  it("additionne le choix radio et les suppléments payants", () => {
    expect(calculateUnitPrice(16.5, 3, [3, 1.5])).toBe(24);
  });

  it("arrondit le résultat à deux décimales", () => {
    expect(calculateUnitPrice(13.5, 0, [2, 1.5])).toBe(17);
  });
});
