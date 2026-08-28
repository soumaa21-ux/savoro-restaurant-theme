import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { calculateUnitPrice } from "@/lib/order-pricing";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link, useRoute } from "wouter";

type Option = { id: string; label: string; price: number };

const assetBase = (globalThis as { SAVORO_ASSET_BASE?: string }).SAVORO_ASSET_BASE ?? "/manus-storage";
const product = {
  name: "Pizza Primavera",
  description: "Mozzarella fior di latte, basilic, tomates confites et pecorino.",
  price: 16.5,
  image: `${assetBase}/savoro-pizza_fbc68958.jpg`,
  allergens: "Gluten, lait",
  choices: [
    { id: "classic", label: "Classique", price: 0 },
    { id: "large", label: "Grande", price: 3 },
  ] satisfies Option[],
  extras: [
    { id: "burrata", label: "Burrata crémeuse", price: 3 },
    { id: "pepper", label: "Piments doux rôtis", price: 1.5 },
  ] satisfies Option[],
};

const formatPrice = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;
const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export default function ProductPage() {
  const [, params] = useRoute("/produit/:slug");
  const [choice, setChoice] = useState("classic");
  const [extras, setExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const selectedChoice = product.choices.find((item) => item.id === choice);
  const selectedExtras = product.extras.filter((item) => extras.includes(item.id));
  const unitPrice = calculateUnitPrice(product.price, selectedChoice?.price ?? 0, selectedExtras.map((item) => item.price));
  const total = unitPrice * quantity;
  const optionLabels = [selectedChoice?.label ?? "Classique", ...selectedExtras.map((item) => item.label)];
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(whatsappNumber, ["Bonjour Savoro, je souhaite commander :", "", `${quantity} × ${product.name} — ${formatPrice(unitPrice)} / unité · ${formatPrice(total)}`, `   Options : ${optionLabels.join(" · ")}`, "", `Total : ${formatPrice(total)}`, "", "Merci !"].join("\n")), [quantity, unitPrice, total, optionLabels]);

  const toggleExtra = (id: string) => setExtras((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="min-h-screen bg-[#fbf7ee] text-[#2f251e]">
      <header className="sticky top-0 z-30 border-b border-[#2f251e]/10 bg-[#fbf7ee]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2 text-left"><img src={`${assetBase}/savoro-steam-s-logo_2851daf5.png`} alt="" className="h-10 w-10 object-contain" /><span className="font-display text-[1.8rem] leading-none tracking-[-0.08em]">savoro</span></Link>
          <div className="flex items-center gap-2"><Link href="/" className="icon-close" aria-label="Retour au menu"><ArrowLeft className="h-4 w-4" /></Link><button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag className="h-5 w-5" /><span className="hidden text-sm font-bold sm:inline">Panier</span><span className="cart-count">{added ? quantity : 0}</span></button></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-14">
        <div className="mb-8 flex items-center gap-2 text-sm font-bold text-[#806f60]"><Link href="/" className="hover:text-[#d95f32]">La carte</Link><span>/</span><span>{params?.slug ? "Pizza Primavera" : "Produit"}</span></div>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,.95fr)] lg:gap-14">
          <div className="relative overflow-hidden dish-shape-b bg-[#e9dfce]"><img src={product.image} alt={product.name} className="aspect-square h-full w-full object-cover" /><span className="image-badge">Le plus choisi</span><span className="dish-number">02</span></div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow mb-3"><span className="ticket-stamp">02</span> Pizzas · Savoro</p>
            <h1 className="font-display text-5xl leading-[.9] tracking-[-.06em] sm:text-6xl">{product.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-[#594b40]">{product.description}</p>
            <div className="mt-4 flex flex-wrap gap-2"><span className="tag">Végétarien</span><span className="tag">Allergènes : {product.allergens}</span></div>
            <div className="customization-panel">
              <div className="option-group"><div className="option-heading"><span>Taille</span><span className="required-label">Obligatoire</span></div><RadioGroup value={choice} onValueChange={setChoice} className="mt-3 space-y-2">{product.choices.map((item) => <label key={item.id} className={`option-row ${choice === item.id ? "selected" : ""}`}><RadioGroupItem value={item.id} /><span>{item.label}</span><span className="ml-auto">{item.price ? `+${formatPrice(item.price)}` : "Inclus"}</span></label>)}</RadioGroup></div>
              <div className="option-group"><div className="option-heading"><span>Suppléments</span><span className="optional-label">Au choix</span></div><div className="mt-3 space-y-2">{product.extras.map((item) => <label key={item.id} className={`option-row ${extras.includes(item.id) ? "selected" : ""}`}><Checkbox checked={extras.includes(item.id)} onCheckedChange={() => toggleExtra(item.id)} /><span>{item.label}</span><span className="ml-auto">+{formatPrice(item.price)}</span></label>)}</div></div>
              <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#2f251e]/20 pt-5"><div><p className="eyebrow">Quantité</p><div className="quantity-control mt-2"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Retirer une unité"><Minus className="h-3.5 w-3.5" /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="Ajouter une unité"><Plus className="h-3.5 w-3.5" /></button></div></div><div className="text-right"><p className="eyebrow">Total</p><p className="mt-1 font-display text-3xl">{formatPrice(total)}</p></div></div>
              <button className="primary-cta mt-6 w-full justify-center" onClick={() => { setAdded(true); setCartOpen(true); }}>Ajouter au panier · {formatPrice(total)} <Check className="h-4 w-4" /></button>
            </div>
          </div>
        </section>
      </main>

      {cartOpen && <div className="modal-layer"><button className="absolute inset-0 cursor-default" aria-label="Fermer" onClick={() => setCartOpen(false)} /><aside className="side-cart relative ml-auto flex h-full w-full max-w-md flex-col bg-[#fbf7ee] p-5 shadow-2xl sm:p-7"><button className="icon-close absolute right-5 top-5" aria-label="Fermer le panier" onClick={() => setCartOpen(false)}><X className="h-4 w-4" /></button><p className="eyebrow">Votre commande</p><h2 className="mt-2 font-display text-4xl tracking-[-.05em]">Le panier</h2>{added ? <div className="mt-8 border-t border-dashed border-[#2f251e]/20 pt-5"><div className="flex gap-3"><img src={product.image} alt="" className="h-20 w-20 rounded-2xl object-cover" /><div className="min-w-0 flex-1"><h3 className="font-display text-2xl leading-none">{product.name}</h3><p className="mt-2 text-sm text-[#685a4d]">{optionLabels.join(" · ")}</p><div className="mt-3 flex items-center justify-between"><span className="quantity-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="h-3.5 w-3.5" /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)}><Plus className="h-3.5 w-3.5" /></button></span><strong className="font-mono">{formatPrice(total)}</strong></div></div></div><div className="mt-auto border-t border-[#2f251e]/10 pt-5"><div className="flex items-center justify-between font-bold"><span>Sous-total</span><span>{formatPrice(total)}</span></div><a className="primary-cta mt-4 w-full justify-center" href={whatsappNumber ? whatsappUrl : undefined} target="_blank" rel="noreferrer" onClick={(event) => { if (!whatsappNumber) event.preventDefault(); }}>{whatsappNumber ? "Continuer la commande" : "Ajoutez le numéro WhatsApp"}</a></div></div> : <p className="mt-8 text-[#685a4d]">Votre panier est encore vide.</p>}</aside></div>}
    </div>
  );
}
