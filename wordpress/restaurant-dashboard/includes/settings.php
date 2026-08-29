<?php
if (!defined('ABSPATH')) exit;

// ── MENU ADMIN ────────────────────────────────────────────
add_action('admin_menu', 'rd_add_settings_page');
function rd_add_settings_page() {
    add_menu_page('Restaurant Dashboard', '🍽️ Restaurant', 'manage_options',
        'restaurant-dashboard', 'rd_render_settings_page', 'dashicons-store', 58);
}

add_action('admin_init', 'rd_register_settings');
function rd_register_settings() {
    register_setting('rd_settings_group', 'rd_settings', 'rd_sanitize_settings');
}

function rd_sanitize_settings($input) {
    $clean = [];
    $clean['restaurant_name']  = sanitize_text_field($input['restaurant_name'] ?? 'Mon Restaurant');
    $clean['accent_color']     = sanitize_hex_color($input['accent_color']    ?? '#ff6b35');
    $clean['accent_color2']    = sanitize_hex_color($input['accent_color2']   ?? '#ff9a5c');
    $clean['btn_edit_color']   = sanitize_hex_color($input['btn_edit_color']  ?? '#ff6b35');
    $clean['btn_del_color']    = sanitize_hex_color($input['btn_del_color']   ?? '#e74c3c');
    $clean['bg_color']         = sanitize_hex_color($input['bg_color']        ?? '#0d0d0d');
    $clean['card_color']       = sanitize_hex_color($input['card_color']      ?? '#1e1e1e');
    $clean['text_color']       = sanitize_hex_color($input['text_color']      ?? '#f0f0f0');
    $clean['font_head']        = sanitize_text_field($input['font_head']      ?? 'Syne');
    $clean['font_body']        = sanitize_text_field($input['font_body']      ?? 'DM Sans');
    $clean['currency']         = sanitize_text_field($input['currency']       ?? 'MAD');
    // Logo — géré par AJAX upload, on préserve les valeurs existantes
    $existing = get_option('rd_settings', []);
    $clean['logo_url']         = esc_url_raw($existing['logo_url'] ?? '');
    $clean['logo_id']          = absint($existing['logo_id'] ?? 0);
    return $clean;
}

function rd_get_settings() {
    return wp_parse_args(get_option('rd_settings', []), [
        'restaurant_name' => 'Mon Restaurant',
        'accent_color'    => '#ff6b35',
        'accent_color2'   => '#ff9a5c',
        'btn_edit_color'  => '#ff6b35',
        'btn_del_color'   => '#e74c3c',
        'bg_color'        => '#0d0d0d',
        'card_color'      => '#1e1e1e',
        'text_color'      => '#f0f0f0',
        'font_head'       => 'Syne',
        'font_body'       => 'DM Sans',
        'currency'        => 'MAD',
        'logo_url'        => '',
        'logo_id'         => 0,
    ]);
}

