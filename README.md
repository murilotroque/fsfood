# FR · FoodRadar

**FR · FoodRadar** — plataforma de descoberta de restaurantes com **cardápio completo e preço transparente**.
Protótipo funcional em HTML/CSS/JS puro — sem build, sem dependências. Basta abrir o `index.html`.

## A ideia

Escolher onde comer ainda costuma exigir alternar entre mapas, redes sociais e links de cardápio — e, mesmo assim, chegar ao restaurante sem saber quanto vai gastar. O FoodRadar reúne a descoberta do lugar e o que realmente orienta a decisão: **o cardápio completo, os pratos e seus preços**.

O produto combina dois tipos de informação. A base própria guarda os dados que precisam ser confiáveis e mantidos pelo restaurante, como cardápio, preço e média por pessoa. Já o OpenStreetMap amplia a descoberta para qualquer região do Brasil, exibindo locais reais ainda sem cardápio cadastrado e criando uma porta de entrada para que esses estabelecimentos participem da plataforma.

Em resumo: mapas ajudam a encontrar restaurantes; o FoodRadar foi pensado para ajudar a escolher um, com clareza antes de sair de casa.

## Como rodar

Duplo clique em `index.html`. Só isso.

Para gerar uma versão em arquivo único (fácil de mandar por e-mail ou hospedar):

```bash
powershell -ExecutionPolicy Bypass -File build.ps1
```

Saída: `dist/foodradar.html` (~158 KB, tudo embutido).

## Estrutura

```
index.html          casca da página (header + footer + <main id="app">)
css/styles.css      design system inteiro (tokens, cards, página do restaurante)
js/config.js        API key do Google + localização padrão + moeda
js/data.js          CATEGORIES, FACILITIES e RESTAURANTS (cardápios e preços)
js/maps.js          mapa (Leaflet/OSM ou Google) + autocomplete de lugares
js/osm.js           catálogo aberto: restaurantes reais via Overpass API
js/app.js           router por hash + as duas telas
build.ps1           gera dist/foodradar.html em arquivo único
```

## O que já funciona

**Home**
- Busca que varre nome, cozinha, endereço **e itens do cardápio** ("carbonara", "ramen", "brigadeiro")
- 12 categorias em carrossel
- Filtros: aberto agora, delivery, aceita reserva, faixa de preço ($ a $$$$)
- Ordenação: relevância, mais perto, melhor avaliados, menor/maior preço
- Cards com nota, distância, 2 pratos com preço, tags e média por pessoa
- Favoritos salvos em `localStorage`

**Seletor de localização** (botão do topo, duas formas de escolher o ponto de partida)
- **Usar minha localização atual** — GPS do navegador, ordena por proximidade
- **Buscar um lugar** — a pessoa digita "belo hori" e as sugestões aparecem abaixo
  ("Belo Horizonte · MG, Brasil"). Cobre o Brasil inteiro: cidade, bairro ou rua.
  Usa o **Photon** (OpenStreetMap), sem chave — o Nominatim proíbe type-ahead na
  política dele, por isso não serve aqui.
- Ao abrir, o seletor já lista as cidades cobertas com a contagem de restaurantes
- Só aparecem restaurantes dentro de `NEARBY_RADIUS_KM` (30 km) do ponto escolhido
- A distância no card muda de "900 m **de você**" (GPS) para "**a** 900 m" (lugar
  escolhido) — não faz sentido dizer "de você" pra quem está a 400 km dali

**Tema claro / escuro** (botão do header)
- Sem escolha salva, segue o `prefers-color-scheme` do sistema
- O botão grava a escolha em `localStorage` e ela passa a valer mesmo se o sistema mudar
- Um script inline no `<head>` aplica o tema antes da primeira pintura — sem ele a
  página pisca branca antes de virar escura
- Toda cor nasce como token no `:root` claro; os blocos escuros só **redefinem** tokens.
  Nenhuma cor tem sua única definição dentro de um bloco escuro.
- Os tiles do OpenStreetMap são claros por natureza: no tema escuro levam um filtro
  (`--tile-filter`) para não virarem um retângulo branco no meio do card
- O gradiente do placeholder de foto recebe do JS só a **matiz**; saturação e
  luminosidade vêm do tema

**Página do restaurante**
- Foto de capa, nome, estrelas com fração real, nota, nº de avaliações, cozinha, faixa `$`
- Cardápio completo por seção, com descrição, preço e selos `Popular` / `Vegetariano`
- Sidebar: mapa, endereço, distância, horário com "aberto agora / fecha às 23:00",
  semana completa, faixa de preço médio por pessoa, facilidades, "Como chegar" e telefone

## Cobertura: Brasil inteiro, com duas fontes

A plataforma junta duas camadas, e a diferença entre elas é o produto:

