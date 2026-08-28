# Comparaison React ↔ WordPress

## Captures de base

Les captures React ont été réalisées dans la preview gérée aux viewports 1280×720 et 375×812. Les captures WordPress public ont été réalisées sans barre d’administration avec Chromium aux mêmes dimensions. Les deux versions chargent les mêmes images Savoro depuis des chemins différents : preview Manus et `/wp-content/themes/savoro-wordpress-theme/assets/`.

## Observations initiales

La composition principale, la hiérarchie typographique, le fond ivoire, le brun encre, le paprika, la navigation, le hero, le texte et la barre panier mobile correspondent visuellement. Deux écarts sont visibles sur le logo : le desktop WordPress affiche un carré sombre derrière le symbole S alors que la preview React affiche le symbole sur fond ivoire, et la capture mobile WordPress n’affiche que le mot « savoro » sans le symbole S visible à gauche. Ces écarts doivent être inspectés et corrigés avant de conclure à une équivalence.

## Diagnostic du logo

Le source React affiche le symbole S avec une image de 40×40 dans le même bouton que le mot « savoro ». Les fichiers PHP du package WordPress servent d’enveloppe minimale autour du build compilé ; le style.css contient uniquement les métadonnées du thème. La différence observée ne vient donc pas d’une mise en page PHP distincte. Le rendu WordPress public reproduit la structure et les styles compilés, mais l’asset PNG du symbole ou son traitement par le navigateur doit être contrôlé pour supprimer le carré sombre desktop et garantir sa présence mobile.

## Contrôle après activation v2

WordPress confirme l’activation de `savoro-wordpress-theme-v2` et sert bien les assets depuis `/wp-content/themes/savoro-wordpress-theme-v2/assets/`. Le HTML public contient le hero, les cinq plats et les chemins d’images corrects. Une capture navigateur immédiate affiche cependant le hero et les cartes avec un fond ivoire en attendant le chargement complet des images ; le contrôle doit être refait après attente/rafraîchissement. La v2 ajoute également la route React `/produit/:slug`, à tester publiquement avec `/produit/pizza-primavera`.

## Page produit WordPress v3 validée

L’URL compatible `/?savoro_product=pizza-primavera` fonctionne et affiche la page produit dédiée. La version desktop présente la même composition à deux colonnes, l’image pizza, le titre, les options radio de taille, les cases à cocher de suppléments, la quantité, le total et le bouton d’ajout. La version mobile s’empile correctement avec le header Savoro, l’image produit, le titre et le début des options. Les captures headless doivent utiliser un délai de rendu pour éviter de conclure à tort que les images sont absentes.

## Quick view WordPress v3 validée

La quick view publique s’ouvre correctement sur la page d’accueil avec l’image du plat, le groupe radio obligatoire, les cases à cocher de suppléments payants, la quantité et le bouton orange. Le contenu est visible dans la fenêtre desktop et le rendu reprend la hiérarchie, les filets et la palette de la preview React. Le test suivant consiste à sélectionner un supplément, ajouter la ligne puis contrôler le side cart et le lien WhatsApp.

## Side cart WordPress v3 validé

Après sélection du supplément « Pain grillé maison +2,00 € », la ligne est ajoutée au panier à 15,50 €. Le side cart affiche le plat, le supplément, la quantité, le prix final, les actions Modifier/Retirer et le bouton « Continuer la commande ». Ce flux correspond à la logique React et conserve le détail nécessaire pour le message WhatsApp.

## WhatsApp WordPress validé

Le bouton « Continuer la commande » ouvre bien `api.whatsapp.com/send` vers le numéro configuré. Le texte prérempli contient le plat, la quantité, le prix unitaire, le prix de ligne, l’option radio et le supplément payant. Aucun message n’a été envoyé automatiquement ; WhatsApp présente la commande et laisse le client confirmer l’envoi.

## Quick view React validée

La preview React ouvre la même quick view que WordPress avec la photo Burrata, le radio « À partager », le radio « Format généreux +2,50 € », les cases de suppléments payants, la quantité et le bouton orange. La structure, le contenu et les accents Paprika sont cohérents avec la capture WordPress v3.

## Side cart React validé

La preview React affiche le même side cart que WordPress : la ligne Burrata à 15,50 €, le supplément « Pain grillé maison », la quantité, les actions Modifier/Retirer, le sous-total et le bouton « Continuer la commande ». Les captures React et WordPress reprennent la même hiérarchie, le même langage visuel et le même contenu de commande.
