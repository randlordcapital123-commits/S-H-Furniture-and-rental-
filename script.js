/* ============================================================
   S&H Rentals Co — Main Script
   All data is stored locally in localStorage (no cloud, no DB).
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   1. STORAGE KEYS & DEFAULT DATA
   ------------------------------------------------------------ */
const STORAGE_KEY = 'sh_rentals_data_v1';
const SESSION_KEY = 'sh_rentals_session';

const DEFAULTS = {
  business: {
    name: 'S&H Rentals Co',
    tagline: 'Furniture Rental Service',
    phone: '+27614169953',
    whatsapp: '27614169953',
    email: 'info@shrentals.co.za',
    address: 'Soweto, Johannesburg, Gauteng',
    hours: 'Mon–Sat 08:00–18:00 · Sun 09:00–14:00',
    about: 'S&H Rentals Co is a proudly Sowetan furniture rental business. We help families, students, young professionals, landlords and businesses furnish their spaces without spending a fortune upfront. Choose what you need, rent it monthly, and we deliver and set it up for you.',
    facebook: '',
    instagram: '',
    tiktok: ''
  },
  services: [
    {
      id: 'svc_1',
      title: '5-Piece Lounge Suite',
      desc: 'Comfortable 3-seater + 2-seater + coffee table + 2 side tables. Perfect for a family lounge.',
      price: '850',
      unit: 'per month',
      badge: 'Most Popular',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'svc_2',
      title: 'Queen Bedroom Suite',
      desc: 'Queen bed frame, orthopaedic mattress, 2 pedestals and a built-in wardrobe.',
      price: '750',
      unit: 'per month',
      badge: '',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'svc_3',
      title: 'Kitchen Appliance Pack',
      desc: 'Fridge, microwave, 2-plate stove, kettle and toaster. Everything a starter kitchen needs.',
      price: '650',
      unit: 'per month',
      badge: 'Great Value',
      image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'svc_4',
      title: 'Office Desk Setup',
      desc: 'Executive desk, ergonomic chair, filing cabinet and 2 visitor chairs. Ideal for home offices.',
      price: '550',
      unit: 'per month',
      badge: '',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'svc_5',
      title: 'Event Tables & Chairs',
      desc: 'Round tables + 10 chairs per set. Perfect for weddings, parties and church events.',
      price: '400',
      unit: 'per day',
      badge: 'Events',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'svc_6',
      title: 'TV & Entertainment Unit',
      desc: '55-inch smart TV, TV stand and soundbar. Movie nights sorted.',
      price: '600',
      unit: 'per month',
      badge: '',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80'
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80'
  ],
  logo: '',
  hero: '',
  password: 'admin123'
};

/* ------------------------------------------------------------
   2. STATE
   ------------------------------------------------------------ */
let state = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        business: Object.assign({}, DEFAULTS.business, parsed.business || {}),
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULTS.services.slice(),
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULTS.gallery.slice(),
        logo: parsed.logo || '',
        hero: parsed.hero || '',
        password: parsed.password || DEFAULTS.password
      };
      return;
    }
  } catch (e) {
    console.warn('Could not load saved data, using defaults.', e);
  }
  state = JSON.parse(JSON.stringify(DEFAULTS));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('saveState failed:', e);
    if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
      toast('Storage is full. Please remove some images.', 'error');
    } else {
      toast('Could not save changes.', 'error');
    }
    return false;
  }
}

/* ------------------------------------------------------------
   3. UTILITIES
   ------------------------------------------------------------ */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