| Camada | Fonte | Tem cardápio? |
|---|---|---|
| Restaurantes do FoodRadar | `js/data.js` (seu banco, no futuro) | **sim — com preço por prato** |
| Catálogo aberto | OpenStreetMap via Overpass (`js/osm.js`) | não |

Buscou uma região onde o FoodRadar ainda não tem cardápio cadastrado? O app consulta o
OpenStreetMap e mostra os restaurantes reais que existem ali, marcados como
**"Cardápio ainda não cadastrado"**, com um caminho para o dono se cadastrar.
É como a plataforma sai do zero em qualquer cidade sem inventar dado.

O que o OSM entrega: nome, tipo de cozinha, coordenada e — quando alguém mapeou —
endereço, telefone, site e horário. Numa amostra real de Santos, 26 restaurantes:
todos com nome e coordenada, 14 com cozinha, 7 com endereço, 3 com horário.
Nenhum com cardápio ou preço. Essa parte é sua.

### Cuidados com o Overpass

- **Não consulte do navegador de cada visitante.** São servidores voluntários. O
  `js/osm.js` só chama quando a região tem menos de 3 restaurantes próprios, guarda
  24h no `localStorage` e faz uma requisição por vez. Em produção, rode offline uma
  vez e grave no seu banco.
- **Eles caem.** É comum receber 504 ou uma página de erro sem cabeçalho CORS (o
  navegador reporta "Failed to fetch"). O app tenta dois espelhos e, se ambos
  falharem, mostra um aviso com botão de tentar de novo — não uma tela vazia.
- **Só espelhos com cobertura mundial.** Vários espelhos públicos são regionais
  (`overpass.osm.ch` só tem a Suíça) e respondem HTTP 200 com zero elementos — o app
  concluiria que não existe restaurante nenhum na cidade. Pior que um erro.
- **Licença ODbL**: atribuição obrigatória, e leia as regras antes de redistribuir a base.

## Mapa

O mapa da página do restaurante é **OpenStreetMap via Leaflet** por padrão: sem chave,
sem cartão, sem cota. O Leaflet é carregado sob demanda do cdnjs — quem só usa a home
não baixa nada.

Escolha o motor em `js/config.js`:

```js
MAP_PROVIDER: "auto"   // Google se houver API key, senão OpenStreetMap
                       // "osm" | "google" | "none" forçam a escolha
```

Dois pontos sobre usar o OSM:

- **A atribuição "© OpenStreetMap" no canto do mapa é obrigatória** (licença ODbL).
  Não remova.
- Os tiles vêm de `tile.openstreetmap.org`, que é mantido por doação e tem
  [política de uso](https://operations.osmfoundation.org/policies/tiles/) —
  ok para protótipo e tráfego baixo. Com volume real, troque por um provedor de
  tiles (MapTiler, Stadia, Thunderforest) ou hospede os seus.

## Google Maps (opcional)

Cole a chave em `js/config.js` e habilite no Google Cloud Console:

| API | Para quê |
|---|---|
| Maps JavaScript API | renderizar o mapa na página do restaurante |
| Places API (New) | endereço oficial, horário, "aberto agora", fotos, nota |
| Places Autocomplete | sugestões no seletor de localização (qualquer cidade, bairro ou endereço do Brasil) |
| Geocoding API | nome do bairro a partir do GPS do usuário |

Sem chave nada quebra: o mapa usa OpenStreetMap, o botão "Como chegar" continua
abrindo o Google Maps por URL (não precisa de chave), o autocomplete cai na lista de
~60 cidades em `window.PLACES` (`js/data.js`) e todo o resto usa os dados locais.

### O que o Google **não** resolve

O Places não devolve item de cardápio com preço. Cardápio, preço, seção, selo de
vegetariano e média por pessoa são **conteúdo próprio da plataforma** — é justamente
o diferencial do produto e o que dá trabalho de manter atualizado. O Google entra só
como camada de contexto (onde fica, está aberto, como é o lugar).

## Próximos passos sugeridos

1. **Backend + painel do restaurante** — o dono atualiza o próprio cardápio; é o que
   mantém o preço confiável. Sem isso, os dados envelhecem em semanas.
2. **Data de verificação** — mostrar "preços conferidos em 12/set" gera confiança e
   protege a marca quando um preço estiver defasado.
3. **Busca por prato** como entrada principal ("quero comer ramen até R$ 60").
4. Migrar para React/Next quando houver backend — a separação atual
   (dados → adaptador → views) já foi pensada para isso.

## Aviso

Os 21 restaurantes de `js/data.js` são fictícios, para demonstração —
12 em São Paulo, 6 no Rio de Janeiro e 3 em Belo Horizonte.
Fotos vêm do Unsplash e servem como placeholder.
