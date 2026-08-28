import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("normalise le numéro et encode la commande complète", () => {
    const url = buildWhatsAppUrl("+33 6 12-34-56-78", "Pizza Primavera\n2 × Pizza Primavera — 24,00 € / unité · 48,00 €\nOptions : Grande · Burrata crémeuse\nTotal : 48,00 €");
    expect(url.startsWith("https://wa.me/33612345678?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1] ?? "")).toContain("Pizza Primavera");
    expect(decodeURIComponent(url.split("?text=")[1] ?? "")).toContain("Burrata crémeuse");
    expect(decodeURIComponent(url.split("?text=")[1] ?? "")).toContain("24,00 € / unité");
    expect(decodeURIComponent(url.split("?text=")[1] ?? "")).toContain("Total : 48,00 €");
  });
});
