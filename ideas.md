# Direction créative — Savoro

## Trois pistes explorées

| Thème | Très brève intention | Probabilité |
| --- | --- | ---: |
| Comptoir solaire | Une identité méditerranéenne claire, lumineuse et tactile, pensée comme un menu imprimé qui devient fluide au doigt. L’expérience privilégie la chaleur, la lisibilité et l’appétit visuel. | 0.07 |
| Izakaya de minuit | Une direction dense et nocturne, inspirée des petits comptoirs urbains japonais, où les choix culinaires apparaissent comme des signaux lumineux. Elle favorise le rythme et la découverte. | 0.03 |
| Cuisine d’atelier | Un univers éditorial de bistrot contemporain : matières papier, encre brune, photos culinaires expressives et repères colorés d’une carte manuscrite. L’interface semble conçue par une maison de restauration, non par un logiciel générique. | 0.09 |

## Approche retenue — Cuisine d’atelier

### Mouvement de design

**Éditorial gastronomique contemporain**, avec l’énergie tactile des cartes de menu de quartier et la précision fonctionnelle du commerce mobile.

### Principes directeurs

1. **Commander sans interrompre l’envie :** les actions d’ajout, de personnalisation et de consultation du panier restent visibles et réversibles.
2. **Une hiérarchie comestible :** les plats s’expriment par la photographie, un titre typographique assumé et un petit nombre d’informations immédiatement utiles.
3. **Mobile d’abord, pas mobile réduit :** les éléments d’action ont une zone tactile généreuse, un panier persistant et des étapes de commande à faible charge cognitive.
4. **Chaleur maîtrisée :** la texture, les ombres et les couleurs se mettent au service du repas sans ajouter de friction visuelle.

### Philosophie couleur

Le fond ivoire légèrement chaud rappelle le papier d’une carte soigneusement imprimée et crée une base calme pour parcourir plusieurs plats. Le brun encre structure le texte et donne de la présence aux prix. La couleur propriétaire, **Paprika Brûlé**, joue le rôle de repère transactionnel : elle signale l’ajout, la progression et les éléments sélectionnés, comme une annotation de chef sur un menu. Un vert olive discret apporte l’idée de fraîcheur aux attributs alimentaires et aux accents secondaires.

### Paradigme de mise en page

Sur grand écran, l’interface suit un **rail de commande** : à gauche, une bande éditoriale verticale ancre la marque et les catégories ; au centre, le menu défile en ruban de plats ; à droite, le panier peut s’ouvrir en panneau latéral. Sur mobile, la page devient une **carte à explorer au pouce** : une barre de catégories glisse horizontalement, chaque plat conserve une action immédiate et le panier reste disponible dans une barre fixe basse.

### Éléments signatures

1. Les **pastilles d’annotation** en paprika, petites mais contrastées, signalent les sélections, les nouveautés et les ajouts.
2. Un **filet en pointillé** et des repères de menu évoquent les tickets de cuisine sans donner un aspect rétro forcé.
3. Des **vignettes de plats aux cadrages serrés** donnent une sensation de matière, avec un traitement arrondi asymétrique réservé aux médias.

### Philosophie d’interaction

L’interface confirme chaque intention avec retenue : un ajout met à jour la quantité dans le panier et fait apparaître un bref retour contextualisé. Le quick view s’ouvre comme une fiche de plat accessible sans perdre la position dans le menu ; le side cart préserve l’état du menu et se ferme d’un geste simple. Les actions fréquentes sont instantanées au clavier et au toucher.

### Animation

Les panneaux et modales utilisent une arrivée courte de 220 à 280 ms avec une courbe nette `cubic-bezier(0.23, 1, 0.32, 1)`. Les images peuvent se décaler légèrement au survol sur desktop, tandis que les boutons confirment le toucher à `scale(0.97)`. Les articles du panier entrent par opacité et translation discrète, jamais par rebond. Toute animation non essentielle respecte `prefers-reduced-motion`.

### Système typographique

**DM Serif Display** joue le rôle de voix gastronomique pour les titres, les noms de plats et les montants clés. **Manrope** assure le corps, les filtres, les descriptions et les commandes grâce à sa densité lisible sur mobile. Les titres utilisent un contraste de taille marqué, tandis que les informations opérationnelles restent compactes, en capitales espacées seulement lorsqu’elles servent de repère.

### Essence de marque

**Savoro est la carte de restaurant pensée pour commander avec l’assurance d’un habitué, rapide à parcourir et riche en envie.**

Personnalité : **gourmande, précise, chaleureuse**.

### Voix de marque

Les titres décrivent une tentation ou une intention culinaire concrète ; les appels à l’action sont directs et situés ; les microcopies expliquent l’effet d’une action sans remplir l’espace.

> « Votre table commence ici. »

> « Ajouter au panier, garder l’appétit. »

### Wordmark et logo

Le mot-symbole combine un « S » souple dessiné comme un ruban de sauce et une coupe minimale gravée d’un point paprika. Le symbole autonome est une **spirale de vapeur formant un S**, lisible dans une icône d’application, un favicon ou à côté de la marque. Il ne dépend d’aucune typographie système.

### Couleur de marque signature

**Paprika Brûlé — #D95F32**. Cette teinte incarne la chaleur du four et sert exclusivement à guider les décisions de commande, ce qui la rend immédiatement reconnaissable.

## Style Decisions

- Les pastilles d’annotation commerciales, les sélections de catégories et les repères de progression utilisent **Paprika Brûlé #D95F32** ; les surfaces neutres ne servent qu’aux informations descriptives.
- Les médias culinaires utilisent un **arrondi asymétrique clairement visible**, alterné dans la carte pour créer une signature éditoriale plutôt qu’une grille de catalogue.
- Chaque grande section contient au moins un signe de **menu imprimé contemporain** : numéro de carte, filet pointillé, annotation brève ou repère de ticket.