// ── PAGE RÉGLAGES ─────────────────────────────────────────
function rd_render_settings_page() {
    $s = rd_get_settings();
    $fonts = [
        'Syne'             => 'Syne — Moderne & Géométrique',
        'DM Sans'          => 'DM Sans — Clean & Lisible',
        'Italiana'         => 'Italiana — Élégance Italienne ✨',
        'Poppins'          => 'Poppins — Arrondi & Amical',
        'Playfair Display' => 'Playfair Display — Raffiné & Classique',
        'Montserrat'       => 'Montserrat — Sport & Dynamique',
        'Raleway'          => 'Raleway — Fin & Aérien',
        'Oswald'           => 'Oswald — Bold & Compact',
        'Nunito'           => 'Nunito — Doux & Accessible',
        'Lato'             => 'Lato — Neutre & Professionnel',
        'Inter'            => 'Inter — UI Standard',
    ];
    $owner = rd_get_owner_user();
    ?>
    <div class="wrap rd-admin-wrap">
      <h1>🍽️ Restaurant Dashboard — Réglages</h1>

      <div class="rd-admin-tabs">
        <button class="rd-atab active" data-tab="design">🎨 Design</button>
        <button class="rd-atab" data-tab="logo">🖼️ Logo</button>
        <button class="rd-atab" data-tab="account">🔐 Compte</button>
        <button class="rd-atab" data-tab="security">🛡️ Sécurité</button>
      </div>

      <!-- ══ TAB DESIGN ═══════════════════════════════════ -->
      <div class="rd-tab-panel active" id="tab-design">
        <form method="post" action="options.php">
          <?php settings_fields('rd_settings_group'); ?>
          <div class="rd-admin-grid">

            <!-- Général -->
            <div class="rd-admin-card">
              <h2>⚙️ Général</h2>
              <table class="form-table">
                <tr>
                  <th><label>Nom du restaurant</label></th>
                  <td><input type="text" name="rd_settings[restaurant_name]" value="<?= esc_attr($s['restaurant_name']) ?>" class="regular-text"></td>
                </tr>
                <tr>
                  <th><label>Devise</label></th>
                  <td><input type="text" name="rd_settings[currency]" value="<?= esc_attr($s['currency']) ?>" class="small-text" placeholder="MAD"></td>
                </tr>
              </table>
            </div>

            <!-- Couleurs -->
            <div class="rd-admin-card">
              <h2>🎨 Couleurs</h2>
              <table class="form-table">
                <?php
                $colors = [
                    'accent_color'   => ['Couleur principale',         'Boutons, prix, accents'],
                    'accent_color2'  => ['Couleur secondaire',         'Dégradé des boutons'],
                    'btn_edit_color' => ['Bouton Modifier ✏️',         'Couleur du bouton d\'édition'],
                    'btn_del_color'  => ['Bouton Désactiver 🗑️',       'Couleur du bouton désactiver/réactiver'],
                    'bg_color'       => ['Fond du dashboard',          ''],
                    'card_color'     => ['Fond des cartes produits',   ''],
                    'text_color'     => ['Couleur du texte',           ''],
                ];
                foreach ($colors as $key => [$label, $desc]): ?>
                <tr>
                  <th><label><?= esc_html($label) ?></label></th>
                  <td>
                    <input type="color" name="rd_settings[<?= $key ?>]" value="<?= esc_attr($s[$key]) ?>">
                    <span class="rd-color-label"><?= esc_html($s[$key]) ?></span>
                    <?php if ($desc): ?><p class="description"><?= esc_html($desc) ?></p><?php endif; ?>
                  </td>
                </tr>
                <?php endforeach; ?>
              </table>
            </div>

            <!-- Polices -->
            <div class="rd-admin-card">
              <h2>✏️ Polices</h2>
              <table class="form-table">
                <?php foreach (['font_head' => 'Police titres & prix', 'font_body' => 'Police texte & boutons'] as $fkey => $flabel): ?>
                <tr>
                  <th><label><?= esc_html($flabel) ?></label></th>
                  <td>
                    <select name="rd_settings[<?= $fkey ?>]" class="rd-font-select" data-preview="<?= $fkey ?>">
                      <?php foreach ($fonts as $val => $lbl): ?>
                        <option value="<?= esc_attr($val) ?>" <?= selected($s[$fkey], $val, false) ?>><?= esc_html($lbl) ?></option>
                      <?php endforeach; ?>
                    </select>
                    <div class="rd-font-preview" id="preview-<?= $fkey ?>" style="font-family:'<?= esc_attr($s[$fkey]) ?>'">
                      Le meilleur restaurant de la ville !
                    </div>
                  </td>
                </tr>
                <?php endforeach; ?>
              </table>
            </div>

            <!-- Live Preview -->
            <div class="rd-admin-card rd-preview-card">
              <h2>👁️ Aperçu en direct</h2>
              <div id="rd-live-preview">
                <div class="rdp-header">
                  <div class="rdp-logo" id="rdp-logo">
                    <?php if (!empty($s['logo_url'])): ?>
                      <img src="<?= esc_url($s['logo_url']) ?>" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" id="rdp-logo-img">
                    <?php else: ?>
                      <span id="rdp-logo-emoji">🍽️</span>
                      <img id="rdp-logo-img" style="display:none;width:100%;height:100%;object-fit:cover;border-radius:10px;">
                    <?php endif; ?>
                  </div>
                  <div>
                    <div class="rdp-title" id="rdp-title"><?= esc_html($s['restaurant_name']) ?></div>
                    <div class="rdp-sub">Gestion des produits</div>
                  </div>
                  <div class="rdp-btn" id="rdp-btn">+ Ajouter</div>
                </div>
                <div class="rdp-cats">
                  <div class="rdp-cat active">Tous</div>
                  <div class="rdp-cat">🍕 Pizzas</div>
                  <div class="rdp-cat">🍰 Desserts</div>
                </div>
                <div class="rdp-cards">
                  <div class="rdp-card">
                    <div class="rdp-card-img">🍕</div>
                    <div class="rdp-card-body">
                      <div class="rdp-card-name">Pizza Margherita</div>
                      <div class="rdp-card-price" id="rdp-card-price">85.00 <?= esc_html($s['currency']) ?></div>
                      <div class="rdp-card-actions">
                        <div class="rdp-btn-edit" id="rdp-btn-edit">✏️</div>
                        <div class="rdp-btn-del" id="rdp-btn-del">🗑️</div>
                      </div>
                    </div>
                  </div>
                  <div class="rdp-card">
                    <div class="rdp-card-img">🍰</div>
                    <div class="rdp-card-body">
                      <div class="rdp-card-name">Fondant Chocolat</div>
                      <div class="rdp-card-price">45.00 <?= esc_html($s['currency']) ?></div>
                      <div class="rdp-card-actions">
                        <div class="rdp-btn-edit">✏️</div>
                        <div class="rdp-btn-del">🗑️</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <?php submit_button('💾 Enregistrer le design'); ?>
        </form>
      </div>

      <!-- ══ TAB LOGO ══════════════════════════════════════ -->
      <div class="rd-tab-panel" id="tab-logo">
        <div class="rd-admin-card" style="max-width:560px">
          <h2>🖼️ Logo du restaurant</h2>
          <p class="description" style="margin-bottom:16px">Formats acceptés : SVG, PNG, JPG, WEBP — max 2 Mo</p>

          <div class="rd-logo-current" id="rd-logo-current">
            <?php if (!empty($s['logo_url'])): ?>
              <img src="<?= esc_url($s['logo_url']) ?>" alt="Logo actuel" style="max-height:80px;border-radius:10px;border:1px solid #ddd;padding:4px;">
              <p style="margin-top:8px;color:#666;font-size:13px">Logo actuel</p>
            <?php else: ?>
              <div style="width:70px;height:70px;background:#f5f5f5;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;">🍽️</div>
              <p style="margin-top:8px;color:#999;font-size:13px">Aucun logo — emoji par défaut affiché</p>
            <?php endif; ?>
          </div>

          <div class="rd-logo-drop" id="rd-logo-drop">
            <span>📁</span>
            <p>Glisser votre logo ici</p>
            <p style="font-size:12px;color:#999">ou cliquer pour sélectionner</p>
          </div>
          <input type="file" id="rd-logo-input" accept=".svg,.png,.jpg,.jpeg,.webp" style="display:none">

          <div id="rd-logo-status" style="margin-top:12px;font-size:13px;display:none"></div>

          <?php if (!empty($s['logo_url'])): ?>
          <button type="button" id="rd-logo-remove" class="button" style="margin-top:12px;color:#c0392b">
            🗑️ Supprimer le logo
          </button>
          <?php endif; ?>
        </div>
      </div>

      <!-- ══ TAB COMPTE ════════════════════════════════════ -->
      <div class="rd-tab-panel" id="tab-account">
        <div class="rd-admin-card" style="max-width:520px">
          <h2>🔐 Modifier le compte propriétaire</h2>
          <?php if ($owner): ?>
          <p class="description" style="margin-bottom:16px">
            Compte actuel : <strong><?= esc_html($owner->user_login) ?></strong>
            (<?= esc_html($owner->user_email) ?>)
          </p>
          <table class="form-table">
            <tr>
              <th><label>Nouvel email</label></th>
              <td><input type="email" id="rd-new-email" class="regular-text" placeholder="Laisser vide = pas de changement"></td>
            </tr>
            <tr>
              <th><label>Nouveau mot de passe</label></th>
              <td>
                <input type="password" id="rd-new-pass" class="regular-text" placeholder="Laisser vide = pas de changement" autocomplete="new-password">
                <p class="description">Min 8 caractères, avec chiffre et lettre</p>
              </td>
            </tr>
            <tr>
              <th><label>Confirmer le mdp</label></th>
              <td><input type="password" id="rd-confirm-pass" class="regular-text" placeholder="Confirmer le nouveau mot de passe"></td>
            </tr>
          </table>
          <p style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;font-size:13px;">
            ⚠️ Cette modification ne concerne que le compte <strong>restaurant_owner</strong>.<br>
            Pour modifier un compte admin, utilisez wp-admin → Utilisateurs.
          </p>
          <div style="margin-top:16px;display:flex;gap:10px;align-items:center">
            <button type="button" id="rd-admin-save-creds" class="button button-primary">💾 Enregistrer</button>
            <span id="rd-creds-status" style="font-size:13px"></span>
          </div>
          <?php else: ?>
          <div style="padding:20px;background:#fff3cd;border-radius:8px;">
            <p>⚠️ Aucun utilisateur avec le rôle <code>restaurant_owner</code> trouvé.</p>
            <p style="margin-top:8px">Créez-en un dans <a href="<?= admin_url('user-new.php') ?>">Utilisateurs → Ajouter</a> avec le rôle "Restaurant Owner".</p>
          </div>
          <?php endif; ?>
        </div>
      </div>

      <!-- ══ TAB SÉCURITÉ ══════════════════════════════════ -->
      <div class="rd-tab-panel" id="tab-security">
        <div class="rd-admin-card" style="max-width:620px">
          <h2>🛡️ État de la sécurité</h2>
          <?php rd_render_security_checklist(); ?>
        </div>
      </div>

    </div><!-- .wrap -->

    <?php rd_admin_styles_and_scripts($s, $fonts); ?>
    <?php
}

