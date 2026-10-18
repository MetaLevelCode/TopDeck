// ==========================================================================
// TOP DECK TCG — DATA, MASCOTS, CURATED MTG VAULT & TAVERN ECOSYSTEM
// ==========================================================================

window.TOPDECK_DATA = {
  // 1. ELENCO DE MASCOTAS (WEB + 5 SECCIONES PWA)
  mascots: {
    dexter: {
      id: "dexter",
      name: "DEXTER",
      title: "El Zorro Mago Archivista",
      role: "Anfitrión Principal & Guardián de la Bóveda",
      badgeColor: "#D97706",
      bgAccent: "#FEF3C7",
      borderColor: "#92400E",
      emoji: "🦊",
      avatarSvg: `<svg viewBox="0 0 64 64" class="w-full h-full">
        <rect width="64" height="64" fill="#382414"/>
        <!-- Wizard Hat -->
        <polygon points="32,4 12,26 52,26" fill="#4A2B11" stroke="#F29F38" stroke-width="2"/>
        <rect x="8" y="24" width="48" height="5" fill="#F29F38"/>
        <!-- Fox Ears -->
        <polygon points="16,24 12,10 24,20" fill="#D97706"/>
        <polygon points="48,24 52,10 40,20" fill="#D97706"/>
        <!-- Fox Face -->
        <rect x="16" y="28" width="32" height="24" rx="4" fill="#EA580C"/>
        <polygon points="16,40 32,54 48,40" fill="#FFF9EE"/>
        <!-- Glasses & Eyes -->
        <rect x="20" y="33" width="9" height="7" fill="#1F1B0E" stroke="#FBBF24" stroke-width="2"/>
        <rect x="35" y="33" width="9" height="7" fill="#1F1B0E" stroke="#FBBF24" stroke-width="2"/>
        <line x1="29" y1="36" x2="35" y2="36" stroke="#FBBF24" stroke-width="2"/>
        <rect x="23" y="35" width="3" height="3" fill="#FFF"/>
        <rect x="38" y="35" width="3" height="3" fill="#FFF"/>
        <!-- Nose -->
        <rect x="30" y="46" width="4" height="4" fill="#1F1B0E"/>
      </svg>`,
      welcomeWeb: "¡Bienvenido a la taberna de TopDeck, viajero! Soy Dexter. Dime qué carta buscas por su nombre, o explora por color, sinergia o rol para tu mazo. ¡Haz clic en cualquier carta de mi carpeta para sacarla de la funda e inspeccionarla en 3D como si la tuvieras en tus manos!"
    },
    barnaby: {
      id: "barnaby",
      name: "BARNABY",
      title: "El Tejón Maestro Tabernero",
      role: "Comandas a Mesa & Cocina del Gremio",
      badgeColor: "#B45309",
      bgAccent: "#FFEDD5",
      borderColor: "#7C2D12",
      emoji: "🍺",
      avatarSvg: `<svg viewBox="0 0 64 64" class="w-full h-full">
        <rect width="64" height="64" fill="#431407"/>
        <circle cx="18" cy="18" r="7" fill="#57534E"/>
        <circle cx="46" cy="18" r="7" fill="#57534E"/>
        <rect x="14" y="18" width="36" height="32" rx="8" fill="#44403C"/>
        <!-- Badger Stripes -->
        <rect x="22" y="18" width="6" height="26" fill="#F5F5F4"/>
        <rect x="36" y="18" width="6" height="26" fill="#F5F5F4"/>
        <!-- Eyes & Chef Mustache -->
        <rect x="22" y="28" width="5" height="5" fill="#1C1917"/>
        <rect x="37" y="28" width="5" height="5" fill="#1C1917"/>
        <rect x="28" y="36" width="8" height="5" rx="2" fill="#1C1917"/>
        <path d="M20 44 Q32 39 44 44" stroke="#D97706" stroke-width="4" fill="none"/>
        <rect x="18" y="50" width="28" height="10" fill="#F59E0B"/>
      </svg>`,
      greeting: "¡Pasa, toma asiento! Ingresa el código de tu mesa y te llevamos hidromiel fría, café de maná o nachos recién salidos del horno sin que pauses tu partida."
    },
    vulkan: {
      id: "vulkan",
      name: "VULKAN",
      title: "El Grifo Juez & Estratega",
      role: "Torneos Oficiales, Pairings & Ranking ELO",
      badgeColor: "#DC2626",
      bgAccent: "#FEE2E2",
      borderColor: "#991B1B",
      emoji: "🦁",
      avatarSvg: `<svg viewBox="0 0 64 64" class="w-full h-full">
        <rect width="64" height="64" fill="#450A0A"/>
        <!-- Crown / Helmet -->
        <polygon points="14,22 22,8 32,18 42,8 50,22" fill="#FBBF24" stroke="#382414" stroke-width="2"/>
        <!-- Gryphon Head -->
        <rect x="16" y="22" width="32" height="28" rx="4" fill="#B45309"/>
        <polygon points="26,34 38,34 32,48" fill="#F59E0B" stroke="#382414" stroke-width="2"/>
        <rect x="20" y="27" width="6" height="4" fill="#FEF08A"/>
        <rect x="38" y="27" width="6" height="4" fill="#FEF08A"/>
      </svg>`,
      greeting: "¡Silencio en la sala de torneo! Aquí puedes inscribirte al FNM de hoy, consultar tu mesa asignada en la ronda activa, reportar resultados y revisar tu ELO competitivo."
    },
    pip: {
      id: "pip",
      name: "PIP",
      title: "El Duendecillo de Mesa",
      role: "Contador de Vidas Commander, Dados & Casual",
      badgeColor: "#16A34A",
      bgAccent: "#DCFCE7",
      borderColor: "#166534",
      emoji: "👺",
      avatarSvg: `<svg viewBox="0 0 64 64" class="w-full h-full">
        <rect width="64" height="64" fill="#052E16"/>
        <!-- Goblin Ears -->
        <polygon points="4,26 18,22 16,36" fill="#22C55E"/>
        <polygon points="60,26 46,22 48,36" fill="#22C55E"/>
        <!-- Head -->
        <rect x="16" y="18" width="32" height="30" rx="6" fill="#16A34A"/>
        <!-- Cap -->
        <polygon points="16,20 36,6 48,20" fill="#F29F38"/>
        <!-- Big Eyes & Grin -->
        <circle cx="25" cy="30" r="4" fill="#FEF08A"/>
        <circle cx="39" cy="30" r="4" fill="#FEF08A"/>
        <circle cx="25" cy="30" r="2" fill="#000"/>
        <circle cx="39" cy="30" r="2" fill="#000"/>
        <rect x="22" y="39" width="20" height="5" fill="#FFF"/>
      </svg>`,
      greeting: "¡Jejeje! ¿Mesa de Commander de 4 jugadores o duelo rápido? Yo llevo las vidas, el daño de comandante, el veneno y lanzo el D20 para que nadie haga trampa."
    },
    vespera: {
      id: "vespera",
      name: "MADAME VESPERA",
      title: "La Lechuza del Oráculo Astral",
      role: "Tarot del Planeswalker & Sobres de la Suerte",
      badgeColor: "#7C3AED",
      bgAccent: "#F3E8FF",
      borderColor: "#5B21B6",
      emoji: "🦉",
      avatarSvg: `<svg viewBox="0 0 64 64" class="w-full h-full">
        <rect width="64" height="64" fill="#2E1065"/>
        <!-- Mystic Hood -->
        <polygon points="32,6 8,28 12,56 52,56 56,28" fill="#5B21B6" stroke="#C084FC" stroke-width="2"/>
        <!-- Owl Face -->
        <circle cx="25" cy="34" r="7" fill="#FDE047" stroke="#1E1B4B" stroke-width="2"/>
        <circle cx="39" cy="34" r="7" fill="#FDE047" stroke="#1E1B4B" stroke-width="2"/>
        <circle cx="25" cy="34" r="3" fill="#1E1B4B"/>
        <circle cx="39" cy="34" r="3" fill="#1E1B4B"/>
        <!-- Third Eye Gem -->
        <polygon points="32,18 28,24 32,28 36,24" fill="#38BDF8"/>
        <polygon points="29,40 35,40 32,47" fill="#F59E0B"/>
      </svg>`,
      greeting: "Las líneas de maná susurran tu destino... Destapa las 3 cartas del Tarot del Planeswalker para conocer el augurio de tus partidas hoy, o prueba tu fortuna abriendo un Sobre Misterioso."
    }
  },

  // 2. BOTONES DE SINERGIA Y FUNCIONALIDAD DE DEXTER (CON QUERIES SCRYFALL REALES)
  synergies: [
    {
      id: "all",
      label: "✨ Joyas de la Bóveda",
      shortLabel: "Todas",
      query: "",
      speech: "He abierto la página principal de nuestra carpeta maestra. Aquí están las cartas más codiciadas hoy en TopDeck. ¡Haz clic en cualquiera para sacarla de su funda y tocarla en 3D!"
    },
    {
      id: "ramp",
      label: "🌿 Ramp & Maná Rápido",
      shortLabel: "Ramp / Maná",
      query: '(o:"add {" or o:"search your library for a basic land") f:commander',
      speech: "¡Todo gran mazo necesita acelerar su maná! Te muestro artefactos de maná rápido, rituales y buscadores de tierras para que juegues tus amenazas turnos antes."
    },
    {
      id: "draw",
      label: "🧠 Robo & Ventaja de Cartas",
      shortLabel: "Robo Cartas",
      query: 'o:"draw" (o:"card" or o:"cards") cmc<=4 f:commander',
      speech: "¡Quien roba más cartas domina la partida! Estas piezas mantienen tu mano llena castigando a tus oponentes o convirtiendo tus recursos en combustible puro."
    },
    {
      id: "graveyard",
      label: "💀 Cementerio & Reanimar",
      shortLabel: "Cementerio",
      query: 'o:"graveyard" (o:"return" or o:"put") f:commander',
      speech: "¡En Magic el cementerio es solo una segunda mano! Con estas sinergias podrás reanimar criaturas colosales o reciclar hechizos clave una y otra vez."
    },
    {
      id: "removal",
      label: "🔥 Removal & Control de Mesa",
      shortLabel: "Removal / Control",
      query: '(o:"destroy target" or o:"exile target" or o:"counter target" or o:"destroy all") f:commander',
      speech: "¿Un oponente se está saliendo de control? Aquí tienes las mejores respuestas instantáneas, contrahechizos e iras masivas para limpiar la mesa."
    },
    {
      id: "tokens",
      label: "💎 Tokens, Tesoros & Duplicar",
      shortLabel: "Tokens / Tesoros",
      query: '(o:"create" o:"token") f:commander',
      speech: "¡Multiplica tu ejército y tus recursos! Estas cartas generan fichas de Tesoro, demonios, espíritus o duplican cada contador y token que pongas en juego."
    },
    {
      id: "commanders",
      label: "👑 Comandantes Top Tier",
      shortLabel: "Comandantes",
      query: 'is:commander f:commander',
      speech: "¿Buscando liderar un nuevo mazo de Commander? Estos son los Comandantes más temidos y versátiles disponibles en nuestra bóveda hoy."
    }
  ],

  // 3. CATÁLOGO BASE INSTANTÁNEO DE LA BÓVEDA (18 CARTAS ICÓNICAS MTG = 2 PÁGINAS DE 9 BOLSILLOS)
  initialCards: [
    {
      id: "the-one-ring",
      name: "The One Ring",
      mana_cost: "{4}",
      cmc: 4,
      type_line: "Legendary Artifact",
      oracle_text: "Indestructible\nWhen The One Ring enters, if you cast it, you gain protection from everything until your next turn.\nAt the beginning of your upkeep, you lose 1 life for each burden counter on The One Ring.\n{T}: Put a burden counter on The One Ring, then draw a card for each burden counter on it.",
      set: "LTR",
      set_name: "The Lord of the Rings: Tales of Middle-earth",
      collector_number: "246",
      rarity: "mythic",
      colors: [],
      color_identity: [],
      synergyTags: ["draw", "all"],
      dexterNote: "Motor de robo absoluto e inmunidad por un turno completo. Encaja en literalmente cualquier mazo competitivo o Commander.",
      priceUsd: 98.50,
      priceCop: 413700,
      stock: 3,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/d/5/d5806e68-1054-458e-866d-1f2470f682b2.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "legal", vintage: "legal" }
    },
    {
      id: "sheoldred-apocalypse",
      name: "Sheoldred, the Apocalypse",
      mana_cost: "{2}{B}{B}",
      cmc: 4,
      type_line: "Legendary Creature — Phyrexian Praetor",
      oracle_text: "Deathtouch\nWhenever you draw a card, you gain 2 life.\nWhenever an opponent draws a card, they lose 2 life.",
      set: "DMU",
      set_name: "Dominaria United",
      collector_number: "107",
      rarity: "mythic",
      colors: ["B"],
      color_identity: ["B"],
      synergyTags: ["draw", "commanders", "all"],
      dexterNote: "Castiga el robo rival y estabiliza tus vidas al instante. Si la combinas con efectos tipo Wheel, ganas en el acto.",
      priceUsd: 74.00,
      priceCop: 310800,
      stock: 2,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/d/6/d67be074-cdd4-41d9-ac89-0a0456c4e4b2.jpg",
      legalities: { commander: "legal", modern: "legal", pioneer: "legal", standard: "legal" }
    },
    {
      id: "atraxa-grand-unifier",
      name: "Atraxa, Grand Unifier",
      mana_cost: "{3}{G}{W}{U}{B}",
      cmc: 7,
      type_line: "Legendary Creature — Phyrexian Angel",
      oracle_text: "Flying, vigilance, deathtouch, lifelink\nWhen Atraxa, Grand Unifier enters, reveal the top ten cards of your library. For each card type, you may put a card of that type from among the revealed cards into your hand.",
      set: "ONE",
      set_name: "Phyrexia: All Will Be One",
      collector_number: "196",
      rarity: "mythic",
      colors: ["W", "U", "B", "G"],
      color_identity: ["W", "U", "B", "G"],
      synergyTags: ["commanders", "draw", "graveyard", "all"],
      dexterNote: "Reina indiscutible tanto como Comandante de 4 colores como objetivo de reanimación del cementerio. Recarga tu mano con 4 a 6 cartas al entrar.",
      priceUsd: 26.50,
      priceCop: 111300,
      stock: 4,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/4/a/4a1f905f-1d55-4d02-9d24-e58070793d3f.jpg",
      legalities: { commander: "legal", modern: "legal", pioneer: "legal", standard: "legal" }
    },
    {
      id: "sol-ring",
      name: "Sol Ring",
      mana_cost: "{1}",
      cmc: 1,
      type_line: "Artifact",
      oracle_text: "{T}: Add {C}{C}.",
      set: "CMM",
      set_name: "Commander Masters",
      collector_number: "396",
      rarity: "uncommon",
      colors: [],
      color_identity: [],
      synergyTags: ["ramp", "all"],
      dexterNote: "El emblema de Commander. Costo 1 que produce 2 manás incoloros desde el turno 1. Ningún mazo de 99 cartas sale de casa sin él.",
      priceUsd: 18.00,
      priceCop: 75600,
      stock: 9,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/4/c/4cbc6901-6a4a-4d0a-83ea-7eefa3b35021.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "banned", vintage: "restricted" }
    },
    {
      id: "demonic-tutor",
      name: "Demonic Tutor",
      mana_cost: "{1}{B}",
      cmc: 2,
      type_line: "Sorcery",
      oracle_text: "Search your library for a card, put that card into your hand, then shuffle.",
      set: "CMM",
      set_name: "Commander Masters",
      collector_number: "150",
      rarity: "mythic",
      colors: ["B"],
      color_identity: ["B"],
      synergyTags: ["draw", "graveyard", "all"],
      dexterNote: "Por solo 2 manás buscas exactamente la pieza de combo, tierra o respuesta que necesitas sin mostrarla a tus oponentes.",
      priceUsd: 44.00,
      priceCop: 184800,
      stock: 2,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/a/2/a24b652c-7359-4556-82ae-c94380eb922c.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "banned", vintage: "restricted" }
    },
    {
      id: "rhystic-study",
      name: "Rhystic Study",
      mana_cost: "{2}{U}",
      cmc: 3,
      type_line: "Enchantment",
      oracle_text: "Whenever an opponent casts a spell, you may draw a card unless that player pays {1}.",
      set: "WOT",
      set_name: "Wilds of Eldraine: Enchanting Tales",
      collector_number: "25",
      rarity: "mythic",
      colors: ["U"],
      color_identity: ["U"],
      synergyTags: ["draw", "all"],
      dexterNote: "'¿Pagas el 1?' La pregunta más famosa en las mesas de TopDeck. En mesas de 4 jugadores te dará docenas de cartas gratis.",
      priceUsd: 52.00,
      priceCop: 218400,
      stock: 3,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/d/6/d6914dba-0d27-4055-ac34-b3ebf5802221.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "legal", vintage: "legal" }
    },
    {
      id: "cyclonic-rift",
      name: "Cyclonic Rift",
      mana_cost: "{1}{U}",
      cmc: 2,
      type_line: "Instant",
      oracle_text: "Return target nonland permanent you don't control to its owner's hand.\nOverload {6}{U} (You may cast this spell for its overload cost. If you do, change 'target' in its text to 'each'.)",
      set: "RVR",
      set_name: "Ravnica Remastered",
      collector_number: "40",
      rarity: "rare",
      colors: ["U"],
      color_identity: ["U"],
      synergyTags: ["removal", "all"],
      dexterNote: "El reinicio asimétrico definitivo: devuelve todos los permanentes que no sean tierra de tus rivales a sus manos a velocidad de instantáneo.",
      priceUsd: 36.50,
      priceCop: 153300,
      stock: 5,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/d/f/dfb7c4b9-f2f4-4d4e-baf2-86551c8150fe.jpg",
      legalities: { commander: "legal", modern: "legal", pioneer: "legal", legacy: "legal" }
    },
    {
      id: "ragavan-pilferer",
      name: "Ragavan, Nimble Pilferer",
      mana_cost: "{R}",
      cmc: 1,
      type_line: "Legendary Creature — Monkey Pirate",
      oracle_text: "Whenever Ragavan, Nimble Pilferer deals combat damage to a player, create a Treasure token and exile the top card of that player's library. Until end of turn, you may cast that card.\nDash {1}{R}",
      set: "MH2",
      set_name: "Modern Horizons 2",
      collector_number: "138",
      rarity: "mythic",
      colors: ["R"],
      color_identity: ["R"],
      synergyTags: ["ramp", "tokens", "commanders", "all"],
      dexterNote: "Turno 1 explosivo: genera fichas de Tesoro y roba la carta superior de la biblioteca rival.",
      priceUsd: 42.25,
      priceCop: 177450,
      stock: 3,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg",
      legalities: { commander: "legal", modern: "legal", legacy: "banned", vintage: "legal" }
    },
    {
      id: "doubling-season",
      name: "Doubling Season",
      mana_cost: "{4}{G}",
      cmc: 5,
      type_line: "Enchantment",
      oracle_text: "If an effect would create one or more tokens under your control, it creates twice that many of those tokens instead.\nIf an effect would put one or more counters on a permanent you control, it puts twice that many of those counters on that permanent instead.",
      set: "WOT",
      set_name: "Wilds of Eldraine: Enchanting Tales",
      collector_number: "52",
      rarity: "mythic",
      colors: ["G"],
      color_identity: ["G"],
      synergyTags: ["tokens", "all"],
      dexterNote: "Duplica todos tus tokens y hace que tus Planeswalkers entren con el doble de lealtad listos para activar su habilidad definitiva.",
      priceUsd: 48.00,
      priceCop: 201600,
      stock: 2,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/1/6/16d9c9a9-2c7b-4604-95b2-a2809804eb12.jpg",
      legalities: { commander: "legal", modern: "legal", legacy: "legal", vintage: "legal" }
    },
    // PAGE 2 OF BINDER (Cards 10-18)
    {
      id: "reanimate",
      name: "Reanimate",
      mana_cost: "{B}",
      cmc: 1,
      type_line: "Sorcery",
      oracle_text: "Put target creature card from a graveyard onto the battlefield under your control. You lose life equal to its mana value.",
      set: "OTP",
      set_name: "Breaking News",
      collector_number: "18",
      rarity: "mythic",
      colors: ["B"],
      color_identity: ["B"],
      synergyTags: ["graveyard", "all"],
      dexterNote: "La carta insignia de la nigromancia en Magic: por un solo maná negro traes cualquier criatura de cualquier cementerio a tu lado del campo.",
      priceUsd: 16.50,
      priceCop: 69300,
      stock: 4,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/d/2/d27c6aaa-289e-451e-8fde-91a037c55468.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "legal", vintage: "legal" }
    },
    {
      id: "swords-to-plowshares",
      name: "Swords to Plowshares",
      mana_cost: "{W}",
      cmc: 1,
      type_line: "Instant",
      oracle_text: "Exile target creature. Its controller gains life equal to its power.",
      set: "CMM",
      set_name: "Commander Masters",
      collector_number: "60",
      rarity: "uncommon",
      colors: ["W"],
      color_identity: ["W"],
      synergyTags: ["removal", "all"],
      dexterNote: "El removal blanco más eficiente de todos los tiempos: exilia cualquier amenaza indestructibe por solo {W} a velocidad de instantáneo.",
      priceUsd: 4.50,
      priceCop: 18900,
      stock: 12,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/9/b/9bbec76c-c1e4-4c6d-ad24-078fe097f195.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "legal", vintage: "legal" }
    },
    {
      id: "smothering-tithe",
      name: "Smothering Tithe",
      mana_cost: "{3}{W}",
      cmc: 4,
      type_line: "Enchantment",
      oracle_text: "Whenever an opponent draws a card, that player may pay {2}. If the player doesn't, you create a Treasure token.",
      set: "WOT",
      set_name: "Wilds of Eldraine: Enchanting Tales",
      collector_number: "13",
      rarity: "mythic",
      colors: ["W"],
      color_identity: ["W"],
      synergyTags: ["ramp", "tokens", "all"],
      dexterNote: "Inunda tu mesa de fichas de Tesoro cada vez que tus oponentes roban cartas. Aceleración explosiva en blanco.",
      priceUsd: 31.00,
      priceCop: 130200,
      stock: 3,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/8/6/861b5889-0183-4bee-afeb-a4b2aa700a8e.jpg",
      legalities: { commander: "legal", modern: "legal", pioneer: "legal", legacy: "legal" }
    },
    {
      id: "edgar-markov",
      name: "Edgar Markov",
      mana_cost: "{3}{R}{W}{B}",
      cmc: 6,
      type_line: "Legendary Creature — Vampire Knight",
      oracle_text: "Eminence — Whenever you cast another Vampire spell, if Edgar Markov is in the command zone or on the battlefield, create a 1/1 black Vampire creature token.\nFirst strike, haste\nWhenever Edgar Markov attacks, put a +1/+1 counter on each Vampire you control.",
      set: "C17",
      set_name: "Commander 2017",
      collector_number: "36",
      rarity: "mythic",
      colors: ["R", "W", "B"],
      color_identity: ["R", "W", "B"],
      synergyTags: ["commanders", "tokens", "all"],
      dexterNote: "Gracias a Eminencia, genera vampiros gratis desde la zona de mando sin siquiera tener que lanzarlo. Pieza de colección de altísima demanda.",
      priceUsd: 112.00,
      priceCop: 470400,
      stock: 1,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/8/d/8d94b8ec-ecda-43c8-a60e-1ba33e6a54a4.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "legal", vintage: "legal" }
    },
    {
      id: "force-of-will",
      name: "Force of Will",
      mana_cost: "{3}{U}{U}",
      cmc: 5,
      type_line: "Instant",
      oracle_text: "You may pay 1 life and exile a blue card from your hand rather than pay this spell's mana cost.\nCounter target spell.",
      set: "DMR",
      set_name: "Dominaria Remastered",
      collector_number: "48",
      rarity: "mythic",
      colors: ["U"],
      color_identity: ["U"],
      synergyTags: ["removal", "all"],
      dexterNote: "El guardián supremo de formatos eternos: detiene cualquier combo incluso cuando estás completamente girado sin maná.",
      priceUsd: 68.00,
      priceCop: 285600,
      stock: 2,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/8/9/89f612d6-7c59-4a7b-a87d-45f789e88ba5.jpg",
      legalities: { commander: "legal", modern: "banned", legacy: "legal", vintage: "legal" }
    },
    {
      id: "birds-of-paradise",
      name: "Birds of Paradise",
      mana_cost: "{G}",
      cmc: 1,
      type_line: "Creature — Bird",
      oracle_text: "Flying\n{T}: Add one mana of any color.",
      set: "RVR",
      set_name: "Ravnica Remastered",
      collector_number: "133",
      rarity: "rare",
      colors: ["G"],
      color_identity: ["G"],
      synergyTags: ["ramp", "all"],
      dexterNote: "'Boltear al pájaro' es ley, pero si sobrevive al turno 1 arregla todos tus colores de maná.",
      priceUsd: 7.50,
      priceCop: 31500,
      stock: 8,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/3/d/3d69a3e0-6a2e-475a-964e-0affed1c017d.jpg",
      legalities: { commander: "legal", modern: "legal", legacy: "legal", vintage: "legal" }
    },
    {
      id: "breach-multiverse",
      name: "Breach the Multiverse",
      mana_cost: "{5}{B}{B}",
      cmc: 7,
      type_line: "Sorcery",
      oracle_text: "Each player mills ten cards. For each player, choose a creature or planeswalker card in that player's graveyard. Put those cards onto the battlefield under your control.",
      set: "MOM",
      set_name: "March of the Machine",
      collector_number: "94",
      rarity: "rare",
      colors: ["B"],
      color_identity: ["B"],
      synergyTags: ["graveyard", "all"],
      dexterNote: "En una mesa de 4 jugadores robas la mejor criatura o Planeswalker del cementerio de cada jugador al mismo tiempo.",
      priceUsd: 9.20,
      priceCop: 38600,
      stock: 6,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/d/a/daf51a7b-7cb3-429d-8a3b-6c9bd60b9443.jpg",
      legalities: { commander: "legal", modern: "legal", pioneer: "legal", standard: "legal" }
    },
    {
      id: "toxic-deluge",
      name: "Toxic Deluge",
      mana_cost: "{2}{B}",
      cmc: 3,
      type_line: "Sorcery",
      oracle_text: "As an additional cost to cast this spell, pay X life.\nAll creatures get -X/-X until end of turn.",
      set: "MH3",
      set_name: "Modern Horizons 3",
      collector_number: "277",
      rarity: "rare",
      colors: ["B"],
      color_identity: ["B"],
      synergyTags: ["removal", "all"],
      dexterNote: "El mejor limpiamesas negro: por solo 3 manás elimina incluso criaturas con Indestructible ajustando la cantidad de vidas que pagas.",
      priceUsd: 11.80,
      priceCop: 49500,
      stock: 5,
      condition: "NM",
      isFoil: false,
      image: "https://cards.scryfall.io/large/front/5/a/5aa86251-5300-4c96-87c1-87523a9b8628.jpg",
      legalities: { commander: "legal", modern: "legal", legacy: "legal", vintage: "legal" }
    },
    {
      id: "urza-high-artificer",
      name: "Urza, Lord High Artificer",
      mana_cost: "{2}{U}{U}",
      cmc: 4,
      type_line: "Legendary Creature — Human Artificer",
      oracle_text: "When Urza, Lord High Artificer enters, create a 0/0 colorless Construct artifact creature token with 'This creature gets +1/+1 for each artifact you control.'\nTap an untapped artifact you control: Add {U}.\n{5}: Shuffle your library, then exile the top card. Until end of turn, you may play that card without paying its mana cost.",
      set: "MH1",
      set_name: "Modern Horizons",
      collector_number: "75",
      rarity: "mythic",
      colors: ["U"],
      color_identity: ["U"],
      synergyTags: ["commanders", "ramp", "tokens", "all"],
      dexterNote: "Convierte cada uno de tus artefactos y Tesoros en un Mox Sapphire y además es condición de victoria con maná infinito.",
      priceUsd: 24.50,
      priceCop: 102900,
      stock: 3,
      condition: "NM",
      isFoil: true,
      image: "https://cards.scryfall.io/large/front/9/e/9e7fb3c0-5159-4d1f-8490-ce4c9a60f567.jpg",
      legalities: { commander: "legal", modern: "legal", legacy: "legal", vintage: "legal" }
    }
  ],

  // 4. PWA SECCIÓN 1: MENÚ DE LA TABERNA TOPDECK (PEDIDOS A LA MESA)
  tavernTables: [
    { code: "MESA-01", zone: "Zona Vitrinas & Mostrador", capacity: "4 Jugadores", active: true },
    { code: "MESA-02", zone: "Salón Commander Norte", capacity: "4 Jugadores", active: true },
    { code: "MESA-04", zone: "Mesa Élite (Junto a Dexter)", capacity: "4 Jugadores", active: true },
    { code: "MESA-06", zone: "Arena Competitiva FNM", capacity: "2 Jugadores (1v1)", active: true },
    { code: "MESA-08", zone: "Rincón del Gremio VIP", capacity: "6 Jugadores", active: true }
  ],

  tavernMenu: [
    {
      id: "drink-mana-blue",
      name: "Poción de Maná Azul (Cold Brew & Mora Azul)",
      category: "Bebidas Mágicas",
      desc: "Café frío infusionado con jarabe artesanal y espuma cremosa para pensar tus contrahechizos.",
      priceCop: 14500,
      icon: "🧪",
      tag: "FAVORITO"
    },
    {
      id: "drink-mead",
      name: "Cerveza / Hidromiel del Tabernero",
      category: "Bebidas Mágicas",
      desc: "Rubia artesanal bien fría servida en jarra de taberna (Con o sin alcohol).",
      priceCop: 16000,
      icon: "🍺",
      tag: "FRÍA"
    },
    {
      id: "food-nachos",
      name: "Nachos del Dragón de Shiv",
      category: "Para Compartir en Mesa",
      desc: "Totopos crujientes con queso cheddar fundido, carne desmechada, pico de gallo y guacamole (No engrasa las cartas: incluye pinzas gamer).",
      priceCop: 28000,
      icon: "🧀",
      tag: "CON PINZAS GAMER"
    },
    {
      id: "food-panini",
      name: "Panini Golgari de Pastrami & Queso",
      category: "Fuerte",
      desc: "Pan rústico dorado a la plancha con pastrami ahumado, mozzarella, mostaza antigua y papas rústicas.",
      priceCop: 24000,
      icon: "🥪",
      tag: "RECIÉN HECHO"
    },
    {
      id: "food-pizza",
      name: "Pizza Personal Planeswalker (Pepperoni & Miel Picante)",
      category: "Fuerte",
      desc: "Masa artesanal crocante, pepperoni premium y toque de hot honey.",
      priceCop: 26500,
      icon: "🍕",
      tag: "TOP VENTAS"
    },
    {
      id: "combo-fnm",
      name: "Combo Noche de Commander (Bocados + 2 Bebidas + 1 Sobre)",
      category: "Combos TCG",
      desc: "Bandeja de tequeños dorados + 2 bebidas a elección + 1 Play Booster de Magic para abrir en la mesa.",
      priceCop: 52000,
      icon: "🎁",
      tag: "INCLUYE BOOSTER"
    }
  ],

  // 5. PWA SECCIÓN 2: COLECCIONISTA, MOXFIELD & MERCADO DE PULGAS P2P
  myMoxfieldDecks: [
    {
      id: "deck-1",
      name: "Dimir Ritual Control // Unholy Annex",
      commander: "Talion, the Kindly Lord",
      format: "Commander / EDH",
      moxfieldUrl: "https://moxfield.com/decks/topdeck-dimir-ritual",
      colors: ["U", "B"],
      cardCount: 100,
      estValueUsd: 645.00,
      winrate: "78%",
      featuredImg: "https://cards.scryfall.io/large/front/d/6/d67be074-cdd4-41d9-ac89-0a0456c4e4b2.jpg",
      keyCards: ["Sheoldred, the Apocalypse", "Rhystic Study", "Cyclonic Rift", "Demonic Tutor", "The One Ring"]
    },
    {
      id: "deck-2",
      name: "Atraxa Superfriends & Proliferate",
      commander: "Atraxa, Grand Unifier",
      format: "Commander / EDH",
      moxfieldUrl: "https://moxfield.com/decks/topdeck-atraxa-4c",
      colors: ["W", "U", "B", "G"],
      cardCount: 100,
      estValueUsd: 890.00,
      winrate: "71%",
      featuredImg: "https://cards.scryfall.io/large/front/4/a/4a1f905f-1d55-4d02-9d24-e58070793d3f.jpg",
      keyCards: ["Atraxa, Grand Unifier", "Doubling Season", "Smothering Tithe", "Sol Ring", "Birds of Paradise"]
    },
    {
      id: "deck-3",
      name: "Mardu Vampires Aggro Tribal",
      commander: "Edgar Markov",
      format: "Commander / EDH",
      moxfieldUrl: "https://moxfield.com/decks/topdeck-edgar-vampires",
      colors: ["R", "W", "B"],
      cardCount: 100,
      estValueUsd: 720.00,
      winrate: "66%",
      featuredImg: "https://cards.scryfall.io/large/front/8/d/8d94b8ec-ecda-43c8-a60e-1ba33e6a54a4.jpg",
      keyCards: ["Edgar Markov", "Swords to Plowshares", "Toxic Deluge", "Reanimate"]
    }
  ],

  myTradeBinder: [
    {
      name: "Ragavan, Nimble Pilferer",
      set: "MH2",
      condition: "NM Foil",
      mode: "VENTA O CAMBIO",
      priceCop: 175000,
      img: "https://cards.scryfall.io/large/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg"
    },
    {
      name: "Cyclonic Rift",
      set: "RVR",
      condition: "NM",
      mode: "SOLO CAMBIO",
      priceCop: 150000,
      img: "https://cards.scryfall.io/large/front/d/f/dfb7c4b9-f2f4-4d4e-baf2-86551c8150fe.jpg"
    },
    {
      name: "Smothering Tithe",
      set: "WOT",
      condition: "NM",
      mode: "VENTA ($)",
      priceCop: 128000,
      img: "https://cards.scryfall.io/large/front/8/6/861b5889-0183-4bee-afeb-a4b2aa700a8e.jpg"
    },
    {
      name: "Urza, Lord High Artificer",
      set: "MH1",
      condition: "EX+",
      mode: "VENTA O CAMBIO",
      priceCop: 98000,
      img: "https://cards.scryfall.io/large/front/9/e/9e7fb3c0-5159-4d1f-8490-ce4c9a60f567.jpg"
    }
  ],

  fleaMarketBinders: [
    {
      id: "binder-carlos",
      player: "Carlos Restrepo",
      handle: "@carlos_mtg",
      table: "MESA-02",
      status: "🟢 En tienda ahora • Buscando tierras Fetch y Negro",
      reputation: "★ 4.9 (38 tratos)",
      cards: [
        {
          name: "Doubling Season",
          set: "WOT#52",
          cond: "NM Foil",
          mode: "CAMBIO / VENTA",
          priceCop: 195000,
          wants: "Busco Sheoldred o Fetchlands",
          img: "https://cards.scryfall.io/large/front/1/6/16d9c9a9-2c7b-4604-95b2-a2809804eb12.jpg"
        },
        {
          name: "Force of Will",
          set: "DMR#48",
          cond: "NM",
          mode: "VENTA DIRECTA",
          priceCop: 275000,
          wants: "Nequi / Efectivo en Mesa 02",
          img: "https://cards.scryfall.io/large/front/8/9/89f612d6-7c59-4a7b-a87d-45f789e88ba5.jpg"
        },
        {
          name: "Birds of Paradise",
          set: "RVR#133",
          cond: "NM",
          mode: "INTERCAMBIO",
          priceCop: 30000,
          wants: "Cambio por staples de Commander",
          img: "https://cards.scryfall.io/large/front/3/d/3d69a3e0-6a2e-475a-964e-0affed1c017d.jpg"
        }
      ]
    },
    {
      id: "binder-valentina",
      player: "Valentina Gómez",
      handle: "@valen_edh",
      table: "MESA-06",
      status: "🟢 En tienda ahora • Jugando Commander",
      reputation: "★ 5.0 (52 tratos)",
      cards: [
        {
          name: "The One Ring",
          set: "LTR#246",
          cond: "NM Foil Bundle",
          mode: "CAMBIO / VENTA",
          priceCop: 400000,
          wants: "Busco Edgar Markov o Duals",
          img: "https://cards.scryfall.io/large/front/d/5/d5806e68-1054-458e-866d-1f2470f682b2.jpg"
        },
        {
          name: "Demonic Tutor",
          set: "CMM#150",
          cond: "NM",
          mode: "VENTA / TRADE",
          priceCop: 180000,
          wants: "Abierta a ver carpetas",
          img: "https://cards.scryfall.io/large/front/a/2/a24b652c-7359-4556-82ae-c94380eb922c.jpg"
        },
        {
          name: "Toxic Deluge",
          set: "MH3#277",
          cond: "NM",
          mode: "INTERCAMBIO",
          priceCop: 48000,
          wants: "Busco cartas de Ángeles o Vampiros",
          img: "https://cards.scryfall.io/large/front/5/a/5aa86251-5300-4c96-87c1-87523a9b8628.jpg"
        }
      ]
    },
    {
      id: "binder-andres",
      player: "Andrés Mejía",
      handle: "@andres_planeswalker",
      table: "MESA-01",
      status: "🟢 En tienda ahora • Campeón FNM",
      reputation: "★ 5.0 (94 tratos)",
      cards: [
        {
          name: "Rhystic Study",
          set: "WOT#25",
          cond: "NM Anime Foil",
          mode: "VENTA / CAMBIO",
          priceCop: 215000,
          wants: "Efectivo o piezas Modern",
          img: "https://cards.scryfall.io/large/front/d/6/d6914dba-0d27-4055-ac34-b3ebf5802221.jpg"
        },
        {
          name: "Reanimate",
          set: "OTP#18",
          cond: "NM",
          mode: "VENTA DIRECTA",
          priceCop: 65000,
          wants: "Estoy frente a la vitrina principal",
          img: "https://cards.scryfall.io/large/front/d/2/d27c6aaa-289e-451e-8fde-91a037c55468.jpg"
        }
      ]
    }
  ],

  // 6. PWA SECCIÓN 3: TORNEOS & COMPETITIVO (VULKAN)
  tournaments: [
    {
      id: "fnm-commander",
      name: "Friday Night Magic — Commander Party",
      format: "Commander Multiplayer",
      time: "HOY • 19:00 HRS",
      entryCop: 25000,
      prizePool: "2 Sobres por jugador al pozo + Promo Foil WPN",
      spotsLeft: 4,
      totalSpots: 32,
      enrolled: true
    },
    {
      id: "modern-challenge",
      name: "TopDeck Regional Qualifier — Modern",
      format: "Modern (Suizo 5 Rondas + Top 8)",
      time: "SÁBADO • 14:00 HRS",
      entryCop: 45000,
      prizePool: "$1,200,000 COP en Crédito de Tienda + Trofeo Gremial",
      spotsLeft: 7,
      totalSpots: 24,
      enrolled: false
    },
    {
      id: "draft-duskmourn",
      name: "Booster Draft Nocturno: Duskmourn",
      format: "Booster Draft (3 sobres incluidos)",
      time: "DOMINGO • 15:30 HRS",
      entryCop: 65000,
      prizePool: "3 Sobres de Duskmourn + 1 Collector Booster al 3-0",
      spotsLeft: 3,
      totalSpots: 8,
      enrolled: false
    }
  ],

  standings: [
    { rank: 1, player: "Andrés Mejía", points: 9, record: "3-0-0", omw: "68.2%", elo: 1845 },
    { rank: 2, player: "Tú (Santiago G.)", points: 6, record: "2-1-0", omw: "64.5%", elo: 1790, isUser: true },
    { rank: 3, player: "Valentina Gómez", points: 6, record: "2-1-0", omw: "61.0%", elo: 1765 },
    { rank: 4, player: "Carlos Restrepo", points: 6, record: "2-1-0", omw: "58.4%", elo: 1720 },
    { rank: 5, player: "Mateo Londoño", points: 3, record: "1-2-0", omw: "52.1%", elo: 1650 }
  ],

  // 7. PWA SECCIÓN 5: EL ORÁCULO DE LA SUERTE / TAROT DEL PLANESWALKER (MADAME VESPERA)
  tarotArcana: [
    {
      arcanaTitle: "I. EL MAGO ARCANO",
      cardName: "Urza, Lord High Artificer",
      positionMeaning: "Tu Mano Inicial (El Pasado)",
      reading: "Tus artefactos y preparación previa están alineados. Hoy verás manos iniciales con excelente curva de maná; no temas quedarte una mano de 2 tierras si tienes acelerador.",
      luckyColor: "Azul (U)",
      img: "https://cards.scryfall.io/large/front/9/e/9e7fb3c0-5159-4d1f-8490-ce4c9a60f567.jpg"
    },
    {
      arcanaTitle: "X. LA RUEDA DE LA FORTUNA",
      cardName: "The One Ring",
      positionMeaning: "El Campo de Batalla (El Presente)",
      reading: "La protección te rodea en el turno crítico. Cuando la mesa parezca volverse en tu contra hoy, robarás exactamente la respuesta que necesitas antes de que caiga tu escudo.",
      luckyColor: "Incoloro (C)",
      img: "https://cards.scryfall.io/large/front/d/5/d5806e68-1054-458e-866d-1f2470f682b2.jpg"
    },
    {
      arcanaTitle: "XIX. EL SOL SUPREMO",
      cardName: "Atraxa, Grand Unifier",
      positionMeaning: "Tu Topdeck Decisivo (El Futuro)",
      reading: "¡Augurio Mítico! Tu última partida de la noche se definirá con un topdeck legendario que unificará todos tus colores. ¡Hoy la suerte de la taberna está de tu lado!",
      luckyColor: "WUBG (4 Colores)",
      rewardCode: "ORACULO-15",
      rewardText: "🎁 ¡PREMIO DESBLOQUEADO! Muestra el código ORACULO-15 a Barnaby en la barra para un 15% OFF en tu bebida mágica de hoy.",
      img: "https://cards.scryfall.io/large/front/4/a/4a1f905f-1d55-4d02-9d24-e58070793d3f.jpg"
    },
    {
      arcanaTitle: "XIII. EL RENACIMIENTO",
      cardName: "Reanimate",
      positionMeaning: "El Giro Inesperado",
      reading: "Lo que dabas por perdido en el cementerio volverá para darte la victoria. Juega con audacia tus recursos.",
      luckyColor: "Negro (B)",
      img: "https://cards.scryfall.io/large/front/d/2/d27c6aaa-289e-451e-8fde-91a037c55468.jpg"
    },
    {
      arcanaTitle: "VII. EL CARRO DEL BOTÍN",
      cardName: "Ragavan, Nimble Pilferer",
      positionMeaning: "La Agresión Temprana",
      reading: "Ataca primero en los primeros turnos; un tesoro inesperado abrirá el camino a tu comandante antes que nadie.",
      luckyColor: "Rojo (R)",
      img: "https://cards.scryfall.io/large/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg"
    },
    {
      arcanaTitle: "III. LA ABUNDANCIA",
      cardName: "Doubling Season",
      positionMeaning: "La Cosecha Multiplicada",
      reading: "Tus sinergias hoy rendirán el doble. Excelente día para intercambiar cartas en el Mercado de Pulgas de TopDeck.",
      luckyColor: "Verde (G)",
      rewardCode: "SLEEVE-GOLD",
      rewardText: "🎁 ¡BENDICIÓN DE LA TABERNA! Ganaste 1 participación extra en el sorteo nocturno de TopDeck.",
      img: "https://cards.scryfall.io/large/front/1/6/16d9c9a9-2c7b-4604-95b2-a2809804eb12.jpg"
    }
  ]
};
