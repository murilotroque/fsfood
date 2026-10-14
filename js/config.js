/* ============================================================
   FoodRadar — configuração
   ------------------------------------------------------------
   Para ligar o Google Maps (mapa real, foto do lugar, horário
   oficial e endereço), cole sua chave em GOOGLE_MAPS_API_KEY.

   No Google Cloud Console habilite:
     - Maps JavaScript API   (renderizar o mapa)
     - Places API (New)      (detalhes, horários, fotos, nota)
     - Geocoding API         (endereço a partir da localização)

   Sem chave o app funciona 100% com os dados locais de
   js/data.js — só o mapa vira um placeholder com link para o
   Google Maps.
   ============================================================ */
window.FR_CONFIG = {
  GOOGLE_MAPS_API_KEY: "",

  // Quem desenha o mapa da página do restaurante:
  //   "auto"   → Google se houver API key, senão OpenStreetMap
  //   "osm"    → sempre OpenStreetMap (Leaflet) — grátis, sem chave, sem cartão
  //   "google" → sempre Google (exige a API key acima)
  //   "none"   → sem mapa, só o placeholder
  MAP_PROVIDER: "auto",

  // Centro padrão quando o usuário não libera a localização.
  DEFAULT_LOCATION: { lat: -23.5613, lng: -46.6565, label: "São Paulo, SP" },

  // Raio considerado "por perto" a partir do ponto escolhido (km).
  // 30 km cobre uma região metropolitana inteira.
  NEARBY_RADIUS_KM: 30,

  // Moeda usada na formatação de preços.
  CURRENCY: { locale: "pt-BR", code: "BRL" }
};