function uid(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
function escapeAttr(str) { return escapeHtml(str); }

function waLink(number, message) {
  var clean = String(number || '').replace(/[^0-9]/g, '');
  var text = encodeURIComponent(message || '');
  return 'https://wa.me/' + clean + '?text=' + text;
}
function telLink(number) {
  return 'tel:' + String(number || '').replace(/[^0-9+]/g, '');
}
function formatPrice(price) {
  var n = Number(String(price).replace(/[^0-9.]/g, ''));
  if (!isFinite(n) || isNaN(n)) return 'R ' + escapeHtml(price);
  return 'R ' + n.toLocaleString('en-ZA');
}

function placeholder(text) {
  var safe = escapeHtml(text || 'S&H Rentals Co').replace(/&amp;/g, 'and');
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#ff7a18"/><stop offset="1" stop-color="#ffb347"/>' +
    '</linearGradient></defs>' +
    '<rect width="600" height="400" fill="url(#g)"/>' +
    '<text x="300" y="210" font-family="Arial, sans-serif" font-size="30" ' +
    'font-weight="700" fill="#ffffff" text-anchor="middle">' + safe + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* Image compression — resize + JPEG */
function compressImage(file, maxW, quality) {
  maxW = maxW || 1400;
  quality = quality || 0.78;
  return new Promise(function (resolve, reject) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) {
      reject(new Error('Not an image file'));
      return;
    }
    var reader = new FileReader();
    reader.onerror = function () { reject(new Error('Could not read file')); };
    reader.onload = function (e) {
      var img = new Image();
      img.onerror = function () { reject(new Error('Could not decode image')); };
      img.onload = function () {
        var w = img.width;
        var h = img.height;
        if (w > maxW) {
          h = Math.round(h * (maxW / w));
          w = maxW;
        }
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          var dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------
   4. TOAST
   ------------------------------------------------------------ */
function toast(message, type) {
  var wrap = $('#toastWrap');
  if (!wrap) return;
  var el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(function () {
    el.classList.add('out');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 320);
  }, 3200);
}

/* ------------------------------------------------------------
   5. RENDER — HEADER, HERO, CONTACT, FOOTER
   ------------------------------------------------------------ */
function applyBranding() {
  var biz = state.business;

  // Brand name / tagline everywhere
  ['brandName', 'footerBrandName', 'footerCopyName', 'adminHeaderName'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = biz.name;
  });
  ['brandTagline', 'footerTagline'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = biz.tagline;
  });

  // Title
  document.title = biz.name + ' | ' + biz.tagline + ' in Soweto';

  // Phone / WhatsApp
  var phoneEls = ['topbarPhoneText', 'contactPhoneText', 'footerPhoneText'];
  phoneEls.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = biz.phone;
  });

  var waNumberText = biz.phone;
  ['contactWaText'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = waNumberText;
  });

  // Links
  var telAnchors = ['topbarPhone', 'heroCall', 'contactPhone', 'footerPhone', 'formFootPhone'];
  telAnchors.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.setAttribute('href', telLink(biz.phone));
  });

  var waAnchors = ['navWa', 'heroWa', 'aboutWa', 'customWa', 'contactWa', 'waFab', 'footerWa'];
  waAnchors.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.setAttribute('href', waLink(biz.whatsapp, 'Hi ' + biz.name + ', I would like to enquire about furniture rental.'));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  });

  // Contact details
  var addr = document.getElementById('contactAddress');
  if (addr) addr.textContent = biz.address;
  var footAddr = document.getElementById('footerAddress');
  if (footAddr) footAddr.textContent = biz.address;

  var hours = document.getElementById('contactHours');
  if (hours) hours.textContent = biz.hours;

  var emailText = document.getElementById('footerEmailText');
  if (emailText) emailText.textContent = biz.email;
  var emailLink = document.getElementById('footerEmail');
  if (emailLink) emailLink.setAttribute('href', 'mailto:' + biz.email);

  var aboutText = document.getElementById('aboutText');
  if (aboutText) aboutText.textContent = biz.about;

  var footerAbout = document.getElementById('footerAbout');
  if (footerAbout) footerAbout.textContent = biz.about;

  // Socials
  var socialMap = { socialFb: biz.facebook, socialIg: biz.instagram, socialTt: biz.tiktok };
  Object.keys(socialMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (socialMap[id]) {
      el.setAttribute('href', socialMap[id]);
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });

  // Logo
  applyLogoToUI();

  // Hero background
  var heroBg = document.getElementById('heroBg');
  if (heroBg) {
    var heroUrl = state.hero || getDefaultHeroFromDOM();
    heroBg.style.backgroundImage = "url('" + heroUrl + "')";
  }
}

function getDefaultHeroFromDOM() {
  // Fallback hero image if none saved
  return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80';
}

function applyLogoToUI() {
  var hasLogo = !!state.logo;
  ['brandLogoBox', 'footerLogoBox'].forEach(function (boxId) {
    var box = document.getElementById(boxId);
    if (!box) return;
    var img = box.querySelector('img');
    var fallback = box.querySelector('.brand-logo-fallback');
    if (hasLogo) {
      if (img) { img.src = state.logo; img.alt = state.business.name + ' logo'; }
      box.classList.add('has-img');
    } else {
      if (img) { img.removeAttribute('src'); img.alt = ''; }
      box.classList.remove('has-img');
      if (fallback) fallback.textContent = getInitials(state.business.name);
    }
  });

  // Favicon
  var fav = document.getElementById('favicon');
  if (fav && hasLogo) {
    fav.setAttribute('href', state.logo);
  }
}

