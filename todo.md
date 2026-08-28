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
