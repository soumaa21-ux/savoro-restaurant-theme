# WordPress et commande WhatsApp

## Compatibilité

Le thème actuel est une application React/Tailwind autonome. Il fonctionne immédiatement comme storefront indépendant, mais ce n’est pas encore un thème WordPress natif installable depuis l’écran **Apparence → Thèmes**.

Pour WordPress, deux chemins sont possibles. Le premier consiste à intégrer le build dans une page WordPress via un bloc HTML ou un shortcode ; c’est le chemin le plus rapide et il conserve l’interface, les couleurs, les interactions de quick view et le side cart. Le second consiste à convertir la structure en thème WordPress ou en plugin Gutenberg, puis à remplacer les données statiques par des produits WooCommerce ou une API headless. Cette conversion est une étape dédiée, car elle doit gérer les templates, les assets, le cache et la sécurité WordPress.

## WhatsApp

Le bouton **Continuer la commande** conserve son libellé, sa couleur et son style. Il construit un lien `wa.me` avec un message prérempli comprenant chaque plat, la quantité, le choix radio, les suppléments cochés, le prix de la ligne et le total. Le client arrive dans WhatsApp avec la commande complète prête à être envoyée au restaurant.

La variable frontend à renseigner est `VITE_WHATSAPP_NUMBER`. Elle doit contenir le numéro international sans espaces, parenthèses, signe `+` ni tirets, par exemple `33612345678`. Le code retire également les caractères non numériques par sécurité. Sans cette variable, l’interface affiche un message de configuration au lieu de générer un lien incomplet.

## Limite importante

`wa.me` ouvre une conversation et préremplit le texte ; il ne confirme pas automatiquement le paiement, la disponibilité ou la préparation. Pour une commande réellement validée, le restaurant doit confirmer la commande dans WhatsApp ou utiliser un checkout commerce séparé. Les prix et les disponibilités devront être revalidés côté serveur lors d’une future intégration WooCommerce ou Shopify.

## Page produit dédiée

WordPress peut renvoyer 404 sur une route React profonde comme `/produit/pizza-primavera` lorsque ses permaliens ne réécrivent pas cette URL vers le template du thème. L’alias compatible utilisé par Savoro est donc `/?savoro_product=pizza-primavera`. Il charge la même page produit React avec la même image, les radios, les cases à cocher, les suppléments, le prix recalculé, le panier latéral et le lien WhatsApp.
