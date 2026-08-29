# 📱 Restaurant Owner Dashboard — Guide d'installation

## ✅ Ce que fait ce plugin

- Dashboard frontend pour gérer tes produits WooCommerce
- Ajouter / modifier / supprimer des produits
- Upload photos par drag & drop
- Interface style app mobile (dark mode)
- Accès séparé de wp-admin via rôle `restaurant_owner`

---

## 🚀 Installation (5 minutes)

### Étape 1 — Uploader le plugin

1. Va dans WordPress : **Extensions → Ajouter**
2. Clique **Téléverser une extension**
3. Upload le fichier `restaurant-dashboard.zip`
4. Clique **Installer** puis **Activer**

---

### Étape 2 — Créer la page Dashboard

1. Va dans **Pages → Ajouter**
2. Titre : `Dashboard`
3. Dans le contenu, ajoute ce shortcode :
   ```
   [restaurant_dashboard]
   ```
4. Publie la page

---

### Étape 3 — Créer ton compte propriétaire (optionnel)

> Si tu veux utiliser ton compte admin WordPress existant, 
> tu peux accéder directement à la page Dashboard sans créer de nouveau compte.
> 
> Si tu veux un compte séparé sans accès wp-admin :

1. Va dans **Utilisateurs → Ajouter**
2. Remplis email + mot de passe
3. **Rôle** : choisir `Restaurant Owner`
4. Enregistre

⚠️ Ce rôle n'a PAS accès à wp-admin — il sera redirigé vers le dashboard.

---

### Étape 4 — Tester

1. Va sur ta page Dashboard (ex: `tonsite.com/dashboard`)
2. Connecte-toi si nécessaire
3. Tu dois voir l'interface avec tes produits existants

---

## 🎨 Personnalisation

### Changer le nom du restaurant

Dans `templates/dashboard.php`, ligne :
```html
<h1 class="rd-title">Mon Restaurant</h1>
```
Remplace `Mon Restaurant` par ton nom.

### Changer les couleurs

Dans `assets/css/style.css`, modifie les variables CSS :
```css
--rd-accent: #ff6b35;   /* couleur principale (orange) */
--rd-green:  #2ecc71;   /* actif */
--rd-red:    #e74c3c;   /* supprimer */
```

---

## ❓ Problèmes fréquents

**"Produit créé mais pas visible dans la boutique"**
→ Vérifie que le statut est "Actif" et non "Brouillon"

**"L'image ne s'uploade pas"**
→ Vérifie les permissions du dossier `wp-content/uploads/`

**"Page blanche après activation"**
→ WooCommerce doit être installé et activé avant ce plugin

---

## 📋 Structure des fichiers

```
restaurant-dashboard/
├── restaurant-dashboard.php   ← fichier principal
├── includes/
│   ├── roles.php              ← rôle restaurant_owner
│   ├── ajax.php               ← CRUD produits (sécurisé)
│   ├── shortcode.php          ← [restaurant_dashboard]
│   └── redirect.php           ← blocage wp-admin
├── templates/
│   └── dashboard.php          ← HTML du dashboard
└── assets/
    ├── css/style.css          ← styles app mobile
    └── js/app.js              ← logique JavaScript
```
