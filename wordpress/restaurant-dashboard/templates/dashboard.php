<?php if (!defined('ABSPATH')) exit;
$s = rd_get_settings();
$logo_url = $s['logo_url'] ?? '';
?>
<div id="rd-app" class="rd-app-active">

  <!-- ══ HEADER ══════════════════════════════════════════ -->
  <header class="rd-header">
    <!-- Ligne 1 : logo + nom + actions -->
    <div class="rd-header-top">
      <div class="rd-logo">
        <?php if ($logo_url): ?>
          <img src="<?= esc_url($logo_url) ?>" class="rd-logo-img" alt="Logo">
        <?php else: ?>🍽️<?php endif; ?>
      </div>
      <div class="rd-header-info">
        <span class="rd-title"><?= esc_html($s['restaurant_name']) ?></span>
        <span class="rd-subtitle">Gestion des produits</span>
      </div>
      <div class="rd-header-actions">
        <button class="rd-header-account" id="rd-open-account" title="Mon compte">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>
        <button class="rd-btn-add" id="rd-open-add">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </button>
      </div>
    </div>
    <!-- Ligne 2 : stats -->
    <div class="rd-stats-row">
      <div class="rd-stat-pill gold">
        <span class="rd-stat-val" id="rd-count-total">—</span>
        <span class="rd-stat-label">Produits</span>
      </div>
      <div class="rd-stat-pill green">
        <span class="rd-stat-val" id="rd-count-active">—</span>
        <span class="rd-stat-label">Actifs</span>
      </div>
      <div class="rd-stat-pill neutral">
        <span class="rd-stat-val" id="rd-count-draft">—</span>
        <span class="rd-stat-label">Désactivés</span>
      </div>
    </div>
  </header>

  <!-- ══ SEARCH + FILTERS ══════════════════════════════ -->
  <div class="rd-search-bar">
    <div class="rd-search-wrap">
      <span class="rd-search-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
      <input type="text" id="rd-search" placeholder="Rechercher un produit…" autocomplete="off">
    </div>
    <div class="rd-filter-tabs">
      <button class="rd-tab active" data-filter="all">Tous</button>
      <button class="rd-tab" data-filter="publish">Actifs</button>
      <button class="rd-tab" data-filter="draft">Désactivés</button>
    </div>
  </div>

  <!-- ══ CATEGORIES BAR ════════════════════════════════ -->
  <div class="rd-cats-sticky" id="rd-cats-bar">
    <div class="rd-cats-scroll" id="rd-cats-scroll">
      <button class="rd-cat-btn active" data-cat-id="all">🍽️ Tous</button>
    </div>
    <button class="rd-cat-manage-btn" id="rd-open-cat-manager" title="Gérer catégories">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    </button>
  </div>

  <div id="rd-toast" class="rd-toast"></div>

  <!-- ══ PRODUCT LIST ═══════════════════════════════════ -->
  <div id="rd-products-grid" class="rd-products-grid">
    <div class="rd-loading"><div class="rd-spinner"></div><p>Chargement…</p></div>
  </div>

  <!-- ══ PRODUCT MODAL ══════════════════════════════════ -->
  <div id="rd-modal-overlay" class="rd-modal-overlay hidden">
    <div class="rd-modal">
      <div class="rd-modal-header">
        <h2 id="rd-modal-title">Ajouter un produit</h2>
        <button class="rd-modal-close" id="rd-close-modal">✕</button>
      </div>
      <form id="rd-product-form" enctype="multipart/form-data">
        <input type="hidden" id="rd-product-id" name="id" value="">
        <div class="rd-image-upload" id="rd-drop-zone">
          <div class="rd-image-preview" id="rd-image-preview">
            <div class="rd-drop-hint" id="rd-drop-hint">
              <span class="rd-drop-icon">📸</span>
              <p>Glisser une photo ici</p>
              <p class="rd-drop-sub">ou cliquer pour sélectionner</p>
            </div>
            <img id="rd-preview-img" src="" alt="" style="display:none">
          </div>
          <input type="file" id="rd-image-input" accept="image/*" style="display:none">
          <input type="hidden" id="rd-image-id" name="image_id" value="">
          <button type="button" class="rd-btn-change-img" id="rd-change-image">📷 Changer la photo</button>
        </div>
        <div class="rd-form-fields">
          <div class="rd-field">
            <label>Nom du produit *</label>
            <input type="text" id="rd-name" name="name" placeholder="Ex: Tagine Agneau" required>
          </div>
          <div class="rd-field-row">
            <div class="rd-field">
              <label>Prix (<?= esc_html($s['currency']) ?>) *</label>
              <input type="number" id="rd-price" name="price" placeholder="0.00" step="0.01" min="0" required>
            </div>
            <div class="rd-field">
              <label>Statut</label>
              <select id="rd-status" name="status">
                <option value="publish">✅ Actif</option>
                <option value="draft">⏸ Désactivé</option>
              </select>
            </div>
          </div>
          <div class="rd-field">
            <label>Catégories</label>
            <div class="rd-cat-checkboxes" id="rd-cat-checkboxes">
              <span style="color:#444;font-size:13px">Chargement…</span>
            </div>
          </div>
          <div class="rd-field rd-config-field">
            <div class="rd-option-builder-head"><div><label>Options, sauces et suppléments</label><p class="rd-help-text">Créez un groupe puis ajoutez ses choix. Exemple : « Sauces », cases à cocher, maximum 2.</p></div><button type="button" class="rd-btn-add-option" id="rd-add-option-group">+ Ajouter un groupe</button></div>
            <div id="rd-option-groups" class="rd-option-groups"></div>
            <input type="hidden" id="rd-product-config" name="config" value="">
          </div>
          <div class="rd-field">
            <label>Description courte</label>
            <input type="text" id="rd-short-desc" name="short_desc" placeholder="Ex: Avec légumes de saison">
          </div>
          <div class="rd-field">
            <label>Description complète</label>
            <textarea id="rd-description" name="description" rows="3" placeholder="Détails du plat…"></textarea>
          </div>
          <div class="rd-field">
            <div class="rd-toggle-row">
              <label>Gérer le stock</label>
              <label class="rd-toggle">
                <input type="checkbox" id="rd-manage-stock" name="manage_stock">
                <span class="rd-toggle-slider"></span>
              </label>
            </div>
            <div id="rd-stock-qty-wrap" class="rd-stock-qty hidden">
              <input type="number" id="rd-stock" name="stock" placeholder="Quantité en stock" min="0" style="margin-top:8px">
            </div>
          </div>
        </div>
        <div class="rd-modal-actions">
          <button type="button" class="rd-btn-cancel" id="rd-cancel">Annuler</button>
          <button type="submit" class="rd-btn-save" id="rd-save-btn">
            <span id="rd-save-label">💾 Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- ══ ACCOUNT MODAL ══════════════════════════════════ -->
  <div id="rd-account-overlay" class="rd-modal-overlay hidden">
    <div class="rd-modal rd-account-modal">
      <div class="rd-modal-header">
        <h2>👤 Mon compte</h2>
        <button class="rd-modal-close" id="rd-close-account">✕</button>
      </div>
      <div class="rd-form-fields" style="padding-top:20px">
        <div class="rd-field">
          <label>Nouvel email</label>
          <input type="email" id="rd-acc-email" placeholder="Laisser vide = pas de changement" autocomplete="off">
        </div>
        <div class="rd-field">
          <label>Nouveau mot de passe</label>
          <input type="password" id="rd-acc-pass" placeholder="Min 8 caractères" autocomplete="new-password">
        </div>
        <div class="rd-field">
          <label>Confirmer le mot de passe</label>
          <input type="password" id="rd-acc-pass2" placeholder="Confirmer…">
        </div>
        <div class="rd-field">
          <label>Mot de passe actuel *</label>
          <input type="password" id="rd-acc-current" placeholder="Requis pour confirmer">
        </div>
        <div id="rd-acc-msg" style="font-size:13px;min-height:18px"></div>
      </div>
      <div class="rd-modal-actions">
        <button type="button" class="rd-btn-cancel" id="rd-acc-cancel">Annuler</button>
        <button type="button" class="rd-btn-save" id="rd-acc-save">💾 Enregistrer</button>
      </div>
    </div>
  </div>

  <!-- ══ TOGGLE CONFIRM ════════════════════════════════ -->
  <div id="rd-confirm-overlay" class="rd-modal-overlay rd-confirm-overlay-center hidden">
    <div class="rd-confirm-box">
      <span class="rd-confirm-icon" id="rd-confirm-icon">⏸</span>
      <h3 id="rd-confirm-title">Désactiver ?</h3>
      <p id="rd-confirm-desc">Le produit sera masqué de la boutique.</p>
      <div class="rd-confirm-actions">
        <button class="rd-btn-cancel" id="rd-confirm-cancel">Annuler</button>
        <button class="rd-btn-delete-confirm" id="rd-confirm-ok">Confirmer</button>
      </div>
    </div>
  </div>

  <!-- ══ CATEGORY MANAGER ══════════════════════════════ -->
  <div id="rd-cat-modal-overlay" class="rd-modal-overlay hidden">
    <div class="rd-modal rd-cat-modal">
      <div class="rd-modal-header">
        <h2>Catégories</h2>
        <button class="rd-modal-close" id="rd-close-cat-modal">✕</button>
      </div>
      <div class="rd-cat-manager-body">
        <div class="rd-cat-add-form">
          <input type="text" id="rd-new-cat-name" placeholder="Nouvelle catégorie…" maxlength="50">
          <button class="rd-btn-add-cat" id="rd-add-cat-btn">+ Ajouter</button>
        </div>
        <div class="rd-cat-list" id="rd-cat-list">
          <div class="rd-loading" style="padding:24px 0"><div class="rd-spinner"></div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══ DELETE CATEGORY CONFIRM ═══════════════════════ -->
  <div id="rd-cat-del-overlay" class="rd-modal-overlay rd-confirm-overlay-center hidden">
    <div class="rd-confirm-box">
      <span class="rd-confirm-icon">🗂️</span>
      <h3>Supprimer la catégorie ?</h3>
      <p>Les produits seront conservés.</p>
      <div class="rd-confirm-actions">
        <button class="rd-btn-cancel" id="rd-cat-del-cancel">Annuler</button>
        <button class="rd-btn-delete-confirm" id="rd-cat-del-confirm">Supprimer</button>
      </div>
    </div>
  </div>

  <!-- ══ BOTTOM NAV — MOD 4 ════════════════════════════ -->
  <nav class="rd-bottom-nav">
    <button class="rd-nav-btn active" data-nav="products">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
      <span>Produits</span>
    </button>
    <button class="rd-nav-btn" data-nav="add">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Nouveau</span>
    </button>
    <button class="rd-nav-btn" data-nav="settings">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
      <span>Réglages</span>
    </button>
  </nav>

</div>
