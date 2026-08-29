<?php
if (!defined('ABSPATH')) exit;

add_shortcode('restaurant_dashboard', 'rd_render_dashboard');
function rd_render_dashboard() {

    // ── Page de connexion branded ───────────────────────────
    if (!is_user_logged_in()) {
        $s         = rd_get_settings();
        $logo_url  = $s['logo_url'] ?? '';
        $name      = esc_html($s['restaurant_name']);
        $login_url = wp_login_url(get_permalink());
        $logo_html = $logo_url
            ? '<img src="' . esc_url($logo_url) . '" style="width:64px;height:64px;border-radius:18px;object-fit:cover;display:block;margin:0 auto 14px">'
            : '<div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#C9A84C,#E8C76A);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px">🍽️</div>';

        return '
        <div style="min-height:100vh;background:#0d0d0d;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;box-sizing:border-box">
          <div style="margin-bottom:24px;text-align:center">
            ' . $logo_html . '
            <h1 style="font-family:Syne,sans-serif;font-size:22px;font-weight:800;color:#F0EDE6;margin:0 0 4px">' . $name . '</h1>
            <p style="color:#555;font-size:13px;margin:0">Espace propriétaire</p>
          </div>
          <div style="width:100%;max-width:340px">
            <a href="' . $login_url . '" style="display:flex;align-items:center;justify-content:center;width:100%;padding:15px;background:linear-gradient(135deg,#C9A84C,#E8C76A);border-radius:14px;color:#111;font-weight:700;font-size:15px;text-decoration:none;font-family:DM Sans,sans-serif;box-sizing:border-box">
              Se connecter →
            </a>
          </div>
        </div>';
    }

    if (!current_user_can('edit_products')) {
        return '<div style="padding:40px;text-align:center;color:#555">Accès non autorisé.</div>';
    }

    ob_start();
    include RD_PLUGIN_DIR . 'templates/dashboard.php';
    return ob_get_clean();
}
