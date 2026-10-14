/* ============================================================
   FoodRadar — adaptador do Google Maps
   ------------------------------------------------------------
   Tudo aqui é OPCIONAL e degrada com elegância: sem API key
   (ou com a rede fora), o app continua funcionando com os
   dados locais e o mapa vira um placeholder clicável.

   O que o Google entrega de verdade:
     ✔ coordenadas, endereço formatado, mapa e rota
     ✔ horário de funcionamento oficial + "aberto agora"
     ✔ fotos do lugar, nota e nº de avaliações
     ✘ cardápio item a item com preço  → isso é dado NOSSO
   ============================================================ */
(function (global) {
  "use strict";

  var CFG = global.FR_CONFIG || {};
  var loadPromise = null;

  function hasKey() {
    return typeof CFG.GOOGLE_MAPS_API_KEY === "string" && CFG.GOOGLE_MAPS_API_KEY.trim().length > 0;
  }

  /* ---------- carregamento sob demanda da Maps JavaScript API ---------- */
  function load() {
    if (!hasKey()) return Promise.reject(new Error("sem-api-key"));
    if (loadPromise) return loadPromise;

    loadPromise = new Promise(function (resolve, reject) {
      if (global.google && global.google.maps) return resolve(global.google.maps);

      var cbName = "__frMapsReady";
      var timer = setTimeout(function () { reject(new Error("timeout")); }, 12000);

      global[cbName] = function () {
        clearTimeout(timer);
        resolve(global.google.maps);
      };

      var s = document.createElement("script");
      s.async = true;
      s.src = "https://maps.googleapis.com/maps/api/js" +
        "?key=" + encodeURIComponent(CFG.GOOGLE_MAPS_API_KEY) +
        "&v=weekly&libraries=places,marker&loading=async&language=pt-BR&region=BR" +
        "&callback=" + cbName;
      s.onerror = function () { clearTimeout(timer); reject(new Error("script-error")); };
      document.head.appendChild(s);
    }).catch(function (err) {
      loadPromise = null;
      throw err;
    });

    return loadPromise;
  }

  /* ---------- distância (não precisa de API) ---------- */
  function haversineKm(a, b) {
    if (!a || !b) return null;
    var R = 6371;
    var dLat = (b.lat - a.lat) * Math.PI / 180;
    var dLng = (b.lng - a.lng) * Math.PI / 180;
    var la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(la1) * Math.cos(la2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function formatDistance(km) {
    if (km == null) return "";
    var meters = Math.round(km * 1000 / 50) * 50;
    if (meters < 1000) return meters + " m";
    return (meters / 1000).toFixed(1).replace(".", ",") + " km";
  }

  /* ---------- localização do usuário ---------- */
  function getUserLocation() {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) return reject(new Error("sem-geolocation"));
      navigator.geolocation.getCurrentPosition(
        function (pos) { resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
        function (err) { reject(err); },
        { enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 }
      );
    });
  }

  /* ---------- nome do bairro a partir das coordenadas ---------- */
  function reverseGeocode(coords) {
    return load().then(function (maps) {
      var geocoder = new maps.Geocoder();
      return geocoder.geocode({ location: coords }).then(function (res) {
        var r = res.results && res.results[0];
        if (!r) return null;
        var pick = function (type) {
          var c = (r.address_components || []).find(function (x) { return x.types.indexOf(type) >= 0; });
          return c ? c.short_name : null;
        };
        var bairro = pick("sublocality_level_1") || pick("sublocality") || pick("administrative_area_level_2");
        var uf = pick("administrative_area_level_1");
        return bairro ? (uf ? bairro + ", " + uf : bairro) : r.formatted_address;
      });
    });
  }

  /* ---------- mapa embutido (ou placeholder) ---------- */
  var PIN_SVG =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>';

  function renderFallback(el) {
    el.innerHTML = '<div class="map-fallback"><div class="map-pin">' + PIN_SVG + "</div></div>";
  }

  /* ---------- Leaflet + OpenStreetMap ----------
     Sem chave, sem cartão, sem cota. Carregado sob demanda:
     quem nunca abre uma página de restaurante não baixa nada.  */
  var LEAFLET = {
    css: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
    js: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"
  };
  var leafletPromise = null;

  function loadLeaflet() {
    if (leafletPromise) return leafletPromise;

    leafletPromise = new Promise(function (resolve, reject) {
      if (global.L && global.L.map) return resolve(global.L);

      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET.css;
      document.head.appendChild(link);

      var timer = setTimeout(function () { reject(new Error("timeout")); }, 12000);
      var s = document.createElement("script");
      s.async = true;
      s.src = LEAFLET.js;
      s.onload = function () {
        clearTimeout(timer);
        if (global.L && global.L.map) resolve(global.L);
        else reject(new Error("sem-leaflet"));
      };
      s.onerror = function () { clearTimeout(timer); reject(new Error("script-error")); };
      document.head.appendChild(s);
    }).catch(function (err) {
      leafletPromise = null;
      throw err;
    });

    return leafletPromise;
  }

  /* Qual motor desenha o mapa. */
  function mapProvider() {
    var p = CFG.MAP_PROVIDER || "auto";
    if (p === "auto") return hasKey() ? "google" : "osm";
    if (p === "google" && !hasKey()) return "osm";   // pediu Google sem chave
    return p;
  }

  var activeMap = null;   // só um mapa vivo por vez — evita listener vazando

  function destroyActiveMap() {
    if (activeMap && typeof activeMap.remove === "function") {
      try { activeMap.remove(); } catch (e) { /* já foi embora com o DOM */ }
    }
    activeMap = null;
  }

  function renderGoogleMap(el, coords, title) {
    return load().then(function (maps) {
      el.innerHTML = "";
      var map = new maps.Map(el, {
        center: coords,
        zoom: 16,
        disableDefaultUI: true,
        gestureHandling: "cooperative",
        clickableIcons: false
      });
      new maps.Marker({ position: coords, map: map, title: title || "" });
    });
  }

  function renderOsmMap(el, coords, title) {
    return loadLeaflet().then(function (L) {
      destroyActiveMap();
      el.innerHTML = "";

      var map = L.map(el, {
        zoomControl: false,        // 150px de altura não comporta o controle
        scrollWheelZoom: false,    // não sequestra a rolagem da página
        attributionControl: true   // atribuição do OSM é obrigatória (ODbL)
      }).setView([coords.lat, coords.lng], 16);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }).addTo(map);

      L.marker([coords.lat, coords.lng], {
        title: title || "",
        icon: L.divIcon({
          className: "fr-pin",
          html: '<span class="map-pin">' + PIN_SVG + "</span>",
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        })
      }).addTo(map);

      activeMap = map;
      return map;
    });
  }

  function renderMap(el, coords, title) {
    if (!el) return;
    renderFallback(el);
    if (!coords) return;

    var which = mapProvider();
    if (which === "none") return;

    var job = which === "google"
      ? renderGoogleMap(el, coords, title)
      : renderOsmMap(el, coords, title);

    job.catch(function () { renderFallback(el); });
  }

  /* ---------- enriquecer um restaurante com dados do Places ---------- */
  /* Retorna um objeto só com os campos que o Google conseguiu preencher.
     O app faz o merge — dados locais continuam valendo como fallback.   */
  function enrich(restaurant) {
    if (!hasKey() || !restaurant) return Promise.resolve(null);

    return load().then(function (maps) {
      var Place = maps.places && maps.places.Place;
      if (!Place) return null;

      var fields = [
        "id", "displayName", "formattedAddress", "location",
        "rating", "userRatingCount", "priceLevel",
        "regularOpeningHours", "photos", "nationalPhoneNumber", "websiteURI"
      ];

      var query = restaurant.name + " " + (restaurant.address || "");
      return Place.searchByText({
        textQuery: query,
        fields: fields,
        language: "pt-BR",
        region: "br",
        maxResultCount: 1,
        locationBias: restaurant.coords ? { center: restaurant.coords, radius: 3000 } : undefined
      }).then(function (res) {
        var p = res && res.places && res.places[0];
        if (!p) return null;

        var out = { source: "google", placeId: p.id };
        if (p.formattedAddress) out.address = p.formattedAddress;
        if (p.location) out.coords = { lat: p.location.lat(), lng: p.location.lng() };
        if (typeof p.rating === "number") out.rating = p.rating;
        if (typeof p.userRatingCount === "number") out.reviews = p.userRatingCount;
        if (p.nationalPhoneNumber) out.phone = p.nationalPhoneNumber;
        if (p.websiteURI) out.website = p.websiteURI;

        if (p.regularOpeningHours) {
          out.hoursText = p.regularOpeningHours.weekdayDescriptions || null;
          if (typeof p.regularOpeningHours.isOpen === "function") {
            try { out.openNow = p.regularOpeningHours.isOpen(); } catch (e) { /* ignora */ }
          }
        }
        if (p.photos && p.photos.length) {
          try { out.photo = p.photos[0].getURI({ maxWidth: 1200 }); } catch (e) { /* ignora */ }
        }
        return out;
      });
    }).catch(function () { return null; });
  }

  /* ---------- autocomplete de lugares ----------
     Com API key: Places Autocomplete (qualquer cidade, bairro ou
     endereço do Brasil). Sem key: filtra a lista de js/data.js.   */
  var predictionCache = {};   // id -> objeto de predição do Google
  var sessionToken = null;

  function normalize(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function searchPlacesLocal(input) {
    var q = normalize(input).trim();
    if (!q) return [];
    var places = global.PLACES || [];
    return places
      .filter(function (p) { return normalize(p.name).indexOf(q) >= 0; })
      .sort(function (a, b) {
        // quem começa com o termo digitado aparece primeiro
        var ai = normalize(a.name).indexOf(q), bi = normalize(b.name).indexOf(q);
        return ai - bi || a.name.localeCompare(b.name);
      })
      .slice(0, 6)
      .map(function (p) {
        return {
          id: "local:" + p.name + "-" + p.uf,
          main: p.name,
          secondary: p.uf + ", Brasil",
          coords: p.coords
        };
      });
  }

  /* Photon (OpenStreetMap) — cobre o Brasil inteiro: cidade, bairro,
     rua. Sem chave, sem cartão. É o geocoder feito para type-ahead;
     o Nominatim proíbe esse uso na política dele.                    */
  var PHOTON = "https://photon.komoot.io/api/";

  // ruído que não serve como ponto de partida (entrada de metrô, etc.)
  var PHOTON_KEYS = ["place", "boundary", "highway", "building", "addr", "landuse"];

  function searchPlacesPhoton(input) {
    var url = PHOTON + "?q=" + encodeURIComponent(input) + "&limit=12";

    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("http-" + res.status);
      return res.json();
    }).then(function (data) {
      var seen = {};

      return (data.features || [])
        .filter(function (f) {
          var p = f.properties || {};
          if (p.countrycode !== "BR") return false;
          return PHOTON_KEYS.indexOf(p.osm_key) >= 0;
        })
        .map(function (f) {
          var p = f.properties;
          var c = f.geometry.coordinates;     // [lng, lat]

          // "Vila Mariana" / "São Paulo, SP, Brasil"
          var tail = [];
          if (p.city && p.city !== p.name) tail.push(p.city);
          if (p.state && p.state !== p.name) tail.push(p.state);
          tail.push("Brasil");

          return {
            id: "photon:" + p.osm_type + p.osm_id,
            main: p.name || p.street || p.city,
            secondary: tail.join(", "),
            coords: { lat: c[1], lng: c[0] }
          };
        })
        .filter(function (s) {
          if (!s.main) return false;
          var k = (s.main + "|" + s.secondary).toLowerCase();
          if (seen[k]) return false;
          seen[k] = true;
          return true;
        })
        .slice(0, 6);
    }).catch(function () {
      return searchPlacesLocal(input);       // rede fora: lista local
    });
  }

  function searchPlaces(input) {
    if (!hasKey()) return searchPlacesPhoton(input);

    return load().then(function (maps) {
      var AS = maps.places && maps.places.AutocompleteSuggestion;
      if (!AS) return searchPlacesLocal(input);

      if (!sessionToken) sessionToken = new maps.places.AutocompleteSessionToken();

      return AS.fetchAutocompleteSuggestions({
        input: input,
        includedRegionCodes: ["br"],
        language: "pt-BR",
        region: "br",
        sessionToken: sessionToken
      }).then(function (res) {
        return (res.suggestions || []).slice(0, 6).map(function (s) {
          var p = s.placePrediction;
          predictionCache[p.placeId] = p;
          return {
            id: p.placeId,
            main: p.mainText ? p.mainText.text : p.text.text,
            secondary: p.secondaryText ? p.secondaryText.text : "",
            coords: null              // resolvido só quando a pessoa escolher
          };
        });
      });
    }).catch(function () {
      return searchPlacesLocal(input);
    });
  }

  /* Converte uma sugestão em { label, coords }. */
  function resolvePlace(suggestion) {
    if (suggestion.coords) {
      return Promise.resolve({
        label: suggestion.main + (suggestion.secondary ? " - " + suggestion.secondary.split(",")[0] : ""),
        coords: suggestion.coords
      });
    }

    var pred = predictionCache[suggestion.id];
    if (!pred) return Promise.reject(new Error("sem-predicao"));

    return load().then(function () {
      var place = pred.toPlace();
      return place.fetchFields({ fields: ["location", "displayName", "formattedAddress"] }).then(function (r) {
        var p = r.place || place;
        sessionToken = null;          // encerra a sessão de billing
        return {
          label: (p.displayName || suggestion.main),
          coords: { lat: p.location.lat(), lng: p.location.lng() }
        };
      });
    });
  }

  /* ---------- links externos ---------- */
  function directionsUrl(r) {
    if (r.placeId) {
      return "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(r.address || r.name) + "&destination_place_id=" + encodeURIComponent(r.placeId);
    }
    var dest = r.coords ? r.coords.lat + "," + r.coords.lng : (r.address || r.name);
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest);
  }

  function placeUrl(r) {
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(r.name + " " + (r.address || "")) +
      (r.placeId ? "&query_place_id=" + encodeURIComponent(r.placeId) : "");
  }

  global.Maps = {
    hasKey: hasKey,
    load: load,
    haversineKm: haversineKm,
    formatDistance: formatDistance,
    getUserLocation: getUserLocation,
    reverseGeocode: reverseGeocode,
    searchPlaces: searchPlaces,
    resolvePlace: resolvePlace,
    renderMap: renderMap,
    enrich: enrich,
    directionsUrl: directionsUrl,
    placeUrl: placeUrl
  };
})(window);
