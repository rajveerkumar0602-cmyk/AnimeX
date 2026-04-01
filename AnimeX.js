 
var view       = 'grid';
var page       = 1;
var totalPages = 1;
var searchTimer = null;
var cachedItems = [];
 
// localStorage persistence (Milestone 4 polish)
var favs    = JSON.parse(localStorage.getItem('animex-favs') || '[]');
var isLight = localStorage.getItem('animex-theme') === 'light';
 
// Apply saved theme on load
function applyTheme() {
  if (isLight) {
    document.getElementById('body').className = 'light';
    document.getElementById('themeBtn').textContent = '☀️';
  } else {
    document.getElementById('body').className = '';
    document.getElementById('themeBtn').textContent = '🌙';
  }
}
 
document.getElementById('themeBtn').addEventListener('click', function () {
  isLight = !isLight;
  localStorage.setItem('animex-theme', isLight ? 'light' : 'dark');
  applyTheme();
});
 
 
/* ────────────────────────────────────────────────────────────────
   MILESTONE 2 — API Integration & Responsive UI
   ──────────────────────────────────────────────────────────────── */
 
/**
 * fetchAnime(p)
 * Builds the correct Jikan v4 URL based on active search/filter/sort,
 * fetches data, updates state, and triggers render + pagination.
 */
function fetchAnime(p) {
  var q     = document.getElementById('searchInput').value.trim();
  var genre = document.getElementById('genreFilter').value;
  var type  = document.getElementById('typeFilter').value;
  var sort  = document.getElementById('sortSelect').value;
  var url;
 
  if (q) {
    // Search query takes priority
    url = 'https://api.jikan.moe/v4/anime?q=' + encodeURIComponent(q)
        + '&page=' + p + '&limit=20&order_by=score&sort=desc';
    if (type) url += '&type=' + type;
  } else if (genre) {
    // Genre filter
    url = 'https://api.jikan.moe/v4/anime?genres=' + genre
        + '&page=' + p + '&limit=20&order_by=score&sort=desc';
    if (type) url += '&type=' + type;
  } else {
    // Top anime with sort
    url = 'https://api.jikan.moe/v4/top/anime?page=' + p + '&limit=20&filter=' + sort;
    if (type) url += '&type=' + type;
  }
 
  showLoader(true);
  document.getElementById('errBox').style.display = 'none';
 
  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error('API error ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var items = data.data || [];
 
      // MILESTONE 3 — client-side A-Z sort using Array.sort (HOF)
      if (sort === 'title' && !q && !genre) {
        items = items.slice().sort(function (a, b) {
          return (a.title || '').localeCompare(b.title || '');
        });
      }
 
      cachedItems = items;
      totalPages  = Math.min(
        data.pagination && data.pagination.last_visible_page
          ? data.pagination.last_visible_page : 1,
        10
      );
      page = p;
 
      var total = (data.pagination && data.pagination.items && data.pagination.items.total)
        ? data.pagination.items.total
        : items.length;
 
      document.getElementById('resultCount').innerHTML =
        '<b>' + total.toLocaleString() + '</b> results found';
 
      renderItems(items);
      buildPager();
    })
    .catch(function () {
      document.getElementById('errBox').textContent =
        '⚠️  Failed to load anime. Please check your connection and try again.';
      document.getElementById('errBox').style.display = 'block';
      document.getElementById('grid').innerHTML  = '';
      document.getElementById('pager').innerHTML = '';
      document.getElementById('resultCount').textContent = '';
    })
    .finally(function () {
      showLoader(false);
    });
}
 
/**
 * showLoader(v) — Toggle loader visibility (loading state, Milestone 2)
 */
function showLoader(v) {
  document.getElementById('loader').style.display = v ? 'block' : 'none';
  if (v) {
    document.getElementById('grid').innerHTML  = '';
    document.getElementById('pager').innerHTML = '';
  }
}
 
/**
 * renderItems(items) — Render grid or list view
 */