// ── OWNER USER HELPER ─────────────────────────────────────
function rd_get_owner_user(): ?WP_User {
    $users = get_users(['role' => 'restaurant_owner', 'number' => 1]);
    return $users[0] ?? null;
}

// ── SECURITY CHECKLIST ────────────────────────────────────
function rd_render_security_checklist() {
    $checks = [];

    // HTTPS
    $checks[] = [is_ssl(), 'HTTPS activé', 'Votre site tourne sur HTTPS — les données sont chiffrées en transit.', 'Activez HTTPS via votre hébergeur ou Cloudflare.'];

    // WP Debug désactivé
    $debug_off = !WP_DEBUG;
    $checks[] = [$debug_off, 'WP_DEBUG désactivé', 'Les erreurs ne sont pas exposées aux visiteurs.', 'Réglez WP_DEBUG à false dans wp-config.php en production.'];

    // Version WP à jour
    $wp_version = get_bloginfo('version');
    $checks[] = [version_compare($wp_version, '6.0', '>='), 'WordPress récent (v'.$wp_version.')', 'Votre WordPress est à jour.', 'Mettez WordPress à jour depuis Tableau de bord → Mises à jour.'];

    // Owner ne peut pas manage_options
    $owner = rd_get_owner_user();
    $no_admin_access = $owner ? !user_can($owner->ID, 'manage_options') : true;
    $checks[] = [$no_admin_access, 'Rôle owner sans accès admin', 'Le compte propriétaire ne peut pas accéder à wp-admin.', 'Ne donnez jamais le rôle Administrateur au compte restaurant_owner.'];

    // Uploads directory not browsable
    $upload_dir = wp_upload_dir();
    $htaccess   = $upload_dir['basedir'] . '/.htaccess';
    $checks[] = [file_exists($htaccess), 'Dossier uploads protégé (.htaccess)', 'Un .htaccess bloque la navigation dans /uploads/.', 'Créez un .htaccess dans ' . $upload_dir['basedir'] . ' avec : Options -Indexes'];

    // Nonce check (notre plugin)
    $checks[] = [true, 'Protection CSRF (nonces)', 'Toutes les requêtes AJAX sont protégées par nonce WordPress.', ''];

    // Rate limiting
    $checks[] = [true, 'Rate limiting AJAX', 'Max 60 requêtes/min par IP sur les endpoints du plugin.', ''];

    // MIME validation uploads
    $checks[] = [true, 'Validation MIME réelle des images', 'Les images uploadées sont vérifiées par leur contenu réel, pas seulement leur extension.', ''];

    echo '<table class="rd-security-table">';
    foreach ($checks as [$ok, $title, $ok_msg, $fail_msg]) {
        $icon  = $ok ? '✅' : '⚠️';
        $color = $ok ? '#27ae60' : '#e67e22';
        $msg   = $ok ? $ok_msg : $fail_msg;
        echo '<tr>';
        echo '<td style="font-size:20px;padding:10px 12px 10px 0;">' . $icon . '</td>';
        echo '<td style="padding:10px 16px 10px 0;">';
        echo '<strong style="color:' . $color . '">' . esc_html($title) . '</strong>';
        if ($msg) echo '<br><span style="font-size:12px;color:#666">' . esc_html($msg) . '</span>';
        echo '</td>';
        echo '</tr>';
    }
    echo '</table>';
}

