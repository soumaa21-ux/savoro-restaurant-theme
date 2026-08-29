<?php
if (!defined('ABSPATH')) exit;

function rd_register_roles() {
    add_role('restaurant_owner', 'Restaurant Owner', [
        'read'           => true,
        'edit_products'  => true,
        'delete_products'=> true,
        'upload_files'   => true,
        'publish_products' => true,
        'edit_published_products' => true,
        'delete_published_products' => true,
    ]);
}
