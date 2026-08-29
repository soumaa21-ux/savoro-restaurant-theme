<?php
if (!defined('ABSPATH')) exit;

function rd_ajax_guard() {
    check_ajax_referer('rd_nonce', 'nonce');
    if (!is_user_logged_in() || !current_user_can('edit_products')) {
        wp_send_json_error(['message' => 'Accès non autorisé.'], 403);
    }
}

function rd_product_payload($product_id) {
    $product = wc_get_product($product_id);
    if (!$product) return null;
    $terms = get_the_terms($product_id, 'product_cat');
    $categories = [];
    if (!is_wp_error($terms) && $terms) {
        foreach ($terms as $term) $categories[] = ['id' => $term->term_id, 'name' => $term->name];
    }
    $config = get_post_meta($product_id, '_savoro_product_config', true);
    return [
        'id' => $product_id,
        'name' => $product->get_name(),
        'price' => $product->get_price(),
        'regular_price' => $product->get_regular_price(),
        'short_desc' => $product->get_short_description(),
        'description' => $product->get_description(),
        'status' => $product->get_status(),
        'image_url' => wp_get_attachment_image_url($product->get_image_id(), 'medium') ?: '',
        'image_id' => $product->get_image_id(),
        'stock' => $product->get_stock_quantity(),
        'manage_stock' => $product->managing_stock(),
        'categories' => $categories,
        'config' => is_array($config) ? $config : ['groups' => []],
    ];
}

function rd_parse_config() {
    $raw = isset($_POST['config']) ? wp_unslash($_POST['config']) : '';
    if (!$raw) return ['groups' => []];
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return ['groups' => []];
    $groups = [];
    foreach (($decoded['groups'] ?? []) as $group) {
        if (!is_array($group)) continue;
        $items = [];
        foreach (($group['items'] ?? []) as $item) {
            if (!is_array($item) || empty($item['label'])) continue;
            $items[] = [
                'id' => sanitize_key($item['id'] ?? sanitize_title($item['label'])),
                'label' => sanitize_text_field($item['label']),
                'price' => max(0, (float)($item['price'] ?? 0)),
            ];
        }
        if (!empty($group['name']) && $items) {
            $groups[] = [
                'id' => sanitize_key($group['id'] ?? sanitize_title($group['name'])),
                'name' => sanitize_text_field($group['name']),
                'type' => in_array(($group['type'] ?? 'checkbox'), ['radio', 'checkbox'], true) ? $group['type'] : 'checkbox',
                'required' => !empty($group['required']),
                'min' => max(0, (int)($group['min'] ?? 0)),
                'max' => max(0, (int)($group['max'] ?? 0)),
                'items' => $items,
            ];
        }
    }
    return ['groups' => $groups];
}

add_action('wp_ajax_rd_get_products', function () {
    rd_ajax_guard();
    $args = ['post_type' => 'product', 'post_status' => ['publish', 'draft', 'private'], 'posts_per_page' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC'];
    $query = new WP_Query($args);
    $products = [];
    foreach ($query->posts as $post) {
        $payload = rd_product_payload($post->ID);
        if ($payload) $products[] = $payload;
    }
    wp_send_json_success($products);
});

add_action('wp_ajax_rd_get_categories', function () {
    rd_ajax_guard();
    $terms = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false, 'orderby' => 'menu_order', 'order' => 'ASC']);
    $categories = [];
    if (!is_wp_error($terms)) foreach ($terms as $term) $categories[] = ['id' => $term->term_id, 'name' => $term->name, 'count' => (int)$term->count];
    wp_send_json_success($categories);
});

function rd_save_product_from_request($product_id = 0) {
    $product = $product_id ? wc_get_product($product_id) : new WC_Product_Simple();
    if (!$product) return new WP_Error('missing_product', 'Produit introuvable.');
    $product->set_name(sanitize_text_field(wp_unslash($_POST['name'] ?? '')));
    $product->set_status(in_array(($_POST['status'] ?? 'draft'), ['publish', 'draft', 'private'], true) ? $_POST['status'] : 'draft');
    $product->set_regular_price(wc_format_decimal(wp_unslash($_POST['price'] ?? '0')));
    $product->set_short_description(wp_kses_post(wp_unslash($_POST['short_desc'] ?? '')));
    $product->set_description(wp_kses_post(wp_unslash($_POST['description'] ?? '')));
    $product->set_manage_stock(!empty($_POST['manage_stock']));
    if (!empty($_POST['manage_stock'])) $product->set_stock_quantity(max(0, (int)($_POST['stock'] ?? 0)));
    $saved_id = $product->save();
    $category_ids = isset($_POST['category_ids']) ? array_map('absint', (array)$_POST['category_ids']) : [];
    wp_set_object_terms($saved_id, $category_ids, 'product_cat');
    $image_id = absint($_POST['image_id'] ?? 0);
    if ($image_id) $product->set_image_id($image_id);
    update_post_meta($saved_id, '_savoro_product_config', rd_parse_config());
    return $saved_id;
}