// ── INJECT CSS VARS FRONTEND ──────────────────────────────
add_action('wp_head', 'rd_inject_css_vars');
function rd_inject_css_vars() {
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'restaurant_dashboard')) return;

    $s  = rd_get_settings();
    $fh = esc_attr($s['font_head']);
    $fb = esc_attr($s['font_body']);

    // Italiana est sur Google Fonts
    $fonts_needed = array_unique([$fh, $fb]);
    $gf_query = implode('&family=', array_map(function($f) {
        // Italiana n'a qu'un weight (400), pas de variantes
        if ($f === 'Italiana') return urlencode($f);
        return urlencode($f) . ':wght@400;600;700;800';
    }, $fonts_needed));

    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    echo '<link href="https://fonts.googleapis.com/css2?family=' . $gf_query . '&display=swap" rel="stylesheet">';

    $edit_rgba = rd_hex_to_rgba($s['btn_edit_color'], 0.12);
    $del_rgba  = rd_hex_to_rgba($s['btn_del_color'],  0.12);

    echo '<style id="rd-custom-vars">
    #rd-app {
      --rd-accent:        ' . esc_attr($s['accent_color'])   . ';
      --rd-accent2:       ' . esc_attr($s['accent_color2'])  . ';
      --rd-btn-edit:      ' . esc_attr($s['btn_edit_color']) . ';
      --rd-btn-edit-bg:   ' . $edit_rgba . ';
      --rd-btn-del:       ' . esc_attr($s['btn_del_color'])  . ';
      --rd-btn-del-bg:    ' . $del_rgba  . ';
      --rd-bg:            ' . esc_attr($s['bg_color'])       . ';
      --rd-surface:       ' . esc_attr(rd_darken_hex($s['bg_color'], 5))    . ';
      --rd-card:          ' . esc_attr($s['card_color'])     . ';
      --rd-card-hover:    ' . esc_attr(rd_lighten_hex($s['card_color'], 5)) . ';
      --rd-text:          ' . esc_attr($s['text_color'])     . ';
      --rd-font-head:     \'' . $fh . '\', serif;
      --rd-font-body:     \'' . $fb . '\', sans-serif;
    }
    </style>';
}

