/* ============================================================
   FoodRadar — camada de dados (mock)
   ------------------------------------------------------------
   Essa é a fonte de verdade do produto: o CARDÁPIO e os PREÇOS.
   O Google Maps complementa (mapa, foto, horário oficial), mas
   não fornece item de cardápio com preço — isso é conteúdo
   próprio da plataforma.

   Formato de horário: 7 posições, 0 = domingo … 6 = sábado.
   Cada dia é um array de faixas "HH:MM-HH:MM" ou null (fechado).
   ============================================================ */

window.CATEGORIES = [
  { id: "italiana",      name: "Italiana",      emoji: "\u{1F35D}" },
  { id: "japonesa",      name: "Japonesa",      emoji: "\u{1F363}" },
  { id: "hamburguer",    name: "Hambúrguer",    emoji: "\u{1F354}" },
  { id: "pizza",         name: "Pizza",         emoji: "\u{1F355}" },
  { id: "brasileira",    name: "Brasileira",    emoji: "\u{1F35B}" },
  { id: "churrasco",     name: "Churrasco",     emoji: "\u{1F969}" },
  { id: "vegetariana",   name: "Vegetariana",   emoji: "\u{1F957}" },
  { id: "arabe",         name: "Árabe",         emoji: "\u{1F959}" },
  { id: "mexicana",      name: "Mexicana",      emoji: "\u{1F32E}" },
  { id: "frutos-do-mar", name: "Frutos do mar", emoji: "\u{1F990}" },
  { id: "cafeteria",     name: "Cafeteria",     emoji: "☕" },
  { id: "doces",         name: "Doces",         emoji: "\u{1F370}" }
];

/* Facilidades — rótulo + ícone (chave usada em js/app.js) */
window.FACILITIES = {
  wifi:       { label: "WiFi gratuito",     icon: "wifi" },
  parking:    { label: "Estacionamento",    icon: "parking" },
  ac:         { label: "Ar-condicionado",   icon: "snow" },
  accessible: { label: "Acessível",         icon: "accessible" },
  outdoor:    { label: "Área externa",      icon: "sun" },
  pet:        { label: "Pet friendly",      icon: "paw" },
  kids:       { label: "Espaço kids",       icon: "kids" },
  bar:        { label: "Bar completo",      icon: "glass" },
  music:      { label: "Música ao vivo",    icon: "music" },
  cards:      { label: "Aceita cartão",     icon: "card" }
};

/* Cidades onde a plataforma já tem cardápios cadastrados.
   Serve para o texto de "nenhum restaurante por aqui" sugerir
   a cidade coberta mais próxima. */
window.CITY_INFO = {
  "sao-paulo":      { label: "São Paulo, SP",      coords: { lat: -23.5613, lng: -46.6565 } },
  "rio-de-janeiro": { label: "Rio de Janeiro, RJ", coords: { lat: -22.9711, lng: -43.1822 } },
  "belo-horizonte": { label: "Belo Horizonte, MG", coords: { lat: -19.9386, lng: -43.9382 } }
};

/* ------------------------------------------------------------
   Base local de lugares — usada no autocomplete do seletor de
   localização QUANDO NÃO HÁ API key do Google. Com a chave,
   js/maps.js usa o Places Autocomplete e ignora esta lista.
   ------------------------------------------------------------ */
window.PLACES = [
  { name: "São Paulo", uf: "SP", coords: { lat: -23.5505, lng: -46.6333 } },
  { name: "Rio de Janeiro", uf: "RJ", coords: { lat: -22.9068, lng: -43.1729 } },
  { name: "Belo Horizonte", uf: "MG", coords: { lat: -19.9167, lng: -43.9345 } },
  { name: "Brasília", uf: "DF", coords: { lat: -15.7939, lng: -47.8828 } },
  { name: "Salvador", uf: "BA", coords: { lat: -12.9777, lng: -38.5016 } },
  { name: "Fortaleza", uf: "CE", coords: { lat: -3.7319, lng: -38.5267 } },
  { name: "Curitiba", uf: "PR", coords: { lat: -25.4284, lng: -49.2733 } },
  { name: "Recife", uf: "PE", coords: { lat: -8.0476, lng: -34.877 } },
  { name: "Porto Alegre", uf: "RS", coords: { lat: -30.0346, lng: -51.2177 } },
  { name: "Manaus", uf: "AM", coords: { lat: -3.1019, lng: -60.025 } },
  { name: "Belém", uf: "PA", coords: { lat: -1.4558, lng: -48.5044 } },
  { name: "Goiânia", uf: "GO", coords: { lat: -16.6869, lng: -49.2648 } },
  { name: "Guarulhos", uf: "SP", coords: { lat: -23.4538, lng: -46.5333 } },
  { name: "Campinas", uf: "SP", coords: { lat: -22.9099, lng: -47.0626 } },
  { name: "Osasco", uf: "SP", coords: { lat: -23.5329, lng: -46.7918 } },
  { name: "Santo André", uf: "SP", coords: { lat: -23.6639, lng: -46.5383 } },
  { name: "São Bernardo do Campo", uf: "SP", coords: { lat: -23.6944, lng: -46.5654 } },
  { name: "Barueri", uf: "SP", coords: { lat: -23.5107, lng: -46.8764 } },
  { name: "Santos", uf: "SP", coords: { lat: -23.9608, lng: -46.3336 } },
  { name: "Ribeirão Preto", uf: "SP", coords: { lat: -21.1775, lng: -47.8103 } },
  { name: "Sorocaba", uf: "SP", coords: { lat: -23.5015, lng: -47.4526 } },
  { name: "São José dos Campos", uf: "SP", coords: { lat: -23.1896, lng: -45.8841 } },
  { name: "São Luís", uf: "MA", coords: { lat: -2.5307, lng: -44.3068 } },
  { name: "Maceió", uf: "AL", coords: { lat: -9.6498, lng: -35.7089 } },
  { name: "Natal", uf: "RN", coords: { lat: -5.7945, lng: -35.211 } },
  { name: "Teresina", uf: "PI", coords: { lat: -5.0892, lng: -42.8019 } },
  { name: "Campo Grande", uf: "MS", coords: { lat: -20.4697, lng: -54.6201 } },
  { name: "João Pessoa", uf: "PB", coords: { lat: -7.1195, lng: -34.845 } },
  { name: "Florianópolis", uf: "SC", coords: { lat: -27.5954, lng: -48.548 } },
  { name: "Joinville", uf: "SC", coords: { lat: -26.3044, lng: -48.8456 } },
  { name: "Blumenau", uf: "SC", coords: { lat: -26.9194, lng: -49.0661 } },
  { name: "Balneário Camboriú", uf: "SC", coords: { lat: -26.9906, lng: -48.6348 } },
  { name: "Vitória", uf: "ES", coords: { lat: -20.3155, lng: -40.3128 } },
  { name: "Vila Velha", uf: "ES", coords: { lat: -20.3297, lng: -40.2925 } },
  { name: "Cuiabá", uf: "MT", coords: { lat: -15.6014, lng: -56.0979 } },
  { name: "Aracaju", uf: "SE", coords: { lat: -10.9472, lng: -37.0731 } },
  { name: "Macapá", uf: "AP", coords: { lat: 0.0349, lng: -51.0694 } },
  { name: "Porto Velho", uf: "RO", coords: { lat: -8.7612, lng: -63.9004 } },
  { name: "Rio Branco", uf: "AC", coords: { lat: -9.9754, lng: -67.8249 } },
  { name: "Boa Vista", uf: "RR", coords: { lat: 2.8235, lng: -60.6758 } },
  { name: "Palmas", uf: "TO", coords: { lat: -10.1849, lng: -48.3336 } },
  { name: "Uberlândia", uf: "MG", coords: { lat: -18.9186, lng: -48.2772 } },
  { name: "Juiz de Fora", uf: "MG", coords: { lat: -21.7642, lng: -43.3496 } },
  { name: "Contagem", uf: "MG", coords: { lat: -19.9321, lng: -44.0539 } },
  { name: "Nova Lima", uf: "MG", coords: { lat: -19.9857, lng: -43.8464 } },
  { name: "Betim", uf: "MG", coords: { lat: -19.9678, lng: -44.1983 } },
  { name: "Niterói", uf: "RJ", coords: { lat: -22.8832, lng: -43.1034 } },
  { name: "Petrópolis", uf: "RJ", coords: { lat: -22.505, lng: -43.1789 } },
  { name: "Armação dos Búzios", uf: "RJ", coords: { lat: -22.7469, lng: -41.8817 } },
  { name: "Angra dos Reis", uf: "RJ", coords: { lat: -23.0067, lng: -44.3181 } },
  { name: "Londrina", uf: "PR", coords: { lat: -23.3045, lng: -51.1696 } },
  { name: "Foz do Iguaçu", uf: "PR", coords: { lat: -25.5163, lng: -54.5854 } },
  { name: "Caxias do Sul", uf: "RS", coords: { lat: -29.1678, lng: -51.1794 } },
  { name: "Gramado", uf: "RS", coords: { lat: -29.3788, lng: -50.8737 } },
  { name: "Olinda", uf: "PE", coords: { lat: -8.0089, lng: -34.8553 } },
  { name: "Caruaru", uf: "PE", coords: { lat: -8.2828, lng: -35.9758 } },
  { name: "Feira de Santana", uf: "BA", coords: { lat: -12.2664, lng: -38.9663 } },
  { name: "Ilhéus", uf: "BA", coords: { lat: -14.7889, lng: -39.0347 } },
  { name: "Porto Seguro", uf: "BA", coords: { lat: -16.4497, lng: -39.0647 } }
];

