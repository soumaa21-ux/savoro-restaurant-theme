# Savoro — Restaurant Ordering Theme

Savoro est un thème de commande restaurant premium, mobile-first, avec menu éditorial, quick view personnalisable, side cart et commande WhatsApp. Le projet comprend la source React/Vite, le wrapper WordPress/WooCommerce de test, les captures de comparaison et le dashboard restaurateur fourni par le client.

## Démarrage rapide

```bash
pnpm install
pnpm test
pnpm exec tsc --noEmit
pnpm build
pnpm dev
```

Le guide complet de reprise se trouve dans [`PASSATION.md`](./PASSATION.md). Les documents WordPress et de comparaison sont [`WORDPRESS.md`](./WORDPRESS.md), [`wordpress-audit.md`](./wordpress-audit.md) et [`comparison/visual-findings.md`](./comparison/visual-findings.md).

## Fonctionnalités livrées

Le parcours client comprend la navigation par catégories, les fiches plats, la quick view avec choix radio et cases à cocher, les suppléments payants, le recalcul de prix, le side cart avec quantité et modification de ligne, ainsi qu’un lien WhatsApp contenant le détail de la commande. La page produit dédiée est accessible par route React et par alias WordPress `?savoro_product=pizza-primavera`.

## Structure principale

| Dossier | Rôle |
|---|---|
| `client/src/pages` | Home et page produit React |
| `client/src/components` | Composants d’interface et primitives UI |
| `savoro-wordpress-theme-v4` | Package WordPress v4 validé dans l’environnement de test |
| `wordpress/restaurant-dashboard` | Dashboard restaurateur fourni et adaptation locale commencée |
| `comparison` | Captures et constats de comparaison React/WordPress |
| `scripts` | Packaging WordPress et outils de contrôle d’assets |
| `PASSATION.md` | Architecture, règles métier, sécurité et étapes de reprise |

## État WooCommerce

WooCommerce est installé dans l’environnement de test, mais son catalogue est actuellement vide. Les vrais produits, catégories, dimensions, sauces et suppléments doivent être fournis par le restaurateur avant alimentation du catalogue. Aucune donnée client, note ou témoignage ne doit être inventé.

## URLs de test

| Accès | URL |
|---|---|
| Site public | https://lightseagreen-bison-790707.hostingersite.com/ |
| Administration WordPress | https://lightseagreen-bison-790707.hostingersite.com/wp-admin/ |
| Alias page produit | https://lightseagreen-bison-790707.hostingersite.com/?savoro_product=pizza-primavera |
| Preview React | https://3000-igowooleyft68qqb74lls-c975e590.us4.manus.computer/ |

## Version de référence

Le checkpoint WebDev de référence est `manus-webdev://641de63b`. Le dashboard a été volontairement laissé comme travail local non finalisé lorsque la priorité a été déplacée vers la création de ce dépôt GitHub.
