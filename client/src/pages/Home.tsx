/**
 * Direction « Cuisine d’atelier » : menu éditorial chaleureux, fond ivoire,
 * brun encre et paprika brûlé réservé aux actions de commande.
 * Les gestes fréquents restent accessibles au pouce ; le menu conserve son contexte.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Flame,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  badge?: string;
  rating?: string;
  spicy?: boolean;
  allergens?: string;
};

type CartItem = MenuItem & { quantity: number };

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Burrata au feu de bois",
    description: "Tomates rôties, basilic froissé, huile d’olive aux braises.",
    price: 13.5,
    image: "/manus-storage/savoro-hero-table_030cf89e.jpg",
    category: "À partager",
    tags: ["Végétarien", "À partager"],
    badge: "Favori de la maison",
    rating: "4.9",
    allergens: "Lait",
  },
  {
    id: 2,
    name: "Pizza Primavera",
    description: "Mozzarella fior di latte, basilic, tomates confites et pecorino.",
    price: 16.5,
    image: "/manus-storage/savoro-pizza_fbc68958.jpg",
    category: "Pizzas",
    tags: ["Végétarien", "Le plus choisi"],
    badge: "Le plus choisi",
    rating: "4.8",
    allergens: "Gluten, lait",
  },
  {
    id: 3,
    name: "Risotto du marché",
    description: "Safran, champignons rôtis, parmesan affiné et jus réduit.",
    price: 18,
    image: "/manus-storage/savoro-risotto_d0c66110.jpg",
    category: "Signatures",
    tags: ["Sans gluten", "Végétarien"],
    rating: "4.7",
    allergens: "Lait",
  },
  {
    id: 4,
    name: "Rigatoni arrabbiata",
    description: "Sauce tomate piquante, ail doux, pecorino et persil plat.",
    price: 15.5,
    image: "/manus-storage/savoro-pizza_fbc68958.jpg",
    category: "Pâtes",
    tags: ["Végétalien", "Épicé"],
    spicy: true,
    allergens: "Gluten",
  },
  {
    id: 5,
    name: "Tarte chocolat noisette",
    description: "Ganache intense, crème fraîche légère et éclats de noisette.",
    price: 8.5,
    image: "/manus-storage/savoro-dessert_9016693a.jpg",
    category: "Douceurs",
    tags: ["À ne pas partager"],
    badge: "Dernières parts",
    allergens: "Gluten, lait, fruits à coque",
  },
];

const categories = ["Tout", "À partager", "Pizzas", "Pâtes", "Signatures", "Douceurs"];

const formatPrice = (price: number) => `${price.toFixed(2).replace(".", ",")} €`;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const displayedItems = useMemo(
    () => (activeCategory === "Tout" ? menuItems : menuItems.filter((item) => item.category === activeCategory)),
    [activeCategory],
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2400);
  };

  const addToCart = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
    showNotice(`${item.name} a rejoint votre commande.`);
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fbf7ee] text-[#2f251e]">
      <header className="sticky top-0 z-30 border-b border-[#2f251e]/10 bg-[#fbf7ee]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <button
            className="flex items-center gap-2 text-left"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Retourner en haut du menu"
          >
            <img src="/manus-storage/savoro-steam-s-logo_2851daf5.png" alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-[1.8rem] leading-none tracking-[-0.08em]">savoro</span>
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            <button className="nav-link is-active">Commander</button>
            <button className="nav-link" onClick={() => showNotice("Les adresses sont disponibles à la commande.")}>Nos adresses</button>
            <button className="nav-link" onClick={() => showNotice("La réservation arrive bientôt.")}>Réserver</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden h-10 items-center gap-2 rounded-full border border-[#2f251e]/10 px-4 text-sm font-semibold transition hover:border-[#2f251e]/35 sm:flex" onClick={() => showNotice("Recherche de plats activée prochainement.")}>
              <Search className="h-4 w-4" /> Rechercher
            </button>
            <button
              className="cart-trigger"
              onClick={() => setCartOpen(true)}
              aria-label={`Ouvrir le panier, ${totalItems} article${totalItems > 1 ? "s" : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden text-sm font-bold sm:inline">Panier</span>
              <span className="cart-count">{totalItems}</span>
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[#2f251e]/10 lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[535px] overflow-hidden border-b border-[#2f251e]/10 lg:min-h-[570px]">
          <img src="/manus-storage/savoro-hero-table_030cf89e.jpg" alt="Table de repas à partager" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbf7ee] via-[#fbf7ee]/92 via-42% to-[#fbf7ee]/15" />
          <div className="relative mx-auto flex min-h-[535px] max-w-[1600px] flex-col justify-end px-4 pb-10 pt-20 sm:px-6 lg:min-h-[570px] lg:px-10 lg:pb-16">
            <div className="max-w-[610px]">
              <p className="eyebrow mb-5"><span className="ticket-stamp">01</span><Sparkles className="h-3.5 w-3.5" /> Cuisine de saison · à emporter</p>
              <h1 className="font-display text-[clamp(3.5rem,7vw,6.6rem)] leading-[0.86] tracking-[-0.07em] text-[#2f251e]">Votre table<br />commence ici.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#594b40] sm:text-lg">De la cuisine au panier, composez un repas de partage sans perdre une miette.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button className="primary-cta" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>Voir le menu <ArrowRight className="h-4 w-4" /></button>
                <span className="flex items-center gap-2 text-sm font-semibold text-[#594b40]"><Clock3 className="h-4 w-4 text-[#d95f32]" /> Prêt dans 20–30 min</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 hidden w-[340px] border-l border-t border-[#2f251e]/10 bg-[#fbf7ee]/95 p-5 backdrop-blur lg:block">
            <p className="eyebrow mb-2">À deux pas</p>
            <div className="flex items-center justify-between gap-4"><span className="font-display text-2xl tracking-[-0.04em]">Atelier République</span><MapPin className="h-5 w-5 text-[#d95f32]" /></div>
            <p className="mt-1 text-sm text-[#685a4d]">12 rue du Faubourg · Ouvert jusqu’à 23h</p>
          </div>
        </section>

        <section id="menu" className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="rail-heading"><span className="ticket-stamp">S/01</span><p className="eyebrow">La carte</p></div>
              <nav className="space-y-1" aria-label="Catégories du menu">
                {categories.map((category, index) => (
                  <button key={category} onClick={() => setActiveCategory(category)} className={`category-link ${activeCategory === category ? "active" : ""}`}>
                    <span>{category}</span><span className="category-number">0{index + 1}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-10 border-t border-dashed border-[#2f251e]/20 pt-5 text-sm leading-6 text-[#685a4d]">
                <Leaf className="mb-2 h-5 w-5 text-[#78815b]" />
                Les détails allergènes sont visibles dans la fiche de chaque plat.
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="eyebrow mb-2">Aujourd’hui chez Savoro</p>
                <h2 className="font-display text-4xl tracking-[-0.055em] sm:text-5xl">À votre appétit.</h2>
              </div>
              <button className="hidden items-center gap-1 text-sm font-bold underline decoration-[#d95f32] decoration-2 underline-offset-4 sm:flex" onClick={() => showNotice("Tous les filtres sont déjà visibles dans le menu.")}>Filtrer <ChevronDown className="h-4 w-4" /></button>
            </div>

            <div className="scrollbar-none -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 lg:hidden">
              {categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`mobile-category ${activeCategory === category ? "active" : ""}`}>{category}</button>)}
            </div>

            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {displayedItems.map((item) => (
                <article key={item.id} className="menu-card group">
                  <button className={`relative aspect-[1.08] w-full overflow-hidden bg-[#e9dfce] text-left ${item.id % 2 ? "dish-shape-a" : "dish-shape-b"}`} onClick={() => setSelected(item)} aria-label={`Voir ${item.name}`}>
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]" />
                    {item.badge && <span className="image-badge">{item.badge}</span>}
                    <span className="dish-number">{String(item.id).padStart(2, "0")}</span>
                    <span className="quick-view"><Search className="h-4 w-4" /> Quick view</span>
                  </button>
                  <div className="flex gap-3 pt-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3"><h3 className="font-display text-2xl leading-6 tracking-[-0.045em]">{item.name}</h3><span className="menu-price shrink-0">{formatPrice(item.price)}</span></div>
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#685a4d]">{item.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#685a4d]">
                        {item.rating && <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[#d95f32] text-[#d95f32]" /> {item.rating}</span>}
                        {item.spicy && <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-[#d95f32]" /> relevé</span>}
                        <span>{item.tags[0]}</span>
                      </div>
                    </div>
                    <button className="add-button" onClick={() => addToCart(item)} aria-label={`Ajouter ${item.name}`}><Plus className="h-5 w-5" /></button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#2f251e]/10 bg-[#e9dfce] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl"><p className="eyebrow mb-3"><span className="ticket-stamp">S/02</span> Le rituel Savoro</p><h2 className="font-display text-4xl leading-none tracking-[-0.055em]">Trois gestes, rien de plus.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#685a4d]">Une carte courte, un panier clair, votre repas préparé au bon moment.</p></div>
            <div className="grid grid-cols-3 gap-4 text-center sm:gap-8">
              {[['01', 'Choisissez', 'Votre table'], ['02', 'Ajustez', 'Votre rythme'], ['03', 'Récupérez', 'Au comptoir']].map(([number, label, detail]) => <div className="ritual-step" key={number}><span className="font-display text-3xl text-[#d95f32]">{number}</span><p className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-[#594b40]">{label}</p><small>{detail}</small></div>)}
            </div>
          </div>
        </section>
      </main>

      <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fbf7ee] text-[#2f251e]"><ShoppingBag className="h-4 w-4" /></span>
        <span className="flex-1 text-left"><strong>Voir ma commande</strong><small>{totalItems ? `${totalItems} article${totalItems > 1 ? "s" : ""} · ${formatPrice(subtotal)}` : "Le panier vous attend"}</small></span>
        <ArrowRight className="h-5 w-5" />
      </button>

      {notice && <div className="notice" role="status"><Check className="h-4 w-4" />{notice}</div>}

      {selected && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label={`Fiche de ${selected.name}`}>
          <button className="absolute inset-0 cursor-default" aria-label="Fermer la fiche" onClick={() => setSelected(null)} />
          <div className="quick-modal relative">
            <button className="icon-close" onClick={() => setSelected(null)} aria-label="Fermer"><X className="h-5 w-5" /></button>
            <div className="grid md:grid-cols-[0.95fr_1.05fr]">
              <img src={selected.image} alt={selected.name} className="h-64 w-full object-cover md:h-full" />
              <div className="p-6 sm:p-8">
                <p className="eyebrow mb-3">{selected.category}</p>
                <div className="flex items-start justify-between gap-4"><h2 className="font-display text-4xl leading-none tracking-[-0.055em]">{selected.name}</h2><span className="shrink-0 font-bold">{formatPrice(selected.price)}</span></div>
                <p className="mt-5 leading-7 text-[#685a4d]">{selected.description}</p>
                <div className="my-6 border-y border-dashed border-[#2f251e]/20 py-4"><p className="text-sm"><strong>Allergènes :</strong> {selected.allergens}</p></div>
                <div className="flex flex-wrap gap-2">{selected.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <button className="primary-cta mt-8 w-full justify-center" onClick={() => { addToCart(selected); setSelected(null); }}>Ajouter à la commande <Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="modal-layer z-50" role="dialog" aria-modal="true" aria-label="Votre commande">
          <button className="absolute inset-0 cursor-default bg-[#2f251e]/20" aria-label="Fermer le panier" onClick={() => setCartOpen(false)} />
          <aside className="side-cart relative ml-auto flex h-full w-full max-w-[460px] flex-col bg-[#fbf7ee] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2f251e]/10 px-6 py-5"><div><p className="eyebrow mb-1">Votre commande</p><h2 className="font-display text-3xl tracking-[-0.05em]">Le panier</h2></div><button className="icon-close" onClick={() => setCartOpen(false)} aria-label="Fermer"><X className="h-5 w-5" /></button></div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex h-full min-h-72 flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#e9dfce]"><UtensilsCrossed className="h-7 w-7 text-[#d95f32]" /></span><h3 className="mt-5 font-display text-3xl tracking-[-0.05em]">Un peu faim ?</h3><p className="mt-2 max-w-64 text-sm leading-6 text-[#685a4d]">Votre sélection apparaîtra ici, prête à être finalisée.</p><button className="mt-5 font-bold underline decoration-[#d95f32] decoration-2 underline-offset-4" onClick={() => setCartOpen(false)}>Explorer la carte</button></div>
              ) : cart.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-dashed border-[#2f251e]/15 py-4 first:pt-0"><img src={item.image} alt="" className="h-[74px] w-[74px] rounded-[1rem_1rem_1rem_0.25rem] object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><h3 className="font-display text-xl leading-5 tracking-[-0.04em]">{item.name}</h3><span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span></div><div className="mt-3 flex items-center justify-between"><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Retirer un ${item.name}`}><Minus className="h-3.5 w-3.5" /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Ajouter un ${item.name}`}><Plus className="h-3.5 w-3.5" /></button></div><button className="text-xs font-bold text-[#685a4d] underline underline-offset-4" onClick={() => changeQuantity(item.id, -item.quantity)}>Retirer</button></div></div></div>
              ))}
            </div>
            {cart.length > 0 && <div className="border-t border-[#2f251e]/10 bg-[#f4ecdf] p-6"><div className="flex justify-between font-semibold"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div><p className="mt-2 text-xs leading-5 text-[#685a4d]">Taxes et détails de retrait à l’étape suivante.</p><button className="primary-cta mt-5 w-full justify-center" onClick={() => showNotice("Le raccordement au checkout est prêt à être configuré.")}>Continuer la commande <ArrowRight className="h-4 w-4" /></button></div>}
          </aside>
        </div>
      )}

      {mobileMenuOpen && <div className="modal-layer z-50" role="dialog" aria-modal="true" aria-label="Menu de navigation"><button className="absolute inset-0 bg-[#2f251e]/20" aria-label="Fermer le menu" onClick={() => setMobileMenuOpen(false)} /><div className="relative mt-[72px] rounded-b-[2rem] bg-[#fbf7ee] p-6 shadow-xl"><div className="mb-8 flex justify-between"><span className="font-display text-3xl tracking-[-0.06em]">savoro</span><button className="icon-close" onClick={() => setMobileMenuOpen(false)}><X className="h-5 w-5" /></button></div>{["Commander", "Nos adresses", "Réserver"].map((link) => <button key={link} className="flex w-full items-center justify-between border-t border-[#2f251e]/10 py-4 text-left font-display text-3xl tracking-[-0.05em]" onClick={() => { setMobileMenuOpen(false); link === "Commander" ? document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }) : showNotice(`${link} sera bientôt disponible.`); }}>{link}<ChevronLeft className="h-5 w-5 rotate-180 text-[#d95f32]" /></button>)}</div></div>}
    </div>
  );
}