function getInitials(name) {
  var parts = String(name || 'S&H').split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/* ------------------------------------------------------------
   6. RENDER — SERVICES
   ------------------------------------------------------------ */
function renderServices() {
  var grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!state.services.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-2);">No services yet. Add some in the admin panel.</p>';
    renderFooterServices();
    renderContactServiceSelect();
    return;
  }

  state.services.forEach(function (svc) {
    var card = document.createElement('article');
    card.className = 'service-card reveal';

    var img = svc.image || placeholder(svc.title);
    var badge = svc.badge ? '<span class="service-badge">' + escapeHtml(svc.badge) + '</span>' : '';

    var waMsg = 'Hi ' + state.business.name + ', I would like to enquire about the "' + svc.title + '" rental at ' + formatPrice(svc.price) + ' ' + svc.unit + '.';

    card.innerHTML =
      '<div class="service-img">' +
        '<img src="' + escapeAttr(img) + '" alt="' + escapeAttr(svc.title) + '" loading="lazy" ' +
          'onerror="this.onerror=null;this.src=\'' + placeholder(svc.title) + '\'">' +
        badge +
      '</div>' +
      '<div class="service-body">' +
        '<h3>' + escapeHtml(svc.title) + '</h3>' +
        '<p>' + escapeHtml(svc.desc) + '</p>' +
        '<div class="service-price">' +
          '<span class="amount">' + formatPrice(svc.price) + '</span>' +
          '<span class="unit">' + escapeHtml(svc.unit) + '</span>' +
        '</div>' +
        '<a class="btn btn-wa" target="_blank" rel="noopener" ' +
          'href="' + waLink(state.business.whatsapp, waMsg) + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
            '<path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.3 0-.5 0-.1-.6-1.5-.9-2.1-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.6 1.1 2.8c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.6-.4z"/>' +
            '<path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>' +
          '</svg>' +
          'Enquire on WhatsApp' +
        '</a>' +
      '</div>';

    grid.appendChild(card);
  });

  observeReveals();
  renderFooterServices();
  renderContactServiceSelect();
}

function renderFooterServices() {
  var wrap = document.getElementById('footerServices');
  if (!wrap) return;
  wrap.innerHTML = '';
  state.services.slice(0, 5).forEach(function (svc) {
    var a = document.createElement('a');
    a.href = '#services';
    a.setAttribute('data-nav', '');
    a.textContent = svc.title;
    wrap.appendChild(a);
  });
  if (!state.services.length) {
    var s = document.createElement('span');
    s.textContent = 'Coming soon';
    wrap.appendChild(s);
  }
}

function renderContactServiceSelect() {
  var sel = document.getElementById('cfService');
  if (!sel) return;
  var current = sel.value;
  sel.innerHTML = '';
  var opt0 = document.createElement('option');
  opt0.value = '';
  opt0.textContent = 'General enquiry';
  sel.appendChild(opt0);
  state.services.forEach(function (svc) {
    var opt = document.createElement('option');
    opt.value = svc.title;
    opt.textContent = svc.title + ' — ' + formatPrice(svc.price) + ' ' + svc.unit;
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}

/* ------------------------------------------------------------
   7. RENDER — GALLERY
   ------------------------------------------------------------ */
function renderGallery() {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!state.gallery.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-2);width:100%;">Gallery coming soon.</p>';
    return;
  }

  state.gallery.forEach(function (src, i) {
    var item = document.createElement('div');
    item.className = 'gallery-item reveal';
    item.setAttribute('data-index', i);
    var img = document.createElement('img');
    img.src = src;
    img.alt = state.business.name + ' gallery image ' + (i + 1);
    img.loading = 'lazy';
    img.onerror = function () {
      this.onerror = null;
      this.src = placeholder('Gallery');
    };
    item.appendChild(img);
    item.addEventListener('click', function () { openLightbox(i); });
    grid.appendChild(item);
  });

  observeReveals();
}

/* ------------------------------------------------------------
   8. LIGHTBOX
   ------------------------------------------------------------ */
var lbIndex = 0;

function openLightbox(i) {
  if (!state.gallery.length) return;
  lbIndex = i;
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  updateLightbox();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function updateLightbox() {
  var img = document.getElementById('lbImg');
  var cap = document.getElementById('lbCaption');
  if (!img) return;
  var total = state.gallery.length;
  img.src = state.gallery[lbIndex] || '';
  img.onerror = function () {
    this.onerror = null;
    this.src = placeholder('Gallery');
  };
  if (cap) cap.textContent = (lbIndex + 1) + ' / ' + total;
}
function nextLightbox() {
  if (!state.gallery.length) return;
  lbIndex = (lbIndex + 1) % state.gallery.length;
  updateLightbox();
}
function prevLightbox() {
  if (!state.gallery.length) return;
  lbIndex = (lbIndex - 1 + state.gallery.length) % state.gallery.length;
  updateLightbox();
}

/* ------------------------------------------------------------
   9. NAVIGATION & UI
   ------------------------------------------------------------ */
function initNav() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Smooth scroll + close mobile menu
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-nav]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var offset = document.querySelector('.site-header')?.offsetHeight || 0;
    var y = target.getBoundingClientRect().top + window.pageYOffset - offset + 2;
    window.scrollTo({ top: y, behavior: 'smooth' });
    if (navLinks) navLinks.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    setActiveNav(href);
  });

  // Scroll spy
  window.addEventListener('scroll', function () {
    var header = document.getElementById('siteHeader');
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNavOnScroll();
  }, { passive: true });

  setActiveNav('#home');
}

