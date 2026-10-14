/* ============================================================
   FoodRadar — aplicação (router + views)
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.FR_CONFIG;
  var app = document.getElementById("app");

  /* ============================ estado ============================ */
  var state = {
    query: "",
    category: null,
    sort: "relevancia",
    prices: new Set(),
    features: new Set(),          // delivery | reservation | open
    userLoc: Object.assign({}, CFG.DEFAULT_LOCATION),
    locLabel: CFG.DEFAULT_LOCATION.label,
    locSource: "default",         // default | gps | place
    favorites: loadFavorites(),
    googleCache: {},              // id -> dados enriquecidos do Places
    osm: { key: null, list: [], loading: false, error: false }   // catálogo aberto (OSM)
  };

  function loadFavorites() {
    try { return new Set(JSON.parse(localStorage.getItem("foodradar:favs") || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveFavorites() {
    try { localStorage.setItem("foodradar:favs", JSON.stringify(Array.from(state.favorites))); }
    catch (e) { /* modo privado — segue sem persistir */ }
  }

  /* ============================ utilidades ============================ */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var brl = new Intl.NumberFormat(CFG.CURRENCY.locale, {
    style: "currency", currency: CFG.CURRENCY.code, minimumFractionDigits: 2
  });
  function money(v) { return brl.format(v); }

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    pin: '<path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/>',
    heart: '<path d="M12 20s-7.2-4.4-9-9.1C1.7 7.4 3.6 4.3 6.9 4.3c2 0 3.6 1.2 5.1 3 1.5-1.8 3.1-3 5.1-3 3.3 0 5.2 3.1 3.9 6.6-1.8 4.7-9 9.1-9 9.1z"/>',
    share: '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 10.8l7.2-4.2M8.4 13.2l7.2 4.2"/>',
    star: '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.95z"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16.5 14.5h.01"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    wifi: '<path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10 10 0 0 1 13 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 17V7.5h3a2.75 2.75 0 0 1 0 5.5h-3"/>',
    snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>',
    accessible: '<circle cx="12" cy="4.5" r="1.8"/><path d="M8 8.2l4 1.1 4-1.1M12 9.3V14h3.2l2 4.5M12 14l-2.6 4.8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    paw: '<circle cx="7" cy="9" r="1.9"/><circle cx="12" cy="6.5" r="1.9"/><circle cx="17" cy="9" r="1.9"/><path d="M12 11.5c3 0 5 2.3 5 4.6 0 1.9-1.7 2.9-3.4 2.4-1-.3-2.2-.3-3.2 0-1.7.5-3.4-.5-3.4-2.4 0-2.3 2-4.6 5-4.6z"/>',
    kids: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    glass: '<path d="M6 4h12l-5 7v7M13 18h4M13 18H9"/><path d="M6 4l7 7"/>',
    music: '<circle cx="7" cy="18" r="2.6"/><circle cx="18" cy="16" r="2.6"/><path d="M9.6 18V7l11-2v11"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6.5 15h3"/>',
    phone: '<path d="M6 3.5h3l1.6 4-2 1.4a12 12 0 0 0 6.5 6.5l1.4-2 4 1.6v3c0 1-.8 1.8-1.8 1.7C10.2 19.9 4.1 13.8 3.3 5.3 3.2 4.3 4 3.5 5 3.5z"/>',
    route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.5"/>'
  };

  function svg(name, cls) {
    var p = ICONS[name];
    if (!p) return "";
    return '<svg class="' + (cls || "icon") + '" viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>";
  }

  function toast(msg) {
    var el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () { el.classList.add("show"); });
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  /* ============================ horários ============================ */
  var DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function parseRanges(dayRanges) {
    if (!dayRanges) return [];
    return dayRanges.map(function (r) {
      var p = r.split("-");
      var start = toMinutes(p[0]);
      var end = toMinutes(p[1]);
      if (end <= start) end += 1440;          // atravessa a meia-noite
      return { start: start, end: end, raw: r, open: p[0], close: p[1] };
    });
  }

  /** Retorna { open, label } — "Aberto agora · fecha às 23:00" etc. */
  function openStatus(r, now) {
    now = now || new Date();
    if (!r.hours) return { open: null, label: "Consulte o restaurante" };

    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var prevDay = (day + 6) % 7;

    // faixa de ontem que ainda não terminou
    var carry = parseRanges(r.hours[prevDay]).find(function (x) {
      return x.end > 1440 && (mins + 1440) < x.end;
    });
    if (carry) return { open: true, label: "Aberto agora · fecha às " + carry.close };

    var today = parseRanges(r.hours[day]);
    var current = today.find(function (x) { return mins >= x.start && mins < x.end; });
    if (current) return { open: true, label: "Aberto agora · fecha às " + current.close };

    var later = today.find(function (x) { return x.start > mins; });
    if (later) return { open: false, label: "Fechado · abre às " + later.open };

    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      var next = parseRanges(r.hours[d])[0];
      if (next) {
        var when = i === 1 ? "amanhã" : DAY_NAMES[d].toLowerCase();
        return { open: false, label: "Fechado · abre " + when + " às " + next.open };
      }
    }
    return { open: false, label: "Fechado" };
  }

  function hoursListHTML(r) {
    var today = new Date().getDay();
    var rows = [];
    for (var i = 1; i <= 7; i++) {
      var d = i % 7; // começa na segunda
      var ranges = r.hours && r.hours[d];
      var text = ranges && ranges.length
        ? ranges.map(function (x) { return x.replace("-", " às "); }).join(" / ")
        : '<span class="closed">Fechado</span>';
      rows.push('<li class="' + (d === today ? "today" : "") + '"><span>' + DAY_NAMES[d] + "</span><span>" + text + "</span></li>");
    }
    return '<ul class="hours-list">' + rows.join("") + "</ul>";
  }

  /* ============================ derivações ============================ */
  function priceLevelHTML(level) {
    var out = "";
    for (var i = 1; i <= 4; i++) {
      out += '<span class="' + (i <= level ? "on" : "off") + '">$</span>';
    }
    return '<span class="price-level">' + out + "</span>";
  }

  /* 5 estrelas cinzas + camada dourada recortada na proporção exata
     da nota — 4,7 vira 4 cheias e uma quase cheia, não 5 cheias. */
  function starsHTML(rating) {
    var row = "";
    for (var i = 0; i < 5; i++) row += svg("star");
    var pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    return '<span class="stars" role="img" aria-label="Nota ' + rating.toFixed(1) + ' de 5">' +
      '<span class="stars-bg">' + row + "</span>" +
      '<span class="stars-fg" style="width:' + pct.toFixed(1) + '%">' + row + "</span>" +
      "</span>";
  }

  function cheapestItems(r, n) {
    var all = [];
    r.menu.forEach(function (sec) {
      sec.items.forEach(function (it) { all.push(it); });
    });
    var popular = all.filter(function (i) { return i.popular; });
    var pick = popular.length >= n ? popular : popular.concat(all.filter(function (i) { return !i.popular; }));
    return pick.slice(0, n);
  }

  function menuStats(r) {
    var count = 0, min = Infinity;
    r.menu.forEach(function (sec) {
      sec.items.forEach(function (it) {
        count++;
        if (it.price < min) min = it.price;
      });
    });
    return { count: count, min: min === Infinity ? null : min };
  }

  function distanceOf(r) {
    return window.Maps.haversineKm(state.userLoc, r.coords);
  }

  /* "900 m de você" quando veio do GPS; "a 900 m" quando a pessoa
     escolheu outro lugar — aí a distância não é dela, é do ponto. */
  function distLabel(r) {
    var d = window.Maps.formatDistance(distanceOf(r));
    if (!d) return "";
    return state.locSource === "gps" ? d + " de você" : "a " + d;
  }

  /* Cidade coberta mais próxima do ponto atual (para o estado vazio). */
  function nearestCoveredCity() {
    var best = null;
    Object.keys(window.CITY_INFO).forEach(function (id) {
      var c = window.CITY_INFO[id];
      var km = window.Maps.haversineKm(state.userLoc, c.coords);
      if (!best || km < best.km) best = { id: id, label: c.label, coords: c.coords, km: km };
    });
    return best;
  }

  function countInCity(cityId) {
    return window.RESTAURANTS.filter(function (r) { return r.city === cityId; }).length;
  }

  /* ============ catálogo aberto (OpenStreetMap) ============ */

  /* Restaurantes PRÓPRIOS dentro do raio, sem aplicar filtros.
     É esse número que decide se vale consultar o Overpass. */
  function ownNearbyCount() {
    return window.RESTAURANTS.filter(function (r) {
      var km = distanceOf(r);
      return km == null || km <= CFG.NEARBY_RADIUS_KM;
    }).length;
  }

  /* Só busca no Overpass onde a plataforma ainda não tem catálogo
     próprio — respeita a política de uso do serviço. */
  function ensureOsm(force) {
    var coords = state.userLoc;
    var key = coords.lat.toFixed(2) + "," + coords.lng.toFixed(2);
    if (state.osm.key === key && !force) return;

    state.osm.key = key;
    state.osm.list = [];
    state.osm.error = false;

    if (ownNearbyCount() >= 3) { state.osm.loading = false; return; }

    state.osm.loading = true;
    window.Osm.searchNearby(coords, 2500).then(function (list) {
      if (state.osm.key !== key) return;          // a pessoa já mudou de lugar
      state.osm.list = list;
      state.osm.loading = false;
      if (currentRoute().name === "home") renderHome();
    }).catch(function () {
      if (state.osm.key !== key) return;
      state.osm.loading = false;
      state.osm.error = true;                     // servidores do Overpass fora
      if (currentRoute().name === "home") renderHome();
    });
  }

  /* Aplica os mesmos filtros da home ao catálogo aberto, na medida
     do possível — preço e nota o OSM não tem. */
  function visibleOsm() {
    if (state.prices.size) return [];             // sem faixa de preço no OSM

    var q = norm(state.query).trim();
    var terms = q ? q.split(/\s+/) : [];

    return state.osm.list.filter(function (r) {
      if (state.category && r.categories.indexOf(state.category) < 0) return false;
      if (state.features.has("delivery") && !r.delivery) return false;
      if (state.features.has("reservation") && !r.reservation) return false;
      if (state.features.has("open") && openStatus(r).open !== true) return false;
      if (terms.length) {
        var hay = norm([r.name, r.cuisine, r.address].join(" "));
        if (!terms.every(function (t) { return hay.indexOf(t) >= 0; })) return false;
      }
      return true;
    }).sort(function (a, b) { return (distanceOf(a) || 0) - (distanceOf(b) || 0); });
  }

  /* Busca por id em qualquer uma das duas fontes. */
  function findRestaurant(id) {
    return window.RESTAURANTS.find(function (x) { return x.id === id; }) ||
      state.osm.list.find(function (x) { return x.id === id; });
  }

  function merged(r) {
    var g = state.googleCache[r.id];
    return g ? Object.assign({}, r, g) : r;
  }

  /* ============================ imagem com fallback ============================ */
  var CUISINE_EMOJI = {
    italiana: "\u{1F35D}", japonesa: "\u{1F363}", hamburguer: "\u{1F354}", pizza: "\u{1F355}",
    brasileira: "\u{1F35B}", churrasco: "\u{1F969}", vegetariana: "\u{1F957}", arabe: "\u{1F959}",
    mexicana: "\u{1F32E}", "frutos-do-mar": "\u{1F990}", cafeteria: "☕", doces: "\u{1F370}"
  };

  /* Hash do id inteiro — usar só o primeiro caractere daria a mesma
     cor para todo restaurante vindo do OSM (todos começam com "osm-"). */
  function hueFor(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    return h;
  }

  function placeholderHTML(r) {
    var emoji = CUISINE_EMOJI[r.categories[0]] || "\u{1F37D}";
    return '<div class="ph" style="--ph-hue:' + hueFor(r.name + r.id) + '">' + emoji + "</div>";
  }

  /* O placeholder fica SEMPRE atrás da foto: se a imagem falhar
     (404, offline, CSP), o gradiente aparece sozinho — sem handler inline. */
  function imageHTML(r) {
    var ph = placeholderHTML(r);
    if (!r.photo) return ph;
    return ph + '<img src="' + esc(r.photo) + '" alt="" loading="lazy">';
  }

  /* ============================ filtro + ordenação ============================ */
  function visibleRestaurants() {
    var q = norm(state.query).trim();
    var terms = q ? q.split(/\s+/) : [];

    var list = window.RESTAURANTS.filter(function (r) {
      var km = distanceOf(r);
      if (km != null && km > CFG.NEARBY_RADIUS_KM) return false;
      if (state.category && r.categories.indexOf(state.category) < 0) return false;
      if (state.prices.size && !state.prices.has(r.priceLevel)) return false;
      if (state.features.has("delivery") && !r.delivery) return false;
      if (state.features.has("reservation") && !r.reservation) return false;
      if (state.features.has("open") && openStatus(r).open !== true) return false;

      if (terms.length) {
        var haystack = norm([
          r.name, r.cuisine, r.description, r.address,
          r.highlights.join(" "),
          r.menu.map(function (s) {
            return s.section + " " + s.items.map(function (i) { return i.name + " " + i.description; }).join(" ");
          }).join(" ")
        ].join(" "));
        var all = terms.every(function (t) { return haystack.indexOf(t) >= 0; });
        if (!all) return false;
      }
      return true;
    });

    var sorters = {
      relevancia: function (a, b) {
        return (b.rating * Math.log10(b.reviews + 10)) - (a.rating * Math.log10(a.reviews + 10));
      },
      distancia: function (a, b) { return (distanceOf(a) || 0) - (distanceOf(b) || 0); },
      avaliacao: function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; },
      "preco-asc": function (a, b) { return a.avgPerPerson[0] - b.avgPerPerson[0]; },
      "preco-desc": function (a, b) { return b.avgPerPerson[1] - a.avgPerPerson[1]; }
    };
    return list.sort(sorters[state.sort] || sorters.relevancia);
  }

  /* ============================ card ============================ */
  function cardHTML(r) {
    var st = openStatus(r);
    var dist = distLabel(r);
    var dishes = cheapestItems(r, 2);
    var stats = menuStats(r);
    var fav = state.favorites.has(r.id);

    return '' +
      '<article class="rcard">' +
        '<div class="rcard-media">' +
          '<a class="rcard-media-link" href="#/r/' + esc(r.id) + '" aria-label="' + esc(r.name) + '">' +
            imageHTML(r) +
          "</a>" +
          '<span class="rcard-badge">' + svg("star") + r.rating.toFixed(1).replace(".", ",") +
            '<span class="count">(' + r.reviews + ")</span></span>" +
          (st.open === null ? "" :
            '<span class="rcard-open ' + (st.open ? "is-open" : "is-closed") + '">' + (st.open ? "Aberto" : "Fechado") + "</span>") +
          '<button class="rcard-fav' + (fav ? " is-on" : "") + '" type="button" data-fav="' + esc(r.id) + '" ' +
            'aria-label="Favoritar ' + esc(r.name) + '">' + svg("heart") + "</button>" +
        "</div>" +
        '<div class="rcard-body">' +
          '<a class="rcard-title" href="#/r/' + esc(r.id) + '"><h3>' + esc(r.name) + "</h3></a>" +
          '<div class="rcard-meta">' +
            "<span>" + esc(r.cuisine) + "</span><span class=\"dot\"></span>" +
            priceLevelHTML(r.priceLevel) +
            (dist ? '<span class="dot"></span><span>' + esc(dist) + "</span>" : "") +
          "</div>" +
          '<div class="rcard-dishes">' +
            dishes.map(function (d) {
              return '<div class="rcard-dish"><span>' + esc(d.name) + "</span><span>" + money(d.price) + "</span></div>";
            }).join("") +
          "</div>" +
          '<div class="tags">' +
            r.highlights.slice(0, 3).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") +
          "</div>" +
          '<div class="rcard-foot">' +
            '<span class="rcard-avg">Média <b>' + money(r.avgPerPerson[0]) + "–" + money(r.avgPerPerson[1]) + "</b> por pessoa</span>" +
            "<span>" + stats.count + " itens</span>" +
          "</div>" +
        "</div>" +
      "</article>";
  }

  /* Card do catálogo aberto: sem cardápio, sem nota, sem preço.
     O que ele diz de útil é "esse lugar existe aqui". */
  function osmCardHTML(r) {
    var st = openStatus(r);
    var dist = distLabel(r);
    var fav = state.favorites.has(r.id);

    return '' +
      '<article class="rcard rcard--open">' +
        '<div class="rcard-media">' +
          '<a class="rcard-media-link" href="#/r/' + esc(r.id) + '" aria-label="' + esc(r.name) + '">' +
            placeholderHTML(r) +
          "</a>" +
          '<span class="rcard-src">OpenStreetMap</span>' +
          (st.open === true ? '<span class="rcard-open is-open">Aberto</span>' :
           st.open === false ? '<span class="rcard-open is-closed">Fechado</span>' : "") +
          '<button class="rcard-fav' + (fav ? " is-on" : "") + '" type="button" data-fav="' + esc(r.id) + '" ' +
            'aria-label="Favoritar ' + esc(r.name) + '">' + svg("heart") + "</button>" +
        "</div>" +
        '<div class="rcard-body">' +
          '<a class="rcard-title" href="#/r/' + esc(r.id) + '"><h3>' + esc(r.name) + "</h3></a>" +
          '<div class="rcard-meta">' +
            "<span>" + esc(r.cuisine) + "</span>" +
            (dist ? '<span class="dot"></span><span>' + esc(dist) + "</span>" : "") +
          "</div>" +
          '<div class="rcard-nomenu">' +
            "<strong>Cardápio ainda não cadastrado</strong>" +
            "<span>É o seu restaurante? Cadastre o cardápio e apareça com preço.</span>" +
          "</div>" +
          (r.highlights.length
            ? '<div class="tags">' + r.highlights.slice(0, 3).map(function (t) {
                return '<span class="tag">' + esc(t) + "</span>";
              }).join("") + "</div>"
            : "") +
        "</div>" +
      "</article>";
  }

  /* Seção do catálogo aberto, abaixo dos restaurantes com cardápio. */
  function osmSectionHTML() {
    if (state.osm.loading) {
      return '<div class="osm-block"><div class="osm-head">' +
        "<h3>Procurando restaurantes reais por aqui…</h3>" +
        "<p>Consultando o OpenStreetMap</p></div></div>";
    }

    if (state.osm.error) {
      return '<div class="osm-block"><div class="osm-error">' +
        "<strong>O OpenStreetMap não respondeu agora</strong>" +
        "<span>Os servidores públicos do Overpass são mantidos por voluntários e " +
        "vivem sobrecarregados. Costuma voltar em alguns minutos.</span>" +
        '<button class="btn btn--ghost" type="button" id="osmRetry">Tentar de novo</button>' +
      "</div></div>";
    }

    var list = visibleOsm();
    if (!list.length) return "";

    return '<div class="osm-block">' +
      '<div class="osm-head">' +
        "<h3>Também por perto</h3>" +
        "<p>" + list.length + " lugares reais do OpenStreetMap — ainda sem cardápio no FoodRadar</p>" +
      "</div>" +
      '<div class="grid">' + list.map(osmCardHTML).join("") + "</div>" +
    "</div>";
  }

  /* Dois vazios diferentes: "filtro não achou nada" e
     "a plataforma ainda não cobre essa região". */
  function emptyHTML() {
    var anyNearby = window.RESTAURANTS.some(function (r) {
      var km = distanceOf(r);
      return km == null || km <= CFG.NEARBY_RADIUS_KM;
    });

    if (!anyNearby) {
      var near = nearestCoveredCity();
      return '<div class="empty"><div class="big">\u{1F5FA}️</div>' +
        "<h3>Ainda não chegamos em " + esc(state.locLabel.split(",")[0]) + "</h3>" +
        "<p>Por enquanto os cardápios são de " +
          Object.keys(window.CITY_INFO).map(function (id) {
            return esc(window.CITY_INFO[id].label.split(",")[0]);
          }).join(", ") + ".</p>" +
        '<button class="btn btn--brand" type="button" data-goto-city="' + esc(near.id) + '">' +
          "Ver " + countInCity(near.id) + " restaurantes em " + esc(near.label.split(",")[0]) +
          " · a " + Math.round(near.km) + " km</button></div>";
    }

    return '<div class="empty"><div class="big">\u{1F50D}</div><h3>Nada encontrado</h3>' +
      "<p>Tente outro termo ou limpe os filtros.</p>" +
      '<button class="btn" type="button" id="clearAll">Limpar filtros</button></div>';
  }

  /* ============================ view: home ============================ */
  function renderHome() {
    ensureOsm();
    var list = visibleRestaurants();
    var total = window.RESTAURANTS.length;
    var itemsTotal = window.RESTAURANTS.reduce(function (acc, r) { return acc + menuStats(r).count; }, 0);
    var filtering = !!(state.query || state.category || state.prices.size || state.features.size);

    app.innerHTML = '' +
      '<section class="hero"><div class="container">' +
        "<h1>Descubra restaurantes com <em>cardápio completo</em> e preço na mesa</h1>" +
        "<p>Chega de “consulte o valor”. Veja o menu inteiro, o preço de cada prato e a média por pessoa antes de sair de casa.</p>" +
        '<form class="hero-search" id="heroSearch">' +
          svg("search") +
          '<input id="heroSearchInput" type="search" placeholder="Buscar por restaurante, prato ou tipo de cozinha" value="' + esc(state.query) + '" autocomplete="off">' +
          "<button type=\"submit\">Buscar</button>" +
        "</form>" +
        '<div class="hero-stats">' +
          '<div class="hero-stat"><b>' + total + "</b>restaurantes</div>" +
          '<div class="hero-stat"><b>' + itemsTotal + "</b>pratos com preço</div>" +
          '<div class="hero-stat"><b>100%</b>cardápios completos</div>' +
        "</div>" +
      "</div></section>" +

      '<section class="section"><div class="container">' +
        '<div class="section-head"><h2>Categorias</h2>' +
          (state.category ? '<button class="sub" id="clearCat" type="button">Limpar categoria</button>' : "") +
        "</div>" +
        '<div class="cats">' +
          window.CATEGORIES.map(function (c) {
            return '<button class="cat' + (state.category === c.id ? " is-active" : "") + '" type="button" data-cat="' + esc(c.id) + '">' +
              '<span class="cat-emoji">' + c.emoji + "</span>" +
              '<span class="cat-name">' + esc(c.name) + "</span></button>";
          }).join("") +
        "</div>" +
      "</div></section>" +

      '<section class="section" style="padding-top:6px"><div class="container">' +
        '<div class="section-head">' +
          "<h2>" + (filtering ? "Resultados"
            : state.locSource === "gps" ? "Populares perto de você"
            : "Populares em " + esc(state.locLabel.split(",")[0])) + "</h2>" +
          '<span class="sub">' + list.length + (list.length === 1 ? " lugar" : " lugares") + " · " + esc(state.locLabel) + "</span>" +
        "</div>" +

        '<div class="filters">' +
          '<button class="chip' + (state.features.has("open") ? " is-active" : "") + '" type="button" data-feat="open">Aberto agora</button>' +
          '<button class="chip' + (state.features.has("delivery") ? " is-active" : "") + '" type="button" data-feat="delivery">Delivery</button>' +
          '<button class="chip' + (state.features.has("reservation") ? " is-active" : "") + '" type="button" data-feat="reservation">Aceita reserva</button>' +
          [1, 2, 3, 4].map(function (p) {
            return '<button class="chip' + (state.prices.has(p) ? " is-active" : "") + '" type="button" data-price="' + p + '">' +
              new Array(p + 1).join("$") + "</button>";
          }).join("") +
          '<span class="filters-spacer"></span>' +
          '<span class="select-wrap"><select id="sortSel" aria-label="Ordenar por">' +
            '<option value="relevancia">Relevância</option>' +
            '<option value="distancia">Mais perto</option>' +
            '<option value="avaliacao">Melhor avaliados</option>' +
            '<option value="preco-asc">Menor preço</option>' +
            '<option value="preco-desc">Maior preço</option>' +
          "</select>" + svg("chevron") + "</span>" +
        "</div>" +

        (list.length
          ? '<div class="grid">' + list.map(cardHTML).join("") + "</div>"
          : (state.osm.loading || state.osm.error || visibleOsm().length)
            ? '<div class="osm-note">Nenhum restaurante com cardápio cadastrado em ' +
              esc(state.locLabel.split(",")[0]) + " ainda — mas a região existe no mapa:</div>"
            : emptyHTML()) +

        osmSectionHTML() +
      "</div></section>";

    var sel = document.getElementById("sortSel");
    if (sel) sel.value = state.sort;
    window.scrollTo(0, 0);
  }

  /* Painel que substitui o cardápio num restaurante vindo do OSM.
     É a porta de entrada do lado B da plataforma: o dono cadastra. */
  function noMenuPanelHTML(r) {
    return '<section class="panel nomenu-panel">' +
      '<div class="nomenu-ico">' + svg("wallet", "icon") + "</div>" +
      "<h2>Cardápio ainda não cadastrado</h2>" +
      "<p>Sabemos que o <strong>" + esc(r.name) + "</strong> existe e onde ele fica — " +
      "essa informação vem do OpenStreetMap, um mapa aberto mantido por voluntários. " +
      "O que ainda falta é o que o FoodRadar faz de diferente: cada prato com o preço na tela.</p>" +
      '<div class="nomenu-cta">' +
        '<button class="btn btn--brand" type="button" id="claimBtn">Sou o dono, quero cadastrar</button>' +
        (r.website
          ? '<a class="btn btn--ghost" href="' + esc(r.website) + '" target="_blank" rel="noopener noreferrer">Ver site do restaurante</a>'
          : "") +
      "</div>" +
    "</section>";
  }

  /* ============================ view: restaurante ============================ */
  function renderRestaurant(id) {
    var notFound = '<div class="container" style="padding:80px 0"><div class="empty">' +
      '<div class="big">\u{1F37D}</div><h3>Restaurante não encontrado</h3>' +
      '<p>O link pode estar desatualizado.</p><a class="btn" href="#/">Voltar para a busca</a></div></div>';

    var base = findRestaurant(id);

    if (!base) {
      // Link direto para um restaurante do OSM: busca o elemento pelo id.
      if (/^osm-/.test(id)) {
        app.innerHTML = '<div class="container" style="padding:80px 0"><div class="empty">' +
          '<div class="big">\u{1F5FA}️</div><h3>Carregando…</h3>' +
          "<p>Buscando esse lugar no OpenStreetMap.</p></div></div>";

        window.Osm.fetchById(id).then(function (r) {
          state.osm.list = state.osm.list.concat([r]);
          if (currentRoute().id === id) renderRestaurant(id);
        }).catch(function () {
          if (currentRoute().id === id) app.innerHTML = notFound;
        });
        return;
      }
      app.innerHTML = notFound;
      return;
    }

    var isOsm = base.source === "osm";
    var r = merged(base);
    var st = r.openNow != null
      ? { open: r.openNow, label: r.openNow ? "Aberto agora" : "Fechado agora" }
      : openStatus(r);
    var dist = distLabel(r);
    var stats = menuStats(r);
    var fav = state.favorites.has(r.id);

    app.innerHTML = '' +
      '<div class="rhero">' +
        '<a class="rhero-back" href="#/">' + svg("back") + "Voltar</a>" +
        imageHTML(r) +
      "</div>" +

      '<div class="container rwrap">' +
        '<header class="rhead">' +
          '<div class="rhead-main">' +
            "<h1>" + esc(r.name) + "</h1>" +
            '<div class="rhead-meta">' +
              (r.rating != null
                ? starsHTML(r.rating) +
                  '<span class="rating-num">' + r.rating.toFixed(1).replace(".", ",") + "</span>" +
                  '<span class="rating-count">(' + r.reviews + ")</span>" +
                  '<span class="dot"></span>'
                : '<span class="src-badge">' + svg("pin") + "OpenStreetMap</span><span class=\"dot\"></span>") +
              "<span>" + esc(r.cuisine) + "</span>" +
              (r.priceLevel ? '<span class="dot"></span>' + priceLevelHTML(r.priceLevel) : "") +
            "</div>" +
            (r.description ? '<p class="rhead-desc">' + esc(r.description) + "</p>" : "") +
            '<div class="tags">' +
              r.highlights.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") +
            "</div>" +
          "</div>" +
          '<div class="rhead-actions">' +
            '<button class="icon-btn" type="button" id="shareBtn" aria-label="Compartilhar">' + svg("share") + "</button>" +
            '<button class="icon-btn' + (fav ? " is-on" : "") + '" type="button" data-fav="' + esc(r.id) + '" aria-label="Favoritar">' + svg("heart") + "</button>" +
          "</div>" +
        "</header>" +

        '<div class="rbody">' +
          (isOsm ? noMenuPanelHTML(r) : '<section class="panel">' +
            "<h2>Cardápio</h2>" +
            '<span class="sub" style="color:var(--muted);font-size:13.5px">' + stats.count +
              " itens · a partir de " + money(stats.min) + "</span>" +
            '<nav class="menu-nav">' +
              r.menu.map(function (s, i) {
                return '<a href="#sec-' + i + '" data-sec="' + i + '">' + esc(s.section) + "</a>";
              }).join("") +
            "</nav>" +
            r.menu.map(function (s, i) {
              return '<div class="msection" id="sec-' + i + '">' +
                '<div class="msection-head"><h3>' + esc(s.section) + "</h3>" +
                  '<span class="count">(' + s.items.length + (s.items.length === 1 ? " opção" : " opções") + ")</span></div>" +
                s.items.map(function (it) {
                  return '<div class="mitem"><div class="mitem-main">' +
                      '<div class="mitem-name"><strong>' + esc(it.name) + "</strong>" +
                        (it.popular ? '<span class="pill">Popular</span>' : "") +
                        (it.veg ? '<span class="pill pill--veg">Vegetariano</span>' : "") +
                      "</div>" +
                      '<p class="mitem-desc">' + esc(it.description) + "</p>" +
                    "</div>" +
                    '<div class="mitem-price">' + money(it.price) + "</div>" +
                  "</div>";
                }).join("") +
              "</div>";
            }).join("") +
          "</section>") +

          '<aside class="panel panel--flush">' +
            '<div class="side-block">' +
              '<div class="map-box" id="mapBox"></div>' +
              '<h3 class="side-title">' + svg("pin") + "Localização</h3>" +
              (r.address
                ? "<p>" + esc(r.address) + "</p>"
                : '<p class="side-sub">Endereço não informado no OpenStreetMap</p>') +
              (dist ? '<p class="side-sub">' + esc(dist) + "</p>" : "") +
            "</div>" +

            '<div class="side-block">' +
              '<h3 class="side-title">' + svg("clock") + "Horário de atendimento</h3>" +
              (r.hours
                ? '<span class="status ' + (st.open ? "open" : "closed") + '">' + esc(st.label) + "</span>" +
                  '<div id="hoursWrap" hidden>' + hoursListHTML(r) + "</div>" +
                  '<button class="hours-toggle" type="button" id="hoursToggle">Ver semana completa</button>'
                : r.hoursRaw
                  ? '<p>' + esc(r.hoursRaw) + '</p><p class="side-sub">Como está registrado no OpenStreetMap</p>'
                  : '<p class="side-sub">Não informado — confirme com o restaurante</p>') +
            "</div>" +

            (r.avgPerPerson
              ? '<div class="side-block">' +
                  '<h3 class="side-title">' + svg("wallet") + "Faixa de preço</h3>" +
                  '<div class="avg-row"><span class="big">' + money(r.avgPerPerson[0]) + " – " + money(r.avgPerPerson[1]) + "</span></div>" +
                  '<p class="side-sub">Média por pessoa, sem bebidas alcoólicas</p>' +
                "</div>"
              : "") +

            (r.facilities.length
              ? '<div class="side-block">' +
                  '<h3 class="side-title">' + svg("sparkle") + "Facilidades</h3>" +
                  '<div class="facilities">' +
                    r.facilities.map(function (f) {
                      var meta = window.FACILITIES[f];
                      if (!meta) return "";
                      return '<span class="fac">' + svg(meta.icon) + esc(meta.label) + "</span>";
                    }).join("") +
                  "</div>" +
                "</div>"
              : "") +

            '<div class="side-cta">' +
              '<a class="btn btn--brand" href="' + esc(window.Maps.directionsUrl(r)) + '" target="_blank" rel="noopener">' +
                svg("route") + "Como chegar</a>" +
              (r.phone ? '<a class="btn btn--ghost" href="tel:' + esc(r.phone.replace(/\D/g, "")) + '">' + svg("phone") + esc(r.phone) + "</a>" : "") +
            "</div>" +
          "</aside>" +
        "</div>" +
      "</div>";

    window.scrollTo(0, 0);
    window.Maps.renderMap(document.getElementById("mapBox"), r.coords, r.name);

    // Enriquecimento assíncrono com o Google Places (se houver API key)
    if (!isOsm && window.Maps.hasKey() && !state.googleCache[base.id]) {
      window.Maps.enrich(base).then(function (data) {
        if (!data) return;
        state.googleCache[base.id] = data;
        if (currentRoute().id === base.id) renderRestaurant(base.id);
      });
    }
  }

  /* ============================ router ============================ */
  function currentRoute() {
    var h = location.hash.replace(/^#/, "");
    // Permite semear a rota inicial (deep link renderizado sem hash).
    if (!h && window.FR_INITIAL_ROUTE) return window.FR_INITIAL_ROUTE;
    var m = h.match(/^\/r\/([\w-]+)/);
    return m ? { name: "restaurant", id: m[1] } : { name: "home" };
  }

  function render() {
    var route = currentRoute();
    if (route.name === "restaurant") renderRestaurant(route.id);
    else renderHome();
  }

  /* ============================ eventos ============================ */
  document.addEventListener("click", function (e) {
    var el;

    if ((el = e.target.closest("[data-cat]"))) {
      var cat = el.getAttribute("data-cat");
      state.category = state.category === cat ? null : cat;
      return render();
    }
    if (e.target.closest("#clearCat")) { state.category = null; return render(); }

    if ((el = e.target.closest("[data-feat]"))) {
      var f = el.getAttribute("data-feat");
      state.features.has(f) ? state.features.delete(f) : state.features.add(f);
      return render();
    }
    if ((el = e.target.closest("[data-price]"))) {
      var p = parseInt(el.getAttribute("data-price"), 10);
      state.prices.has(p) ? state.prices.delete(p) : state.prices.add(p);
      return render();
    }
    if ((el = e.target.closest("[data-goto-city]"))) {
      var info = window.CITY_INFO[el.getAttribute("data-goto-city")];
      if (info) setLocation(info.coords, info.label, "place");
      return;
    }
    if (e.target.closest("#clearAll")) {
      state.query = ""; state.category = null; state.prices.clear(); state.features.clear();
      document.getElementById("headerSearchInput").value = "";
      return render();
    }

    if ((el = e.target.closest("[data-fav]"))) {
      e.preventDefault();
      var id = el.getAttribute("data-fav");
      if (state.favorites.has(id)) { state.favorites.delete(id); toast("Removido dos favoritos"); }
      else { state.favorites.add(id); toast("Salvo nos favoritos"); }
      saveFavorites();
      el.classList.toggle("is-on");
      return;
    }

    if (e.target.closest("#hoursToggle")) {
      var wrap = document.getElementById("hoursWrap");
      var btn = document.getElementById("hoursToggle");
      wrap.hidden = !wrap.hidden;
      btn.textContent = wrap.hidden ? "Ver semana completa" : "Ocultar horários";
      return;
    }

    if (e.target.closest("#osmRetry")) {
      ensureOsm(true);
      renderHome();
      return;
    }

    if (e.target.closest("#claimBtn")) {
      toast("Protótipo: aqui entraria o cadastro do restaurante");
      return;
    }

    if (e.target.closest("#shareBtn")) {
      var url = location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () { toast("Link copiado"); });
      }
      return;
    }

    // âncoras internas do cardápio
    if ((el = e.target.closest("[data-sec]"))) {
      e.preventDefault();
      var target = document.getElementById("sec-" + el.getAttribute("data-sec"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.id === "headerSearchInput" || e.target.id === "heroSearchInput") {
      state.query = e.target.value;
      if (currentRoute().name !== "home") { location.hash = "#/"; return; }
      renderHome();
      var focusId = e.target.id;
      var again = document.getElementById(focusId);
      if (again) {
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }
      var header = document.getElementById("headerSearchInput");
      if (header && focusId !== "headerSearchInput") header.value = state.query;
    }
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "heroSearch" || e.target.id === "headerSearchForm") {
      e.preventDefault();
      if (currentRoute().name !== "home") location.hash = "#/";
      else renderHome();
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "sortSel") { state.sort = e.target.value; renderHome(); }
  });

  /* ============================================================
     Tema claro / escuro
     Sem escolha salva, segue o sistema (o CSS resolve sozinho via
     prefers-color-scheme). O botão grava uma escolha explícita, que
     passa a valer mesmo se o sistema mudar depois.
     ============================================================ */
  var THEME_KEY = "foodradar:theme";

  function storedTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      return (t === "dark" || t === "light") ? t : null;
    } catch (e) { return null; }
  }

  function effectiveTheme() {
    var chosen = storedTheme();
    if (chosen) return chosen;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark" : "light";
  }

  document.getElementById("themeBtn").addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* modo privado */ }
    toast(next === "dark" ? "Tema escuro" : "Tema claro");
  });

  /* ============================================================
     Seletor de localização
     Duas formas de escolher o ponto de partida:
       1. GPS do navegador ("estou aqui")
       2. Busca com sugestões ("quero ver o Rio")
     ============================================================ */
  var locChip  = document.getElementById("locChip");
  var locPop   = document.getElementById("locPop");
  var locInput = document.getElementById("locInput");
  var locList  = document.getElementById("locList");
  var locHint  = document.getElementById("locHint");
  var locLabel = document.getElementById("locLabel");

  var suggestions = [];      // sugestões atualmente na tela
  var searchTimer = null;
  var searchSeq = 0;         // descarta respostas fora de ordem

  function openLoc() {
    locPop.hidden = false;
    locChip.setAttribute("aria-expanded", "true");
    locInput.value = "";
    renderSuggestions(coveredCitySuggestions());
    locHint.hidden = window.Maps.hasKey();
    locHint.textContent = window.Maps.hasKey() ? "" :
      "Sem chave do Google Maps: a busca usa a lista de cidades de js/data.js.";
    locInput.focus();
  }

  function closeLoc() {
    if (locPop.hidden) return;
    locPop.hidden = true;
    locChip.setAttribute("aria-expanded", "false");
  }

  /* Atalho: as cidades que já têm cardápio cadastrado. */
  function coveredCitySuggestions() {
    return Object.keys(window.CITY_INFO).map(function (id) {
      var c = window.CITY_INFO[id];
      var parts = c.label.split(", ");
      return {
        id: "city:" + id,
        main: parts[0],
        secondary: (parts[1] || "") + ", Brasil",
        coords: c.coords,
        count: countInCity(id)
      };
    });
  }

  function renderSuggestions(items, loading) {
    suggestions = items || [];

    if (loading) {
      locList.innerHTML = '<li class="loc-empty">Buscando…</li>';
      return;
    }
    if (!suggestions.length) {
      locList.innerHTML = '<li class="loc-empty">Nenhum lugar encontrado</li>';
      return;
    }

    locList.innerHTML = suggestions.map(function (s, i) {
      return "<li>" +
        '<button type="button" data-loc-pick="' + i + '">' +
          svg("pin") +
          '<span class="loc-opt-txt">' +
            '<span class="loc-opt-main">' + esc(s.main) + "</span>" +
            (s.secondary ? '<span class="loc-opt-sub">' + esc(s.secondary) + "</span>" : "") +
          "</span>" +
          (s.count ? '<span class="loc-opt-count">' + s.count + " lugares</span>" : "") +
        "</button></li>";
    }).join("");
  }

  function setLocation(coords, label, source) {
    state.userLoc = coords;
    state.locLabel = label;
    state.locSource = source;
    locLabel.textContent = label;
    if (source === "gps") state.sort = "distancia";
    closeLoc();
    if (currentRoute().name !== "home") location.hash = "#/";
    else render();
  }

  locChip.addEventListener("click", function () {
    if (locPop.hidden) openLoc(); else closeLoc();
  });

  /* GPS */
  document.getElementById("locGps").addEventListener("click", function () {
    var btn = this;
    btn.disabled = true;
    locLabel.textContent = "Localizando…";

    window.Maps.getUserLocation().then(function (coords) {
      return window.Maps.reverseGeocode(coords)
        .catch(function () { return null; })
        .then(function (name) { return { coords: coords, name: name }; });
    }).then(function (res) {
      btn.disabled = false;
      setLocation(res.coords, res.name || "Perto de você", "gps");
      toast("Distâncias recalculadas a partir de onde você está");
    }).catch(function () {
      btn.disabled = false;
      locLabel.textContent = state.locLabel;
      toast("Não consegui acessar sua localização");
    });
  });

  /* digitação com debounce */
  locInput.addEventListener("input", function () {
    var value = this.value.trim();
    clearTimeout(searchTimer);

    if (!value) { renderSuggestions(coveredCitySuggestions()); return; }

    var seq = ++searchSeq;
    renderSuggestions(null, true);
    searchTimer = setTimeout(function () {
      window.Maps.searchPlaces(value).then(function (items) {
        if (seq !== searchSeq) return;         // chegou atrasada, ignora
        renderSuggestions(items);
      });
    }, 220);
  });

  locInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeLoc(); locChip.focus(); }
    if (e.key === "Enter") {
      e.preventDefault();
      var first = locList.querySelector("[data-loc-pick]");
      if (first) first.click();
    }
  });

  /* escolha de uma sugestão */
  locList.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-loc-pick]");
    if (!btn) return;

    var s = suggestions[parseInt(btn.getAttribute("data-loc-pick"), 10)];
    if (!s) return;

    if (s.coords) {
      var uf = (s.secondary || "").split(",")[0].trim();
      setLocation(s.coords, uf ? s.main + ", " + uf : s.main, "place");
      return;
    }

    btn.disabled = true;
    window.Maps.resolvePlace(s).then(function (place) {
      setLocation(place.coords, place.label, "place");
    }).catch(function () {
      btn.disabled = false;
      toast("Não consegui localizar esse lugar");
    });
  });

  /* fechar ao clicar fora ou apertar Esc */
  document.addEventListener("click", function (e) {
    if (!locPop.hidden && !e.target.closest(".loc-wrap")) closeLoc();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLoc();
  });

  window.addEventListener("hashchange", render);
  render();
})();