window.RESTAURANTS = [
  {
    id: "bella-vita",
    name: "Bella Vita",
    cuisine: "Italiana",
    categories: ["italiana", "pizza"],
    rating: 4.7,
    reviews: 189,
    priceLevel: 3,
    avgPerPerson: [60, 100],
    description: "Cozinha italiana autêntica com massas artesanais e receitas tradicionais.",
    highlights: ["Delivery", "Aceita reserva", "WiFi gratuito"],
    facilities: ["wifi", "ac", "cards", "accessible", "bar"],
    address: "Av. Paulista, 456 - Bela Vista, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5697, lng: -46.6455 },
    placeId: "",
    phone: "(11) 3251-4400",
    delivery: true,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    hours: [
      ["12:00-22:00"],
      null,
      ["11:30-15:00", "18:00-23:00"],
      ["11:30-15:00", "18:00-23:00"],
      ["11:30-15:00", "18:00-23:00"],
      ["11:30-15:00", "18:00-00:00"],
      ["12:00-00:00"]
    ],
    menu: [
      {
        section: "Massas",
        items: [
          { name: "Carbonara Clássica", price: 58, popular: true, description: "Espaguete com bacon, ovos, queijo pecorino e pimenta do reino" },
          { name: "Lasanha Bolonhesa", price: 52, description: "Camadas de massa fresca, molho bolonhesa e queijo gratinado" },
          { name: "Ravioli de Ricota e Espinafre", price: 56, veg: true, description: "Massa recheada ao molho de manteiga e sálvia" },
          { name: "Fettuccine ao Funghi", price: 62, veg: true, description: "Mix de cogumelos frescos, creme de leite e parmesão" }
        ]
      },
      {
        section: "Entradas",
        items: [
          { name: "Bruschetta Napolitana", price: 28, veg: true, description: "Pão italiano, tomate, manjericão e azeite extra virgem" },
          { name: "Burrata com Pesto", price: 46, veg: true, popular: true, description: "Burrata cremosa, pesto de manjericão e tomate confit" },
          { name: "Antepasto da Casa", price: 54, description: "Seleção de frios, azeitonas, queijos e pães" }
        ]
      },
      {
        section: "Pizzas",
        items: [
          { name: "Margherita", price: 48, veg: true, description: "Molho de tomate San Marzano, muçarela de búfala e manjericão" },
          { name: "Quatro Queijos", price: 56, veg: true, description: "Muçarela, gorgonzola, parmesão e provolone" },
          { name: "Calabresa Artesanal", price: 52, description: "Calabresa fatiada, cebola roxa e orégano" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Tiramisù", price: 26, popular: true, description: "Receita tradicional com mascarpone e café espresso" },
          { name: "Panna Cotta de Frutas Vermelhas", price: 24, description: "Creme gelado com calda de frutas vermelhas" }
        ]
      }
    ]
  },

  {
    id: "sushi-koba",
    name: "Sushi Koba",
    cuisine: "Japonesa",
    categories: ["japonesa", "frutos-do-mar"],
    rating: 4.8,
    reviews: 412,
    priceLevel: 4,
    avgPerPerson: [110, 180],
    description: "Omakase e sushi de balcão com peixe fresco selecionado diariamente.",
    highlights: ["Aceita reserva", "Balcão de sushi", "Rodízio"],
    facilities: ["ac", "cards", "bar", "accessible"],
    address: "R. dos Pinheiros, 1220 - Pinheiros, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5648, lng: -46.6912 },
    placeId: "",
    phone: "(11) 3062-1180",
    delivery: false,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&q=80",
    hours: [null, null, ["18:30-23:00"], ["18:30-23:00"], ["18:30-23:00"], ["18:30-00:00"], ["18:00-00:00"]],
    menu: [
      {
        section: "Sushi & Sashimi",
        items: [
          { name: "Combinado Koba (16 peças)", price: 128, popular: true, description: "Seleção do chef com niguiris, uramakis e sashimis" },
          { name: "Sashimi de Salmão (8 fatias)", price: 68, description: "Cortes espessos de salmão fresco" },
          { name: "Niguiri de Atum (2 peças)", price: 32, description: "Atum sobre arroz temperado com shari da casa" },
          { name: "Uramaki Filadélfia (8 peças)", price: 54, description: "Salmão, cream cheese e cebolinha" }
        ]
      },
      {
        section: "Quentes",
        items: [
          { name: "Ramen Tonkotsu", price: 62, popular: true, description: "Caldo de porco cozido 12h, chashu, ovo marinado e nori" },
          { name: "Gyoza (6 unidades)", price: 38, description: "Pastéis japoneses grelhados de porco e cebolinha" },
          { name: "Yakisoba de Legumes", price: 46, veg: true, description: "Macarrão salteado com legumes e shoyu artesanal" }
        ]
      },
      {
        section: "Omakase",
        items: [
          { name: "Omakase 12 tempos", price: 320, description: "Menu degustação servido no balcão, sob reserva" },
          { name: "Omakase 18 tempos", price: 480, description: "Experiência completa com peixes importados" }
        ]
      }
    ]
  },

  {
    id: "brasa-viva",
    name: "Brasa Viva",
    cuisine: "Churrasco",
    categories: ["churrasco", "brasileira"],
    rating: 4.5,
    reviews: 736,
    priceLevel: 3,
    avgPerPerson: [90, 140],
    description: "Rodízio de carnes nobres com buffet de saladas e forno a lenha.",
    highlights: ["Rodízio", "Estacionamento", "Espaço kids"],
    facilities: ["parking", "ac", "kids", "cards", "accessible", "bar"],
    address: "Av. Brigadeiro Faria Lima, 2100 - Jardim Paulistano, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5758, lng: -46.6892 },
    placeId: "",
    phone: "(11) 3815-7722",
    delivery: false,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    hours: [
      ["11:30-22:00"],
      ["11:30-15:00"],
      ["11:30-15:00", "18:00-23:00"],
      ["11:30-15:00", "18:00-23:00"],
      ["11:30-15:00", "18:00-23:30"],
      ["11:30-23:30"],
      ["11:30-23:30"]
    ],
    menu: [
      {
        section: "Rodízio",
        items: [
          { name: "Rodízio Completo", price: 149, popular: true, description: "Todos os cortes, buffet de saladas e acompanhamentos" },
          { name: "Rodízio Executivo (almoço)", price: 98, description: "Cortes selecionados, seg a sex até 15h" },
          { name: "Buffet de Saladas", price: 62, veg: true, description: "Somente buffet, sem carnes" }
        ]
      },
      {
        section: "À la carte",
        items: [
          { name: "Picanha na Chapa (400g)", price: 168, popular: true, description: "Serve 2 pessoas, com farofa, vinagrete e arroz" },
          { name: "Ancho Angus (300g)", price: 142, description: "Corte argentino grelhado na brasa" },
          { name: "Costela no Bafo", price: 118, description: "12 horas de cocção lenta, desmancha no garfo" }
        ]
      },
      {
        section: "Acompanhamentos",
        items: [
          { name: "Farofa de Bacon", price: 22, description: "Farinha de mandioca torrada na manteiga" },
          { name: "Batata Rústica", price: 28, veg: true, description: "Com alecrim e alho confitado" },
          { name: "Pão de Alho Artesanal", price: 18, veg: true, description: "Grelhado na brasa" }
        ]
      }
    ]
  },

  {
    id: "casa-do-burger",
    name: "Casa do Burger",
    cuisine: "Hambúrguer",
    categories: ["hamburguer"],
    rating: 4.6,
    reviews: 1204,
    priceLevel: 2,
    avgPerPerson: [45, 70],
    description: "Smash burgers de blend próprio, pão brioche e batata frita na hora.",
    highlights: ["Delivery", "Área externa", "Pet friendly"],
    facilities: ["outdoor", "pet", "cards", "wifi"],
    address: "R. Augusta, 2280 - Consolação, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5546, lng: -46.6629 },
    placeId: "",
    phone: "(11) 3061-9090",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
    hours: [
      ["17:00-23:00"],
      ["18:00-23:00"],
      ["18:00-23:00"],
      ["18:00-23:00"],
      ["18:00-00:00"],
      ["18:00-01:00"],
      ["17:00-01:00"]
    ],
    menu: [
      {
        section: "Burgers",
        items: [
          { name: "Smash Duplo", price: 42, popular: true, description: "Dois blends de 90g, cheddar, picles e molho da casa" },
          { name: "Cheese Bacon", price: 46, description: "Blend 160g, cheddar inglês, bacon crocante e cebola caramelizada" },
          { name: "Frango Crispy", price: 39, description: "Sobrecoxa empanada, coleslaw e maionese defumada" },
          { name: "Veggie Mushroom", price: 38, veg: true, description: "Hambúrguer de cogumelos, queijo vegano e rúcula" }
        ]
      },
      {
        section: "Porções",
        items: [
          { name: "Fritas com Cheddar e Bacon", price: 34, popular: true, description: "Porção generosa, serve 2" },
          { name: "Onion Rings", price: 26, veg: true, description: "Anéis de cebola empanados na cerveja" },
          { name: "Fritas Rústicas", price: 22, veg: true, description: "Com sal de ervas" }
        ]
      },
      {
        section: "Bebidas",
        items: [
          { name: "Milkshake do Dia", price: 24, description: "Pergunte o sabor da semana" },
          { name: "Chopp Artesanal 500ml", price: 22, description: "IPA, Pilsen ou Weiss" },
          { name: "Refrigerante Lata", price: 8, description: "Linha Coca-Cola" }
        ]
      }
    ]
  },

  {
    id: "verde-quintal",
    name: "Verde Quintal",
    cuisine: "Vegetariana",
    categories: ["vegetariana", "brasileira"],
    rating: 4.9,
    reviews: 268,
    priceLevel: 2,
    avgPerPerson: [40, 65],
    description: "Comida natural de estação, 100% vegetariana, com horta própria.",
    highlights: ["Delivery", "Área externa", "Sem glúten"],
    facilities: ["outdoor", "wifi", "accessible", "cards", "pet"],
    address: "R. Harmonia, 340 - Vila Madalena, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5527, lng: -46.6903 },
    placeId: "",
    phone: "(11) 3812-4455",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
    hours: [null, ["11:30-16:00"], ["11:30-16:00"], ["11:30-16:00"], ["11:30-16:00"], ["11:30-16:00", "19:00-22:30"], ["11:30-17:00"]],
    menu: [
      {
        section: "Pratos do dia",
        items: [
          { name: "Prato Feito Vegetal", price: 46, veg: true, popular: true, description: "Arroz integral, feijão, legumes assados e proteína do dia" },
          { name: "Curry de Grão-de-bico", price: 48, veg: true, description: "Leite de coco, especiarias e arroz basmati" },
          { name: "Moqueca de Banana da Terra", price: 52, veg: true, description: "Dendê, leite de coco, pirão e arroz" }
        ]
      },
      {
        section: "Bowls & Saladas",
        items: [
          { name: "Bowl Mediterrâneo", price: 42, veg: true, description: "Homus, tabule, falafel e pão sírio" },
          { name: "Salada da Horta", price: 34, veg: true, description: "Folhas colhidas no dia, molho de mostarda e mel" }
        ]
      },
      {
        section: "Sucos & Cafés",
        items: [
          { name: "Suco Verde Detox", price: 18, veg: true, description: "Couve, maçã, limão e gengibre" },
          { name: "Café Coado Especial", price: 12, veg: true, description: "Grãos de produtores da Mantiqueira" }
        ]
      }
    ]
  },

  {
    id: "cantina-do-porto",
    name: "Cantina do Porto",
    cuisine: "Frutos do mar",
    categories: ["frutos-do-mar", "brasileira"],
    rating: 4.4,
    reviews: 523,
    priceLevel: 3,
    avgPerPerson: [80, 130],
    description: "Peixes e frutos do mar frescos, receitas do litoral em porções fartas.",
    highlights: ["Aceita reserva", "Estacionamento", "Música ao vivo"],
    facilities: ["parking", "music", "ac", "cards", "bar"],
    address: "R. Treze de Maio, 620 - Bela Vista, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5589, lng: -46.6419 },
    placeId: "",
    phone: "(11) 3288-3131",
    delivery: true,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    hours: [["11:30-17:00"], null, ["11:30-15:00", "18:30-23:00"], ["11:30-15:00", "18:30-23:00"], ["11:30-15:00", "18:30-23:30"], ["11:30-23:30"], ["11:30-23:30"]],
    menu: [
      {
        section: "Do mar",
        items: [
          { name: "Moqueca Capixaba (2 pessoas)", price: 178, popular: true, description: "Peixe branco, pirão, arroz e farofa" },
          { name: "Camarão à Provençal", price: 96, description: "Camarões salteados no alho, azeite e salsinha" },
          { name: "Filé de Robalo Grelhado", price: 88, description: "Com legumes na manteiga e purê de batata baroa" },
          { name: "Polvo à Lagareiro", price: 132, description: "Polvo assado com batata ao murro e azeite português" }
        ]
      },
      {
        section: "Entradas",
        items: [
          { name: "Casquinha de Siri", price: 32, description: "Gratinada com parmesão" },
          { name: "Bolinho de Bacalhau (6 un.)", price: 46, popular: true, description: "Massa leve com bacalhau desfiado" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Pudim de Leite", price: 22, description: "Receita da casa, calda de caramelo" },
          { name: "Cocada Cremosa", price: 20, description: "Servida quente com sorvete de creme" }
        ]
      }
    ]
  },

  {
    id: "taqueria-sol",
    name: "Taqueria Sol",
    cuisine: "Mexicana",
    categories: ["mexicana"],
    rating: 4.5,
    reviews: 341,
    priceLevel: 2,
    avgPerPerson: [45, 75],
    description: "Tacos de tortilla de milho feita na hora e mezcal em taça.",
    highlights: ["Delivery", "Bar completo", "Área externa"],
    facilities: ["bar", "outdoor", "cards", "wifi"],
    address: "R. Aspicuelta, 210 - Vila Madalena, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5548, lng: -46.6893 },
    placeId: "",
    phone: "(11) 3032-7788",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80",
    hours: [["17:00-22:00"], null, ["18:00-23:00"], ["18:00-23:00"], ["18:00-00:00"], ["18:00-01:00"], ["13:00-01:00"]],
    menu: [
      {
        section: "Tacos",
        items: [
          { name: "Taco al Pastor (3 un.)", price: 44, popular: true, description: "Porco marinado, abacaxi, coentro e cebola" },
          { name: "Taco de Carnitas (3 un.)", price: 46, description: "Pernil desfiado confitado, molho verde" },
          { name: "Taco de Cogumelos (3 un.)", price: 40, veg: true, description: "Mix de cogumelos, queijo vegano e chipotle" }
        ]
      },
      {
        section: "Para dividir",
        items: [
          { name: "Guacamole com Totopos", price: 38, veg: true, popular: true, description: "Abacate amassado na hora com limão e coentro" },
          { name: "Nachos Supremos", price: 52, description: "Carne, feijão, queijo derretido e jalapeño" },
          { name: "Quesadilla de Queijo", price: 34, veg: true, description: "Tortilla de trigo com queijo Oaxaca" }
        ]
      },
      {
        section: "Bar",
        items: [
          { name: "Margarita Clássica", price: 34, description: "Tequila, licor de laranja e limão" },
          { name: "Mezcal Dose", price: 28, description: "Seleção artesanal de Oaxaca" }
        ]
      }
    ]
  },

  {
    id: "forno-di-pietra",
    name: "Forno di Pietra",
    cuisine: "Pizza",
    categories: ["pizza", "italiana"],
    rating: 4.7,
    reviews: 892,
    priceLevel: 2,
    avgPerPerson: [50, 85],
    description: "Pizza napoletana de fermentação natural assada em forno a lenha.",
    highlights: ["Delivery", "Aceita reserva", "Forno a lenha"],
    facilities: ["ac", "cards", "accessible", "bar", "wifi"],
    address: "R. Bela Cintra, 1450 - Consolação, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5563, lng: -46.6636 },
    placeId: "",
    phone: "(11) 3061-2020",
    delivery: true,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    hours: [["18:00-23:00"], ["18:30-23:00"], ["18:30-23:00"], ["18:30-23:00"], ["18:30-00:00"], ["18:30-00:30"], ["18:00-00:30"]],
    menu: [
      {
        section: "Pizzas Clássicas",
        items: [
          { name: "Marinara", price: 42, veg: true, description: "Tomate San Marzano, alho, orégano e azeite" },
          { name: "Margherita D.O.P.", price: 54, veg: true, popular: true, description: "Muçarela de búfala D.O.P., tomate e manjericão" },
          { name: "Diavola", price: 62, description: "Salame picante calabrês e muçarela fior di latte" }
        ]
      },
      {
        section: "Pizzas Especiais",
        items: [
          { name: "Tartufo", price: 78, veg: true, popular: true, description: "Creme de trufas, cogumelos e parmesão 24 meses" },
          { name: "Burrata e Presunto Cru", price: 84, description: "Burrata inteira, presunto de Parma e rúcula" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Pizza Nutella", price: 48, veg: true, description: "Com morangos frescos e açúcar de confeiteiro" },
          { name: "Cannolo Siciliano", price: 22, veg: true, description: "Recheio de ricota e gotas de chocolate" }
        ]
      }
    ]
  },

  {
    id: "beirute-cafe",
    name: "Beirute Café",
    cuisine: "Árabe",
    categories: ["arabe", "vegetariana"],
    rating: 4.3,
    reviews: 197,
    priceLevel: 1,
    avgPerPerson: [25, 45],
    description: "Esfihas abertas, homus cremoso e doces árabes feitos na casa.",
    highlights: ["Delivery", "Preço justo", "Retirada rápida"],
    facilities: ["cards", "wifi", "accessible"],
    address: "R. Vergueiro, 880 - Liberdade, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5713, lng: -46.6382 },
    placeId: "",
    phone: "(11) 3277-6060",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1540914124281-342587941389?w=1200&q=80",
    hours: [["11:00-20:00"], ["09:00-21:00"], ["09:00-21:00"], ["09:00-21:00"], ["09:00-22:00"], ["09:00-22:00"], ["10:00-22:00"]],
    menu: [
      {
        section: "Salgados",
        items: [
          { name: "Esfiha Aberta de Carne", price: 9, popular: true, description: "Massa fina com carne temperada e limão" },
          { name: "Esfiha de Queijo", price: 10, veg: true, description: "Queijo coalho derretido" },
          { name: "Kibe Frito (2 un.)", price: 16, description: "Recheado com carne e hortelã" },
          { name: "Beirute de Rosbife", price: 34, description: "Pão sírio, rosbife, queijo, ovo e salada" }
        ]
      },
      {
        section: "Mezze",
        items: [
          { name: "Homus com Pão Sírio", price: 26, veg: true, popular: true, description: "Pasta de grão-de-bico com tahine e azeite" },
          { name: "Babaganuche", price: 28, veg: true, description: "Berinjela defumada com tahine" },
          { name: "Tabule", price: 24, veg: true, description: "Trigo, tomate, salsa e limão" }
        ]
      },
      {
        section: "Doces",
        items: [
          { name: "Baklava (2 un.)", price: 18, veg: true, description: "Massa folhada, nozes e calda de mel" },
          { name: "Halawet el Jibn", price: 22, veg: true, description: "Doce de queijo com creme e pistache" }
        ]
      }
    ]
  },

  {
    id: "grao-torrado",
    name: "Grão Torrado",
    cuisine: "Cafeteria",
    categories: ["cafeteria", "doces"],
    rating: 4.8,
    reviews: 654,
    priceLevel: 2,
    avgPerPerson: [30, 55],
    description: "Torra própria, métodos filtrados e confeitaria fresca todo dia.",
    highlights: ["WiFi gratuito", "Bom pra trabalhar", "Café especial"],
    facilities: ["wifi", "outdoor", "cards", "pet", "accessible"],
    address: "R. Fradique Coutinho, 1150 - Pinheiros, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5605, lng: -46.6874 },
    placeId: "",
    phone: "(11) 3031-4141",
    delivery: false,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    hours: [["09:00-17:00"], ["07:30-19:00"], ["07:30-19:00"], ["07:30-19:00"], ["07:30-19:00"], ["07:30-20:00"], ["08:30-19:00"]],
    menu: [
      {
        section: "Cafés",
        items: [
          { name: "Espresso", price: 9, veg: true, description: "Blend da casa, 25ml" },
          { name: "Cappuccino Italiano", price: 16, veg: true, popular: true, description: "Espresso, leite vaporizado e microespuma" },
          { name: "Coado V60", price: 18, veg: true, description: "Grão single origin, escolha o do dia" },
          { name: "Cold Brew 300ml", price: 20, veg: true, description: "Extração a frio por 18 horas" }
        ]
      },
      {
        section: "Padaria & Doces",
        items: [
          { name: "Croissant de Manteiga", price: 14, veg: true, popular: true, description: "Folhado artesanal, assado na hora" },
          { name: "Bolo de Cenoura com Ganache", price: 18, veg: true, description: "Fatia generosa" },
          { name: "Cookie de Chocolate 70%", price: 12, veg: true, description: "Casquinha crocante, miolo macio" }
        ]
      },
      {
        section: "Brunch",
        items: [
          { name: "Ovos Mexidos com Torrada", price: 32, veg: true, description: "Pão de fermentação natural e manteiga" },
          { name: "Avocado Toast", price: 36, veg: true, description: "Abacate, ovo pochê e gergelim" }
        ]
      }
    ]
  },

  {
    id: "tempero-mineiro",
    name: "Tempero Mineiro",
    cuisine: "Brasileira",
    categories: ["brasileira"],
    rating: 4.6,
    reviews: 981,
    priceLevel: 1,
    avgPerPerson: [30, 50],
    description: "Comida caseira mineira no fogão a lenha, buffet livre no almoço.",
    highlights: ["Buffet livre", "Almoço executivo", "Estacionamento"],
    facilities: ["parking", "cards", "kids", "accessible", "ac"],
    address: "R. da Consolação, 3120 - Cerqueira César, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5601, lng: -46.6707 },
    placeId: "",
    phone: "(11) 3064-5050",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    hours: [["11:00-16:00"], ["11:00-15:30"], ["11:00-15:30"], ["11:00-15:30"], ["11:00-15:30"], ["11:00-15:30"], ["11:00-16:00"]],
    menu: [
      {
        section: "Buffet",
        items: [
          { name: "Buffet Livre (por pessoa)", price: 54, popular: true, description: "Mais de 20 pratos quentes e saladas, sobremesa inclusa" },
          { name: "Buffet por Quilo", price: 79.9, description: "Preço por quilo, seg a sex" },
          { name: "Marmita Executiva", price: 32, description: "Para viagem, com arroz, feijão, guarnição e proteína" }
        ]
      },
      {
        section: "À la carte",
        items: [
          { name: "Feijoada Completa (sáb.)", price: 68, popular: true, description: "Com couve, laranja, farofa e torresmo" },
          { name: "Frango com Quiabo", price: 52, description: "Acompanha angu e arroz" },
          { name: "Tutu à Mineira", price: 48, description: "Feijão, bisteca, linguiça e couve" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Doce de Leite com Queijo", price: 16, veg: true, description: "Queijo canastra e doce cremoso" },
          { name: "Pudim de Padaria", price: 14, veg: true, description: "Fatia individual" }
        ]
      }
    ]
  },

  {
    id: "doce-hora",
    name: "Doce Hora",
    cuisine: "Doces",
    categories: ["doces", "cafeteria"],
    rating: 4.9,
    reviews: 412,
    priceLevel: 2,
    avgPerPerson: [25, 45],
    description: "Confeitaria francesa contemporânea, tortas inteiras sob encomenda.",
    highlights: ["Delivery", "Encomendas", "Sem lactose"],
    facilities: ["cards", "wifi", "accessible", "ac"],
    address: "R. Oscar Freire, 980 - Jardins, São Paulo - SP",
    city: "sao-paulo",
    coords: { lat: -23.5623, lng: -46.6707 },
    placeId: "",
    phone: "(11) 3085-9090",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80",
    hours: [["10:00-18:00"], ["10:00-19:00"], ["10:00-19:00"], ["10:00-19:00"], ["10:00-20:00"], ["10:00-20:00"], ["10:00-20:00"]],
    menu: [
      {
        section: "Fatias",
        items: [
          { name: "Torta de Limão Siciliano", price: 26, veg: true, popular: true, description: "Merengue maçaricado e base sablé" },
          { name: "Ópera de Chocolate", price: 28, veg: true, description: "Camadas de café, ganache e biscuit joconde" },
          { name: "Cheesecake de Frutas Vermelhas", price: 27, veg: true, description: "Base de biscoito e calda artesanal" }
        ]
      },
      {
        section: "Petit fours",
        items: [
          { name: "Macaron (unidade)", price: 9, veg: true, description: "Seis sabores disponíveis no balcão" },
          { name: "Éclair de Baunilha", price: 18, veg: true, description: "Creme de baunilha de Madagascar" },
          { name: "Brigadeiro Belga (6 un.)", price: 32, veg: true, popular: true, description: "Caixa com chocolate 55%" }
        ]
      },
      {
        section: "Encomendas",
        items: [
          { name: "Torta Inteira (18 cm)", price: 180, veg: true, description: "Serve 10 pessoas, pedido com 48h" },
          { name: "Bolo de Aniversário Personalizado", price: 260, veg: true, description: "A partir de, conforme decoração" }
        ]
      }
    ]
  },

  /* ======================== Rio de Janeiro ======================== */

  {
    id: "bar-do-mirante",
    name: "Bar do Mirante",
    cuisine: "Brasileira",
    categories: ["brasileira"],
    rating: 4.6,
    reviews: 874,
    priceLevel: 2,
    avgPerPerson: [45, 80],
    description: "Boteco de esquina em Santa Teresa, petiscos clássicos e chope gelado.",
    highlights: ["Área externa", "Música ao vivo", "Vista"],
    facilities: ["outdoor", "music", "bar", "cards", "pet"],
    address: "R. Almirante Alexandrino, 1200 - Santa Teresa, Rio de Janeiro - RJ",
    city: "rio-de-janeiro",
    coords: { lat: -22.9186, lng: -43.1876 },
    placeId: "",
    phone: "(21) 2242-1100",
    delivery: false,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    hours: [["12:00-22:00"], null, ["17:00-00:00"], ["17:00-00:00"], ["17:00-01:00"], ["12:00-02:00"], ["12:00-02:00"]],
    menu: [
      {
        section: "Petiscos",
        items: [
          { name: "Bolinho de Feijoada (6 un.)", price: 42, popular: true, description: "Com couve crocante e molho de pimenta" },
          { name: "Linguiça na Cachaça", price: 38, description: "Flambada na hora, com pão e vinagrete" },
          { name: "Bolinho de Aipim com Carne Seca", price: 44, description: "Massa cremosa e recheio desfiado" },
          { name: "Pastel de Queijo Coalho (5 un.)", price: 32, veg: true, description: "Com melado de cana" }
        ]
      },
      {
        section: "Pratos",
        items: [
          { name: "Feijoada Individual", price: 62, popular: true, description: "Sábado e domingo, com todos os acompanhamentos" },
          { name: "Filé à Parmegiana", price: 78, description: "Serve 2, com arroz e fritas" },
          { name: "Escondidinho de Carne Seca", price: 56, description: "Purê de aipim gratinado" }
        ]
      },
      {
        section: "Bar",
        items: [
          { name: "Chope Pilsen 300ml", price: 14, description: "Tirado na pressão certa" },
          { name: "Caipirinha de Limão", price: 26, description: "Cachaça artesanal de Paraty" },
          { name: "Batida de Coco", price: 24, description: "Feita com leite de coco fresco" }
        ]
      }
    ]
  },

  {
    id: "sal-e-maresia",
    name: "Sal & Maresia",
    cuisine: "Frutos do mar",
    categories: ["frutos-do-mar"],
    rating: 4.7,
    reviews: 612,
    priceLevel: 4,
    avgPerPerson: [120, 200],
    description: "Peixes do dia da colônia de pescadores, cozinha de praia contemporânea.",
    highlights: ["Aceita reserva", "Área externa", "Carta de vinhos"],
    facilities: ["outdoor", "ac", "bar", "cards", "accessible"],
    address: "R. Dias Ferreira, 340 - Leblon, Rio de Janeiro - RJ",
    city: "rio-de-janeiro",
    coords: { lat: -22.9838, lng: -43.2237 },
    placeId: "",
    phone: "(21) 2512-7788",
    delivery: false,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    hours: [["12:00-18:00"], null, ["19:00-23:30"], ["19:00-23:30"], ["12:00-16:00", "19:00-00:00"], ["12:00-00:00"], ["12:00-00:00"]],
    menu: [
      {
        section: "Do dia",
        items: [
          { name: "Peixe do Dia Grelhado", price: 118, popular: true, description: "Pergunte ao garçom, com legumes na brasa" },
          { name: "Ceviche de Robalo", price: 82, description: "Leite de tigre, cebola roxa e batata-doce" },
          { name: "Camarão na Moranga", price: 168, description: "Serve 2, com catupiry e arroz" },
          { name: "Arroz de Polvo", price: 142, description: "Polvo macio, açafrão e ervas frescas" }
        ]
      },
      {
        section: "Entradas",
        items: [
          { name: "Ostras Frescas (6 un.)", price: 96, popular: true, description: "De Florianópolis, com mignonette" },
          { name: "Bolinho de Camarão (5 un.)", price: 58, description: "Com maionese de limão siciliano" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Torta de Limão", price: 32, veg: true, description: "Merengue maçaricado" },
          { name: "Sorvete de Coco Queimado", price: 28, veg: true, description: "Com farofa doce de castanha" }
        ]
      }
    ]
  },

  {
    id: "ipanema-poke",
    name: "Ipanema Poke",
    cuisine: "Japonesa",
    categories: ["japonesa", "vegetariana"],
    rating: 4.5,
    reviews: 1032,
    priceLevel: 2,
    avgPerPerson: [40, 70],
    description: "Poke bowls montados na hora, peixe fresco e opções veganas.",
    highlights: ["Delivery", "Retirada rápida", "Opções veganas"],
    facilities: ["cards", "wifi", "accessible", "ac"],
    address: "R. Visconde de Pirajá, 550 - Ipanema, Rio de Janeiro - RJ",
    city: "rio-de-janeiro",
    coords: { lat: -22.9838, lng: -43.2045 },
    placeId: "",
    phone: "(21) 3592-4040",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&q=80",
    hours: [["12:00-21:00"], ["11:30-22:00"], ["11:30-22:00"], ["11:30-22:00"], ["11:30-22:30"], ["11:30-22:30"], ["12:00-22:30"]],
    menu: [
      {
        section: "Poke Bowls",
        items: [
          { name: "Poke de Salmão", price: 52, popular: true, description: "Arroz shari, salmão, edamame, manga e gergelim" },
          { name: "Poke de Atum Picante", price: 58, description: "Atum, maionese apimentada, pepino e cebolinha" },
          { name: "Poke Vegano", price: 44, veg: true, description: "Tofu grelhado, abacate, grão-de-bico e alga" },
          { name: "Monte o Seu", price: 56, description: "Escolha base, proteína, 4 toppings e molho" }
        ]
      },
      {
        section: "Acompanha",
        items: [
          { name: "Sunomono", price: 18, veg: true, description: "Pepino em conserva agridoce" },
          { name: "Edamame com Flor de Sal", price: 22, veg: true, description: "Vagem de soja no vapor" },
          { name: "Gyoza Vegana (5 un.)", price: 32, veg: true, description: "Recheio de shimeji e repolho" }
        ]
      },
      {
        section: "Bebidas",
        items: [
          { name: "Limonada de Gengibre", price: 14, veg: true, description: "Feita na hora" },
          { name: "Chá Gelado de Hibisco", price: 12, veg: true, description: "Sem açúcar" }
        ]
      }
    ]
  },

  {
    id: "confeitaria-copacabana",
    name: "Confeitaria Copacabana",
    cuisine: "Doces",
    categories: ["doces", "cafeteria"],
    rating: 4.8,
    reviews: 1547,
    priceLevel: 1,
    avgPerPerson: [20, 40],
    description: "Casa tradicional de 1948, doces de vitrine e café coado no pano.",
    highlights: ["Tradicional", "Café da manhã", "Balcão"],
    facilities: ["cards", "accessible", "ac", "wifi"],
    address: "Av. Nossa Senhora de Copacabana, 900 - Copacabana, Rio de Janeiro - RJ",
    city: "rio-de-janeiro",
    coords: { lat: -22.9711, lng: -43.1822 },
    placeId: "",
    phone: "(21) 2255-3030",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80",
    hours: [["07:00-20:00"], ["06:30-21:00"], ["06:30-21:00"], ["06:30-21:00"], ["06:30-22:00"], ["06:30-22:00"], ["07:00-22:00"]],
    menu: [
      {
        section: "Vitrine",
        items: [
          { name: "Bomba de Chocolate", price: 14, veg: true, popular: true, description: "Recheio de creme e cobertura brilhante" },
          { name: "Sonho de Creme", price: 12, veg: true, description: "Massa fofa polvilhada com açúcar" },
          { name: "Quindim", price: 10, veg: true, description: "Gema, coco e muito brilho" },
          { name: "Fatia de Bolo Prestígio", price: 16, veg: true, description: "Chocolate e coco" }
        ]
      },
      {
        section: "Salgados",
        items: [
          { name: "Pão de Queijo (2 un.)", price: 9, veg: true, popular: true, description: "Assado a cada 20 minutos" },
          { name: "Empada de Camarão", price: 18, description: "Massa amanteigada, recheio cremoso" },
          { name: "Misto Quente na Chapa", price: 16, description: "Pão francês, presunto e queijo" }
        ]
      },
      {
        section: "Cafés",
        items: [
          { name: "Café Coado", price: 6, veg: true, description: "Xícara pequena, do jeito carioca" },
          { name: "Pingado", price: 8, veg: true, description: "Café com leite quente" },
          { name: "Chocolate Quente", price: 14, veg: true, description: "Com raspas de chocolate meio amargo" }
        ]
      }
    ]
  },

  {
    id: "churrascaria-aterro",
    name: "Churrascaria Aterro",
    cuisine: "Churrasco",
    categories: ["churrasco", "brasileira"],
    rating: 4.4,
    reviews: 928,
    priceLevel: 4,
    avgPerPerson: [140, 220],
    description: "Rodízio clássico carioca com carrinho de sobremesas e vista do Aterro.",
    highlights: ["Rodízio", "Estacionamento", "Aceita reserva"],
    facilities: ["parking", "ac", "cards", "accessible", "bar", "kids"],
    address: "Av. Infante Dom Henrique, 200 - Flamengo, Rio de Janeiro - RJ",
    city: "rio-de-janeiro",
    coords: { lat: -22.935, lng: -43.175 },
    placeId: "",
    phone: "(21) 2205-9090",
    delivery: false,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    hours: [["11:30-22:00"], ["11:30-23:00"], ["11:30-23:00"], ["11:30-23:00"], ["11:30-23:30"], ["11:30-00:00"], ["11:30-23:30"]],
    menu: [
      {
        section: "Rodízio",
        items: [
          { name: "Rodízio Completo", price: 189, popular: true, description: "18 cortes, buffet de frios, sushi e sobremesa" },
          { name: "Rodízio Infantil (até 10 anos)", price: 94, description: "Metade do valor por criança" },
          { name: "Somente Buffet", price: 98, veg: true, description: "Saladas, frios e pratos quentes" }
        ]
      },
      {
        section: "Cortes à la carte",
        items: [
          { name: "Picanha Fatiada (500g)", price: 198, popular: true, description: "Serve 2, com farofa e vinagrete" },
          { name: "Fraldinha na Brasa (400g)", price: 156, description: "Selada na chapa quente" },
          { name: "Costela Fogo de Chão", price: 172, description: "Assada por 8 horas" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Abacaxi Grelhado com Canela", price: 26, veg: true, description: "Direto da grelha" },
          { name: "Petit Gateau", price: 34, veg: true, description: "Com sorvete de creme" }
        ]
      }
    ]
  },

  {
    id: "pizzaria-lagoa",
    name: "Pizzaria Lagoa",
    cuisine: "Pizza",
    categories: ["pizza", "italiana"],
    rating: 4.6,
    reviews: 743,
    priceLevel: 3,
    avgPerPerson: [60, 95],
    description: "Pizza de borda fina com vista para a Lagoa Rodrigo de Freitas.",
    highlights: ["Delivery", "Área externa", "Aceita reserva"],
    facilities: ["outdoor", "bar", "cards", "parking", "accessible"],
    address: "Av. Epitácio Pessoa, 1560 - Lagoa, Rio de Janeiro - RJ",
    city: "rio-de-janeiro",
    coords: { lat: -22.97, lng: -43.205 },
    placeId: "",
    phone: "(21) 2523-6060",
    delivery: true,
    reservation: true,
    photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    hours: [["18:00-23:30"], ["18:30-23:30"], ["18:30-23:30"], ["18:30-23:30"], ["18:30-00:30"], ["18:00-01:00"], ["18:00-01:00"]],
    menu: [
      {
        section: "Pizzas Salgadas",
        items: [
          { name: "Mussarela de Búfala", price: 68, veg: true, popular: true, description: "Tomate italiano, búfala e manjericão fresco" },
          { name: "Portuguesa", price: 64, description: "Presunto, ovo, cebola, azeitona e ervilha" },
          { name: "Frango com Catupiry", price: 66, description: "Frango desfiado e requeijão cremoso" },
          { name: "Vegetariana da Casa", price: 62, veg: true, description: "Abobrinha, berinjela, pimentão e rúcula" }
        ]
      },
      {
        section: "Pizzas Doces",
        items: [
          { name: "Banana com Canela", price: 54, veg: true, description: "Com açúcar mascavo e leite condensado" },
          { name: "Romeu e Julieta", price: 56, veg: true, description: "Goiabada cascão e queijo minas" }
        ]
      },
      {
        section: "Entradas",
        items: [
          { name: "Pão de Alho na Brasa", price: 24, veg: true, description: "4 unidades" },
          { name: "Bruschetta de Tomate", price: 34, veg: true, description: "Com azeite e orégano fresco" }
        ]
      }
    ]
  },

  /* ======================== Belo Horizonte ======================== */

  {
    id: "botequim-da-serra",
    name: "Botequim da Serra",
    cuisine: "Brasileira",
    categories: ["brasileira"],
    rating: 4.8,
    reviews: 1289,
    priceLevel: 2,
    avgPerPerson: [40, 70],
    description: "Boteco premiado da Serra, com tira-gostos mineiros e cerveja bem gelada.",
    highlights: ["Área externa", "Prêmio Comida di Buteco", "Pet friendly"],
    facilities: ["outdoor", "bar", "cards", "pet", "music"],
    address: "R. Ouro Fino, 452 - Serra, Belo Horizonte - MG",
    city: "belo-horizonte",
    coords: { lat: -19.9432, lng: -43.92 },
    placeId: "",
    phone: "(31) 3223-7070",
    delivery: false,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    hours: [["11:00-20:00"], null, ["16:00-00:00"], ["16:00-00:00"], ["16:00-01:00"], ["11:00-02:00"], ["11:00-01:00"]],
    menu: [
      {
        section: "Tira-gostos",
        items: [
          { name: "Torresmo de Rolo", price: 46, popular: true, description: "Crocante por fora, macio por dentro, com limão" },
          { name: "Frango com Quiabo na Panela", price: 52, description: "Servido com angu cremoso" },
          { name: "Linguiça Artesanal de Lagoa", price: 42, description: "Com cebola caramelizada e pão" },
          { name: "Bolinho de Feijão Tropeiro (6 un.)", price: 38, description: "Com molho de pimenta biquinho" }
        ]
      },
      {
        section: "Pratos",
        items: [
          { name: "Feijão Tropeiro Completo", price: 68, popular: true, description: "Serve 2, com couve, torresmo e ovo" },
          { name: "Costelinha na Cachaça", price: 74, description: "Com mandioca frita e vinagrete" }
        ]
      },
      {
        section: "Bar",
        items: [
          { name: "Cerveja Long Neck", price: 13, description: "Sempre a 2 graus" },
          { name: "Cachaça Artesanal (dose)", price: 16, description: "Seleção de alambiques mineiros" },
          { name: "Caipirinha de Maracujá", price: 24, description: "Com cachaça envelhecida" }
        ]
      }
    ]
  },

  {
    id: "cafe-savassi",
    name: "Café Savassi",
    cuisine: "Cafeteria",
    categories: ["cafeteria", "doces"],
    rating: 4.7,
    reviews: 486,
    priceLevel: 2,
    avgPerPerson: [28, 50],
    description: "Cafés do Sul de Minas em métodos filtrados e pão de queijo o dia todo.",
    highlights: ["WiFi gratuito", "Bom pra trabalhar", "Café da manhã"],
    facilities: ["wifi", "outdoor", "cards", "accessible", "ac"],
    address: "R. Antônio de Albuquerque, 620 - Savassi, Belo Horizonte - MG",
    city: "belo-horizonte",
    coords: { lat: -19.938, lng: -43.933 },
    placeId: "",
    phone: "(31) 3287-1515",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    hours: [["08:00-16:00"], ["07:00-20:00"], ["07:00-20:00"], ["07:00-20:00"], ["07:00-21:00"], ["07:30-21:00"], ["08:00-19:00"]],
    menu: [
      {
        section: "Cafés",
        items: [
          { name: "Espresso do Sul de Minas", price: 8, veg: true, description: "Torra média, notas de chocolate" },
          { name: "Coado Prensa Francesa", price: 16, veg: true, popular: true, description: "Serve 2 xícaras" },
          { name: "Latte com Doce de Leite", price: 18, veg: true, description: "Doce de leite da fazenda" }
        ]
      },
      {
        section: "Da chapa",
        items: [
          { name: "Pão de Queijo (3 un.)", price: 12, veg: true, popular: true, description: "Queijo canastra, assado na hora" },
          { name: "Tostex de Queijo Minas", price: 22, veg: true, description: "Pão de forma artesanal prensado" },
          { name: "Broa de Fubá", price: 10, veg: true, description: "Fatia generosa, com erva-doce" }
        ]
      },
      {
        section: "Café da manhã",
        items: [
          { name: "Combo Mineiro", price: 42, veg: true, description: "Café, suco, pão de queijo, ovos e frutas" },
          { name: "Tapioca de Queijo e Tomate", price: 26, veg: true, description: "Massa fininha, feita na hora" }
        ]
      }
    ]
  },

  {
    id: "horta-mineira",
    name: "Horta Mineira",
    cuisine: "Vegetariana",
    categories: ["vegetariana", "brasileira"],
    rating: 4.9,
    reviews: 331,
    priceLevel: 2,
    avgPerPerson: [35, 58],
    description: "Comida mineira vegetariana no fogão a lenha, com legumes de produtores locais.",
    highlights: ["Delivery", "Buffet no almoço", "Sem glúten"],
    facilities: ["outdoor", "cards", "accessible", "wifi", "pet"],
    address: "R. Aarão Reis, 180 - Santo Antônio, Belo Horizonte - MG",
    city: "belo-horizonte",
    coords: { lat: -19.953, lng: -43.943 },
    placeId: "",
    phone: "(31) 3296-4422",
    delivery: true,
    reservation: false,
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
    hours: [null, ["11:00-15:30"], ["11:00-15:30"], ["11:00-15:30"], ["11:00-15:30"], ["11:00-15:30", "18:30-22:00"], ["11:00-16:00"]],
    menu: [
      {
        section: "Almoço",
        items: [
          { name: "Buffet Vegetariano (por pessoa)", price: 52, veg: true, popular: true, description: "Mais de 15 pratos, sobremesa inclusa" },
          { name: "Tutu de Feijão Vegano", price: 46, veg: true, description: "Com couve, angu e banana frita" },
          { name: "Ora-pro-nóbis na Panela", price: 48, veg: true, description: "Refogado com milho verde e arroz" }
        ]
      },
      {
        section: "Da horta",
        items: [
          { name: "Salada de Folhas Orgânicas", price: 32, veg: true, description: "Colhidas na manhã do dia" },
          { name: "Legumes Assados no Lenha", price: 38, veg: true, description: "Com pesto de manjericão" }
        ]
      },
      {
        section: "Sobremesas",
        items: [
          { name: "Doce de Abóbora com Coco", price: 16, veg: true, description: "Receita da vovó, em calda" },
          { name: "Goiabada Cascão com Queijo", price: 18, veg: true, popular: true, description: "Queijo canastra meia-cura" }
        ]
      }
    ]
  }
];
