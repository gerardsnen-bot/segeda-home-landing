/* =============================================
   RENDER.JS — Motor de renderizado dinámico SEGEDA HOME
   =============================================
   Edita los archivos en data/ para cambiar contenido sin tocar index.html:
     data/products.json      → productos, precios, tamaños, imágenes
     data/gallery.json       → galería de trabajos reales
     data/site-settings.json → marca, WhatsApp, redes sociales, textos
   ============================================= */
(function () {
  'use strict';

  // Phone number used in product CTA links (overridden by site-settings.json)
  var waPhone = '51978642447';

  // SVG de WhatsApp reutilizable
  var WA_SVG = '<svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  /* --------- helpers --------- */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function observeFadeIns() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) {
      obs.observe(el);
    });
  }

  function initSizePills(container) {
    container.querySelectorAll('.size-pills').forEach(function (pillGroup) {
      var productKey = pillGroup.getAttribute('data-product');
      var priceDisplay = container.querySelector('[data-price-display="' + productKey + '"]');
      var pills = pillGroup.querySelectorAll('.size-pill');

      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pills.forEach(function (p) {
            p.classList.remove('active');
            p.setAttribute('aria-pressed', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-pressed', 'true');
          if (priceDisplay) {
            var newPrice = this.getAttribute('data-price');
            priceDisplay.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
            priceDisplay.style.opacity = '0';
            priceDisplay.style.transform = 'scale(0.9)';
            setTimeout(function () {
              priceDisplay.textContent = newPrice;
              priceDisplay.style.opacity = '1';
              priceDisplay.style.transform = 'scale(1)';
            }, 100);
          }
        });
      });

      // activate popular or first pill
      var popularPill = pillGroup.querySelector('.popular-size');
      var defaultPill = popularPill || pills[0];
      if (defaultPill) {
        defaultPill.classList.add('active');
        defaultPill.setAttribute('aria-pressed', 'true');
        if (priceDisplay) {
          priceDisplay.textContent = defaultPill.getAttribute('data-price');
        }
      }
    });
  }

  function initCarousels(container) {
    container.querySelectorAll('.prod-carousel').forEach(function(carousel) {
      var imagesAttr = carousel.getAttribute('data-images');
      if (!imagesAttr) return;
      var images = JSON.parse(imagesAttr);
      var total = images.length;
      if (total <= 1) return;

      var img = carousel.querySelector('.prod-carousel-img');
      var dots = carousel.querySelectorAll('.prod-carousel-dot');
      var currentIndex = 0;

      function goTo(idx) {
        currentIndex = (idx + total) % total;
        img.style.opacity = '0';
        setTimeout(function() {
          img.src = images[currentIndex];
          img.style.opacity = '1';
        }, 150);
        dots.forEach(function(d, i) {
          d.classList.toggle('active', i === currentIndex);
        });
        carousel.setAttribute('data-index', currentIndex);
      }

      var prevBtn = carousel.querySelector('.prod-carousel-prev');
      var nextBtn = carousel.querySelector('.prod-carousel-next');
      if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(currentIndex - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(currentIndex + 1); });

      var touchStartX = 0;
      var touchStartY = 0;
      carousel.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: true });
      carousel.addEventListener('touchend', function(e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { goTo(dx < 0 ? currentIndex + 1 : currentIndex - 1); }
      }, { passive: true });
    });
  }

  /* --------- renderProducts --------- */

  function buildPriceBlock(product) {
    if (product.sizes && product.sizes.length > 0) {
      // Size pills + "Desde" price
      var pillsHtml = product.sizes.map(function (s) {
        var cls = 'size-pill' + (s.popular ? ' popular-size' : '');
        var label = s.size + (s.popular ? ' ⭐' : '');
        return '<button class="' + cls + '" data-size="' + escapeHtml(s.size) + '" data-price="' + escapeHtml(s.price) + '" aria-pressed="false">' + escapeHtml(label) + '</button>';
      }).join('\n            ');

      return '<div class="size-pills" data-product="' + escapeHtml(product.sizeKey) + '" role="group" aria-label="Tamaños disponibles">\n            ' +
        pillsHtml +
        '\n          </div>\n          <div class="price-display">\n            <div class="price-from">Desde</div>\n            <div class="price-value" data-price-display="' + escapeHtml(product.sizeKey) + '">' + escapeHtml(product.sizes[0].price) + '</div>\n          </div>';
    }

    if (product.priceDisplay === 'precio-por-pack' && product.fixedPrice) {
      return '<div class="price-display" style="margin-top: auto;">\n            <div class="price-from">Precio por pack</div>\n            <div class="price-single">' + escapeHtml(product.fixedPrice) + '</div>\n          </div>';
    }

    // consultar
    return '<div class="price-display" style="margin-top:auto;">\n            <div class="price-consult">Precio según diseño y piezas</div>\n            <div class="price-single" style="font-size:1.1rem; color:var(--color-taupe);">Consultar precio</div>\n          </div>';
  }

  function buildProductCard(product) {
    var articleClass = 'product-card fade-in' + (product.fadeClass ? ' ' + product.fadeClass : '');
    var badgesHtml = product.badges.map(function (b) {
      return '<span class="badge badge-' + escapeHtml(b.type) + '">' + escapeHtml(b.label) + '</span>';
    }).join('\n            ');

    var ctaHref = 'https://wa.me/' + waPhone + '?text=' + encodeURIComponent(product.ctaMessage);
    var marginTop = (!product.sizes) ? ' margin-top:var(--space-sm);' : '';

    var includesHtml = product.includes ? '<p class="product-includes">' + escapeHtml(product.includes) + '</p>' : '';
    var noteHtml = product.note ? '<p class="product-note">' + escapeHtml(product.note) + '</p>' : '';

    var imgHtml;
    if (product.images && product.images.length > 1) {
      var dotsHtml = '';
      for (var di = 0; di < product.images.length; di++) {
        dotsHtml += '<span class="prod-carousel-dot' + (di === 0 ? ' active' : '') + '"></span>';
      }
      var dataImages = escapeHtml(JSON.stringify(product.images));
      imgHtml = '<div class="prod-carousel" data-index="0" data-images="' + dataImages + '">' +
        '<img class="prod-carousel-img" src="' + escapeHtml(product.images[0]) + '" alt="' + escapeHtml(product.imageAlt) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">' +
        '<button class="prod-carousel-btn prod-carousel-prev" aria-label="Imagen anterior">&#8249;</button>' +
        '<button class="prod-carousel-btn prod-carousel-next" aria-label="Imagen siguiente">&#8250;</button>' +
        '<div class="prod-carousel-dots">' + dotsHtml + '</div>' +
        '</div>';
    } else {
      imgHtml = '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.imageAlt) + '" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">';
    }

    return '<article class="' + articleClass + '" id="' + escapeHtml(product.id) + '" aria-label="' + escapeHtml(product.name) + '">\n' +
      '        <div class="product-img" style="background: ' + escapeHtml(product.imageBg) + '; padding:0;">\n' +
      '          ' + imgHtml + '\n' +
      '        </div>\n' +
      '        <div class="product-body">\n' +
      '          <div class="product-badges">\n            ' + badgesHtml + '\n          </div>\n' +
      '          <h3 class="product-name">' + escapeHtml(product.name) + '</h3>\n' +
      '          <p class="product-desc">' + escapeHtml(product.desc) + '</p>\n' +
      '          ' + buildPriceBlock(product) + '\n' +
      '          ' + includesHtml + '\n' +
      '          ' + noteHtml + '\n' +
      '          <a href="' + ctaHref + '" class="btn-whatsapp" target="_blank" rel="noopener noreferrer" style="width:100%; justify-content:center;' + marginTop + '">\n' +
      '            ' + WA_SVG + '\n' +
      '            ' + escapeHtml(product.ctaText) + '\n' +
      '          </a>\n' +
      '        </div>\n' +
      '      </article>';
  }

  function renderProducts(products) {
    var target = document.getElementById('products-render-target');
    if (!target) {
      console.warn('[SEGEDA HOME] #products-render-target no encontrado');
      return;
    }
    target.innerHTML = products.map(buildProductCard).join('\n      ');
    initSizePills(target);
    initCarousels(target);
  }

  /* --------- renderGallery --------- */

  function renderGallery(gallery) {
    var target = document.getElementById('gallery-render-target');
    if (!target) {
      console.warn('[SEGEDA HOME] #gallery-render-target no encontrado');
      return;
    }
    target.innerHTML = gallery.map(function (item) {
      var cls = 'gallery-item fade-in' + (item.fadeClass ? ' ' + item.fadeClass : '');
      return '<div class="' + cls + '">\n' +
        '        <img src="' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">\n' +
        '        <div class="gallery-item-overlay"><span class="gallery-item-label">' + escapeHtml(item.label) + '</span></div>\n' +
        '      </div>';
    }).join('\n      ');
  }

  /* --------- applySiteSettings --------- */

  function applySiteSettings(settings) {
    // Update module-level waPhone so buildProductCard uses correct number on future calls
    if (settings.whatsapp) {
      waPhone = settings.whatsapp;
    }
    // Update WhatsApp links if phone number changes
    if (settings.whatsapp) {
      document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
        a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + settings.whatsapp);
      });
    }
    // Update Instagram links
    if (settings.instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) {
        a.href = settings.instagram;
      });
    }
    // Update Facebook links
    if (settings.facebook) {
      document.querySelectorAll('a[href*="facebook.com"]').forEach(function (a) {
        a.href = settings.facebook;
      });
    }
    console.log('[SEGEDA HOME] Settings aplicados: ' + settings.brand);
  }

  /* --------- bootstrap --------- */

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
      fetch('data/products.json').then(function (r) { return r.json(); }),
      fetch('data/gallery.json').then(function (r) { return r.json(); }),
      fetch('data/site-settings.json').then(function (r) { return r.json(); })
    ])
    .then(function (results) {
      var products = results[0];
      var gallery = results[1];
      var settings = results[2];
      waPhone = settings.whatsapp || waPhone;
      renderProducts(products);
      renderGallery(gallery);
      applySiteSettings(settings);
      observeFadeIns();
    })
    .catch(function (err) {
      console.error('[SEGEDA HOME] Error cargando JSON:', err);
      var prodTarget = document.getElementById('products-render-target');
      var galTarget = document.getElementById('gallery-render-target');
      var msg = '<p style="text-align:center;color:var(--color-taupe);padding:2rem;">Para ver el contenido, abre la página desde un servidor HTTP (no como archivo local).</p>';
      if (prodTarget && !prodTarget.hasChildNodes()) prodTarget.innerHTML = msg;
      if (galTarget && !galTarget.hasChildNodes()) galTarget.innerHTML = msg;
    });
  });

}());
