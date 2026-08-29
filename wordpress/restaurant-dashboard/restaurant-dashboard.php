<?php
/**
 * Plugin Name: Restaurant Owner Dashboard
 * Description: Dashboard propriétaire pour gérer les produits WooCommerce sans accès wp-admin
 * Version: 1.0.0
 * Author: Custom
 * Text Domain: restaurant-dashboard
 */

if (!defined('ABSPATH')) exit;

define('RD_VERSION', '1.0.0');
define('RD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RD_PLUGIN_URL', plugin_dir_url(__FILE__));

// ─── INCLUDES ───────────────────────────────────────────────────────────────
require_once RD_PLUGIN_DIR . 'includes/roles.php';
require_once RD_PLUGIN_DIR . 'includes/settings.php';
require_once RD_PLUGIN_DIR . 'includes/ajax.php';
require_once RD_PLUGIN_DIR . 'includes/shortcode.php';
require_once RD_PLUGIN_DIR . 'includes/redirect.php';

// ─── ACTIVATION ─────────────────────────────────────────────────────────────
register_activation_hook(__FILE__, 'rd_activate');
function rd_activate() {
    rd_register_roles();
    flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, 'rd_deactivate');
function rd_deactivate() {
    remove_role('restaurant_owner');
    flush_rewrite_rules();
}

// ─── ENQUEUE ASSETS ─────────────────────────────────────────────────────────
add_action('wp_enqueue_scripts', 'rd_enqueue_assets');
function rd_enqueue_assets() {
    if (!is_page() || !has_shortcode(get_the_content(), 'restaurant_dashboard')) return;

    wp_enqueue_media();
    wp_enqueue_style('rd-style', RD_PLUGIN_URL . 'assets/css/style.css', [], RD_VERSION);
    wp_enqueue_script('rd-app', RD_PLUGIN_URL . 'assets/js/app.js', ['jquery'], RD_VERSION, true);

    $s = rd_get_settings();
    $js_vars = apply_filters('rd_js_vars', [
        'ajax_url'        => admin_url('admin-ajax.php'),
        'nonce'           => wp_create_nonce('rd_nonce'),
        'site_url'        => get_site_url(),
        'currency'        => $s['currency'],
        'restaurant_name' => $s['restaurant_name'],
    ]);
    wp_localize_script('rd-app', 'RD', $js_vars);
}

// ─── PROTECTION UPLOADS DIR ON ACTIVATION ───────────────────
register_activation_hook(__FILE__, 'rd_secure_uploads');
function rd_secure_uploads() {
    rd_register_roles();
    $upload_dir = wp_upload_dir();
    $htaccess   = $upload_dir['basedir'] . '/.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "Options -Indexes\n");
    }
    flush_rewrite_rules();
}

// ─── SECURITY HEADERS ON DASHBOARD PAGE ──────────────────────
add_action('wp_head', 'rd_security_headers', 1);
function rd_security_headers() {
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'restaurant_dashboard')) return;
    // Prevent clickjacking
    if (!headers_sent()) {
        header('X-Frame-Options: SAMEORIGIN');
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
}
