# Audit initial WordPress — environnement de test

L’administration est accessible avec un compte administrateur connecté. Le site utilise WordPress 7.1 et le thème semble être un thème basé sur les blocs, avec l’éditeur de site actif. La liste des extensions affiche 5 extensions activées, dont 2 indispensables et 1 extension avancée selon les filtres WordPress.

Extensions visibles : Hostinger AI, Hostinger Easy Onboarding, Hostinger Reach, Hostinger Tools et LiteSpeed Cache. WooCommerce n’est pas présent dans la liste affichée. Hostinger AI, Easy Onboarding, Reach et Tools sont des extensions de service ou d’onboarding ; LiteSpeed Cache est utile pour le cache et l’optimisation. Aucune suppression n’a encore été effectuée.

Suite prévue : ouvrir l’ajout d’extensions pour installer WooCommerce, auditer le thème actif et préparer une intégration Savoro compatible avec l’éditeur de site. Les extensions Hostinger seront désactivées ou supprimées uniquement après confirmation de leur rôle et après conservation de LiteSpeed Cache si son cache est utilisé.

La page officielle d’ajout d’extensions est accessible et la recherche `WooCommerce` a été saisie. Il faut attendre le rafraîchissement des résultats avant de sélectionner l’extension officielle WooCommerce.

Le résultat officiel WooCommerce (éditeur Automattic, version 11.0.1 affichée) a été sélectionné. WordPress indique « Installation… » ; l’activation et l’assistant de configuration restent à vérifier.

Vérification finale : WooCommerce apparaît dans le menu d’administration et le thème Savoro est activé. Le site public charge les assets depuis /wp-content/themes/savoro-wordpress-theme/assets avec le rendu Savoro. La quick view affiche les radios, les cases à cocher, les suppléments et le bouton d’ajout visible. Après sélection de « Pain grillé maison +2,00 € », le panier affiche Burrata à 15,50 €. Le bouton « Continuer la commande » ouvre api.whatsapp.com avec le numéro 212655008856 et un message contenant le plat, la quantité, le prix unitaire, le total de ligne et les options sélectionnées. Aucun message n’a été envoyé.

Audit complémentaire : la liste des extensions contient 2 éléments actifs, LiteSpeed Cache 7.9 et WooCommerce 11.0.1. LiteSpeed est conservée car elle sert au cache/optimisation Hostinger ; aucun plugin de test additionnel n’est installé. La liste des pages contient 6 pages : Boutique, Mon compte, Panier, Politique de confidentialité, Remboursements et retours (brouillon), et Validation de la commande. Le site public Savoro est rendu par le thème et n’utilise pas ces pages WooCommerce pour son checkout WhatsApp.

Réglages généraux confirmés après enregistrement : pays/état « Maroc — Casablanca » et devise « Dirham marocain (د.م.) — MAD ». Les champs d’adresse et de code postal restent volontairement vides car aucune adresse réelle n’a été fournie. La boutique est encore signalée comme « bientôt disponible » dans l’administration, point à vérifier dans la visibilité WooCommerce avant publication de test.

Visibilité confirmée : WooCommerce affiche désormais « En ligne » et le message de confirmation indique que les réglages ont été enregistrés. Le badge de visibilité reste activé dans la barre d’administration, ce qui permet de garder le statut visible pour l’administrateur pendant les tests.

21. Paiements WooCommerce contrôlés : l’onglet Paiements est accessible, les fournisseurs sont affichés et aucune passerelle n’est déclenchée pour le parcours actuel. Le bouton du side cart ouvre WhatsApp avec le détail complet ; aucun paiement automatique n’est exécuté.
