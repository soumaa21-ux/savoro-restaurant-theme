<?php
if (!defined('ABSPATH')) exit;

add_action('admin_init', 'rd_block_admin_access');
function rd_block_admin_access() {
    if (
        is_admin() &&
        !wp_doing_ajax() &&
        current_user_can('restaurant_owner') &&
        !current_user_can('manage_options')
    ) {
        $dashboard_page = get_page_by_path('restaurant-dashboard');
        $redirect_url = $dashboard_page ? get_permalink($dashboard_page) : home_url('/restaurant-dashboard');
        wp_redirect($redirect_url);
        exit;
    }
}

// Masquer la barre admin pour le rôle restaurant_owner
add_filter('show_admin_bar', 'rd_hide_admin_bar');
function rd_hide_admin_bar($show) {
    if (current_user_can('restaurant_owner') && !current_user_can('manage_options')) {
        return false;
    }
    return $show;
}
