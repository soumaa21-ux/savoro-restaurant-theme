<?php
function savoro_enqueue_assets() {
  $uri = get_template_directory_uri();
  wp_enqueue_style('savoro-app', $uri . '/assets/index-Bq4mNvbL.css', array(), '1.0.0');
  wp_enqueue_script('savoro-app', $uri . '/assets/index-Bf21Nt7K.js', array(), '1.0.0', true);
  wp_add_inline_script('savoro-app', 'globalThis.SAVORO_ASSET_BASE = ' . wp_json_encode($uri . '/assets') . ';', 'before');
}
add_action('wp_enqueue_scripts', 'savoro_enqueue_assets');
add_filter('script_loader_tag', function($tag, $handle) {
  if ($handle === 'savoro-app') {
    return str_replace(' src=', ' type="module" src=', $tag);
  }
  return $tag;
}, 10, 2);
add_action('after_setup_theme', function() {
  add_theme_support('title-tag');
  add_theme_support('woocommerce');
});
