# Project TODO

- [x] Direction visuelle « Cuisine d’atelier » et palette Savoro
- [x] Menu restaurant responsive desktop/mobile
- [x] Quick view produit
- [x] Side cart avec contrôle des quantités
- [x] Barre de panier persistante sur mobile
- [x] Assets gastronomiques personnalisés
- [x] Groupes d’options par plat : choix obligatoire en radio, choix multiples en checkbox et suppléments payants
- [x] Options visibles dans la quick view avec état local réinitialisé à chaque plat
- [x] Prix recalculé selon les suppléments sélectionnés et affiché en direct sur le bouton
- [x] Options et prix final conservés dans chaque ligne du side cart
- [x] Test unitaire du calcul de prix avec options et suppléments
- [x] Vérification responsive et typage/build
- [x] Documenter le raccordement du panier à un vrai checkout et aux disponibilités en temps réel via Shopify comme prochaine extension hors périmètre frontend
- [x] Documenter le back-office de gestion des options et suppléments comme prochaine extension hors périmètre frontend
- [x] Ajouter le parcours de modification d’une ligne existante depuis le panier avec options préremplies et prix recalculé
- [x] Créer un checkpoint final après validation

## Règles UX

Les radios servent aux choix exclusifs et obligatoires, avec une option par défaut explicite. Les cases à cocher servent aux ajouts multiples, avec le prix affiché sur chaque supplément. Le bouton d’ajout affiche le prix calculé en direct afin d’éviter toute surprise. Les options sélectionnées restent visibles dans le panier et pourront être modifiées via la quick view lorsqu’un parcours d’édition sera ajouté.

## Nouvelle demande — desktop, WordPress et WhatsApp

- [x] Rendre le conteneur quick view scrollable sur desktop pour garder le bouton d’action accessible.
- [x] Ajouter une URL wa.me configurable et générer le détail complet de la commande.
- [x] Conserver dans le message WhatsApp les plats, quantités, options, suppléments, prix unitaires et total.
- [x] Garder le même libellé et la même couleur du bouton de checkout en le reliant à WhatsApp.
- [x] Documenter la compatibilité WordPress et la méthode d’intégration.
- [x] Vérifier le flux, le typage/build et créer un checkpoint final.

## Contrôle final complémentaire

- [x] Inclure le prix unitaire de chaque ligne dans le message WhatsApp, en plus du total de ligne.
- [x] Créer un nouveau checkpoint après les corrections Quick View, WhatsApp et WordPress, puis clôturer la validation finale.

## Intégration WordPress de test

- [x] Auditer les extensions, le thème actif, les réglages et les pages existantes.
- [x] Installer WooCommerce si nécessaire et vérifier sa configuration de base.
- [x] Préparer un package WordPress du thème Savoro avec le même rendu visuel.
- [x] Installer et activer le thème Savoro dans WordPress.
- [x] Désactiver ou supprimer uniquement les extensions de test inutiles après audit — aucune extension clairement inutile identifiée ; LiteSpeed est conservée pour le cache.
- [x] Configurer le parcours panier vers WhatsApp sans perdre les options, suppléments et total.
- [x] Vérifier le rendu public desktop et sauvegarder un état restaurable ; le desktop et le flux public sont validés, le mobile réel reste à contrôler sur appareil.

## Contrôles WordPress complémentaires

- [x] Auditer les pages existantes et les réglages WordPress/WooCommerce, puis documenter précisément les constats.
- [x] Ouvrir les réglages WooCommerce essentiels : boutique, paiements, visibilité et pages, puis confirmer la configuration de base.
- [x] Refaire un audit complet des extensions installées avant de conclure qu’aucune suppression/désactivation n’est nécessaire.
- [x] Créer un checkpoint restaurable après l’intégration WordPress et revalider le rendu public desktop.

## Comparaison objective React ↔ WordPress

- [x] Définir les mêmes viewports : desktop 1280×720 et mobile 375×812.
- [x] Capturer la page principale React et WordPress avec les mêmes images.
- [x] Capturer la quick view React et WordPress avec radio, checkbox et supplément payant sélectionnés.
- [x] Capturer le side cart React et WordPress avec une ligne configurée, options et total visibles.
- [x] Capturer les états fermés, ouverts et scrollés de la quick view et du side cart.
- [x] Produire une comparaison objective des écarts de layout, typographie, couleurs, images, espacements et interactions.
- [x] Corriger les écarts importants et revalider desktop/mobile — logo transparent, assets v3 et route produit corrigés.
- [x] Sauvegarder un checkpoint après la comparaison et les corrections.

## Extension page produit

- [x] Inclure une page produit dédiée dans la comparaison React et WordPress, en desktop et mobile.
- [x] Vérifier sur la page produit les options radio, cases à cocher, suppléments payants, quantité, prix final, panier et WhatsApp.
- [x] Corriger les écarts entre page produit et quick view, puis revalider les deux versions.
- [x] Corriger la route produit WordPress qui renvoie 404 et fournir une URL produit publique compatible avec les permaliens WordPress.

## Contrôles manquants à compléter

- [x] Ouvrir et documenter explicitement l’onglet Paiements WooCommerce ainsi que l’état des pages boutique, panier et commande.
- [x] Prendre une capture React de la quick view avec un radio sélectionné, un supplément coché et le prix recalculé.
- [x] Prendre une capture React du side cart avec une ligne configurée, options visibles et total.
- [x] Tester depuis la page produit dédiée l’ajout au panier puis l’ouverture du lien WhatsApp avec options et suppléments.
- [x] Corriger les éventuels écarts page produit/quick view et revalider desktop/mobile.
- [x] Créer un checkpoint après l’intégration WordPress et la comparaison finale.

## Revalidation finale après corrections

- [x] Revalider explicitement desktop et mobile après v3 sur home, quick view et side cart.
- [x] Tester depuis la page produit dédiée l’ajout au panier, le side cart puis WhatsApp avec options et suppléments.
- [x] Documenter précisément l’écart page produit/quick view et recapturer les deux versions après correction.
- [x] Créer le checkpoint final après comparaison React ↔ WordPress et corrections validées.

## Validation finale WordPress v4 — 28 août 2026
- [x] Installer et activer le package Savoro v4 dans WordPress.
- [x] Vérifier l’absence d’artefact noir autour du logo transparent.
- [x] Vérifier l’alias public `/?savoro_product=pizza-primavera`.
- [x] Vérifier quick view, options radio, suppléments payants, prix recalculé et side cart.
- [x] Vérifier le lien WhatsApp avec options, suppléments, prix unitaire et total.
- [x] Corriger les scripts package.json hérités afin que `pnpm test` et `pnpm build` s’exécutent réellement dans la version finale.
- [x] Relancer les tests et le build après correction, puis créer le checkpoint final restaurable.
- [x] Compléter le contrôle explicite des états mobile/scroll et des réglages WooCommerce si l’accès reste disponible.

Rapport : la validation WordPress v4 a confirmé le thème actif, le logo transparent, la home, le quick view, la page produit alias, le side cart et le lien WhatsApp configuré. Les tests Vitest (4/4), le contrôle TypeScript et le build de production passent après rétablissement du script `test`.