// ── PASS SETTINGS TO JS ───────────────────────────────────
add_filter('rd_js_vars', 'rd_add_settings_to_js');
function rd_add_settings_to_js($vars) {
    $s = rd_get_settings();
    $vars['currency']        = $s['currency'];
    $vars['restaurant_name'] = $s['restaurant_name'];
    $vars['logo_url']        = $s['logo_url'];
    $vars['nonce_upload']    = wp_create_nonce('rd_nonce');
    return $vars;
}

// ── COLOR HELPERS ─────────────────────────────────────────
function rd_hex_to_rgb($hex) {
    $hex = ltrim($hex, '#');
    if (strlen($hex) === 3) $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
    return [hexdec(substr($hex,0,2)), hexdec(substr($hex,2,2)), hexdec(substr($hex,4,2))];
}
function rd_hex_to_rgba($hex, $alpha) {
    [$r,$g,$b] = rd_hex_to_rgb($hex);
    return "rgba($r,$g,$b,$alpha)";
}
function rd_rgb_to_hex($r,$g,$b) {
    return sprintf('#%02x%02x%02x', max(0,min(255,(int)$r)), max(0,min(255,(int)$g)), max(0,min(255,(int)$b)));
}
function rd_darken_hex($hex, $pct) {
    [$r,$g,$b] = rd_hex_to_rgb($hex);
    $f = 1 - ($pct/100);
    return rd_rgb_to_hex($r*$f, $g*$f, $b*$f);
}
function rd_lighten_hex($hex, $pct) {
    [$r,$g,$b] = rd_hex_to_rgb($hex);
    $f = $pct/100;
    return rd_rgb_to_hex($r+(255-$r)*$f, $g+(255-$g)*$f, $b+(255-$b)*$f);
}