function setActiveNav(hash) {
  $$('.nav-link').forEach(function (a) {
    var h = a.getAttribute('href');
    a.classList.toggle('active', h === hash);
  });
}

function updateActiveNavOnScroll() {
  var sections = ['#home', '#about', '#services', '#gallery', '#contact'];
  var scrollY = window.scrollY + 140;
  var current = '#home';
  sections.forEach(function (id) {
    var el = document.querySelector(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  setActiveNav(current);
}

/* Reveal on scroll */
var revealObserver = null;
function observeReveals() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  $$('.reveal:not(.visible)').forEach(function (el) { revealObserver.observe(el); });
}

/* Stat counters */
function initCounters() {
  var counters = $$('[data-count]');
  if (!counters.length) return;
  var animate = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var current = 0;
    var step = Math.max(1, Math.round(target / 45));
    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 22);
  };
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { io.observe(c); });
}

/* ------------------------------------------------------------
   10. CONTACT FORM → WHATSAPP
   ------------------------------------------------------------ */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cfName').value.trim();
    var phone = document.getElementById('cfPhone').value.trim();
    var service = document.getElementById('cfService').value;
    var message = document.getElementById('cfMessage').value.trim();

    if (!name || !phone) {
      toast('Please enter your name and phone number.', 'error');
      return;
    }

    var lines = [
      'Hi ' + state.business.name + ',',
      '',
      'Name: ' + name,
      'Phone: ' + phone
    ];
    if (service) lines.push('Interested in: ' + service);
    if (message) {
      lines.push('');
      lines.push(message);
    }
    var text = lines.join('\n');
    window.open(waLink(state.business.whatsapp, text), '_blank', 'noopener');
    toast('Opening WhatsApp...', 'success');
    form.reset();
  });
}

/* ------------------------------------------------------------
   11. ADMIN — LOGIN & SESSION
   ------------------------------------------------------------ */
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'yes';
}
function setLoggedIn(v) {
  if (v) sessionStorage.setItem(SESSION_KEY, 'yes');
  else sessionStorage.removeItem(SESSION_KEY);
}

function openAdmin() {
  var panel = document.getElementById('adminPanel');
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  var login = document.getElementById('adminLogin');
  var app = document.getElementById('adminApp');

  if (isLoggedIn()) {
    if (login) login.hidden = true;
    if (app) app.hidden = false;
    renderAdminAll();
  } else {
    if (login) login.hidden = false;
    if (app) app.hidden = true;
    var hint = document.getElementById('loginHint');
    if (hint) hint.innerHTML = 'Default password is <code>admin123</code>. Change it in Settings after logging in.';
    var pass = document.getElementById('adminPass');
    if (pass) { pass.value = ''; pass.focus(); }
    var err = document.getElementById('loginError');
    if (err) err.textContent = '';
  }
}

function closeAdmin() {
  var panel = document.getElementById('adminPanel');
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initAdminAccess() {
  ['adminLink', 'adminLinkFooter'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openAdmin();
      });
    }
  });

  var closeLogin = document.getElementById('closeLogin');
  if (closeLogin) closeLogin.addEventListener('click', closeAdmin);

  var viewSite = document.getElementById('viewSiteBtn');
  if (viewSite) viewSite.addEventListener('click', closeAdmin);

  var logout = document.getElementById('logoutBtn');
  if (logout) {
    logout.addEventListener('click', function () {
      setLoggedIn(false);
      closeAdmin();
      toast('Logged out.', 'success');
    });
  }

  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('adminPass');
      var val = input ? input.value : '';
      var err = document.getElementById('loginError');
      if (val === state.password) {
        setLoggedIn(true);
        if (err) err.textContent = '';
        document.getElementById('adminLogin').hidden = true;
        document.getElementById('adminApp').hidden = false;
        renderAdminAll();
        toast('Welcome back.', 'success');
      } else {
        if (err) err.textContent = 'Incorrect password. Try again.';
        if (input) { input.value = ''; input.focus(); }
      }
    });
  }

  // Admin tabs
  $$('.admin-tabs .tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      $$('.admin-tabs .tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      $$('.tab-panel').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-panel') === name);
      });
      if (name === 'dash') updateDashboardStats();
    });
  });

  // Quick actions
  $$('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabName = btn.getAttribute('data-goto');
      var action = btn.getAttribute('data-action');
      var tab = $('.admin-tabs .tab[data-tab="' + tabName + '"]');
      if (tab) tab.click();
      if (tabName === 'services' && action === 'new') {
        setTimeout(function () { openServiceEditor(null); }, 100);
      }
    });
  });
}

