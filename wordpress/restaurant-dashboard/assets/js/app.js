/**
 * Restaurant Dashboard v6
 * Cards liste pleine largeur + bottom nav + empty state + sticky fix
 */
(function ($) {
  'use strict';

  // SVG icons (MOD 2)
  var ICO_EDIT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  var ICO_OFF  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
  var ICO_ON   = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  var allProducts       = [];
  var allCategories     = [];
  var currentFilter     = 'all';
  var currentCatId      = 'all';
  var searchQuery       = '';
  var toggleTargetId    = null;
  var deleteCatTargetId = null;
  var uploadedImageId   = 0;
  var isEditing         = false;
  var editingId         = 0;

  $(document).ready(function () {
    fixCatsSticky();
    $(window).on('resize', fixCatsSticky);
    loadCategoriesThen(loadProducts);
    bindEvents();
    initBottomNav();
  });

  // ── STICKY FIX — calcul dynamique ──────────────────────
  function fixCatsSticky() {
    var header = document.querySelector('.rd-header');
    var bar    = document.getElementById('rd-cats-bar');
    if (!header || !bar) return;
    var h = header.getBoundingClientRect().height;
    bar.style.setProperty('position', 'sticky', 'important');
    bar.style.setProperty('top', h + 'px', 'important');
    bar.style.setProperty('z-index', '150', 'important');
    bar.style.setProperty('background', '#090909', 'important');
  }

  // ── BOTTOM NAV — MOD 4 ─────────────────────────────────
  function initBottomNav() {
    document.querySelectorAll('.rd-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.rd-nav-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var nav = this.dataset.nav;
        if (nav === 'products') {
          document.getElementById('rd-products-grid').scrollIntoView({ behavior: 'smooth' });
        } else if (nav === 'add') {
          openModal(false);
          document.querySelector('[data-nav="products"]').classList.add('active');
          this.classList.remove('active');
        } else if (nav === 'settings') {
          window.location.href = '/wp-admin/admin.php?page=restaurant-dashboard';
        }
      });
    });
  }

  // ── LOAD ────────────────────────────────────────────────
  function loadCategoriesThen(cb) {
    $.post(RD.ajax_url, { action: 'rd_get_categories', nonce: RD.nonce }, function (res) {
      if (res.success) { allCategories = res.data; renderCategoryBar(); renderCategoryList(); }
      if (cb) cb();
    });
  }

  function loadProducts() {
    $('#rd-products-grid').html('<div class="rd-loading"><div class="rd-spinner"></div><p>Chargement…</p></div>');
    $.post(RD.ajax_url, { action: 'rd_get_products', nonce: RD.nonce }, function (res) {
      if (res.success) {
        allProducts = res.data;
        updateStats(); updateCatCounts(); renderProducts();
      } else { showToast('Erreur de chargement', 'error'); }
    });
  }

  // ── STATS ───────────────────────────────────────────────
  function updateStats() {
    var total  = allProducts.length;
    var active = allProducts.filter(function(p){ return p.status === 'publish'; }).length;
    var draft  = allProducts.filter(function(p){ return p.status === 'draft'; }).length;
    $('#rd-count-total').text(total);
    $('#rd-count-active').text(active);
    $('#rd-count-draft').text(draft);
  }

  // ── CATEGORY BAR ────────────────────────────────────────
  function renderCategoryBar() {
    var $scroll = $('#rd-cats-scroll');
    var $allBtn = $scroll.find('[data-cat-id="all"]');
    $scroll.empty().append($allBtn);
    allCategories.forEach(function (cat) {
      $scroll.append(
        $('<button class="rd-cat-btn"/>').attr('data-cat-id', cat.id)
          .html(getCatEmoji(cat.name) + ' ' + escHtml(cat.name) + ' <span class="rd-cat-count">' + cat.count + '</span>')
      );
    });
    $scroll.find('[data-cat-id]').removeClass('active');
    $scroll.find('[data-cat-id="' + currentCatId + '"]').addClass('active');
    fixCatsSticky();
  }

  function renderCategoryList() {
    var $list = $('#rd-cat-list');
    if (!allCategories.length) { $list.html('<div class="rd-cat-empty">Aucune catégorie.</div>'); return; }
    $list.html(allCategories.map(function (cat, i) {
      return '<div class="rd-cat-item" style="animation-delay:' + (i*.04) + 's">' +
        '<div class="rd-cat-item-left"><div class="rd-cat-item-icon">' + getCatEmoji(cat.name) + '</div>' +
        '<div><div class="rd-cat-item-name">' + escHtml(cat.name) + '</div>' +
        '<div class="rd-cat-item-count">' + cat.count + ' produit' + (cat.count!==1?'s':'') + '</div></div></div>' +
        '<button class="rd-btn-del-cat" data-cat-id="' + cat.id + '">🗑️</button></div>';
    }).join(''));
  }

  function renderCategoryCheckboxes(selectedIds) {
    var $box = $('#rd-cat-checkboxes');
    if (!allCategories.length) { $box.html('<span style="color:#444;font-size:13px">Aucune catégorie — ajoutez-en via ⚙️</span>'); return; }
    $box.html(allCategories.map(function (cat) {
      var checked = selectedIds && selectedIds.indexOf(cat.id) > -1;
      return '<label class="rd-cat-checkbox-label' + (checked?' checked':'') + '">' +
        '<input type="checkbox" name="category_ids[]" value="' + cat.id + '"' + (checked?' checked':'') + '>' +
        getCatEmoji(cat.name) + ' ' + escHtml(cat.name) + '</label>';
    }).join(''));
  }

  function updateCatCounts() {
    allCategories.forEach(function (cat) {
      cat.count = allProducts.filter(function(p){ return p.categories && p.categories.some(function(c){ return c.id===cat.id; }); }).length;
      $('#rd-cats-scroll [data-cat-id="' + cat.id + '"] .rd-cat-count').text(cat.count);
    });
  }

  // ── RENDER PRODUCTS — MOD 1+2+7 ─────────────────────────
  function renderProducts() {
    var filtered = allProducts.filter(function (p) {
      if (currentFilter !== 'all' && p.status !== currentFilter) return false;
      if (currentCatId !== 'all' && !(p.categories && p.categories.some(function(c){ return c.id == currentCatId; }))) return false;
      if (searchQuery && p.name.toLowerCase().indexOf(searchQuery.toLowerCase()) < 0) return false;
      return true;
    });

    if (!filtered.length) {
      // MOD 7 — empty state amélioré
      var isSearch = !!(searchQuery || currentCatId !== 'all' || currentFilter !== 'all');
      $('#rd-products-grid').html(renderEmptyState(isSearch));
      return;
    }
    $('#rd-products-grid').html(filtered.map(buildCard).join(''));
  }

  // MOD 7 — empty state
  function renderEmptyState(isSearch) {
    return '<div style="text-align:center;padding:60px 20px">' +
      '<div style="font-size:52px;margin-bottom:16px;opacity:.4">🍽️</div>' +
      '<p style="color:#555;font-size:15px;margin-bottom:8px;font-weight:500">' +
        (isSearch ? 'Aucun produit trouvé' : 'Aucun produit pour le moment') + '</p>' +
      '<p style="color:#333;font-size:13px;margin-bottom:24px">' +
        (isSearch ? 'Essaie un autre terme de recherche' : 'Ajoute ton premier plat au menu') + '</p>' +
      (!isSearch ? '<button onclick="document.getElementById(\'rd-open-add\').click()" ' +
        'style="padding:12px 24px;background:linear-gradient(135deg,#C9A84C,#E8C76A);' +
        'border:none;border-radius:24px;color:#111;font-weight:700;font-size:14px;cursor:pointer;font-family:DM Sans,sans-serif">' +
        '+ Ajouter mon premier produit</button>' : '') +
    '</div>';
  }

  // MOD 1+2 — card liste pleine largeur avec footer boutons
  function buildCard(p, i) {
    var currency  = RD.currency || 'MAD';
    var isDraft   = p.status === 'draft';
    var priceDisp = p.price ? parseFloat(p.price).toFixed(2) + ' ' + currency : '— ' + currency;

    var imgHtml = p.image_url
      ? '<img class="rd-card-image" src="' + p.image_url + '" alt="' + escHtml(p.name) + '" loading="lazy">'
      : '<div class="rd-card-image-placeholder">' + (p.categories&&p.categories.length ? getCatEmoji(p.categories[0].name) : '🍽️') + '</div>';

    var statusBadge = isDraft
      ? '<span class="rd-badge-draft">Désactivé</span>'
      : '<span class="rd-badge-active">● Actif</span>';

    var catBadge = (p.categories && p.categories.length)
      ? '<span class="rd-badge-cat">' + getCatEmoji(p.categories[0].name) + ' ' + escHtml(p.categories[0].name) + '</span>'
      : '';

    var toggleClass = isDraft ? 'rd-btn-toggle is-draft' : 'rd-btn-toggle';
    var toggleIcon  = isDraft ? ICO_ON : ICO_OFF;
    var toggleLabel = isDraft ? 'Réactiver' : 'Désactiver';

    var shortDesc = p.short_desc ? '<span class="rd-card-desc">' + escHtml(p.short_desc.substring(0,50)) + (p.short_desc.length>50?'…':'') + '</span>' : '';

    return '<div class="rd-product-card status-' + p.status + '" data-id="' + p.id + '" style="animation-delay:' + (i*.06) + 's">' +
      // Body horizontal
      '<div class="rd-card-body">' +
        imgHtml +
        '<div class="rd-card-info">' +
          '<div class="rd-card-badges">' + statusBadge + catBadge + '</div>' +
          '<span class="rd-card-name">' + escHtml(p.name) + '</span>' +
          shortDesc +
          '<span class="rd-card-price">' + priceDisp + '</span>' +
        '</div>' +
      '</div>' +
      // Footer boutons égaux
      '<div class="rd-card-footer">' +
        '<button class="rd-btn-edit" data-id="' + p.id + '">' + ICO_EDIT + ' Modifier</button>' +
        '<button class="' + toggleClass + '" data-id="' + p.id + '" data-status="' + p.status + '">' + toggleIcon + ' ' + toggleLabel + '</button>' +
      '</div>' +
    '</div>';
  }

  // ── EVENTS ──────────────────────────────────────────────
  function bindEvents() {
    $('#rd-open-add').on('click', function () { openModal(false); });
    $('#rd-close-modal, #rd-cancel').on('click', closeModal);
    $('#rd-modal-overlay').on('click', function (e) { if ($(e.target).is(this)) closeModal(); });

    $(document).on('click', '.rd-btn-edit', function (e) {
      e.stopPropagation();
      var p = findProduct(parseInt($(this).data('id')));
      if (p) openModal(true, p);
    });

    $(document).on('click', '.rd-btn-toggle', function (e) {
      e.stopPropagation();
      var isDraft = $(this).data('status') === 'draft';
      toggleTargetId = parseInt($(this).data('id'));
      $('#rd-confirm-icon').text(isDraft ? '✅' : '⏸');
      $('#rd-confirm-title').text(isDraft ? 'Réactiver ce produit ?' : 'Désactiver ce produit ?');
      $('#rd-confirm-desc').text(isDraft ? 'Le produit sera visible dans la boutique.' : 'Le produit sera masqué mais conservé.');
      $('#rd-confirm-ok').text(isDraft ? 'Réactiver' : 'Désactiver');
      $('#rd-confirm-overlay').removeClass('hidden');
    });
    $('#rd-confirm-ok').on('click', function () { if (toggleTargetId) toggleProductStatus(toggleTargetId); });
    $('#rd-confirm-cancel').on('click', function () { $('#rd-confirm-overlay').addClass('hidden'); toggleTargetId = null; });
    $('#rd-confirm-overlay').on('click', function (e) { if ($(e.target).is(this)) { $(this).addClass('hidden'); toggleTargetId = null; } });

    $('#rd-product-form').on('submit', function (e) { e.preventDefault(); saveProduct(); });
    $('#rd-add-option-group').on('click', function(){ addOptionGroup(); });
    $('#rd-option-groups').on('click', '.rd-option-add-item', function(){ addOptionItem($(this).closest('.rd-option-group')); });
    $('#rd-option-groups').on('click', '.rd-option-remove-item', function(){ $(this).closest('.rd-option-item').remove(); syncConfigField(); });
    $('#rd-option-groups').on('click', '.rd-option-remove-group', function(){ $(this).closest('.rd-option-group').remove(); syncConfigField(); });
    $('#rd-option-groups').on('input change', 'input,select', syncConfigField);
    $('#rd-search').on('input', function () { searchQuery = $(this).val().trim(); renderProducts(); });

    $('.rd-filter-tabs').on('click', '.rd-tab', function () {
      $('.rd-tab').removeClass('active'); $(this).addClass('active');
      currentFilter = $(this).data('filter'); renderProducts();
    });
    $('#rd-cats-scroll').on('click', '.rd-cat-btn', function () {
      $('#rd-cats-scroll .rd-cat-btn').removeClass('active'); $(this).addClass('active');
      currentCatId = $(this).data('cat-id'); renderProducts();
      var btn = this;
      setTimeout(function(){ btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}); }, 50);
    });

    $('#rd-open-cat-manager').on('click', function () { renderCategoryList(); $('#rd-cat-modal-overlay').removeClass('hidden'); });
    $('#rd-close-cat-modal').on('click', function () { $('#rd-cat-modal-overlay').addClass('hidden'); });
    $('#rd-cat-modal-overlay').on('click', function (e) { if ($(e.target).is(this)) $(this).addClass('hidden'); });
    $('#rd-add-cat-btn').on('click', addCategory);
    $('#rd-new-cat-name').on('keydown', function (e) { if (e.key==='Enter') { e.preventDefault(); addCategory(); } });
    $('#rd-cat-list').on('click', '.rd-btn-del-cat', function () {
      deleteCatTargetId = parseInt($(this).data('cat-id'));
      $('#rd-cat-del-overlay').removeClass('hidden');
    });
    $('#rd-cat-del-confirm').on('click', function () { if (deleteCatTargetId) deleteCategory(deleteCatTargetId); });
    $('#rd-cat-del-cancel').on('click', function () { $('#rd-cat-del-overlay').addClass('hidden'); deleteCatTargetId = null; });

    $('#rd-cat-checkboxes').on('click', '.rd-cat-checkbox-label', function () {
      var $cb = $(this).find('input[type=checkbox]');
      $cb.prop('checked', !$cb.prop('checked'));
      $(this).toggleClass('checked', $cb.prop('checked'));
    });

    $('#rd-manage-stock').on('change', function () {
      $('#rd-stock-qty-wrap').toggleClass('hidden', !$(this).is(':checked'));
    });

    var imageInput = document.getElementById('rd-image-input');
    var dropZone   = document.getElementById('rd-drop-zone');
    $('#rd-image-preview, #rd-drop-hint').on('click', function () { imageInput.click(); });
    $('#rd-change-image').on('click', function () { imageInput.click(); });
    $(imageInput).on('change', function () { if (this.files[0]) handleImageUpload(this.files[0]); });
    dropZone.addEventListener('dragover',  function(e){ e.preventDefault(); $('#rd-image-preview').addClass('drag-over'); });
    dropZone.addEventListener('dragleave', function(){  $('#rd-image-preview').removeClass('drag-over'); });
    dropZone.addEventListener('drop', function(e){
      e.preventDefault(); $('#rd-image-preview').removeClass('drag-over');
      var file = e.dataTransfer.files[0];
      if (file && file.type.indexOf('image/')===0) handleImageUpload(file);
    });

    $('#rd-open-account').on('click', function () { $('#rd-account-overlay').removeClass('hidden'); });
    $('#rd-close-account, #rd-acc-cancel').on('click', function () { $('#rd-account-overlay').addClass('hidden'); });
    $('#rd-account-overlay').on('click', function (e) { if ($(e.target).is(this)) $(this).addClass('hidden'); });
    $('#rd-acc-save').on('click', saveCredentials);
  }

  // ── TOGGLE STATUS ────────────────────────────────────────
  function toggleProductStatus(id) {
    $('#rd-confirm-overlay').addClass('hidden');
    $.post(RD.ajax_url, { action: 'rd_toggle_product_status', nonce: RD.nonce, id: id }, function (res) {
      if (res.success) {
        var p = findProduct(id);
        if (p) p.status = res.data.status;
        updateStats(); updateCatCounts(); renderProducts();
        showToast(res.data.message, 'success');
      } else { showToast(res.data.message || 'Erreur', 'error'); }
      toggleTargetId = null;
    });
  }

  // ── CATEGORIES CRUD ──────────────────────────────────────
  function addCategory() {
    var name = $('#rd-new-cat-name').val().trim();
    if (!name) { showToast('Entrez un nom', 'error'); return; }
    $('#rd-add-cat-btn').prop('disabled', true).text('…');
    $.post(RD.ajax_url, { action: 'rd_create_category', nonce: RD.nonce, name: name }, function (res) {
      $('#rd-add-cat-btn').prop('disabled', false).text('+ Ajouter');
      if (res.success) {
        allCategories.push(res.data); $('#rd-new-cat-name').val('');
        renderCategoryBar(); renderCategoryList(); showToast('Catégorie créée ✓', 'success');
      } else { showToast(res.data.message || 'Erreur', 'error'); }
    });
  }

  function deleteCategory(id) {
    $('#rd-cat-del-overlay').addClass('hidden');
    $.post(RD.ajax_url, { action: 'rd_delete_category', nonce: RD.nonce, id: id }, function (res) {
      if (res.success) {
        allCategories = allCategories.filter(function(c){ return c.id!==id; });
        if (currentCatId == id) currentCatId = 'all';
        renderCategoryBar(); renderCategoryList(); showToast('Catégorie supprimée', 'success');
      } else { showToast(res.data.message || 'Erreur', 'error'); }
      deleteCatTargetId = null;
    });
  }

  // ── MODAL ────────────────────────────────────────────────
  function openModal(editing, product) {
    isEditing = editing; resetForm();
    var selCats = (product && product.categories) ? product.categories.map(function(c){ return c.id; }) : [];
    renderCategoryCheckboxes(selCats);
    if (editing && product) {
      editingId = product.id;
      $('#rd-modal-title').text('Modifier le produit');
      $('#rd-product-id').val(product.id);
      $('#rd-name').val(product.name);
      $('#rd-price').val(product.regular_price || product.price);
      $('#rd-short-desc').val(product.short_desc);
      $('#rd-description').val(product.description);
      $('#rd-status').val(product.status);
      if (product.manage_stock) { $('#rd-manage-stock').prop('checked', true); $('#rd-stock-qty-wrap').removeClass('hidden'); $('#rd-stock').val(product.stock); }
      if (product.image_url) { uploadedImageId = product.image_id || 0; showImagePreview(product.image_url); }
      renderOptionGroups(product.config || {groups: []});
    } else {
      editingId = 0; $('#rd-modal-title').text('Ajouter un produit');
      renderOptionGroups({groups: []});
    }
    $('#rd-modal-overlay').removeClass('hidden');
    setTimeout(function(){ $('#rd-name').focus(); }, 300);
  }
  function closeModal() { $('#rd-modal-overlay').addClass('hidden'); resetForm(); }
  function resetForm() {
    $('#rd-product-form')[0].reset();
    $('#rd-product-id, #rd-image-id').val('');
    uploadedImageId = 0; clearImagePreview();
    $('#rd-stock-qty-wrap').addClass('hidden');
    $('#rd-option-groups').empty(); $('#rd-product-config').val('');
    $('#rd-save-btn').prop('disabled', false);
    $('#rd-save-label').text('💾 Enregistrer');
  }

  // ── IMAGE ────────────────────────────────────────────────
  function handleImageUpload(file) {
    var reader = new FileReader();
    reader.onload = function(e){ showImagePreview(e.target.result); };
    reader.readAsDataURL(file);
    var fd = new FormData();
    fd.append('action','rd_upload_image'); fd.append('nonce',RD.nonce); fd.append('image',file);
    showToast('Upload…','');
    $.ajax({ url:RD.ajax_url, type:'POST', data:fd, processData:false, contentType:false,
      success:function(res){ if(res.success){ uploadedImageId=res.data.id; $('#rd-image-id').val(uploadedImageId); showToast('Photo uploadée ✓','success'); } else showToast('Erreur upload','error'); },
      error:function(){ showToast('Erreur serveur','error'); }
    });
  }
  function showImagePreview(url){ $('#rd-drop-hint').hide(); $('#rd-preview-img').attr('src',url).show(); }
  function clearImagePreview(){   $('#rd-drop-hint').show(); $('#rd-preview-img').attr('src','').hide(); }

  // ── OPTIONS / SUPPLEMENTS BUILDER ───────────────────────
  function optionGroupHtml(group) {
    group = group || {name:'', type:'checkbox', required:false, min:0, max:0, items:[{label:'', price:0}]};
    var items = (group.items && group.items.length ? group.items : [{label:'', price:0}]).map(function(item){ return '<div class="rd-option-item"><input class="rd-option-label" type="text" placeholder="Ex: Sauce barbecue" value="'+escHtml(item.label||'')+'"><input class="rd-option-price" type="number" min="0" step="0.01" placeholder="0" value="'+(item.price||0)+'"><button type="button" class="rd-option-remove-item" title="Supprimer">×</button></div>'; }).join('');
    return '<div class="rd-option-group" data-group-id="'+escHtml(group.id||'')+'"><div class="rd-option-group-head"><input class="rd-option-group-name" type="text" placeholder="Nom du groupe : Sauces" value="'+escHtml(group.name||'')+'"><select class="rd-option-type"><option value="radio" '+(group.type==='radio'?'selected':'')+'>Un seul choix</option><option value="checkbox" '+(group.type!=='radio'?'selected':'')+'>Plusieurs choix</option></select><button type="button" class="rd-option-remove-group">Supprimer</button></div><div class="rd-option-rules"><label><input class="rd-option-required" type="checkbox" '+(group.required?'checked':'')+'> Obligatoire</label><label>Min <input class="rd-option-min" type="number" min="0" value="'+(group.min||0)+'"></label><label>Max <input class="rd-option-max" type="number" min="0" value="'+(group.max||0)+'"></label></div><div class="rd-option-items">'+items+'</div><button type="button" class="rd-option-add-item">+ Ajouter un choix</button></div>';
  }
  function addOptionGroup(group){ $('#rd-option-groups').append(optionGroupHtml(group)); syncConfigField(); }
  function addOptionItem($group){ $group.find('.rd-option-items').append('<div class="rd-option-item"><input class="rd-option-label" type="text" placeholder="Ex: Sauce barbecue"><input class="rd-option-price" type="number" min="0" step="0.01" placeholder="0"><button type="button" class="rd-option-remove-item" title="Supprimer">×</button></div>'); syncConfigField(); }
  function renderOptionGroups(config){ $('#rd-option-groups').empty(); (config.groups||[]).forEach(addOptionGroup); syncConfigField(); }
  function readOptionGroups(){ var groups=[]; $('#rd-option-groups .rd-option-group').each(function(){ var $g=$(this), items=[]; $g.find('.rd-option-item').each(function(){ var label=$(this).find('.rd-option-label').val().trim(); if(label) items.push({id:slugify(label),label:label,price:parseFloat($(this).find('.rd-option-price').val())||0}); }); var name=$g.find('.rd-option-group-name').val().trim(); var min=parseInt($g.find('.rd-option-min').val(),10)||0, max=parseInt($g.find('.rd-option-max').val(),10)||0; if(name && items.length) groups.push({id:slugify(name),name:name,type:$g.find('.rd-option-type').val(),required:$g.find('.rd-option-required').is(':checked'),min:min,max:max,items:items}); }); return {groups:groups}; }
  function syncConfigField(){ $('#rd-product-config').val(JSON.stringify(readOptionGroups())); }
  function slugify(value){ return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'option'; }
  // ── SAVE PRODUCT ─────────────────────────────────────────
  function saveProduct() {
    var name = $('#rd-name').val().trim(), price = $('#rd-price').val().trim();
    if (!name)  { showToast('Le nom est requis','error'); return; }
    if (!price) { showToast('Prix invalide','error'); return; }
    $('#rd-save-btn').prop('disabled',true); $('#rd-save-label').text('Enregistrement…');
    var catIds = [];
    $('#rd-cat-checkboxes input[type=checkbox]:checked').each(function(){ catIds.push($(this).val()); });
    var data = {
      action: isEditing ? 'rd_update_product' : 'rd_create_product', nonce: RD.nonce,
      id: isEditing ? editingId : 0, name: name, price: price,
      short_desc: $('#rd-short-desc').val().trim(), description: $('#rd-description').val().trim(),
      status: $('#rd-status').val(), image_id: uploadedImageId || $('#rd-image-id').val() || 0,
      config: JSON.stringify(readOptionGroups()),
      manage_stock: $('#rd-manage-stock').is(':checked') ? 1 : 0, stock: $('#rd-stock').val() || 0,
    };
    catIds.forEach(function(id,i){ data['category_ids['+i+']']=id; });
    $.post(RD.ajax_url, data, function(res){
      if (res.success) { showToast(res.data.message||'Succès ✓','success'); closeModal(); loadCategoriesThen(loadProducts); }
      else { showToast(res.data.message||'Erreur','error'); $('#rd-save-btn').prop('disabled',false); $('#rd-save-label').text('💾 Enregistrer'); }
    }).fail(function(){ showToast('Erreur serveur','error'); $('#rd-save-btn').prop('disabled',false); $('#rd-save-label').text('💾 Enregistrer'); });
  }

  // ── ACCOUNT ──────────────────────────────────────────────
  function saveCredentials() {
    var email=$('#rd-acc-email').val().trim(), pass=$('#rd-acc-pass').val(),
        pass2=$('#rd-acc-pass2').val(), current=$('#rd-acc-current').val(), $msg=$('#rd-acc-msg');
    if (!current) { $msg.css('color','#EF4444').text('⚠️ Mot de passe actuel requis'); return; }
    if (!email && !pass) { $msg.css('color','#444').text('Aucune modification'); return; }
    if (pass && pass!==pass2) { $msg.css('color','#EF4444').text('❌ Mots de passe différents'); return; }
    if (pass && pass.length<8) { $msg.css('color','#EF4444').text('❌ 8 caractères minimum'); return; }
    $msg.css('color','#888').text('Enregistrement…'); $('#rd-acc-save').prop('disabled',true);
    $.post(RD.ajax_url, { action:'rd_update_credentials', nonce:RD.nonce, email:email, password:pass, current_password:current }, function(res){
      $('#rd-acc-save').prop('disabled',false);
      if (res.success) { $msg.css('color','#22C55E').text('✅ '+res.data.message); $('#rd-acc-pass,#rd-acc-pass2,#rd-acc-current,#rd-acc-email').val(''); if(pass) setTimeout(function(){window.location.reload();},1500); }
      else { $msg.css('color','#EF4444').text('❌ '+(res.data.message||'Erreur')); }
    }).fail(function(){ $('#rd-acc-save').prop('disabled',false); $msg.css('color','#EF4444').text('❌ Erreur serveur'); });
  }

  // ── TOAST ────────────────────────────────────────────────
  var toastTimer;
  function showToast(msg, type) {
    var $t = $('#rd-toast');
    $t.text(msg).removeClass('success error').addClass(type).addClass('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ $t.removeClass('show'); }, 2800);
  }

  // ── UTILS ────────────────────────────────────────────────
  function findProduct(id){ for(var i=0;i<allProducts.length;i++){ if(allProducts[i].id===id) return allProducts[i]; } return null; }
  function escHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function getCatEmoji(name) {
    var n=(name||'').toLowerCase();
    if(n.indexOf('dessert')>-1||n.indexOf('patiss')>-1||n.indexOf('pâtiss')>-1) return '🍰';
    if(n.indexOf('pizza')>-1)     return '🍕';
    if(n.indexOf('burger')>-1||n.indexOf('sandwich')>-1) return '🍔';
    if(n.indexOf('salade')>-1||n.indexOf('entr')>-1) return '🥗';
    if(n.indexOf('soupe')>-1||n.indexOf('pâte')>-1||n.indexOf('paste')>-1||n.indexOf('pate')>-1) return '🍜';
    if(n.indexOf('poisson')>-1||n.indexOf('mer')>-1) return '🐟';
    if(n.indexOf('viande')>-1||n.indexOf('grill')>-1) return '🥩';
    if(n.indexOf('poulet')>-1)    return '🍗';
    if(n.indexOf('tagine')>-1||n.indexOf('couscous')>-1) return '🫕';
    if(n.indexOf('boisson')>-1||n.indexOf('jus')>-1||n.indexOf('drink')>-1) return '🥤';
    if(n.indexOf('fromage')>-1)   return '🧀';
    if(n.indexOf('plat')>-1)      return '🍽️';
    return '🍴';
  }

})(jQuery);
