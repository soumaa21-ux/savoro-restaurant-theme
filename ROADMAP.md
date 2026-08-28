# Roadmap métier Savoro

Cette version livre une expérience frontend de commande avec personnalisation locale des plats. Les choix radio, les suppléments en cases à cocher, le prix calculé en direct et l’édition d’une ligne existante sont prêts à être reliés à un catalogue réel.

## Prochaine extension : checkout et disponibilités

Le panier pourra être raccordé à **Shopify** afin de déléguer le checkout, les paiements et la gestion du cycle de commande à une plateforme commerce. Le storefront devra ensuite remplacer les données statiques de `Home.tsx` par le catalogue et les variantes exposées par la boutique. Les disponibilités pourront être synchronisées par créneau, emplacement et inventaire ; l’interface devra afficher un état indisponible avant l’ajout et revalider le panier avant paiement.

## Prochaine extension : back-office des options

Un back-office devra permettre de gérer les groupes de personnalisation par plat : nom du groupe, caractère obligatoire, type radio ou checkbox, limite de sélection, ordre d’affichage, disponibilité, allergènes et supplément de prix. Chaque option devra posséder un identifiant stable afin de préserver les lignes de panier lorsque son libellé évolue. Les règles de prix devront être centralisées côté serveur avant toute commande réelle.

## Contrats UX à conserver

La quick view doit rester le point d’entrée de la personnalisation. Toute variation de prix est visible sur la ligne d’option et dans le bouton d’action. Le panier montre le choix obligatoire et les extras sélectionnés, et le bouton **Modifier** rouvre la fiche avec les choix précédents. Une future intégration serveur devra revalider prix, disponibilité et règles de sélection à la soumission.
