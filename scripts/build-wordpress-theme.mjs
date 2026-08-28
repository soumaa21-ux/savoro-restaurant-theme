import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const project = process.cwd();
const output = join(project, "savoro-wordpress-theme");
const assets = join(output, "assets");
await rm(output, { recursive: true, force: true });
await mkdir(assets, { recursive: true });

const buildAssets = join(project, "dist/public/assets");
for (const filename of await readdir(buildAssets)) {
  if (filename.endsWith(".css") || filename.endsWith(".js")) {
    await cp(join(buildAssets, filename), join(assets, filename));
  }
}

const sourceAssets = "/home/ubuntu/webdev-static-assets";
const imageMap = {
  "savoro-hero-table.jpg": "savoro-hero-table_030cf89e.jpg",
  "savoro-pizza.jpg": "savoro-pizza_fbc68958.jpg",
  "savoro-risotto.jpg": "savoro-risotto_d0c66110.jpg",
  "savoro-dessert.jpg": "savoro-dessert_9016693a.jpg",
  "savoro-steam-s-logo.png": "savoro-steam-s-logo_2851daf5.png",
};
for (const [source, target] of Object.entries(imageMap)) {
  await cp(join(sourceAssets, source), join(assets, target));
}

const jsFile = (await readdir(assets)).find((file) => file.endsWith(".js"));
const cssFile = (await readdir(assets)).find((file) => file.endsWith(".css"));
if (!jsFile || !cssFile) throw new Error("Build React introuvable dans dist/public/assets");

await writeFile(join(output, "style.css"), `/*\nTheme Name: Savoro Restaurant\nTheme URI: https://savoro.restaurant\nDescription: Expérience de commande Savoro, mobile-first, avec quick view et side cart.\nVersion: 1.0.0\nAuthor: Savoro\nText Domain: savoro-restaurant\n*/\n`);
await writeFile(join(output, "functions.php"), `<?php\nfunction savoro_enqueue_assets() {\n  $uri = get_template_directory_uri();\n  wp_enqueue_style('savoro-app', $uri . '/assets/${cssFile}', array(), '1.0.0');\n  wp_enqueue_script('savoro-app', $uri . '/assets/${jsFile}', array(), '1.0.0', true);\n  wp_add_inline_script('savoro-app', 'globalThis.SAVORO_ASSET_BASE = ' . wp_json_encode($uri . '/assets') . ';', 'before');\n}\nadd_action('wp_enqueue_scripts', 'savoro_enqueue_assets');\nadd_filter('script_loader_tag', function($tag, $handle) {\n  if ($handle === 'savoro-app') {\n    return str_replace(' src=', ' type="module" src=', $tag);\n  }\n  return $tag;\n}, 10, 2);\nadd_action('after_setup_theme', function() {\n  add_theme_support('title-tag');\n  add_theme_support('woocommerce');\n});\n`);
await writeFile(join(output, "index.php"), `<?php\nget_header();\n?>\n<main id="savoro-app" aria-label="Savoro — commande en ligne"></main>\n<?php get_footer(); ?>\n`);
await writeFile(join(output, "header.php"), `<!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><?php wp_head(); ?></head><body <?php body_class(); ?>><?php wp_body_open(); ?><div id="root"></div>\n`);
await writeFile(join(output, "footer.php"), `<?php wp_footer(); ?></body></html>\n`);
console.log(`Thème WordPress généré : ${output}`);
