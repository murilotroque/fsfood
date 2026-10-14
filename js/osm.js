/* ============================================================
   FoodRadar — catálogo aberto (OpenStreetMap via Overpass API)
   ------------------------------------------------------------
   Cobre o Brasil inteiro sem chave e sem cartão. Entrega o que
   o OSM sabe: nome, tipo de cozinha, coordenada, e às vezes
   endereço, telefone e horário.

   NÃO entrega cardápio nem preço — esses continuam sendo dado
   próprio da plataforma. Um restaurante vindo daqui aparece
   marcado como "cardápio ainda não cadastrado".

   IMPORTANTE — política de uso:
   O Overpass é mantido por voluntários. Este arquivo só o
   consulta quando a região não tem NENHUM restaurante próprio
   cadastrado, guarda o resultado por 24h no localStorage e faz
   no máximo uma requisição por vez. Em produção o certo é rodar
   isso offline, uma vez, e gravar no seu banco — não do
   navegador de cada visitante.
   ============================================================ */
(function (global) {
  "use strict";

  /* Instâncias públicas com cobertura MUNDIAL, tentadas em ordem.
     São servidores voluntários e vivem sobrecarregados — quando um
     devolve 504 ou uma página de erro sem cabeçalho CORS, o navegador
     reporta "Failed to fetch"; por isso mais de um espelho.

     Atenção ao acrescentar espelhos: vários são REGIONAIS (o
     overpass.osm.ch, por exemplo, só tem a Suíça). Um espelho regional
     responde HTTP 200 com zero elementos, e o app conclui que não
     existe restaurante nenhum na região — pior que um erro. */
  var ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];

  var CACHE_PREFIX = "foodradar:osm:";
  var CACHE_TTL_MS = 24 * 60 * 60 * 1000;
  var inFlight = null;

  /* ---------- tradução de tags do OSM para o vocabulário do app ---------- */

  var CUISINE_TO_CATEGORY = {
    italian: "italiana", pizza: "pizza", pasta: "italiana",
    japanese: "japonesa", sushi: "japonesa", ramen: "japonesa", asian: "japonesa",
    burger: "hamburguer", american: "hamburguer", sandwich: "hamburguer",
    brazilian: "brasileira", regional: "brasileira", mineira: "brasileira",
    barbecue: "churrasco", steak_house: "churrasco", churrascaria: "churrasco",
    vegetarian: "vegetariana", vegan: "vegetariana", salad: "vegetariana",
    arab: "arabe", lebanese: "arabe", kebab: "arabe", turkish: "arabe",
    mexican: "mexicana", "tex-mex": "mexicana",
    seafood: "frutos-do-mar", fish: "frutos-do-mar",
    coffee_shop: "cafeteria", coffee: "cafeteria", breakfast: "cafeteria",
    cake: "doces", ice_cream: "doces", dessert: "doces", donut: "doces",
    bakery: "doces", chocolate: "doces"
  };

  var CUISINE_LABEL = {
    italiana: "Italiana", pizza: "Pizza", japonesa: "Japonesa",
    hamburguer: "Hambúrguer", brasileira: "Brasileira", churrasco: "Churrasco",
    vegetariana: "Vegetariana", arabe: "Árabe", mexicana: "Mexicana",
    "frutos-do-mar": "Frutos do mar", cafeteria: "Cafeteria", doces: "Doces"
  };

  var AMENITY_LABEL = {
    restaurant: "Restaurante",
    cafe: "Cafeteria",
    fast_food: "Lanchonete",
    bar: "Bar",
    ice_cream: "Sorveteria"
  };

  /* ---------- horário: formato OSM -> array de 7 dias do app ----------
     Cobre os padrões comuns ("Mo-Sa 10:00-22:00; Su 16:00-22:00",
     "Mo-Su 09:00-21:00", "24/7", "Tu-Fr 12:00-15:00,19:00-23:00").
     Qualquer coisa mais exótica devolve null e a UI mostra o texto cru. */

  var DAY_INDEX = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };
  var DAY_ORDER = ["su", "mo", "tu", "we", "th", "fr", "sa"];

  function expandDays(token) {
    var out = [];
    var ok = true;

    token.split(",").forEach(function (part) {
      part = part.trim().toLowerCase();
      var range = part.split("-");

      if (range.length === 2) {
        var from = DAY_INDEX[range[0]], to = DAY_INDEX[range[1]];
        if (from === undefined || to === undefined) { ok = false; return; }
        for (var i = 0; i < 7; i++) {
          var d = (from + i) % 7;
          out.push(d);
          if (d === to) break;
        }
      } else {
        var single = DAY_INDEX[part];
        if (single === undefined) { ok = false; return; }   // PH, SH, etc.
        out.push(single);
      }
    });

    return ok && out.length ? out : null;
  }

  function padTime(t) {
    var p = t.split(":");
    return (p[0].length === 1 ? "0" + p[0] : p[0]) + ":" + p[1];
  }

  function parseOpeningHours(raw) {
    if (!raw) return null;
    var s = String(raw).trim();

    if (s === "24/7") {
      return [0, 1, 2, 3, 4, 5, 6].map(function () { return ["00:00-24:00"]; });
    }

    var week = [null, null, null, null, null, null, null];
    var matched = false;

    s.split(";").forEach(function (rule) {
      rule = rule.trim();
      if (!rule) return;

      var m = rule.match(/^([A-Za-z]{2}(?:\s*[-,]\s*[A-Za-z]{2})*)\s+(.+)$/);
      if (!m) return;

      var days = expandDays(m[1]);
      if (!days) return;                       // regra de feriado, ignora

      var timePart = m[2].trim();
      if (/^(off|closed)$/i.test(timePart)) {
        days.forEach(function (d) { week[d] = null; });
        matched = true;
        return;
      }

      var ranges = timePart.split(",")
        .map(function (t) { return t.trim(); })
        .filter(function (t) { return /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(t); })
        .map(function (t) {
          var pair = t.split("-");
          return padTime(pair[0].trim()) + "-" + padTime(pair[1].trim());
        });

      if (!ranges.length) return;
      days.forEach(function (d) { week[d] = (week[d] || []).concat(ranges); });
      matched = true;
    });

    return matched ? week : null;
  }

  /* ---------- normalização de um elemento do Overpass ---------- */

  function buildAddress(tags) {
    var street = tags["addr:street"];
    var number = tags["addr:housenumber"];
    var suburb = tags["addr:suburb"] || tags["addr:neighbourhood"];
    var city = tags["addr:city"];
    var uf = tags["addr:state"];

    if (!street && !city) return "";

    var line = street ? (number ? street + ", " + number : street) : "";
    var tail = [suburb, city].filter(Boolean).join(", ");
    var out = [line, tail].filter(Boolean).join(" - ");
    return uf ? out + " - " + uf : out;
  }

  function toRestaurant(el) {
    var tags = el.tags || {};
    if (!tags.name) return null;

    var lat = el.lat != null ? el.lat : (el.center && el.center.lat);
    var lng = el.lon != null ? el.lon : (el.center && el.center.lon);
    if (lat == null || lng == null) return null;

    // cuisine pode vir como "pizza;italian" — pega o primeiro que conhecemos
    var categories = [];
    String(tags.cuisine || "").split(";").forEach(function (c) {
      var cat = CUISINE_TO_CATEGORY[c.trim().toLowerCase()];
      if (cat && categories.indexOf(cat) < 0) categories.push(cat);
    });
    if (!categories.length && tags.amenity === "cafe") categories.push("cafeteria");

    var cuisineLabel = categories.length
      ? CUISINE_LABEL[categories[0]]
      : (AMENITY_LABEL[tags.amenity] || "Restaurante");

    var facilities = [];
    if (tags.internet_access === "wlan" || tags.internet_access === "yes") facilities.push("wifi");
    if (tags.outdoor_seating === "yes") facilities.push("outdoor");
    if (tags.wheelchair === "yes") facilities.push("accessible");
    if (tags.air_conditioning === "yes") facilities.push("ac");
    if (tags["payment:cards"] === "yes" || tags["payment:credit_cards"] === "yes") facilities.push("cards");

    var highlights = [];
    if (tags.delivery === "yes") highlights.push("Delivery");
    if (tags.takeaway === "yes") highlights.push("Para viagem");
    if (tags.outdoor_seating === "yes") highlights.push("Área externa");
    if (tags.reservation === "yes") highlights.push("Aceita reserva");

    var hours = parseOpeningHours(tags.opening_hours);

    return {
      id: "osm-" + el.type.charAt(0) + el.id,
      source: "osm",
      name: tags.name,
      cuisine: cuisineLabel,
      categories: categories,
      rating: null,
      reviews: 0,
      priceLevel: 0,
      avgPerPerson: null,
      description: "",
      highlights: highlights,
      facilities: facilities,
      address: buildAddress(tags),
      city: null,
      coords: { lat: lat, lng: lng },
      placeId: "",
      phone: tags.phone || tags["contact:phone"] || "",
      website: tags.website || tags["contact:website"] || "",
      delivery: tags.delivery === "yes",
      reservation: tags.reservation === "yes",
      photo: "",
      hours: hours,
      hoursRaw: hours ? "" : (tags.opening_hours || ""),
      menu: []
    };
  }

  /* ---------- cache ---------- */

  function cacheKey(coords, radius) {
    return CACHE_PREFIX + coords.lat.toFixed(2) + "," + coords.lng.toFixed(2) + ":" + radius;
  }

  function readCache(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.t > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }
      return parsed.list;
    } catch (e) { return null; }
  }

  function writeCache(key, list) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), list: list })); }
    catch (e) { /* cota cheia ou modo privado — segue sem cache */ }
  }

  /* ---------- consulta ---------- */

  function buildQuery(coords, radius) {
    var filter = '["amenity"~"^(restaurant|cafe|fast_food)$"]["name"]';
    var around = "(around:" + radius + "," + coords.lat + "," + coords.lng + ")";
    return "[out:json][timeout:25];(" +
      "node" + filter + around + ";" +
      "way" + filter + around + ";" +
      ");out center 60;";
  }

  function fetchFrom(endpoint, query) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, 20000);

    return fetch(endpoint + "?data=" + encodeURIComponent(query), {
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error("http-" + res.status);
      return res.json();
    });
  }

  /* Tenta os espelhos em sequência; só desiste quando todos falham. */
  function fetchWithMirrors(query) {
    return ENDPOINTS.reduce(function (chain, endpoint) {
      return chain.catch(function () { return fetchFrom(endpoint, query); });
    }, Promise.reject(new Error("start")));
  }

  /**
   * Restaurantes reais num raio ao redor do ponto.
   * @param {{lat:number,lng:number}} coords
   * @param {number} radius metros (padrão 2500)
   * @returns {Promise<Array>} lista normalizada (pode vir vazia).
   *          Rejeita se nenhum espelho do Overpass respondeu.
   */
  function searchNearby(coords, radius) {
    radius = radius || 2500;

    var key = cacheKey(coords, radius);
    var cached = readCache(key);
    if (cached) return Promise.resolve(cached);

    if (inFlight) return inFlight;           // uma requisição por vez

    var query = buildQuery(coords, radius);

    inFlight = fetchWithMirrors(query)
      .then(function (data) {
        var list = (data.elements || [])
          .map(toRestaurant)
          .filter(Boolean);

        // sem duplicar nome no mesmo quarteirão
        var seen = {};
        list = list.filter(function (r) {
          var k = r.name.toLowerCase() + "|" + r.coords.lat.toFixed(3);
          if (seen[k]) return false;
          seen[k] = true;
          return true;
        });

        writeCache(key, list);
        inFlight = null;
        return list;
      })
      .catch(function (err) {
        inFlight = null;
        throw err;                           // quem chamou decide o que mostrar
      });

    return inFlight;
  }

  /**
   * Busca UM elemento pelo id ("osm-n123"). É o que faz um link
   * compartilhado funcionar em carregamento frio — sem isso, quem
   * abre a URL direto cai em "restaurante não encontrado", porque a
   * lista só existe depois de navegar pela home.
   */
  function fetchById(id) {
    var m = String(id).match(/^osm-([nwr])(\d+)$/);
    if (!m) return Promise.reject(new Error("id-invalido"));

    var kind = { n: "node", w: "way", r: "relation" }[m[1]];
    var query = "[out:json][timeout:25];" + kind + "(" + m[2] + ");out center 1;";

    return fetchWithMirrors(query).then(function (data) {
      var el = (data.elements || [])[0];
      var restaurant = el && toRestaurant(el);
      if (!restaurant) throw new Error("nao-encontrado");
      return restaurant;
    });
  }

  global.Osm = {
    searchNearby: searchNearby,
    fetchById: fetchById,
    parseOpeningHours: parseOpeningHours     // exposto para teste
  };
})(window);