/* ------------------------------------------------------------
   12. ADMIN — RENDER
   ------------------------------------------------------------ */
function renderAdminAll() {
  renderAdminServiceList();
  renderAdminGallery();
  renderAdminBranding();
  fillBusinessForm();
  updateDashboardStats();
  updateStorageBar();
}

function updateDashboardStats() {
  var s = document.getElementById('statServices');
  if (s) s.textContent = state.services.length;
  var g = document.getElementById('statGallery');
  if (g) g.textContent = state.gallery.length;
  var l = document.getElementById('statLogo');
  if (l) l.textContent = state.logo ? 'Yes' : '-';
  var h = document.getElementById('statHero');
  if (h) h.textContent = state.hero ? 'Yes' : '-';
}

function updateStorageBar() {
  var fill = document.getElementById('storageFill');
  var text = document.getElementById('storageText');
  if (!fill || !text) return;
  var total = 0;
  try {
    for (var k in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, k)) {
        total += (localStorage[k] || '').length + k.length;
      }
    }
  } catch (e) { total = 0; }
  // localStorage usually ~5MB per origin. Use 5,000,000 chars as reference.
  var max = 5 * 1024 * 1024;
  var pct = Math.min(100, Math.round((total / max) * 100));
  fill.style.width = pct + '%';
  var kb = (total / 1024).toFixed(1);
  text.textContent = kb + ' KB used (' + pct + '% of ~5 MB)';
}

/* --------- SERVICE LIST --------- */
function renderAdminServiceList() {
  var list = document.getElementById('adminServiceList');
  if (!list) return;
  list.innerHTML = '';

  if (!state.services.length) {
    list.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:20px;">No services yet. Click "Add Service" to create one.</p>';
    return;
  }

  state.services.forEach(function (svc) {
    var item = document.createElement('div');
    item.className = 'admin-item';

    var img = svc.image || placeholder(svc.title);

    item.innerHTML =
      '<img src="' + escapeAttr(img) + '" alt="' + escapeAttr(svc.title) + '" ' +
        'onerror="this.onerror=null;this.src=\'' + placeholder(svc.title) + '\'">' +
      '<div class="admin-item-info">' +
        '<strong>' + escapeHtml(svc.title) + '</strong>' +
        '<small>' + escapeHtml(svc.unit) + (svc.badge ? ' · ' + escapeHtml(svc.badge) : '') + '</small>' +
      '</div>' +
      '<div class="admin-item-price">' + formatPrice(svc.price) + '</div>' +
      '<div class="admin-item-actions">' +
        '<button class="icon-btn" data-edit="' + svc.id + '" title="Edit">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.2V21h3.8L17.8 9.9l-3.8-3.8L3 17.2zM20.7 7.1a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8 1.8-1.8z"/></svg>' +
        '</button>' +
        '<button class="icon-btn danger" data-delete="' + svc.id + '" title="Delete">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7zm3-4h6l1 2H8l1-2zM4 6h16v2H4z"/></svg>' +
        '</button>' +
      '</div>';

    var editBtn = item.querySelector('[data-edit]');
    if (editBtn) editBtn.addEventListener('click', function () { openServiceEditor(svc.id); });

    var delBtn = item.querySelector('[data-delete]');
    if (delBtn) {
      delBtn.addEventListener('click', function () {
        if (!confirm('Delete "' + svc.title + '"?')) return;
        state.services = state.services.filter(function (s) { return s.id !== svc.id; });
        saveState();
        renderAdminServiceList();
        renderServices();
        updateDashboardStats();
        updateStorageBar();
        toast('Service deleted.', 'success');
      });
    }

    list.appendChild(item);
  });
}

/* --------- GALLERY GRID (ADMIN) --------- */
function renderAdminGallery() {
  var grid = document.getElementById('adminGalleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!state.gallery.length) {
    grid.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:20px;grid-column:1/-1;">No gallery images yet.</p>';
    return;
  }

  state.gallery.forEach(function (src, i) {
    var item = document.createElement('div');
    item.className = 'admin-gal-item';
    item.innerHTML =
      '<img src="' + escapeAttr(src) + '" alt="Gallery ' + (i + 1) + '" ' +
        'onerror="this.onerror=null;this.src=\'' + placeholder('Gallery') + '\'">' +
      '<button class="remove" title="Remove" data-idx="' + i + '">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>' +
      '</button>';
    var btn = item.querySelector('.remove');
    btn.addEventListener('click', function () {
      if (!confirm('Remove this image?')) return;
      state.gallery.splice(i, 1);
      saveState();
      renderAdminGallery();
      renderGallery();
      updateDashboardStats();
      updateStorageBar();
      toast('Image removed.', 'success');
    });
    grid.appendChild(item);
  });
}

