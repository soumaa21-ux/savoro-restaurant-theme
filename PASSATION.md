# Passation développeur — Savoro Restaurant Ordering Theme

## 1. Objet du projet

Savoro est un thème de commande restaurant premium, conçu en priorité pour le mobile tout en conservant une expérience desktop soignée. Le parcours principal permet de parcourir une carte, ouvrir une fiche rapide, personnaliser un plat, visualiser un side cart et transférer la commande complète vers WhatsApp.

Le dépôt contient le projet React/Vite source, le packaging WordPress utilisé pour l’environnement de test, les captures de comparaison, les scripts d’optimisation et le plugin de dashboard restaurateur fourni pendant la dernière itération. Le dashboard a été copié et commencé à être adapté, mais cette adaptation a été arrêtée à la demande du propriétaire ; elle doit donc être considérée comme une branche de travail non finalisée.

## 2. État fonctionnel validé

| Élément | État | Emplacement ou URL |
|---|---|---|
| Home React | Validée desktop et mobile | `client/src/pages/Home.tsx` |
| Page produit | Validée avec alias WordPress | `client/src/pages/ProductPage.tsx` |
| Quick view | Radios, cases à cocher, suppléments payants, prix dynamique | `client/src/pages/Home.tsx` |
| Side cart | Quantité, modification, retrait, sous-total | `client/src/pages/Home.tsx` et `ProductPage.tsx` |
| WhatsApp | Message prérempli avec lignes, choix, suppléments et total | Variable `VITE_WHATSAPP_NUMBER` |
| WordPress | Package v4 installé et activé dans l’environnement de test | `savoro-wordpress-theme-v4/` et `savoro-wordpress-theme-v4.zip` |
| WooCommerce | Installé dans l’environnement de test, catalogue actuel vide | API Store `/wp-json/wc/store/v1/products` |
| Tests | Vitest 4/4, TypeScript et build validés au dernier checkpoint | `package.json` |
| Checkpoint Manus | Version restaurable | `manus-webdev://641de63b` |

## 3. Architecture

Le frontend est une application React 19 avec Vite, Tailwind CSS 4, Wouter, Lucide et les composants shadcn présents dans `client/src/components/ui`. `client/src/App.tsx` route la home, la page produit `/produit/:slug`, l’alias WordPress `/?savoro_product=...` et la page 404. Le serveur Express sert le build et respecte `process.env.PORT`.

Les données de démonstration de la carte sont actuellement définies dans les composants de pages. La prochaine intégration attendue est de remplacer cette source locale par un adaptateur WooCommerce. Le catalogue WooCommerce ne doit pas être inventé : l’API testée est vide et doit être alimentée avec les plats réels du restaurateur.

## 4. WordPress et WooCommerce

Le thème WordPress est un wrapper du build React. Les versions sont conservées dans les dossiers `savoro-wordpress-theme`, `savoro-wordpress-theme-v2`, `savoro-wordpress-theme-v3` et `savoro-wordpress-theme-v4`. La v4 corrige notamment le rendu du logo transparent et prend en charge l’alias produit compatible avec WordPress.

Le plugin de dashboard fourni par le client se trouve dans `wordpress/restaurant-dashboard`. Son bootstrap attend `includes/ajax.php`; ce fichier manquant a été ajouté localement avec des handlers CRUD WooCommerce sécurisés par nonce et capacité `edit_products`. Le dashboard joint n’est pas encore installé comme nouvelle version sur le site distant après cette modification.

Pour une vraie intégration, choisir une stratégie explicite : soit le dashboard reste un plugin WordPress qui utilise `admin-ajax.php` et les objets WooCommerce côté serveur, soit le dashboard React consomme une API WordPress dédiée. Ne jamais exposer de clés REST WooCommerce dans le navigateur. Les opérations d’administration doivent rester côté WordPress et être protégées par nonce, authentification et rôle.

## 5. Modèle recommandé pour les options

Les personnalisations doivent être stockées comme métadonnées produit structurées, ou dans des entités dédiées si le volume devient important. Le format commencé dans le plugin est :

```json
{
  "groups": [
    {
      "id": "sauces",
      "name": "Sauces",
      "type": "checkbox",
      "required": false,
      "min": 0,
      "max": 2,
      "items": [
        {"id": "barbecue", "label": "Sauce barbecue", "price": 0},
        {"id": "harissa", "label": "Harissa douce", "price": 2}
      ]
    }
  ]
}
```

Le frontend doit appliquer les règles `radio`, `checkbox`, `required`, `min` et `max`, tout en recalculant le prix à partir des données reçues. La validation doit être reproduite côté serveur avant toute commande WooCommerce ou transmission WhatsApp. Le cas « maximum 2 sauces » correspond à `type: checkbox` et `max: 2`.

## 6. Dashboard restaurateur

Le package d’origine est une interface frontend WordPress avec shortcode `[restaurant_dashboard]`, rôle `restaurant_owner`, redirection hors de `wp-admin`, gestion des produits, catégories, photos, statuts et compte. Son style initial est sombre avec accents dorés. L’objectif Savoro est de conserver sa simplicité mais de reprendre les tokens du thème : ivoire, brun encre, paprika/orange, typographie éditoriale et arrondis plus doux.

Le dashboard final devra permettre au restaurateur de créer et modifier un produit, choisir ses catégories, gérer les dimensions L/XL/XXL, créer des groupes de sauces ou suppléments, fixer les prix additionnels et régler les limites min/max. Il devra afficher un message clair lorsque la règle est incohérente, par exemple un maximum inférieur au minimum ou un maximum supérieur au nombre de choix.

## 7. Installation locale

```bash
pnpm install
pnpm test
pnpm exec tsc --noEmit
pnpm build
pnpm dev
```

Le serveur de développement utilise le port fourni par l’environnement. Ne pas hardcoder un port dans le code serveur. Les variables d’environnement sont injectées par l’environnement WebDev ; ne pas committer de fichier `.env`.

## 8. Déploiement WordPress de test

Le site de test utilisé est `https://lightseagreen-bison-790707.hostingersite.com/`. L’administration se trouve sur `https://lightseagreen-bison-790707.hostingersite.com/wp-admin/`. L’alias de la page produit est `https://lightseagreen-bison-790707.hostingersite.com/?savoro_product=pizza-primavera`.

Le téléversement de thèmes et plugins depuis l’administration WordPress peut nécessiter une sélection manuelle du fichier ZIP dans le sélecteur de fichiers du navigateur. Après installation, vérifier l’activation du thème, la page dashboard, le rôle restaurateur, le catalogue, les options et le rendu mobile.

## 9. Points restant à traiter

La source des plats doit être reliée au catalogue WooCommerce réel, puis le catalogue doit être créé avec les données fournies par le restaurateur. Le plugin dashboard doit être empaqueté et installé comme extension complète, avec une page `[restaurant_dashboard]` et un compte restaurateur dédié. Le thème React doit ensuite lire les produits et métadonnées de personnalisation depuis WordPress au lieu d’utiliser les données locales.

Les tests à ajouter couvrent les limites de sélection, les prix des suppléments, les droits du rôle restaurateur, les erreurs de nonce, les produits désactivés, la synchronisation cache et la génération du message WhatsApp. Les avis et témoignages clients ne doivent jamais être fabriqués ou ajoutés comme contenu de démonstration.

## 10. Références de reprise

Le dépôt doit être lu avec `WORDPRESS.md`, `ROADMAP.md`, `wordpress-audit.md`, `comparison/visual-findings.md` et les scripts du dossier `scripts/`. Le checkpoint Manus final au moment de la passation est `manus-webdev://641de63b`.