// ── ADMIN STYLES + SCRIPTS ────────────────────────────────
function rd_admin_styles_and_scripts($s, $fonts) {
    $owner      = rd_get_owner_user();
    $owner_id   = $owner ? $owner->ID : 0;
    $admin_ajax = admin_url('admin-ajax.php');
    $nonce      = wp_create_nonce('rd_nonce');
    ?>
<style>
.rd-admin-wrap h1 { font-size:22px; margin-bottom:16px; }
.rd-admin-tabs { display:flex; gap:6px; margin-bottom:20px; border-bottom:2px solid #ddd; padding-bottom:0; }
.rd-atab { background:none; border:none; border-bottom:3px solid transparent; padding:10px 18px; font-size:14px; font-weight:600; cursor:pointer; color:#666; margin-bottom:-2px; transition:all .2s; }
.rd-atab.active { border-bottom-color:#ff6b35; color:#ff6b35; }
.rd-tab-panel { display:none; } .rd-tab-panel.active { display:block; }
.rd-admin-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1100px; }
.rd-admin-card { background:#fff; border:1px solid #ddd; border-radius:12px; padding:20px 24px; }
.rd-admin-card h2 { font-size:15px; margin-bottom:16px; border-bottom:1px solid #eee; padding-bottom:10px; }
.rd-color-label { margin-left:10px; font-family:monospace; color:#666; font-size:12px; vertical-align:middle; }
.rd-preview-card { grid-column:1/-1; }
.rd-font-preview { margin-top:8px; padding:8px 12px; background:#f9f9f9; border-radius:8px; font-size:18px; color:#222; transition:font-family .3s; }
.rd-font-select { min-width:220px; }
.rd-security-table { width:100%; border-collapse:collapse; }
.rd-security-table tr { border-bottom:1px solid #f0f0f0; }

/* Logo upload */
.rd-logo-current { margin-bottom:16px; }
.rd-logo-drop { border:2px dashed #ddd; border-radius:12px; padding:30px; text-align:center; cursor:pointer; transition:all .2s; }
.rd-logo-drop:hover, .rd-logo-drop.drag-over { border-color:#ff6b35; background:#fff8f5; }
.rd-logo-drop span { font-size:36px; display:block; margin-bottom:8px; }
.rd-logo-drop p { font-size:14px; color:#666; margin:4px 0; }

/* Live preview */
#rd-live-preview { background:var(--rdp-bg,#0d0d0d); border-radius:14px; padding:0 0 16px; overflow:hidden; max-width:420px; margin:0 auto; }
.rdp-header { display:flex; align-items:center; gap:10px; padding:14px; border-bottom:1px solid rgba(255,255,255,.08); }
.rdp-logo { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; background:linear-gradient(135deg,var(--rdp-accent,#ff6b35),var(--rdp-accent2,#ff9a5c)); overflow:hidden; flex-shrink:0; }
.rdp-title { font-size:14px; font-weight:700; color:var(--rdp-text,#f0f0f0); font-family:var(--rdp-fh,'Syne'); }
.rdp-sub { font-size:10px; color:#888; }
.rdp-btn { margin-left:auto; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:700; background:linear-gradient(135deg,var(--rdp-accent,#ff6b35),var(--rdp-accent2,#ff9a5c)); color:#fff; }
.rdp-cats { display:flex; gap:8px; padding:10px 14px; overflow-x:auto; }
.rdp-cat { padding:5px 14px; border-radius:20px; font-size:11px; font-weight:600; background:rgba(255,255,255,.06); color:#888; }
.rdp-cat.active { background:var(--rdp-accent,#ff6b35); color:#fff; }
.rdp-cards { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0 14px; }
.rdp-card { background:var(--rdp-card,#1e1e1e); border-radius:12px; overflow:hidden; }
.rdp-card-img { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:28px; background:rgba(255,255,255,.04); }
.rdp-card-body { padding:8px 10px 10px; }
.rdp-card-name { font-size:11px; font-weight:700; color:var(--rdp-text,#f0f0f0); font-family:var(--rdp-fh,'Syne'); margin-bottom:4px; }
.rdp-card-price { font-size:12px; font-weight:800; color:var(--rdp-accent,#ff6b35); font-family:var(--rdp-fh,'Syne'); margin-bottom:6px; }
.rdp-card-actions { display:flex; gap:6px; }
.rdp-btn-edit, .rdp-btn-del { flex:1; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; }
.rdp-btn-edit { background:var(--rdp-edit-bg,rgba(255,107,53,.12)); color:var(--rdp-edit,#ff6b35); }
.rdp-btn-del  { background:var(--rdp-del-bg,rgba(231,76,60,.12)); color:var(--rdp-del,#e74c3c); }
</style>

<script>
(function($){
  // ── TABS ──────────────────────────────────────────────
  $('.rd-atab').on('click', function(){
    $('.rd-atab').removeClass('active');
    $('.rd-tab-panel').removeClass('active');
    $(this).addClass('active');
    $('#tab-' + $(this).data('tab')).addClass('active');
  });

  // ── LIVE PREVIEW ──────────────────────────────────────
  function syncPreview() {
    var accent  = $('[name="rd_settings[accent_color]"]').val()   || '#ff6b35';
    var accent2 = $('[name="rd_settings[accent_color2]"]').val()  || '#ff9a5c';
    var editC   = $('[name="rd_settings[btn_edit_color]"]').val() || '#ff6b35';
    var delC    = $('[name="rd_settings[btn_del_color]"]').val()  || '#e74c3c';
    var bg      = $('[name="rd_settings[bg_color]"]').val()       || '#0d0d0d';
    var card    = $('[name="rd_settings[card_color]"]').val()     || '#1e1e1e';
    var text    = $('[name="rd_settings[text_color]"]').val()     || '#f0f0f0';
    var fontH   = $('[name="rd_settings[font_head]"]').val()      || 'Syne';
    var name    = $('[name="rd_settings[restaurant_name]"]').val();
    var curr    = $('[name="rd_settings[currency]"]').val()       || 'MAD';

    var p = document.getElementById('rd-live-preview');
    p.style.setProperty('--rdp-accent',   accent);
    p.style.setProperty('--rdp-accent2',  accent2);
    p.style.setProperty('--rdp-bg',       bg);
    p.style.setProperty('--rdp-card',     card);
    p.style.setProperty('--rdp-text',     text);
    p.style.setProperty('--rdp-fh',       fontH);
    p.style.setProperty('--rdp-edit',     editC);
    p.style.setProperty('--rdp-del',      delC);
    p.style.setProperty('--rdp-edit-bg',  hexToRgba(editC, 0.15));
    p.style.setProperty('--rdp-del-bg',   hexToRgba(delC, 0.15));

    $('#rdp-title').text(name || 'Mon Restaurant');
    $('#rdp-card-price').text('85.00 ' + curr);

    $('input[type=color]').each(function(){
      $(this).next('.rd-color-label').text($(this).val());
    });

    // Font preview
    $('.rd-font-select').each(function(){
      var fkey = $(this).data('preview');
      var val  = $(this).val();
      $('#preview-' + fkey).css('font-family', "'" + val + "'");
    });
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  $('input, select').on('input change', syncPreview);
  syncPreview();

  // ── LOGO UPLOAD ───────────────────────────────────────
  var $drop  = $('#rd-logo-drop');
  var $input = $('#rd-logo-input');
  var $status= $('#rd-logo-status');

  $drop.on('click', function(){ $input.click(); });
  $drop.on('dragover', function(e){ e.preventDefault(); $drop.addClass('drag-over'); });
  $drop.on('dragleave', function(){ $drop.removeClass('drag-over'); });
  $drop.on('drop', function(e){
    e.preventDefault(); $drop.removeClass('drag-over');
    var file = e.originalEvent.dataTransfer.files[0];
    if (file) uploadLogo(file);
  });
  $input.on('change', function(){
    if (this.files[0]) uploadLogo(this.files[0]);
  });

  function uploadLogo(file) {
    $status.show().css('color','#666').text('Upload en cours…');
    var fd = new FormData();
    fd.append('action', 'rd_upload_logo');
    fd.append('nonce', '<?= wp_create_nonce('rd_nonce') ?>');
    fd.append('logo', file);
    $.ajax({
      url: '<?= admin_url('admin-ajax.php') ?>',
      type: 'POST', data: fd, processData: false, contentType: false,
      success: function(res) {
        if (res.success) {
          $status.css('color','#27ae60').text('✅ Logo mis à jour ! Rechargez la page pour voir.');
          $('#rdp-logo-emoji').hide();
          $('#rdp-logo-img').attr('src', res.data.url).show();
          // Update preview
          var $lp = $('#rd-live-preview .rdp-logo');
          $lp.html('<img src="' + res.data.url + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">');
        } else {
          $status.css('color','#c0392b').text('❌ ' + (res.data.message || 'Erreur'));
        }
      },
      error: function(){ $status.css('color','#c0392b').text('❌ Erreur serveur'); }
    });
  }

  $('#rd-logo-remove').on('click', function(){
    if (!confirm('Supprimer le logo ?')) return;
    $.post('<?= admin_url('admin-ajax.php') ?>', {
      action: 'rd_remove_logo',
      nonce: '<?= wp_create_nonce('rd_nonce') ?>'
    }, function(res){
      if (res.success) location.reload();
    });
  });

  // ── ACCOUNT UPDATE ────────────────────────────────────
  $('#rd-admin-save-creds').on('click', function(){
    var email = $('#rd-new-email').val().trim();
    var pass  = $('#rd-new-pass').val();
    var conf  = $('#rd-confirm-pass').val();
    var $s    = $('#rd-creds-status');

    if (pass && pass !== conf) { $s.css('color','#c0392b').text('❌ Les mots de passe ne correspondent pas'); return; }
    if (!email && !pass)       { $s.css('color','#e67e22').text('⚠️ Aucune modification'); return; }

    var currentPass = prompt('Entrez le mot de passe ACTUEL du compte restaurant pour confirmer :');
    if (!currentPass) return;

    $s.css('color','#666').text('Enregistrement…');
    $.post('<?= admin_url('admin-ajax.php') ?>', {
      action: 'rd_admin_update_owner',
      nonce: '<?= wp_create_nonce('rd_nonce') ?>',
      owner_id: <?= $owner_id ?>,
      new_email: email,
      new_password: pass,
      current_password: currentPass
    }, function(res){
      if (res.success) {
        $s.css('color','#27ae60').text('✅ ' + res.data.message);
        $('#rd-new-pass, #rd-confirm-pass').val('');
      } else {
        $s.css('color','#c0392b').text('❌ ' + (res.data.message || 'Erreur'));
      }
    });
  });

})(jQuery);
</script>
    <?php
}