/* --------- BRANDING PREVIEWS --------- */
function renderAdminBranding() {
  var logoPrev = document.getElementById('logoPreview');
  if (logoPrev) {
    if (state.logo) {
      logoPrev.src = state.logo;
      logoPrev.classList.add('show');
    } else {
      logoPrev.removeAttribute('src');
      logoPrev.classList.remove('show');
    }
  }
  var heroPrev = document.getElementById('heroPreview');
  if (heroPrev) {
    if (state.hero) {
      heroPrev.src = state.hero;
      heroPrev.classList.add('show');
    } else {
      heroPrev.removeAttribute('src');
      heroPrev.classList.remove('show');
    }
  }
}

/* --------- BUSINESS FORM --------- */
function fillBusinessForm() {
  var map = {
    bizName: 'name',
    bizTagline: 'tagline',
    bizPhone: 'phone',
    bizWhatsapp: 'whatsapp',
    bizEmail: 'email',
    bizHours: 'hours',
    bizAddress: 'address',
    bizAbout: 'about',
    bizFb: 'facebook',
    bizIg: 'instagram',
    bizTt: 'tiktok'
  };
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = state.business[map[id]] || '';
  });
}

/* ------------------------------------------------------------
   13. ADMIN — SERVICE EDITOR
   ------------------------------------------------------------ */
var editingImageData = '';

function openServiceEditor(id) {
  var editor = document.getElementById('serviceEditor');
  if (!editor) return;
  editor.hidden = false;

  var title = document.getElementById('serviceEditorTitle');
  var form = document.getElementById('serviceForm');
  form.reset();
  editingImageData = '';

  var svcPreview = document.getElementById('svcPreview');
  if (svcPreview) {
    svcPreview.removeAttribute('src');
    svcPreview.classList.remove('show');
  }

  if (id) {
    var svc = state.services.find(function (s) { return s.id === id; });
    if (!svc) return;
    if (title) title.textContent = 'Edit service';
    document.getElementById('svcId').value = svc.id;
    document.getElementById('svcTitle').value = svc.title;
    document.getElementById('svcBadge').value = svc.badge || '';
    document.getElementById('svcDesc').value = svc.desc;
    document.getElementById('svcPrice').value = svc.price;
    document.getElementById('svcUnit').value = svc.unit;
    if (svc.image && svcPreview) {
      editingImageData = svc.image;
      svcPreview.src = svc.image;
      svcPreview.classList.add('show');
    }
  } else {
    if (title) title.textContent = 'Add a new service';
    document.getElementById('svcId').value = '';
  }

  editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeServiceEditor() {
  var editor = document.getElementById('serviceEditor');
  if (editor) editor.hidden = true;
  editingImageData = '';
}

function initServiceForm() {
  var form = document.getElementById('serviceForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('svcId').value;
      var title = document.getElementById('svcTitle').value.trim();
      var badge = document.getElementById('svcBadge').value.trim();
      var desc = document.getElementById('svcDesc').value.trim();
      var price = document.getElementById('svcPrice').value.trim();
      var unit = document.getElementById('svcUnit').value;

      if (!title || !desc || !price) {
        toast('Please fill in name, description and price.', 'error');
        return;
      }

      var existing = id ? state.services.find(function (s) { return s.id === id; }) : null;
      var imageToUse = editingImageData || (existing ? existing.image : '') || placeholder(title);

      if (existing) {
        existing.title = title;
        existing.badge = badge;
        existing.desc = desc;
        existing.price = price;
        existing.unit = unit;
        existing.image = imageToUse;
      } else {
        state.services.push({
          id: uid('svc'),
          title: title,
          badge: badge,
          desc: desc,
          price: price,
          unit: unit,
          image: imageToUse
        });
      }

      saveState();
      renderAdminServiceList();
      renderServices();
      updateDashboardStats();
      updateStorageBar();
      closeServiceEditor();
      toast(existing ? 'Service updated.' : 'Service added.', 'success');
    });
  }

  var newBtn = document.getElementById('newServiceBtn');
  if (newBtn) newBtn.addEventListener('click', function () { openServiceEditor(null); });

  var cancel = document.getElementById('svcCancel');
  if (cancel) cancel.addEventListener('click', closeServiceEditor);

  var removeImg = document.getElementById('svcRemoveImg');
  if (removeImg) {
    removeImg.addEventListener('click', function () {
      editingImageData = '';
      var prev = document.getElementById('svcPreview');
      if (prev) { prev.removeAttribute('src'); prev.classList.remove('show'); }
    });
  }

  // Dropzone
  setupDropzone(
    'svcDrop', 'svcFile', 'svcPreview',
    function (dataUrl) { editingImageData = dataUrl; }
  );
}