function renderItems(items) {
  var grid = document.getElementById('grid');
 
  if (!items.length) {
    grid.innerHTML =
      '<p style="text-align:center;padding:48px 32px;color:#888888;font-family:Georgia,serif;font-size:15px;">'
      + 'No anime found. Try a different search or filter.</p>';
    return;
  }
 
  // MILESTONE 3 — Array.map (HOF) builds HTML strings
  var html = items.map(function (a) {
    return view === 'grid' ? buildGridCard(a) : buildListCard(a);
  }).join('');
 
  grid.innerHTML = html;
 
  // Card click → modal (excludes heart button clicks)
  grid.querySelectorAll('[data-id]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target.closest &&
          e.target.closest('.heart-btn, .heart-btn-faved, .lcard-heart, .lcard-heart-faved')) return;
      var id    = parseInt(el.getAttribute('data-id'));
      // MILESTONE 3 — Array.find (HOF)
      var anime = cachedItems.find(function (a) { return a.mal_id === id; });
      if (anime) openModal(anime);
    });
  });
 
  // Heart button clicks
  grid.querySelectorAll('[data-heart]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var id    = parseInt(btn.getAttribute('data-heart'));
      // MILESTONE 3 — Array.find (HOF)
      var anime = cachedItems.find(function (a) { return a.mal_id === id; });
      if (anime) toggleFav(anime, btn);
    });
  });
}
 
/**
 * buildGridCard(a) — Returns HTML string for a grid card
 */
function buildGridCard(a) {
  var faved = isFaved(a.mal_id);
  var img   = getImg(a, 'large');
  return '<div class="gcard" data-id="' + a.mal_id + '">'
    + '<div class="gcard-img"><img src="' + img + '" alt="' + a.title + '" loading="lazy" /></div>'
    + '<div class="gcard-body">'
    + '<p class="gcard-title">' + a.title + '</p>'
    + (a.score ? '<span class="score-tag">&#9733; ' + a.score + '</span>' : '')
    + (a.type  ? '<span class="type-tag">'  + a.type  + '</span>' : '')
    + (a.year  ? '<span class="year-tag">'  + a.year  + '</span>' : '')
    + '<br/>'
    + '<button class="' + (faved ? 'heart-btn-faved' : 'heart-btn') + '" data-heart="' + a.mal_id + '">'
    + (faved ? '&#10084; Saved' : '&#9825; Save')
    + '</button>'
    + '</div>'
    + '</div>';
}
 
/**
 * buildListCard(a) — Returns HTML string for a list card
 */
function buildListCard(a) {
  var faved    = isFaved(a.mal_id);
  var img      = getImg(a, 'small');
  var synopsis = a.synopsis ? a.synopsis.substring(0, 180) + '...' : 'No synopsis available.';
  return '<div class="lcard" data-id="' + a.mal_id + '">'
    + '<div class="lcard-img"><img src="' + img + '" alt="' + a.title + '" loading="lazy"/></div>'
    + '<div class="lcard-info">'
    + '<p class="lcard-title">' + a.title + '</p>'
    + '<p class="lcard-synopsis">' + synopsis + '</p>'
    + (a.score ? '<span class="score-tag">&#9733; ' + a.score + '</span>' : '')
    + (a.type  ? '<span class="type-tag">'  + a.type  + '</span>' : '')
    + (a.year  ? '<span class="year-tag">'  + a.year  + '</span>' : '')
    + '</div>'
    + '<button class="' + (faved ? 'lcard-heart-faved' : 'lcard-heart') + '" data-heart="' + a.mal_id + '">'
    + (faved ? '&#10084;' : '&#9825;')
    + '</button>'
    + '</div>';
}
 
/** Helper — pick image URL */
function getImg(a, size) {
  if (!a.images || !a.images.jpg) return '';
  return size === 'large'
    ? (a.images.jpg.large_image_url || a.images.jpg.image_url || '')
    : (a.images.jpg.image_url || '');
}
 
