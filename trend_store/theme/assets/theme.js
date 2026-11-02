/* Trendloop theme — storefront behaviour. No dependencies. */
(function () {
  'use strict';

  var theme = window.theme || {};
  var routes = theme.routes || {};
  var strings = theme.strings || {};

  /* ---------- Helpers ---------- */

  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    format = format || theme.moneyFormat || '${{amount}}';
    var match = format.match(/\{\{\s*(\w+)\s*\}\}/);
    if (!match) return String(cents);

    function withDelimiters(number, precision, thousands, decimal) {
      if (isNaN(number) || number == null) return '0';
      number = (number / 100).toFixed(precision);
      var parts = number.split('.');
      var whole = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousands);
      return whole + (parts[1] ? decimal + parts[1] : '');
    }

    var value;
    switch (match[1]) {
      case 'amount_no_decimals': value = withDelimiters(cents, 0, ',', '.'); break;
      case 'amount_with_comma_separator': value = withDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = withDelimiters(cents, 0, '.', ','); break;
      case 'amount_with_apostrophe_separator': value = withDelimiters(cents, 2, "'", '.'); break;
      case 'amount_with_space_separator': value = withDelimiters(cents, 2, ' ', ','); break;
      default: value = withDelimiters(cents, 2, ',', '.');
    }
    return format.replace(match[0], value);
  }

  function postJSON(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || data.status) {
          var err = new Error(data.description || data.message || 'Request failed');
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  function parseHTML(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  /* ---------- Announcement rotator ---------- */

  function initRotators(root) {
    (root || document).querySelectorAll('[data-rotator]').forEach(function (el) {
      if (el._rotator) clearInterval(el._rotator);
      var items = el.querySelectorAll('.announcement__item');
      if (items.length < 2) return;
      var i = 0;
      var interval = parseInt(el.dataset.interval, 10) || 4000;
      el._rotator = setInterval(function () {
        items[i].classList.remove('is-active');
        i = (i + 1) % items.length;
        items[i].classList.add('is-active');
      }, interval);
    });
  }

  /* ---------- Cart drawer ---------- */

  var drawer = {
    el: function () { return document.querySelector('[data-cart-drawer]'); },
    open: function () {
      var el = this.el();
      if (!el) return false;
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
      var panel = el.querySelector('.drawer__panel');
      if (panel) panel.focus();
      return true;
    },
    close: function () {
      var el = this.el();
      if (!el) return;
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
    },
    render: function (sections) {
      if (!sections || !sections['cart-drawer']) return;
      var doc = parseHTML(sections['cart-drawer']);
      var fresh = doc.getElementById('CartDrawerContent');
      var current = document.getElementById('CartDrawerContent');
      if (fresh && current) {
        current.replaceWith(fresh);
        updateCount(parseInt(fresh.dataset.cartCountValue, 10) || 0);
      }
    }
  };

  function updateCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (badge) {
      badge.textContent = count;
      badge.classList.toggle('is-empty', count === 0);
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    });
  }

  function useDrawer() {
    return theme.cartType === 'drawer' && !!drawer.el();
  }

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-cart-toggle]');
    if (toggle && useDrawer() && !document.body.classList.contains('template-cart')) {
      e.preventDefault();
      drawer.open();
      return;
    }
    if (e.target.closest('[data-drawer-close]')) {
      drawer.close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      drawer.close();
      document.querySelectorAll('details[open]').forEach(function (d) { d.removeAttribute('open'); });
    }
  });

  /* ---------- Add to cart ---------- */

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-product-form]');
    if (!form || !useDrawer()) return;
    e.preventDefault();

    var button = form.querySelector('[type="submit"]');
    var label = button && (button.querySelector('[data-add-label]') || button.querySelector('span'));
    var originalLabel = label ? label.textContent : '';
    var errorEl = form.querySelector('[data-form-error]');
    if (button) { button.classList.add('is-loading'); button.setAttribute('aria-busy', 'true'); }
    if (label) label.textContent = strings.adding || '…';
    if (errorEl) errorEl.hidden = true;

    var formData = new FormData(form);
    var item = {
      id: Number(formData.get('id')),
      quantity: Math.max(1, parseInt(formData.get('quantity'), 10) || 1)
    };
    var props = {};
    formData.forEach(function (value, key) {
      var m = key.match(/^properties\[(.+)\]$/);
      if (m) props[m[1]] = value;
    });
    if (Object.keys(props).length) item.properties = props;
    var sellingPlan = formData.get('selling_plan');
    if (sellingPlan) item.selling_plan = Number(sellingPlan);

    postJSON(routes.cartAdd + '.js', { items: [item], sections: 'cart-drawer', sections_url: window.location.pathname })
      .then(function (data) {
        drawer.render(data.sections);
        drawer.open();
      })
      .catch(function (err) {
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.hidden = false;
        } else {
          alert(err.message);
        }
      })
      .finally(function () {
        if (button) { button.classList.remove('is-loading'); button.removeAttribute('aria-busy'); }
        if (label) label.textContent = originalLabel;
      });
  });

  /* ---------- Cart quantity changes (drawer + cart page) ---------- */

  function changeLine(line, quantity, container) {
    if (container) container.setAttribute('data-cart-busy', '');
    var onCartPage = !!document.querySelector('[data-cart-page]');
    return postJSON(routes.cartChange + '.js', { line: line, quantity: quantity, sections: 'cart-drawer' })
      .then(function (data) {
        if (onCartPage) {
          window.location.reload();
          return;
        }
        drawer.render(data.sections);
      })
      .catch(function (err) {
        alert(err.message);
        if (container) container.removeAttribute('data-cart-busy');
      });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cart-qty]');
    if (!btn) return;
    e.preventDefault();
    var qty = Math.max(0, parseInt(btn.dataset.cartQty, 10) || 0);
    changeLine(parseInt(btn.dataset.line, 10), qty, btn.closest('.cart-item'));
  });

  document.addEventListener('change', function (e) {
    var input = e.target.closest('[data-cart-input]');
    if (!input) return;
    var qty = Math.max(0, parseInt(input.value, 10) || 0);
    changeLine(parseInt(input.dataset.line, 10), qty, input.closest('.cart-item'));
  });

  /* ---------- Product page ---------- */

  function initProduct(section) {
    var jsonEl = section.querySelector('[data-product-json]');
    if (!jsonEl) return;
    var product;
    try { product = JSON.parse(jsonEl.textContent); } catch (err) { return; }

    var picker = section.querySelector('[data-variant-picker]');
    var idInput = section.querySelector('[data-variant-id]');
    var addButton = section.querySelector('[data-add-button]');
    var addLabel = section.querySelector('[data-add-label]');
    var priceWrap = section.querySelector('[data-price-wrapper] [data-price]');
    var gallery = section.querySelector('[data-gallery]');

    function showMedia(mediaId) {
      if (!gallery || !mediaId) return;
      var target = gallery.querySelector('.gallery__slide[data-media-id="' + mediaId + '"]');
      if (!target) return;
      gallery.querySelectorAll('.gallery__slide').forEach(function (s) { s.classList.toggle('is-active', s === target); });
      gallery.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.toggle('is-active', t.dataset.thumb === String(mediaId)); });
    }

    if (gallery) {
      gallery.addEventListener('click', function (e) {
        var thumb = e.target.closest('[data-thumb]');
        if (thumb) showMedia(thumb.dataset.thumb);
      });
    }

    // Quantity stepper
    var qty = section.querySelector('[data-qty]');
    if (qty) {
      var qInput = qty.querySelector('input');
      qty.addEventListener('click', function (e) {
        var v = parseInt(qInput.value, 10) || 1;
        if (e.target.closest('[data-qty-minus]')) qInput.value = Math.max(1, v - 1);
        if (e.target.closest('[data-qty-plus]')) qInput.value = v + 1;
      });
    }

    if (!picker || !product.variants) return;

    function selectedOptions() {
      return Array.prototype.map.call(
        picker.querySelectorAll('.variant-picker__option'),
        function (fs) {
          var checked = fs.querySelector('input:checked');
          return checked ? checked.value : null;
        }
      );
    }

    function findVariant(options) {
      return product.variants.find(function (v) {
        return v.options.every(function (opt, i) { return opt === options[i]; });
      });
    }

    function markAvailability(options) {
      picker.querySelectorAll('input[type="radio"]').forEach(function (input) {
        var idx = parseInt(input.dataset.optionIndex, 10);
        var test = options.slice();
        test[idx] = input.value;
        var v = findVariant(test);
        var label = input.nextElementSibling;
        if (label) label.classList.toggle('is-unavailable', !v || !v.available);
      });
    }

    function renderPrice(variant) {
      if (!priceWrap) return;
      var onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
      var html = '<span class="price__current">' + formatMoney(variant.price) + '</span>';
      if (onSale) {
        var pct = Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price);
        html += '<s class="price__compare">' + formatMoney(variant.compare_at_price) + '</s>';
        html += '<span class="price__badge">' + (strings.savePercent || 'Save __PCT__%').replace('__PCT__', pct) + '</span>';
      }
      priceWrap.innerHTML = html;
      priceWrap.classList.toggle('price--on-sale', !!onSale);
    }

    function update() {
      var options = selectedOptions();
      options.forEach(function (val, i) {
        var lbl = picker.querySelector('[data-option-value="' + i + '"]');
        if (lbl && val) lbl.textContent = val;
      });
      markAvailability(options);
      var variant = findVariant(options);

      if (!variant) {
        if (addButton) addButton.disabled = true;
        if (addLabel) addLabel.textContent = strings.unavailable;
        return;
      }

      if (idInput) idInput.value = variant.id;
      if (addButton) addButton.disabled = !variant.available;
      if (addLabel) addLabel.textContent = variant.available ? strings.addToCart : strings.soldOut;
      renderPrice(variant);
      if (variant.featured_media) showMedia(variant.featured_media.id);

      var url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    }

    picker.addEventListener('change', update);
    markAvailability(selectedOptions());
  }

  function initProducts(root) {
    (root || document).querySelectorAll('[data-product-section]').forEach(initProduct);
  }

  /* ---------- Product recommendations ---------- */

  function initRecommendations(root) {
    (root || document).querySelectorAll('[data-recommendations]').forEach(function (el) {
      if (el.dataset.loaded) return;
      el.dataset.loaded = 'true';
      fetch(el.dataset.url)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var fresh = parseHTML(html).querySelector('[data-recommendations]');
          if (fresh && fresh.innerHTML.trim()) el.innerHTML = fresh.innerHTML;
        })
        .catch(function () { /* recommendations are optional */ });
    });
  }

  /* ---------- Filters & sorting ---------- */

  document.addEventListener('change', function (e) {
    var form = e.target.closest('[data-facets-form]');
    if (!form) return;
    var params = new URLSearchParams();
    new FormData(form).forEach(function (value, key) {
      if (value !== '') params.append(key, value);
    });
    window.location.search = params.toString();
  });

  /* ---------- Close menus/search when clicking outside ---------- */

  document.addEventListener('click', function (e) {
    document.querySelectorAll('.facet[open], [data-search][open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d.matches && d.matches('[data-search]') && d.open) {
      var input = d.querySelector('input[type="search"]');
      if (input) setTimeout(function () { input.focus(); }, 30);
    }
  }, true);

  /* ---------- Boot ---------- */

  function init(root) {
    initRotators(root);
    initProducts(root);
    initRecommendations(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }

  // Theme editor support
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });

  window.theme.formatMoney = formatMoney;
})();