/* ------------------------------------------------------------
   14. ADMIN — GALLERY UPLOAD
   ------------------------------------------------------------ */
function initGalleryUpload() {
  var addBtn = document.getElementById('addGalleryBtn');
  var fileInput = document.getElementById('galFile');

  if (addBtn && fileInput) {
    addBtn.addEventListener('click', function () { fileInput.click(); });
  }

  setupDropzone('galDrop', 'galFile', null, null, true);
}

async function handleGalleryFiles(files) {
  if (!files || !files.length) return;
  var added = 0;
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    if (!f.type || f.type.indexOf('image/') !== 0) continue;
    try {
      var dataUrl = await compressImage(f, 1400, 0.78);
      state.gallery.push(dataUrl);
      added++;
    } catch (err) {
      console.warn('Could not process image', f.name, err);
    }
  }
  if (added > 0) {
    if (saveState()) {
      renderAdminGallery();
      renderGallery();
      updateDashboardStats();
      updateStorageBar();
      toast(added + ' image' + (added > 1 ? 's' : '') + ' added.', 'success');
    }
  } else {
    toast('No valid images were added.', 'error');
  }
}

/* ------------------------------------------------------------
   15. ADMIN — LOGO & HERO
   ------------------------------------------------------------ */
function initBrandingUploads() {
  // Logo
  setupDropzone('logoDrop', 'logoFile', 'logoPreview', async function (dataUrl) {
    state.logo = dataUrl;
    if (saveState()) {
      applyLogoToUI();
      renderAdminBranding();
      updateDashboardStats();
      updateStorageBar();
      toast('Logo updated.', 'success');
    }
  });

  var removeLogo = document.getElementById('removeLogo');
  if (removeLogo) {
    removeLogo.addEventListener('click', function () {
      state.logo = '';
      saveState();
      applyLogoToUI();
      renderAdminBranding();
      updateDashboardStats();
      updateStorageBar();
      toast('Logo removed.', 'success');
    });
  }

  // Hero
  setupDropzone('heroDrop', 'heroFile', 'heroPreview', async function (dataUrl) {
    state.hero = dataUrl;
    if (saveState()) {
      var heroBg = document.getElementById('heroBg');
      if (heroBg) heroBg.style.backgroundImage = "url('" + dataUrl + "')";
      renderAdminBranding();
      updateDashboardStats();
      updateStorageBar();
      toast('Hero image updated.', 'success');
    }
  });

  var removeHero = document.getElementById('removeHero');
  if (removeHero) {
    removeHero.addEventListener('click', function () {
      state.hero = '';
      saveState();
      var heroBg = document.getElementById('heroBg');
      if (heroBg) heroBg.style.backgroundImage = "url('" + getDefaultHeroFromDOM() + "')";
      renderAdminBranding();
      updateDashboardStats();
      updateStorageBar();
      toast('Hero image reset to default.', 'success');
    });
  }
}

/* ------------------------------------------------------------
   16. DRAG-AND-DROP DROPZONE (generic)
   ------------------------------------------------------------ */