/**
 * buildPager() — Render numbered pagination buttons
 */
function buildPager() {
  var pager = document.getElementById('pager');
  if (totalPages <= 1) { pager.innerHTML = ''; return; }
 
  var s = Math.max(1, page - 2);
  var e = Math.min(totalPages, page + 2);
 
  var h = '<button class="' + (page === 1 ? 'pbtn-disabled' : 'pbtn') + '"'
        + ' data-p="' + (page - 1) + '" ' + (page === 1 ? 'disabled' : '') + '>&larr; Prev</button>';
 
  if (s > 1) {
    h += '<button class="pbtn" data-p="1">1</button>';
    if (s > 2) h += '<span style="color:#888888;padding:0 6px;font-family:Georgia,serif;">...</span>';
  }
 
  for (var p2 = s; p2 <= e; p2++) {
    h += '<button class="' + (p2 === page ? 'pbtn-active' : 'pbtn') + '" data-p="' + p2 + '">' + p2 + '</button>';
  }
 
  if (e < totalPages) {
    if (e < totalPages - 1) h += '<span style="color:#888888;padding:0 6px;font-family:Georgia,serif;">...</span>';
    h += '<button class="pbtn" data-p="' + totalPages + '">' + totalPages + '</button>';
  }
 
  h += '<button class="' + (page === totalPages ? 'pbtn-disabled' : 'pbtn') + '"'
     + ' data-p="' + (page + 1) + '" ' + (page === totalPages ? 'disabled' : '') + '>Next &rarr;</button>';
 
  pager.innerHTML = h;
 
  // MILESTONE 3 — forEach (HOF) on page buttons
  pager.querySelectorAll('[data-p]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      fetchAnime(parseInt(btn.getAttribute('data-p')));
      window.scrollTo(0, 0);
    });
  });
}
 
/**
 * openModal(a) — Populate and show the detail modal
 */
function openModal(a) {
  document.getElementById('mImg').src = getImg(a, 'large');
  document.getElementById('mTitle').textContent = a.title;
 
  var badges = '';
  if (a.type)   badges += '<span class="modal-badge">' + a.type + '</span>';
  if (a.score)  badges += '<span class="modal-badge-gold">&#9733; ' + a.score + '</span>';
  if (a.status) badges += '<span class="modal-badge-plain">' + a.status + '</span>';
 
  // MILESTONE 3 — Array.slice + forEach (HOFs) on genres
  if (a.genres) {
    a.genres.slice(0, 3).forEach(function (g) {
      badges += '<span class="modal-badge-plain">' + g.name + '</span>';
    });
  }
  document.getElementById('mBadges').innerHTML = badges;
 
  var stats = [
    ['Episodes',   a.episodes   || '—'],
    ['Duration',   a.duration   || '—'],
    ['Year',       a.year       || '—'],
    ['Rank',       a.rank       ? '#' + a.rank       : '—'],
    ['Popularity', a.popularity ? '#' + a.popularity : '—'],
    ['Members',    a.members    ? a.members.toLocaleString() : '—']
  ];
 
  // MILESTONE 3 — Array.map (HOF) on stats
  document.getElementById('mStats').innerHTML = stats.map(function (s) {
    return '<div class="stat-cell">'
      + '<p class="stat-label">' + s[0] + '</p>'
      + '<p class="stat-value">' + s[1] + '</p>'
      + '</div>';
  }).join('');
 
  document.getElementById('mSyn').textContent = a.synopsis || 'No synopsis available.';
  document.getElementById('overlay').className = 'modal-overlay modal-overlay-open';
}
 
document.getElementById('modalClose').addEventListener('click', function () {
  document.getElementById('overlay').className = 'modal-overlay';
});
document.getElementById('overlay').addEventListener('click', function (e) {
  if (e.target === document.getElementById('overlay')) {
    document.getElementById('overlay').className = 'modal-overlay';
  }
});