add_action('wp_ajax_rd_create_product', function () {
    rd_ajax_guard();
    $id = rd_save_product_from_request();
    if (is_wp_error($id)) wp_send_json_error(['message' => $id->get_error_message()]);
    wp_send_json_success(['message' => 'Produit créé.', 'product' => rd_product_payload($id)]);
});

add_action('wp_ajax_rd_update_product', function () {
    rd_ajax_guard();
    $id = absint($_POST['id'] ?? 0);
    if (!$id || get_post_type($id) !== 'product') wp_send_json_error(['message' => 'Produit invalide.']);
    $saved = rd_save_product_from_request($id);
    if (is_wp_error($saved)) wp_send_json_error(['message' => $saved->get_error_message()]);
    wp_send_json_success(['message' => 'Produit mis à jour.', 'product' => rd_product_payload($saved)]);
});

add_action('wp_ajax_rd_toggle_product_status', function () {
    rd_ajax_guard();
    $id = absint($_POST['id'] ?? 0);
    $product = wc_get_product($id);
    if (!$product) wp_send_json_error(['message' => 'Produit introuvable.']);
    $product->set_status($product->get_status() === 'publish' ? 'draft' : 'publish');
    $product->save();
    wp_send_json_success(['message' => 'Statut mis à jour.']);
});

add_action('wp_ajax_rd_create_category', function () {
    rd_ajax_guard();
    $name = sanitize_text_field(wp_unslash($_POST['name'] ?? ''));
    if (!$name) wp_send_json_error(['message' => 'Nom requis.']);
    $result = wp_insert_term($name, 'product_cat');
    if (is_wp_error($result)) wp_send_json_error(['message' => $result->get_error_message()]);
    wp_send_json_success(['message' => 'Catégorie créée.', 'id' => $result['term_id']]);
});

add_action('wp_ajax_rd_delete_category', function () {
    rd_ajax_guard();
    $id = absint($_POST['id'] ?? 0);
    $result = wp_delete_term($id, 'product_cat');
    if (is_wp_error($result) || !$result) wp_send_json_error(['message' => 'Catégorie introuvable ou non supprimable.']);
    wp_send_json_success(['message' => 'Catégorie supprimée.']);
});

add_action('wp_ajax_rd_upload_image', function () {
    rd_ajax_guard();
    if (empty($_FILES['image'])) wp_send_json_error(['message' => 'Fichier absent.']);
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    $attachment_id = media_handle_upload('image', 0);
    if (is_wp_error($attachment_id)) wp_send_json_error(['message' => $attachment_id->get_error_message()]);
    wp_send_json_success(['id' => $attachment_id, 'url' => wp_get_attachment_image_url($attachment_id, 'medium')]);
});

add_action('wp_ajax_rd_update_credentials', function () {
    rd_ajax_guard();
    $user = wp_get_current_user();
    $current = (string)($_POST['current_password'] ?? '');
    if (!wp_check_password($current, $user->user_pass, $user->ID)) wp_send_json_error(['message' => 'Mot de passe actuel incorrect.']);
    $args = ['ID' => $user->ID];
    if (!empty($_POST['email']) && is_email($_POST['email'])) $args['user_email'] = sanitize_email($_POST['email']);
    if (!empty($_POST['password']) && strlen((string)$_POST['password']) >= 8) $args['user_pass'] = (string)$_POST['password'];
    if (count($args) === 1) wp_send_json_error(['message' => 'Aucune modification.']);
    $result = wp_update_user($args);
    if (is_wp_error($result)) wp_send_json_error(['message' => $result->get_error_message()]);
    wp_send_json_success(['message' => 'Compte mis à jour.']);
});