function setupDropzone(dropId, fileId, previewId, onImage, multiple) {
  var drop = document.getElementById(dropId);
  var input = document.getElementById(fileId);
  if (!drop || !input) return;

  var preview = previewId ? document.getElementById(previewId) : null;

  // Prevent default drag behaviour
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
    drop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  ['dragenter', 'dragover'].forEach(function (evt) {
    drop.addEventListener(evt, function () { drop.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(function (evt) {
    drop.addEventListener(evt, function () { drop.classList.remove('dragover'); });
  });

  drop.addEventListener('click', function (e) {
    if (e.target === input) return;
    input.click();
  });

  drop.addEventListener('drop', function (e) {
    var files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;
    if (multiple) {
      handleGalleryFiles(files);
    } else {
      handleSingleImage(files[0], preview, onImage);
    }
  });

  input.addEventListener('change', function () {
    var files = input.files;
    if (!files || !files.length) return;
    if (multiple) {
      handleGalleryFiles(files);
      input.value = '';
    } else {
      handleSingleImage(files[0], preview, onImage);
    }
  });
}

async function handleSingleImage(file, preview, onImage) {
  if (!file || !file.type || file.type.indexOf('image/') !== 0) {
    toast('Please choose an image file.', 'error');
    return;
  }
  try {
    var dataUrl = await compressImage(file, 1400, 0.8);
    if (preview) {
      preview.src = dataUrl;
      preview.classList.add('show');
    }
    if (typeof onImage === 'function') onImage(dataUrl);
  } catch (err) {
    console.error(err);
    toast('Could not process image.', 'error');
  }
}

/* ------------------------------------------------------------
   17. ADMIN — BUSINESS FORM
   ------------------------------------------------------------ */
function initBusinessForm() {
  var form = document.getElementById('businessForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var map = {
      name: 'bizName',
      tagline: 'bizTagline',
      phone: 'bizPhone',
      whatsapp: 'bizWhatsapp',
      email: 'bizEmail',
      hours: 'bizHours',
      address: 'bizAddress',
      about: 'bizAbout',
      facebook: 'bizFb',
      instagram: 'bizIg',
      tiktok: 'bizTt'
    };
    Object.keys(map).forEach(function (key) {
      var el = document.getElementById(map[key]);
      if (el) state.business[key] = el.value.trim();
    });

    // Clean whatsapp number
    state.business.whatsapp = state.business.whatsapp.replace(/[^0-9]/g, '');

    if (saveState()) {
      applyBranding();
      renderServices();
      renderGallery();
      toast('Business info saved.', 'success');
    }
  });
}

/* ------------------------------------------------------------
   18. ADMIN — SETTINGS (password, backup, reset)
   ------------------------------------------------------------ */
function initSettings() {
  var pwForm = document.getElementById('passwordForm');
  if (pwForm) {
    pwForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var n1 = document.getElementById('newPass').value;
      var n2 = document.getElementById('confirmPass').value;
      if (!n1 || n1.length < 4) {
        toast('Password must be at least 4 characters.', 'error');
        return;
      }
      if (n1 !== n2) {
        toast('Passwords do not match.', 'error');
        return;
      }
      state.password = n1;
      saveState();
      pwForm.reset();
      toast('Password updated.', 'success');
    });
  }

  var exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var data = JSON.stringify(state, null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      var date = new Date().toISOString().slice(0, 10);
      a.download = 'sh-rentals-backup-' + date + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('Backup downloaded.', 'success');
    });
  }

  var importBtn = document.getElementById('importBtn');
  var importFile = document.getElementById('importFile');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', function () { importFile.click(); });
    importFile.addEventListener('change', function () {
      var f = importFile.files && importFile.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var parsed = JSON.parse(e.target.result);
          if (!parsed || typeof parsed !== 'object') throw new Error('Bad file');
          state = {
            business: Object.assign({}, DEFAULTS.business, parsed.business || {}),
            services: Array.isArray(parsed.services) ? parsed.services : DEFAULTS.services.slice(),
            gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULTS.gallery.slice(),
            logo: parsed.logo || '',
            hero: parsed.hero || '',
            password: parsed.password || DEFAULTS.password
          };
          saveState();
          applyBranding();
          renderServices();
          renderGallery();
          renderAdminAll();
          toast('Backup imported successfully.', 'success');
        } catch (err) {
          console.error(err);
          toast('Invalid backup file.', 'error');
        }
        importFile.value = '';
      };
      reader.readAsText(f);
    });
  }

  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!confirm('This will erase ALL data (services, gallery, business info) and restore defaults. Continue?')) return;
      if (!confirm('Are you absolutely sure? This cannot be undone.')) return;
      localStorage.removeItem(STORAGE_KEY);
      loadState();
      saveState();
      applyBranding();
      renderServices();
      renderGallery();
      renderAdminAll();
      toast('Everything reset to defaults.', 'success');
    });
  }
}

/* ------------------------------------------------------------
   19. LIGHTBOX EVENTS
   ------------------------------------------------------------ */
function initLightbox() {
  var lb = document.getElementById('lightbox');
  if (!lb) return;

  var close = document.getElementById('lbClose');
  if (close) close.addEventListener('click', closeLightbox);

  var prev = document.getElementById('lbPrev');
  if (prev) prev.addEventListener('click', prevLightbox);

  var next = document.getElementById('lbNext');
  if (next) next.addEventListener('click', nextLightbox);

  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });
}

/* ------------------------------------------------------------
   20. INIT
   ------------------------------------------------------------ */
function initYear() {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function init() {
  loadState();
  applyBranding();
  renderServices();
  renderGallery();
  initNav();
  initCounters();
  initContactForm();
  initLightbox();
  initAdminAccess();
  initServiceForm();
  initGalleryUpload();
  initBrandingUploads();
  initBusinessForm();
  initSettings();
  initYear();
  observeReveals();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}