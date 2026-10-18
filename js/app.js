// ==========================================================================
// TOP DECK TCG — INTERACTIVE APPLICATION CONTROLLER (WEB 3D + PWA 5-SECTIONS)
// ==========================================================================

(function () {
  const DATA = window.TOPDECK_DATA;
  const MTG_CARD_BACK = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0GZ-lIeBR_De8L8j2qYyxI3nteBfYQI7ak8Ev1d1faocLpOgPxc1H_XrX5fWnCzffd24h5HvTNJbBs06RO6WCCUAULEwWIsIYFi15x2XopqQHc-do6DF3d00AIBT28fQ7xaHsky0dg7lYpt4UzpGnDJTQYsed-UKlS5kkl2IKdRh2XUNpSxVJtLiNwVdR1ey4rZN4qkqJ60qLkOmiQG4ier1FlLKtuokaXTBHMUbIEreXeNaNMInueN0e5hN-zayVtw";

  // Application State
  const state = {
    platform: "web", // 'web' | 'pwa'
    // Web Store State
    cards: [...DATA.initialCards],
    filteredCards: [...DATA.initialCards],
    binderPage: 1,
    cardsPerPage: 9,
    activeSynergy: "all",
    activeColors: [], // ['W','U','B','R','G','C']
    activeType: "all",
    searchQuery: "",
    isSearchingScryfall: false,
    // 3D Inspector State
    inspectedCard: null,
    inspectCondition: "NM",
    inspectFoil: true,
    inspectRotationX: 0,
    inspectRotationY: 0,
    inspectFlipped: false,
    // Personal Binder Cart State
    cart: [
      { ...DATA.initialCards[0], selectedCondition: "NM", selectedFoil: true, finalPriceUsd: 98.50, finalPriceCop: 413700 },
      { ...DATA.initialCards[3], selectedCondition: "NM", selectedFoil: true, finalPriceUsd: 18.00, finalPriceCop: 75600 }
    ],
    // PWA State
    pwaTab: "mesa", // 'mesa' | 'coleccion' | 'competitivo' | 'casual' | 'suerte'
    tableCode: "MESA-04",
    tableCart: [
      { ...DATA.tavernMenu[0], qty: 1 }
    ],
    activeTableOrder: null,
    // PWA Coleccionista & Mercado de Pulgas
    collectorSubtab: "pulgas", // 'pulgas' | 'mazos'
    myBinderPublished: true,
    fleaSearch: "",
    myTradeBinder: [...DATA.myTradeBinder],
    myDecks: [...DATA.myMoxfieldDecks],
    // PWA Competitivo
    matchResultReported: null,
    tournaments: [...DATA.tournaments],
    standings: [...DATA.standings],
    // PWA Casual Life Counter
    casualMode: "commander", // 'commander' | 'duel'
    players: [
      { id: 1, name: "Tú (Mesa 04)", life: 40, cmdDmg: 0, poison: 0, color: "#FEF3C7", border: "#D97706" },
      { id: 2, name: "Jugador 2", life: 40, cmdDmg: 0, poison: 0, color: "#DBEAFE", border: "#2563EB" },
      { id: 3, name: "Jugador 3", life: 40, cmdDmg: 0, poison: 0, color: "#FEE2E2", border: "#DC2626" },
      { id: 4, name: "Jugador 4", life: 40, cmdDmg: 0, poison: 0, color: "#DCFCE7", border: "#16A34A" }
    ],
    monarchPlayer: 1,
    lastDiceRoll: null,
    // PWA Suerte / Tarot
    tarotSpread: [
      { ...DATA.tarotArcana[0], revealed: false },
      { ...DATA.tarotArcana[1], revealed: false },
      { ...DATA.tarotArcana[2], revealed: false }
    ],
    boosterOpened: false,
    boosterCards: []
  };

  // Format currency helpers
  function formatCop(val) {
    return "$" + Math.round(val).toLocaleString("es-CO") + " COP";
  }
  function formatUsd(val) {
    return "$" + Number(val).toFixed(2) + " USD";
  }

  // Toast notification helper
  window.showTavernToast = function (msg, icon = "✨") {
    const container = document.getElementById("tavernToastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "pixel-box bg-[#382414] text-[#FBF6EB] px-4 py-3 flex items-center gap-3 shadow-lg transform transition-all duration-300 translate-y-2 opacity-0 max-w-sm";
    toast.innerHTML = `
      <span class="text-xl">${icon}</span>
      <div class="font-mono-code text-xs leading-snug text-[#FBF6EB]">${msg}</div>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    });
    setTimeout(() => {
      toast.classList.add("translate-y-2", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 3400);
  };

  // ==========================================================================
  // PLATFORM SWITCHER (WEB VIRTUAL VS PWA EN EL LOCAL)
  // ==========================================================================
  window.switchPlatform = function (mode) {
    state.platform = mode;
    const webView = document.getElementById("platformWebView");
    const pwaView = document.getElementById("platformPwaView");
    const btnWeb = document.getElementById("switchBtnWeb");
    const btnPwa = document.getElementById("switchBtnPwa");

    if (mode === "web") {
      webView.classList.remove("hidden");
      pwaView.classList.add("hidden");
      btnWeb.className = "pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[10px] px-3 sm:px-4 py-2 flex items-center gap-2 font-bold";
      btnPwa.className = "pixel-btn bg-[#ECE0C8] hover:bg-[#FBF6EB] text-[#5A4231] font-pixel text-[10px] px-3 sm:px-4 py-2 flex items-center gap-2";
    } else {
      webView.classList.add("hidden");
      pwaView.classList.remove("hidden");
      btnPwa.className = "pixel-btn bg-[#16A34A] text-white font-pixel text-[10px] px-3 sm:px-4 py-2 flex items-center gap-2 font-bold";
      btnWeb.className = "pixel-btn bg-[#ECE0C8] hover:bg-[#FBF6EB] text-[#5A4231] font-pixel text-[10px] px-3 sm:px-4 py-2 flex items-center gap-2";
      renderPwaCurrentSection();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================================================
  // WEB STORE: DEXTER ASSISTANT & LIVE SCRYFALL API ENGINE
  // ==========================================================================

  function setDexterSpeech(text, badge = "CONSEJO DE DEXTER") {
    const speechEl = document.getElementById("dexterSpeechText");
    const badgeEl = document.getElementById("dexterSpeechBadge");
    if (badgeEl) badgeEl.textContent = badge;
    if (!speechEl) return;
    speechEl.textContent = text;
  }

  // Convert a raw Scryfall card object into our TopDeck Vault card format
  function normalizeScryfallCard(scryCard) {
    let img = MTG_CARD_BACK;
    let backImg = MTG_CARD_BACK;
    if (scryCard.image_uris && scryCard.image_uris.normal) {
      img = scryCard.image_uris.large || scryCard.image_uris.normal;
    } else if (scryCard.card_faces && scryCard.card_faces[0] && scryCard.card_faces[0].image_uris) {
      img = scryCard.card_faces[0].image_uris.large || scryCard.card_faces[0].image_uris.normal;
      if (scryCard.card_faces[1] && scryCard.card_faces[1].image_uris) {
        backImg = scryCard.card_faces[1].image_uris.large || scryCard.card_faces[1].image_uris.normal;
      }
    }

    const rawUsd = parseFloat(scryCard.prices?.usd || scryCard.prices?.usd_foil || "0");
    const fallbackUsd = scryCard.rarity === "mythic" ? 28.5 : scryCard.rarity === "rare" ? 8.5 : scryCard.rarity === "uncommon" ? 2.5 : 1.0;
    const priceUsd = rawUsd > 0 ? rawUsd : fallbackUsd;
    const priceCop = Math.round(priceUsd * 4200);

    const oracle = scryCard.oracle_text || (scryCard.card_faces ? scryCard.card_faces.map(f => f.oracle_text).join("\n//\n") : "Sin texto de oráculo.");

    return {
      id: scryCard.id,
      name: scryCard.name,
      mana_cost: scryCard.mana_cost || (scryCard.card_faces ? scryCard.card_faces[0].mana_cost : ""),
      cmc: scryCard.cmc || 0,
      type_line: scryCard.type_line || "Magic Card",
      oracle_text: oracle,
      set: (scryCard.set || "MTG").toUpperCase(),
      set_name: scryCard.set_name || "Magic Expansion",
      collector_number: scryCard.collector_number || "1",
      rarity: scryCard.rarity || "rare",
      colors: scryCard.colors || [],
      color_identity: scryCard.color_identity || [],
      synergyTags: ["all"],
      dexterNote: `Carta sincronizada en tiempo real desde Scryfall (${scryCard.set_name}). Lista para inspección física 3D en la bóveda de TopDeck.`,
      priceUsd: priceUsd,
      priceCop: priceCop,
      stock: Math.floor(Math.random() * 6) + 1,
      condition: "NM",
      isFoil: Boolean(scryCard.prices?.usd_foil) || scryCard.rarity === "mythic",
      image: img,
      backImage: backImg,
      legalities: scryCard.legalities || { commander: "legal", modern: "legal" }
    };
  }

  let currentSearchController = null;

  // Trigger Live Scryfall Search
  window.executeVaultSearch = async function (customScryfallQuery = null) {
    if (currentSearchController) {
      currentSearchController.abort();
    }
    currentSearchController = new AbortController();

    const searchInput = document.getElementById("vaultSearchInput");
    const rawText = searchInput ? searchInput.value.trim() : "";
    state.searchQuery = rawText;

    // Build Scryfall query parts
    const queryParts = [];
    if (customScryfallQuery) {
      queryParts.push(customScryfallQuery);
    } else if (rawText) {
      queryParts.push(rawText);
    } else if (state.activeSynergy !== "all") {
      const synObj = DATA.synergies.find(s => s.id === state.activeSynergy);
      if (synObj && synObj.query) queryParts.push(synObj.query);
    }

    if (state.activeColors.length > 0) {
      if (state.activeColors.length === 1 && state.activeColors[0] === "C") {
        queryParts.push("(id:c or c:c)");
      } else {
        const nonColorless = state.activeColors.filter(c => c !== "C");
        if (nonColorless.length > 0) {
          queryParts.push(`id>=${nonColorless.join("")}`);
        }
      }
    }

    if (state.activeType !== "all") {
      queryParts.push(`t:${state.activeType}`);
    }

    // If no live query filters are active, filter local curated vault first for instant feel
    if (queryParts.length === 0) {
      state.filteredCards = [...DATA.initialCards];
      state.binderPage = 1;
      renderBinderPage();
      setDexterSpeech(DATA.mascots.dexter.welcomeWeb, "BÓVEDA CENTRAL TOPDECK");
      return;
    }

    // Also filter local cards immediately while Scryfall fetches
    const localMatches = DATA.initialCards.filter(c => {
      const matchSynergy = state.activeSynergy === "all" || (c.synergyTags && c.synergyTags.includes(state.activeSynergy));
      const matchText = !rawText || c.name.toLowerCase().includes(rawText.toLowerCase()) || c.oracle_text.toLowerCase().includes(rawText.toLowerCase()) || c.type_line.toLowerCase().includes(rawText.toLowerCase());
      const matchType = state.activeType === "all" || c.type_line.toLowerCase().includes(state.activeType.toLowerCase());
      const matchColors = state.activeColors.length === 0 || state.activeColors.every(col => col === "C" ? c.color_identity.length === 0 : c.color_identity.includes(col));
      return matchSynergy && matchText && matchType && matchColors;
    });

    const fullQuery = queryParts.join(" ") + " game:paper";
    const statusBadge = document.getElementById("scryfallLiveStatus");
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="w-2.5 h-2.5 bg-[#F59E0B] inline-block border border-[#382414] animate-spin"></span> CONSULTANDO SCRYFALL API...`;
    }

    setDexterSpeech(`Estoy buscando en los archivos arcanos de Scryfall cartas con: "${queryParts.join(" • ")}"...`, "BUSCANDO EN SCRYFALL API");

    try {
      const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(fullQuery)}&order=edhrec`;
      const res = await fetch(url, { signal: currentSearchController.signal });
      if (!res.ok) throw new Error("No exact Scryfall matches");
      const data = await res.json();
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        const scryCards = data.data.slice(0, 27).map(normalizeScryfallCard);
        state.filteredCards = scryCards;
        state.binderPage = 1;
        renderBinderPage();

        if (statusBadge) {
          statusBadge.innerHTML = `<span class="w-2.5 h-2.5 bg-[#16A34A] inline-block border border-[#382414]"></span> SCRYFALL LIVE: ${data.total_cards || scryCards.length} CARTAS ENCONTRADAS`;
        }
        const synObj = DATA.synergies.find(s => s.id === state.activeSynergy);
        if (rawText) {
          setDexterSpeech(`¡Encontré ${data.total_cards || scryCards.length} cartas en Scryfall para "${rawText}"! Las he acomodado en la carpeta. Haz clic en cualquiera para sacarla de la funda y verla en 3D.`, "RESULTADOS SCRYFALL EN VIVO");
        } else if (synObj) {
          setDexterSpeech(synObj.speech, `SINERGIA: ${synObj.shortLabel.toUpperCase()}`);
        }
        return;
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      // Fallback to local curated matches if offline or query had no external results
      if (localMatches.length > 0) {
        state.filteredCards = localMatches;
      } else {
        state.filteredCards = [...DATA.initialCards];
        window.showTavernToast("No se encontraron cartas con esa combinación exacta; mostrando sugerencias de Dexter.", "🦊");
      }
      state.binderPage = 1;
      renderBinderPage();
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2.5 h-2.5 bg-[#16A34A] inline-block border border-[#382414]"></span> BÓVEDA LOCAL ACTIVA (${state.filteredCards.length} CARTAS)`;
      }
    }
  };

  window.selectSynergy = function (synergyId) {
    state.activeSynergy = synergyId;
    const searchInput = document.getElementById("vaultSearchInput");
    if (searchInput && synergyId !== "all") searchInput.value = "";

    renderSynergyPills();
    const synObj = DATA.synergies.find(s => s.id === synergyId);
    if (synObj) {
      setDexterSpeech(synObj.speech, `SINERGIA: ${synObj.shortLabel.toUpperCase()}`);
    }

    // Immediate local filter first for 0ms responsiveness, then enrich with Scryfall if needed
    if (synergyId === "all" && state.activeColors.length === 0 && state.activeType === "all" && (!searchInput || !searchInput.value.trim())) {
      state.filteredCards = [...DATA.initialCards];
      state.binderPage = 1;
      renderBinderPage();
    } else {
      window.executeVaultSearch();
    }
  };

  window.toggleManaColor = function (colorCode) {
    const idx = state.activeColors.indexOf(colorCode);
    if (idx >= 0) {
      state.activeColors.splice(idx, 1);
    } else {
      state.activeColors.push(colorCode);
    }
    renderManaColorButtons();
    window.executeVaultSearch();
  };

  window.changeCardTypeFilter = function (typeVal) {
    state.activeType = typeVal;
    window.executeVaultSearch();
  };

  window.resetVaultFilters = function () {
    state.activeSynergy = "all";
    state.activeColors = [];
    state.activeType = "all";
    state.searchQuery = "";
    const input = document.getElementById("vaultSearchInput");
    if (input) input.value = "";
    const typeSelect = document.getElementById("vaultTypeSelect");
    if (typeSelect) typeSelect.value = "all";
    renderSynergyPills();
    renderManaColorButtons();
    state.filteredCards = [...DATA.initialCards];
    state.binderPage = 1;
    renderBinderPage();
    setDexterSpeech(DATA.mascots.dexter.welcomeWeb, "BÓVEDA RESTAURADA");
  };

  function renderSynergyPills() {
    const container = document.getElementById("dexterSynergyPills");
    if (!container) return;
    container.innerHTML = DATA.synergies.map(s => {
      const isActive = state.activeSynergy === s.id;
      return `
        <button onclick="selectSynergy('${s.id}')" class="pixel-btn px-3 py-1.5 font-pixel text-[9px] flex items-center gap-1.5 transition-all ${
          isActive
            ? "bg-[#F29F38] text-[#2B1810] font-bold scale-105"
            : "bg-[#FFF9EE] hover:bg-[#ECE0C8] text-[#5A4231]"
        }">
          <span>${s.label}</span>
        </button>
      `;
    }).join("");
  }

  function renderManaColorButtons() {
    const colors = [
      { code: "W", label: "Blanco (W)", bg: "#FFFADC", text: "#292212" },
      { code: "U", label: "Azul (U)", bg: "#1B75BB", text: "#FFFFFF" },
      { code: "B", label: "Negro (B)", bg: "#22130C", text: "#FBBF24" },
      { code: "R", label: "Rojo (R)", bg: "#D32F2F", text: "#FFFFFF" },
      { code: "G", label: "Verde (G)", bg: "#2E7D32", text: "#FFFFFF" },
      { code: "C", label: "Incoloro (C)", bg: "#786E65", text: "#FFFFFF" }
    ];
    const container = document.getElementById("manaColorFilterBar");
    if (!container) return;
    container.innerHTML = colors.map(c => {
      const active = state.activeColors.includes(c.code);
      return `
        <button onclick="toggleManaColor('${c.code}')" title="${c.label}"
          style="background-color:${c.bg}; color:${c.text};"
          class="w-7 h-7 font-pixel text-[10px] font-bold flex items-center justify-center transition-transform ${
            active
              ? "border-2 border-[#F29F38] ring-2 ring-[#382414] scale-110 shadow-[2px_2px_0_#382414]"
              : "border-2 border-[#382414] opacity-80 hover:opacity-100"
          }">
          ${c.code}
        </button>
      `;
    }).join("");
  }

  // ==========================================================================
  // BINDER 9-POCKET RENDERER & SLIDE-OUT ANIMATION
  // ==========================================================================

  function renderBinderPage() {
    const grid = document.getElementById("binderPocketGrid");
    const pageIndicator = document.getElementById("binderPageIndicator");
    const countLabel = document.getElementById("binderTotalCountLabel");
    if (!grid) return;

    const totalPages = Math.max(1, Math.ceil(state.filteredCards.length / state.cardsPerPage));
    if (state.binderPage > totalPages) state.binderPage = totalPages;

    const startIdx = (state.binderPage - 1) * state.cardsPerPage;
    const pageCards = state.filteredCards.slice(startIdx, startIdx + state.cardsPerPage);

    if (pageIndicator) {
      pageIndicator.textContent = `PÁG 0${state.binderPage} / 0${totalPages}`;
    }
    if (countLabel) {
      countLabel.textContent = `${state.filteredCards.length} CARTAS EN CARPETA`;
    }

    // Always render 9 pockets so it looks like a real physical 9-pocket binder sheet!
    let pocketsHtml = "";
    for (let i = 0; i < 9; i++) {
      const card = pageCards[i];
      if (card) {
        const rarityBadge = card.rarity === "mythic" ? "MÍTICA" : card.rarity === "rare" ? "RARA" : "SINGLES";
        const rarityColor = card.rarity === "mythic" ? "bg-[#C84630] text-white" : "bg-[#F29F38] text-[#2B1810]";
        pocketsHtml += `
          <div class="binder-pocket rounded-sm flex flex-col justify-between cursor-pointer group"
               onclick="triggerCardSlideOut('${card.id}', this)">
            <div class="pocket-card-inner bg-[#1C110A] border-2 border-[#382414] rounded-sm overflow-hidden aspect-[63/88] relative">
              <img src="${card.image}" alt="${card.name}" loading="lazy"
                   class="w-full h-full object-cover pointer-events-none"
                   onerror="this.src='${MTG_CARD_BACK}'"/>
              ${card.isFoil ? `<span class="absolute top-1.5 left-1.5 bg-[#382414]/90 text-[#FBBF24] font-pixel text-[7px] px-1.5 py-0.5 border border-[#FBBF24]">✨ FOIL</span>` : ""}
              <span class="absolute top-1.5 right-1.5 ${rarityColor} font-pixel text-[7px] px-1.5 py-0.5 border border-[#382414] font-bold">${rarityBadge}</span>
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] px-2 py-1 border border-[#382414] shadow-[2px_2px_0_#000]">
                  🖐️ SACAR E INSPECCIONAR 3D
                </span>
              </div>
            </div>
            <div class="mt-2 px-1 z-20">
              <div class="flex items-center justify-between gap-1">
                <span class="font-pixel text-[9px] text-[#2B1810] truncate font-bold" title="${card.name}">${card.name}</span>
                <span class="font-pixel text-[9px] text-[#B45309] font-bold shrink-0">$${card.priceUsd.toFixed(2)}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] font-mono-code text-[#6B5443] mt-0.5">
                <span>${card.set} #${card.collector_number} • <strong class="text-[#16A34A]">${card.condition}</strong></span>
                <span class="font-bold text-[#382414]">${formatCop(card.priceCop)}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // Empty binder pocket slot
        pocketsHtml += `
          <div class="binder-pocket rounded-sm flex flex-col items-center justify-center aspect-[63/88] opacity-55">
            <div class="text-center p-4">
              <div class="font-pixel text-xs text-[#8C6D46] mb-1">BOLSILLO VACÍO</div>
              <div class="font-mono-code text-[10px] text-[#8C6D46]">ULTRA•PRO 9-POCKET</div>
            </div>
          </div>
        `;
      }
    }
    grid.innerHTML = pocketsHtml;
  }

  window.changeBinderPage = function (delta) {
    const totalPages = Math.max(1, Math.ceil(state.filteredCards.length / state.cardsPerPage));
    const next = state.binderPage + delta;
    if (next >= 1 && next <= totalPages) {
      state.binderPage = next;
      renderBinderPage();
    }
  };

  // Slide-out physical animation before opening 3D modal!
  window.triggerCardSlideOut = function (cardId, pocketElement) {
    const card = state.filteredCards.find(c => c.id === cardId) || DATA.initialCards.find(c => c.id === cardId);
    if (!card) return;

    const innerCard = pocketElement ? pocketElement.querySelector(".pocket-card-inner") : null;
    if (innerCard) {
      innerCard.classList.add("card-sliding-out");
      setTimeout(() => {
        innerCard.classList.remove("card-sliding-out");
        open3DCardInspector(card);
      }, 380);
    } else {
      open3DCardInspector(card);
    }
  };

  // ==========================================================================
  // 3D INTERACTIVE CARD INSPECTOR ("COMO SI LA TOCARAS")
  // ==========================================================================

  function open3DCardInspector(card) {
    state.inspectedCard = card;
    state.inspectCondition = card.condition || "NM";
    state.inspectFoil = Boolean(card.isFoil);
    state.inspectRotationX = 0;
    state.inspectRotationY = 0;
    state.inspectFlipped = false;

    const modal = document.getElementById("cardInspector3DModal");
    if (!modal) return;

    // Populate modal fields
    document.getElementById("inspect3DFrontImg").src = card.image;
    document.getElementById("inspect3DBackImg").src = card.backImage || MTG_CARD_BACK;
    document.getElementById("inspectCardName").textContent = card.name;
    document.getElementById("inspectCardSet").textContent = `${card.set_name} (${card.set} #${card.collector_number})`;
    document.getElementById("inspectCardMana").textContent = card.mana_cost || "SIN COSTO";
    document.getElementById("inspectCardType").textContent = card.type_line;
    document.getElementById("inspectCardOracle").textContent = card.oracle_text;
    document.getElementById("inspectDexterTip").textContent = card.dexterNote || "Excelente adición para tu carpeta de colección o mazo de torneo.";
    document.getElementById("inspectStockBadge").textContent = `${card.stock || 3} DISPONIBLES EN BÓVEDA`;

    // Render legalities
    const legContainer = document.getElementById("inspectLegalities");
    if (legContainer && card.legalities) {
      const formats = ["commander", "modern", "pioneer", "standard", "legacy"];
      legContainer.innerHTML = formats.map(fmt => {
        const status = card.legalities[fmt] || "not_legal";
        const isLegal = status === "legal";
        return `
          <span class="px-2 py-0.5 font-pixel text-[8px] border border-[#382414] ${
            isLegal ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"
          }">
            ${fmt.toUpperCase()}: ${isLegal ? "LEGAL" : "NO LEGAL"}
          </span>
        `;
      }).join("");
    }

    updateInspectorPricingUI();

    const mesh = document.getElementById("interactive3DCardMesh");
    if (mesh) {
      mesh.style.transform = `rotateX(0deg) rotateY(0deg)`;
      mesh.classList.toggle("foil-enabled", state.inspectFoil);
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function getCalculatedInspectPrice() {
    if (!state.inspectedCard) return { usd: 0, cop: 0 };
    const rawBaseUsd = state.inspectedCard.priceUsd;
    const condMultiplier = state.inspectCondition === "NM" ? 1.0 : state.inspectCondition === "EX" ? 0.88 : 0.75;
    let foilFactor = 1.0;
    if (state.inspectedCard.isFoil && !state.inspectFoil) {
      foilFactor = 0.80;
    } else if (!state.inspectedCard.isFoil && state.inspectFoil) {
      foilFactor = 1.25;
    }
    const finalUsd = rawBaseUsd * condMultiplier * foilFactor;
    return {
      usd: finalUsd,
      cop: Math.round(finalUsd * 4200)
    };
  }

  function updateInspectorPricingUI() {
    const price = getCalculatedInspectPrice();
    const usdEl = document.getElementById("inspectPriceUsd");
    const copEl = document.getElementById("inspectPriceCop");
    if (usdEl) usdEl.textContent = formatUsd(price.usd);
    if (copEl) copEl.textContent = formatCop(price.cop);

    // Condition buttons
    ["NM", "EX", "LP"].forEach(cond => {
      const btn = document.getElementById(`condBtn-${cond}`);
      if (btn) {
        if (state.inspectCondition === cond) {
          btn.className = "pixel-btn bg-[#F29F38] text-[#2B1810] p-2 font-pixel text-[9px] font-bold text-center";
        } else {
          btn.className = "pixel-btn bg-[#FFF9EE] text-[#5A4231] p-2 font-pixel text-[9px] text-center";
        }
      }
    });

    // Foil toggle button
    const foilBtn = document.getElementById("toggleFoil3DBtn");
    if (foilBtn) {
      foilBtn.innerHTML = state.inspectFoil
        ? `<span>✨ ACABADO FOIL HOLOGRÁFICO: ACTIVO</span>`
        : `<span>🃏 ACABADO: NORMAL (ACTIVAR FOIL)</span>`;
      foilBtn.className = state.inspectFoil
        ? "pixel-btn bg-[#FBBF24] text-[#2B1810] font-pixel text-[9px] px-3 py-2 w-full font-bold"
        : "pixel-btn bg-[#ECE0C8] text-[#2B1810] font-pixel text-[9px] px-3 py-2 w-full";
    }
  }

  window.setInspectCondition = function (cond) {
    state.inspectCondition = cond;
    updateInspectorPricingUI();
  };

  window.toggleInspectFoil = function () {
    state.inspectFoil = !state.inspectFoil;
    const mesh = document.getElementById("interactive3DCardMesh");
    if (mesh) mesh.classList.toggle("foil-enabled", state.inspectFoil);
    updateInspectorPricingUI();
  };

  window.flip3DCard = function () {
    state.inspectFlipped = !state.inspectFlipped;
    state.inspectRotationY = state.inspectFlipped ? 180 : 0;
    state.inspectRotationX = 0;
    const mesh = document.getElementById("interactive3DCardMesh");
    if (mesh) {
      mesh.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
      mesh.style.transform = `rotateX(${state.inspectRotationX}deg) rotateY(${state.inspectRotationY}deg)`;
    }
  };

  window.spin3DCard360 = function () {
    state.inspectRotationY += 360;
    const mesh = document.getElementById("interactive3DCardMesh");
    if (mesh) {
      mesh.style.transition = "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)";
      mesh.style.transform = `rotateX(${state.inspectRotationX}deg) rotateY(${state.inspectRotationY}deg)`;
    }
  };

  window.close3DCardInspector = function () {
    const modal = document.getElementById("cardInspector3DModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  };

  // Interactive 3D Tactile Touch / Mouse Physics
  function setup3DTactileStage() {
    const stage = document.getElementById("interactive3DStage");
    const mesh = document.getElementById("interactive3DCardMesh");
    if (!stage || !mesh) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let cachedRect = null;
    let rafId = null;

    function refreshRect() {
      cachedRect = stage.getBoundingClientRect();
    }

    stage.addEventListener("pointerenter", refreshRect);
    window.addEventListener("resize", () => { cachedRect = null; });

    // Hover tilt + glare effect (feels like holding the card under tavern light)
    stage.addEventListener("pointermove", (e) => {
      if (!cachedRect) refreshRect();
      const relX = (e.clientX - cachedRect.left) / cachedRect.width;
      const relY = (e.clientY - cachedRect.top) / cachedRect.height;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Update holographic glare coordinates
        mesh.style.setProperty("--glare-x", `${Math.round(relX * 100)}%`);
        mesh.style.setProperty("--glare-y", `${Math.round(relY * 100)}%`);

        if (isDragging) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          startX = e.clientX;
          startY = e.clientY;
          state.inspectRotationY += dx * 0.85;
          state.inspectRotationX = Math.max(-35, Math.min(35, state.inspectRotationX - dy * 0.65));
          mesh.style.transition = "none";
          mesh.style.transform = `rotateX(${state.inspectRotationX}deg) rotateY(${state.inspectRotationY}deg) scale(1.04)`;
        } else {
          // Gentle magnetic tactile tilt on hover based on current rotation
          const tiltY = (relX - 0.5) * 26;
          const tiltX = (0.5 - relY) * 22;
          mesh.style.transition = "transform 0.12s ease-out";
          mesh.style.transform = `rotateX(${tiltX}deg) rotateY(${state.inspectRotationY + tiltY}deg) scale(1.03)`;
        }
      });
    });

    stage.addEventListener("pointerdown", (e) => {
      isDragging = true;
      refreshRect();
      startX = e.clientX;
      startY = e.clientY;
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener("pointerup", () => {
      isDragging = false;
    });

    stage.addEventListener("pointercancel", () => {
      isDragging = false;
    });

    stage.addEventListener("pointerleave", () => {
      if (!isDragging) {
        mesh.style.transition = "transform 0.35s ease-out";
        mesh.style.transform = `rotateX(0deg) rotateY(${state.inspectRotationY}deg) scale(1)`;
      }
    });
  }

  // ==========================================================================
  // PERSONAL BINDER CART ("MI CARPETA PROPIA") & SLEEVE/BOX/TRUCK CHECKOUT
  // ==========================================================================

  window.addInspectedCardToBinderCart = function () {
    if (!state.inspectedCard) return;
    const price = getCalculatedInspectPrice();
    state.cart.push({
      ...state.inspectedCard,
      cartItemId: "cart-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      selectedCondition: state.inspectCondition,
      selectedFoil: state.inspectFoil,
      finalPriceUsd: price.usd,
      finalPriceCop: price.cop
    });
    updateCartBadges();
    window.close3DCardInspector();
    window.showTavernToast(`¡"${state.inspectedCard.name}" deslizada dentro de Tu Carpeta Personal!`, "📖");
  };

  window.removeFromBinderCart = function (index) {
    state.cart.splice(index, 1);
    updateCartBadges();
    renderPersonalBinderCart();
  };

  function updateCartBadges() {
    const count = state.cart.length;
    const totalCop = state.cart.reduce((sum, item) => sum + item.finalPriceCop, 0);
    const badgeCount = document.getElementById("headerCartCount");
    const badgeTotal = document.getElementById("headerCartTotal");
    if (badgeCount) badgeCount.textContent = count;
    if (badgeTotal) badgeTotal.textContent = formatCop(totalCop);
  }

  window.openPersonalBinderCart = function () {
    const modal = document.getElementById("personalBinderCartModal");
    if (!modal) return;
    document.getElementById("checkoutAnimationStage").classList.add("hidden");
    document.getElementById("personalBinderCartContent").classList.remove("hidden");
    renderPersonalBinderCart();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  let activeCheckoutTimeouts = [];

  window.closePersonalBinderCart = function () {
    activeCheckoutTimeouts.forEach(clearTimeout);
    activeCheckoutTimeouts = [];
    const modal = document.getElementById("personalBinderCartModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  };

  function renderPersonalBinderCart() {
    const grid = document.getElementById("personalBinderCartGrid");
    const summaryEl = document.getElementById("personalBinderCartSummary");
    const payBtn = document.getElementById("startCheckoutAnimBtn");
    if (!grid) return;

    // Render 6 personal binder pockets (shows your cards + empty pockets waiting to be filled)
    const maxSlots = Math.max(6, Math.ceil(state.cart.length / 3) * 3);
    let html = "";
    for (let i = 0; i < maxSlots; i++) {
      const item = state.cart[i];
      if (item) {
        html += `
          <div class="binder-pocket rounded-sm p-2 flex flex-col justify-between bg-[#FBF6EB] relative">
            <button onclick="removeFromBinderCart(${i})" title="Sacar de mi carpeta"
              class="absolute top-1.5 right-1.5 z-30 w-6 h-6 bg-[#C84630] text-white font-pixel text-[9px] border border-[#382414] flex items-center justify-center cursor-pointer">
              ✕
            </button>
            <div class="aspect-[63/88] bg-black border border-[#382414] overflow-hidden relative">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"
                   onerror="this.src='${MTG_CARD_BACK}'"/>
              ${item.selectedFoil ? `<span class="absolute bottom-1 left-1 bg-[#382414]/90 text-[#FBBF24] font-pixel text-[7px] px-1">FOIL</span>` : ""}
            </div>
            <div class="mt-1.5 z-20">
              <div class="font-pixel text-[8px] text-[#2B1810] truncate font-bold">${item.name}</div>
              <div class="flex justify-between items-center mt-0.5">
                <span class="font-mono-code text-[10px] font-bold text-[#16A34A]">${item.selectedCondition}</span>
                <span class="font-pixel text-[8px] text-[#B45309] font-bold">${formatCop(item.finalPriceCop)}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="binder-pocket rounded-sm p-2 flex flex-col items-center justify-center aspect-[63/88] opacity-50">
            <span class="text-xl mb-1">🃏</span>
            <span class="font-pixel text-[7px] text-[#6B5443] text-center">ESPACIO EN TU CARPETA</span>
          </div>
        `;
      }
    }
    grid.innerHTML = html;

    const totalCop = state.cart.reduce((s, c) => s + c.finalPriceCop, 0);
    const totalUsd = state.cart.reduce((s, c) => s + c.finalPriceUsd, 0);
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="flex justify-between text-xs font-mono-code">
          <span>Cartas en tu carpeta:</span>
          <strong class="font-pixel text-[10px]">${state.cart.length} Singles MTG</strong>
        </div>
        <div class="flex justify-between text-xs font-mono-code">
          <span>Fundas Dragon Shield de cortesía:</span>
          <strong class="text-[#16A34A]">¡GRATIS! ($0)</strong>
        </div>
        <div class="flex justify-between text-xs font-mono-code">
          <span>Caja protectora TopDeck Vault:</span>
          <strong class="text-[#16A34A]">INCLUIDA</strong>
        </div>
        <div class="border-t-2 border-[#382414] pt-2 mt-2 flex justify-between items-baseline">
          <span class="font-pixel text-[10px] text-[#2B1810]">TOTAL ORDEN:</span>
          <div class="text-right">
            <div class="font-pixel text-sm text-[#B45309] font-bold">${formatCop(totalCop)}</div>
            <div class="font-mono-code text-[10px] text-[#6B5443]">(${formatUsd(totalUsd)})</div>
          </div>
        </div>
      `;
    }
    if (payBtn) {
      payBtn.disabled = state.cart.length === 0;
    }
  }

  // CINEMATIC 3-STAGE CHECKOUT ANIMATION:
  // 1. Sleeving cards -> 2. Packing in TopDeck Box -> 3. Shipping in Pixel Truck!
  window.runCheckoutPackagingAnimation = function () {
    if (state.cart.length === 0) return;

    activeCheckoutTimeouts.forEach(clearTimeout);
    activeCheckoutTimeouts = [];

    const cartContent = document.getElementById("personalBinderCartContent");
    const animStage = document.getElementById("checkoutAnimationStage");
    const stepTitle = document.getElementById("checkoutAnimStepTitle");
    const stepDesc = document.getElementById("checkoutAnimStepDesc");
    const visualCanvas = document.getElementById("checkoutAnimVisualCanvas");
    const progressBar = document.getElementById("checkoutAnimProgressBar");

    cartContent.classList.add("hidden");
    animStage.classList.remove("hidden");

    const sampleCard = state.cart[0];
    const cardCount = state.cart.length;

    // STEP 1: SLEEVING THE CARDS (0s -> 2.2s)
    progressBar.style.width = "33%";
    stepTitle.textContent = "PASO 1/3: ENFUNDANDO TUS CARTAS (DRAGON SHIELD SLEEVING)...";
    stepDesc.textContent = `Dexter está deslizando tus ${cardCount} carta(s) en fundas protectoras doradas libres de ácido.`;
    visualCanvas.innerHTML = `
      <div class="relative w-44 h-60 flex items-center justify-center">
        <!-- Golden Dragon Shield Outer Sleeve -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#F59E0B]/30 to-[#D97706]/50 border-4 border-[#F59E0B] rounded-lg shadow-[0_12px_30px_rgba(245,158,11,0.45)] overflow-hidden z-20 pointer-events-none">
          <div class="sleeve-shine-bar"></div>
          <div class="absolute bottom-2 inset-x-0 text-center font-pixel text-[8px] text-white bg-[#382414]/80 py-1">
            🛡️ DRAGON SHIELD GOLD SLEEVE
          </div>
        </div>
        <!-- Card sliding inside the sleeve -->
        <div class="w-36 h-52 rounded border-2 border-[#382414] overflow-hidden shadow-lg anim-sleeve-card z-10">
          <img src="${sampleCard.image}" class="w-full h-full object-cover" alt="${sampleCard.name}"
               onerror="this.src='${MTG_CARD_BACK}'"/>
        </div>
      </div>
    `;

    // STEP 2: PACKING INTO ARMORED DECKBOX (2.2s -> 4.4s)
    const t1 = setTimeout(() => {
      progressBar.style.width = "68%";
      stepTitle.textContent = "PASO 2/3: EMPACANDO EN TU DECKBOX DE BÓVEDA TOPDECK...";
      stepDesc.textContent = "Sellando las cartas enfundadas dentro de un cofre rígido anti-impacto con lacre del gremio.";
      visualCanvas.innerHTML = `
        <div class="relative w-64 h-60 flex flex-col items-center justify-end pb-4">
          <!-- Sleeved cards dropping into the box -->
          <div class="w-28 h-40 rounded border-2 border-[#F59E0B] overflow-hidden shadow-md anim-pack-box mb-[-30px] z-10">
            <img src="${sampleCard.image}" class="w-full h-full object-cover" alt="Sleeved Card"
                 onerror="this.src='${MTG_CARD_BACK}'"/>
          </div>
          <!-- Armored TopDeck Vault Box -->
          <div class="w-48 h-28 bg-[#4A2B11] border-4 border-[#382414] shadow-[6px_6px_0_#382414] rounded-sm relative z-20 flex flex-col items-center justify-center p-2">
            <div class="w-full h-3 bg-[#F29F38] border-b-2 border-[#382414] absolute top-0 inset-x-0"></div>
            <div class="w-8 h-8 rounded-full bg-[#C84630] border-2 border-[#FBBF24] flex items-center justify-center font-pixel text-[10px] text-white shadow mb-1">
              🃏
            </div>
            <span class="font-pixel text-[9px] text-[#FBF6EB]">COFRE TOPDECK</span>
            <span class="font-mono-code text-[10px] text-[#F29F38] font-bold">${cardCount} CARTAS PROTEGIDAS</span>
          </div>
        </div>
      `;
    }, 2200);
    activeCheckoutTimeouts.push(t1);

    // STEP 3: SHIPPING ON PIXEL DELIVERY TRUCK (4.4s -> 7.0s)
    const t2 = setTimeout(() => {
      // Clear cart immediately upon successful packaging dispatch
      state.cart = [];
      updateCartBadges();

      progressBar.style.width = "100%";
      stepTitle.textContent = "PASO 3/3: ¡DESPACHADO EN EL CAMIÓN EXPRESO TOPDECK!";
      stepDesc.textContent = "¡Tu pedido va en camino! Saliendo de la taberna TopDeck directo a tus manos.";
      const guideCode = "TD-COL-" + Math.floor(100000 + Math.random() * 900000);
      visualCanvas.innerHTML = `
        <div class="w-full flex flex-col items-center justify-center overflow-hidden py-4">
          <div class="relative w-full max-w-md h-36 flex items-end justify-center border-b-4 border-[#382414] pb-2 overflow-hidden">
            <!-- Pixel Delivery Truck -->
            <div class="anim-truck-move flex items-end gap-1">
              <!-- Smoke puffs -->
              <div class="flex gap-1 items-center mr-1 mb-4 animate-pulse">
                <span class="w-3 h-3 rounded-full bg-[#805B3A]/50 inline-block"></span>
                <span class="w-4 h-4 rounded-full bg-[#805B3A]/70 inline-block"></span>
              </div>
              <div class="anim-truck-body flex items-end">
                <!-- Cargo Box -->
                <div class="w-36 h-24 bg-[#4A2B11] border-4 border-[#382414] flex flex-col items-center justify-center p-2 relative shadow-[4px_0_0_#382414]">
                  <span class="font-pixel text-[9px] text-[#F29F38] font-bold">TOPDECK</span>
                  <span class="font-pixel text-[7px] text-[#FBF6EB] mt-1">EXPRESS VAULT</span>
                  <div class="mt-1 bg-[#16A34A] text-white font-pixel text-[7px] px-1.5 py-0.5 border border-[#382414]">
                    📦 ${cardCount} CARTAS
                  </div>
                </div>
                <!-- Truck Cabin -->
                <div class="w-16 h-16 bg-[#F29F38] border-4 border-l-0 border-[#382414] relative flex flex-col justify-between p-1">
                  <div class="w-10 h-6 bg-[#DBEAFE] border-2 border-[#382414] ml-auto"></div>
                  <div class="w-3 h-3 bg-[#FEF08A] border border-[#382414] ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- Confirmation Ticket -->
          <div class="mt-4 bg-[#DCFCE7] border-2 border-[#166534] p-3 w-full max-w-md text-center shadow-[3px_3px_0_#166534]">
            <div class="font-pixel text-[10px] text-[#166534] font-bold">✅ ¡PAGO APROBADO Y CARPETA DESPACHADA!</div>
            <div class="font-mono-code text-xs text-[#2B1810] mt-1">
              Guía de Rastreo: <strong>${guideCode}</strong> • Empaque: <strong>Sleeve + Deckbox</strong>
            </div>
            <button onclick="finishCheckoutOrder()" class="mt-3 pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[9px] px-4 py-2 font-bold">
              VOLVER A LA BÓVEDA
            </button>
          </div>
        </div>
      `;
    }, 4400);
    activeCheckoutTimeouts.push(t2);
  };

  window.finishCheckoutOrder = function () {
    state.cart = [];
    updateCartBadges();
    window.closePersonalBinderCart();
    window.showTavernToast("¡Gracias por tu compra en TopDeck! Tus cartas van enfundadas y en camino.", "🚚");
  };

  // ==========================================================================
  // PWA MOBILE CONTROLLER (5 SECCIONES CON MASCOTAS)
  // ==========================================================================

  window.switchPwaTab = function (tabId) {
    state.pwaTab = tabId;
    renderPwaNavButtons();
    renderPwaCurrentSection();
  };

  function renderPwaNavButtons() {
    const tabs = [
      { id: "mesa", label: "1. Mesa", icon: "🍺", mascot: "Barnaby", color: "#B45309" },
      { id: "coleccion", label: "2. Pulgas", icon: "🦊", mascot: "Dexter", color: "#D97706" },
      { id: "competitivo", label: "3. Torneo", icon: "🦁", mascot: "Vulkan", color: "#DC2626" },
      { id: "casual", label: "4. Casual", icon: "👺", mascot: "Pip", color: "#16A34A" },
      { id: "suerte", label: "5. Suerte", icon: "🦉", mascot: "Vespera", color: "#7C3AED" }
    ];

    const navBar = document.getElementById("pwaBottomNavBar");
    if (!navBar) return;
    navBar.innerHTML = tabs.map(t => {
      const active = state.pwaTab === t.id;
      return `
        <button onclick="switchPwaTab('${t.id}')"
          class="flex-1 py-2 px-1 flex flex-col items-center justify-center transition-all border-r last:border-r-0 border-[#382414] cursor-pointer ${
            active ? "bg-[#382414] text-[#FBBF24] -translate-y-1 shadow-[0_4px_0_#382414]" : "bg-[#ECE0C8] text-[#382414] hover:bg-[#FBF6EB]"
          }">
          <span class="text-base leading-none">${t.icon}</span>
          <span class="font-pixel text-[7px] mt-1 tracking-tighter">${t.label}</span>
          <span class="font-mono-code text-[8px] opacity-75">${t.mascot}</span>
        </button>
      `;
    }).join("");
  }

  function renderMascotHeaderBanner(mascotKey, customSubtitle = null) {
    const m = DATA.mascots[mascotKey];
    return `
      <div class="pixel-box p-3 mb-4 flex items-center gap-3" style="background-color: ${m.bgAccent}; border-color: #382414;">
        <div class="w-14 h-14 shrink-0 border-2 border-[#382414] shadow-[2px_2px_0_#382414] overflow-hidden bg-[#382414]">
          ${m.avatarSvg}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-pixel text-[9px] px-1.5 py-0.5 text-white border border-[#382414]" style="background-color: ${m.badgeColor}">
              ${m.emoji} ${m.name}
            </span>
            <span class="font-pixel text-[8px] text-[#382414] truncate">${m.title}</span>
          </div>
          <p class="font-mono-code text-[11px] text-[#2B1810] mt-1 leading-snug">
            "${customSubtitle || m.greeting}"
          </p>
        </div>
      </div>
    `;
  }

  function renderPwaCurrentSection() {
    renderPwaNavButtons();
    const container = document.getElementById("pwaSectionViewport");
    if (!container) return;

    if (state.pwaTab === "mesa") {
      renderPwaSectionMesa(container);
    } else if (state.pwaTab === "coleccion") {
      renderPwaSectionColeccion(container);
    } else if (state.pwaTab === "competitivo") {
      renderPwaSectionCompetitivo(container);
    } else if (state.pwaTab === "casual") {
      renderPwaSectionCasual(container);
    } else if (state.pwaTab === "suerte") {
      renderPwaSectionSuerte(container);
    }
  }

  // --------------------------------------------------------------------------
  // SECCIÓN 1 PWA: MESA & PEDIDOS DEL LOCAL (MASCOTA: BARNABY)
  // --------------------------------------------------------------------------
  function renderPwaSectionMesa(container) {
    const totalTableCop = state.tableCart.reduce((acc, item) => acc + item.priceCop * item.qty, 0);
    container.innerHTML = `
      ${renderMascotHeaderBanner("barnaby")}

      <!-- Selector de Código de Mesa -->
      <div class="pixel-box bg-[#FFF9EE] p-3 mb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="font-pixel text-[9px] text-[#92400E] font-bold">📍 CÓDIGO DE TU MESA EN EL LOCAL:</label>
          <span class="bg-[#DCFCE7] text-[#166534] font-pixel text-[7px] px-1.5 py-0.5 border border-[#166534]">CONECTADO</span>
        </div>
        <div class="flex gap-2">
          <select onchange="updateTableCode(this.value)" class="flex-1 bg-[#ECE0C8] border-2 border-[#382414] font-pixel text-[9px] text-[#2B1810] px-2 py-2 font-bold">
            ${DATA.tavernTables.map(t => `
              <option value="${t.code}" ${state.tableCode === t.code ? "selected" : ""}>
                ${t.code} — ${t.zone}
              </option>
            `).join("")}
          </select>
          <button onclick="simulateQrTableScan()" class="pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] px-2.5 py-2 shrink-0 font-bold">
            📷 QR MESA
          </button>
        </div>
      </div>

      ${state.activeTableOrder ? `
        <div class="pixel-box bg-[#DCFCE7] border-[#166534] p-3 mb-4">
          <div class="flex items-center justify-between">
            <span class="font-pixel text-[9px] text-[#166534] font-bold">🍺 COMANDA EN CAMINO A ${state.activeTableOrder.table}</span>
            <span class="font-pixel text-[8px] bg-[#166534] text-white px-1.5 py-0.5 animate-pulse">EN BARRA</span>
          </div>
          <p class="font-mono-code text-xs text-[#2B1810] mt-1">
            Barnaby está preparando tus <strong>${state.activeTableOrder.itemsCount} producto(s)</strong> (${formatCop(state.activeTableOrder.total)}). Llegará en ~4 min sin interrumpir tu partida.
          </p>
        </div>
      ` : ""}

      <!-- Menú de Comida y Bebida del Local -->
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-pixel text-[10px] text-[#382414] font-bold">🍔 MENÚ DE TABERNA TOPDECK</h3>
        <span class="font-mono-code text-[10px] text-[#6B5443]">Servicio directo a ${state.tableCode}</span>
      </div>

      <div class="space-y-2.5 mb-5">
        ${DATA.tavernMenu.map(item => `
          <div class="pixel-box-sm bg-[#FFF9EE] p-2.5 flex items-center justify-between gap-2">
            <div class="flex items-start gap-2.5 min-w-0">
              <div class="w-10 h-10 bg-[#ECE0C8] border-2 border-[#382414] flex items-center justify-center text-xl shrink-0">
                ${item.icon}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-pixel text-[8px] text-[#2B1810] font-bold">${item.name}</span>
                  <span class="bg-[#F29F38] text-[#2B1810] font-pixel text-[7px] px-1 py-0.5 border border-[#382414]">${item.tag}</span>
                </div>
                <p class="font-mono-code text-[10px] text-[#6B5443] leading-tight mt-0.5">${item.desc}</p>
                <div class="font-pixel text-[9px] text-[#B45309] font-bold mt-1">${formatCop(item.priceCop)}</div>
              </div>
            </div>
            <button onclick="addTavernMenuItem('${item.id}')" class="pixel-btn bg-[#F29F38] hover:bg-[#FBBF24] text-[#2B1810] font-pixel text-[8px] px-2.5 py-2 shrink-0 font-bold">
              + PEDIR
            </button>
          </div>
        `).join("")}
      </div>

      <!-- Resumen de Comanda de la Mesa -->
      <div class="pixel-box bg-[#ECE0C8] p-3">
        <div class="flex items-center justify-between border-b-2 border-[#382414] pb-2 mb-2">
          <span class="font-pixel text-[9px] text-[#382414] font-bold">🧾 COMANDA DE ${state.tableCode}</span>
          <span class="font-pixel text-[9px] text-[#B45309] font-bold">${formatCop(totalTableCop)}</span>
        </div>
        ${state.tableCart.length === 0 ? `
          <p class="font-mono-code text-xs text-[#6B5443] py-2 text-center">Aún no has agregado bebidas ni snacks para tu mesa.</p>
        ` : `
          <div class="space-y-1.5 mb-3">
            ${state.tableCart.map((c, idx) => `
              <div class="flex items-center justify-between text-xs font-mono-code bg-[#FFF9EE] px-2 py-1 border border-[#382414]">
                <span class="truncate">${c.icon} ${c.qty}x ${c.name}</span>
                <div class="flex items-center gap-2 shrink-0">
                  <strong>${formatCop(c.priceCop * c.qty)}</strong>
                  <button onclick="removeTavernMenuItem(${idx})" class="text-[#C84630] font-bold">✕</button>
                </div>
              </div>
            `).join("")}
          </div>
          <button onclick="submitTableOrder()" class="w-full pixel-btn bg-[#16A34A] text-white font-pixel text-[9px] py-2.5 font-bold">
            🍺 ENVIAR PEDIDO A ${state.tableCode} (${formatCop(totalTableCop)})
          </button>
        `}
      </div>
    `;
  }

  window.updateTableCode = function (newCode) {
    state.tableCode = newCode;
    window.showTavernToast(`Ubicación actualizada a ${newCode}`, "📍");
    renderPwaCurrentSection();
  };

  window.simulateQrTableScan = function () {
    state.tableCode = "MESA-04";
    window.showTavernToast("Código QR de MESA-04 (Zona Commander) escaneado con éxito.", "📷");
    renderPwaCurrentSection();
  };

  window.addTavernMenuItem = function (itemId) {
    const item = DATA.tavernMenu.find(m => m.id === itemId);
    if (!item) return;
    const existing = state.tableCart.find(c => c.id === itemId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.tableCart.push({ ...item, qty: 1 });
    }
    window.showTavernToast(`${item.name} agregado a la comanda de ${state.tableCode}`, item.icon);
    renderPwaCurrentSection();
  };

  window.removeTavernMenuItem = function (idx) {
    state.tableCart.splice(idx, 1);
    renderPwaCurrentSection();
  };

  window.submitTableOrder = function () {
    if (state.tableCart.length === 0) return;
    const total = state.tableCart.reduce((acc, i) => acc + i.priceCop * i.qty, 0);
    const count = state.tableCart.reduce((acc, i) => acc + i.qty, 0);
    state.activeTableOrder = {
      table: state.tableCode,
      total: total,
      itemsCount: count
    };
    state.tableCart = [];
    window.showTavernToast(`¡Pedido enviado a cocina! Barnaby lo llevará a ${state.tableCode}.`, "🍺");
    renderPwaCurrentSection();
  };

  // --------------------------------------------------------------------------
  // SECCIÓN 2 PWA: COLECCIONISTA, MOXFIELD & MERCADO DE PULGAS (MASCOTA: DEXTER)
  // --------------------------------------------------------------------------
  function renderPwaSectionColeccion(container) {
    container.innerHTML = `
      ${renderMascotHeaderBanner("dexter", "¡Bienvenido al Gremio de Coleccionistas! Publica tu carpeta en el Mercado de Pulgas del local para vender o cambiar cartas con jugadores de otras mesas, o sincroniza tus mazos de Moxfield.")}

      <!-- Sub-navegación Coleccionista -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <button onclick="setCollectorSubtab('pulgas')" class="pixel-btn py-2 font-pixel text-[8px] font-bold ${
          state.collectorSubtab === "pulgas" ? "bg-[#F29F38] text-[#2B1810]" : "bg-[#FFF9EE] text-[#5A4231]"
        }">
          🔥 MERCADO DE PULGAS (EN TIENDA)
        </button>
        <button onclick="setCollectorSubtab('mazos')" class="pixel-btn py-2 font-pixel text-[8px] font-bold ${
          state.collectorSubtab === "mazos" ? "bg-[#F29F38] text-[#2B1810]" : "bg-[#FFF9EE] text-[#5A4231]"
        }">
          📦 MIS MAZOS (MOXFIELD) & BULK
        </button>
      </div>

      ${state.collectorSubtab === "pulgas" ? renderFleaMarketSubtab() : renderMoxfieldSubtab()}
    `;
  }

  window.setCollectorSubtab = function (sub) {
    state.collectorSubtab = sub;
    renderPwaCurrentSection();
  };

  function renderFleaMarketSubtab() {
    return `
      <!-- Switch Maestro: Habilitar Mi Carpeta en el Local -->
      <div class="pixel-box p-3 mb-4 ${state.myBinderPublished ? "bg-[#DCFCE7] border-[#166534]" : "bg-[#ECE0C8]"}">
        <div class="flex items-center justify-between gap-2">
          <div>
            <div class="font-pixel text-[9px] text-[#2B1810] font-bold flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full ${state.myBinderPublished ? "bg-[#16A34A] animate-ping" : "bg-gray-500"}"></span>
              <span>MI CARPETA EN EL LOCAL (${state.tableCode})</span>
            </div>
            <p class="font-mono-code text-[10px] text-[#382414] mt-0.5">
              ${state.myBinderPublished
                ? "¡Tu carpeta está PÚBLICA! Los jugadores en TopDeck pueden ver tus cartas y acercarse a tu mesa a comprar o intercambiar."
                : "Tu carpeta está oculta. Actívala para que la tienda vea qué vendes o cambias."}
            </p>
          </div>
          <button onclick="toggleMyBinderPublic()" class="pixel-btn px-3 py-2 font-pixel text-[8px] font-bold shrink-0 ${
            state.myBinderPublished ? "bg-[#16A34A] text-white" : "bg-[#FFF9EE] text-[#2B1810]"
          }">
            ${state.myBinderPublished ? "🟢 VISIBLE" : "⚪ OCULTA"}
          </button>
        </div>

        <!-- Mis cartas publicadas en mi carpeta -->
        <div class="mt-3 pt-2 border-t border-[#382414]/20">
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-pixel text-[8px] text-[#382414]">MIS CARTAS PUBLICADAS (${state.myTradeBinder.length}):</span>
            <button onclick="addCardToMyPublicBinderPrompt()" class="font-pixel text-[7px] bg-[#F29F38] text-[#2B1810] px-2 py-0.5 border border-[#382414]">
              + PUBLICAR CARTA
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            ${state.myTradeBinder.map(c => `
              <div class="bg-[#FFF9EE] border border-[#382414] p-1.5 flex items-center gap-2">
                <img src="${c.img}" class="w-8 h-11 object-cover border border-[#382414] shrink-0" alt="${c.name}"/>
                <div class="min-w-0">
                  <div class="font-pixel text-[7px] text-[#2B1810] truncate font-bold">${c.name}</div>
                  <div class="font-mono-code text-[9px] text-[#16A34A] font-bold">${c.mode}</div>
                  <div class="font-pixel text-[7px] text-[#B45309]">${formatCop(c.priceCop)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Explorador de Carpetas Abiertas Ahora en TopDeck -->
      <div class="mb-2 flex items-center justify-between">
        <h4 class="font-pixel text-[9px] text-[#382414] font-bold">🤝 CARPETAS ABIERTAS EN OTRAS MESAS AHORA (3)</h4>
        <span class="font-pixel text-[7px] bg-[#F29F38] px-1.5 py-0.5 border border-[#382414]">P2P EN VIVO</span>
      </div>

      <div class="space-y-3">
        ${DATA.fleaMarketBinders.map(binder => `
          <div class="pixel-box bg-[#FFF9EE] p-3">
            <div class="flex items-center justify-between border-b-2 border-[#382414] pb-2 mb-2">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-pixel text-[9px] text-[#2B1810] font-bold">${binder.player}</span>
                  <span class="bg-[#382414] text-[#FBBF24] font-pixel text-[7px] px-1.5 py-0.5">${binder.table}</span>
                </div>
                <div class="font-mono-code text-[10px] text-[#16A34A] font-bold mt-0.5">${binder.status}</div>
              </div>
              <span class="font-mono-code text-[10px] text-[#B45309] font-bold">${binder.reputation}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              ${binder.cards.map(card => `
                <div class="bg-[#ECE0C8] border border-[#382414] p-1.5 flex flex-col justify-between">
                  <div class="aspect-[63/88] bg-black border border-[#382414] overflow-hidden relative">
                    <img src="${card.img}" alt="${card.name}" class="w-full h-full object-cover"/>
                    <span class="absolute top-0.5 left-0.5 bg-[#382414]/90 text-[#FBBF24] font-pixel text-[7px] px-1">${card.mode}</span>
                  </div>
                  <div class="mt-1">
                    <div class="font-pixel text-[7px] text-[#2B1810] truncate font-bold">${card.name}</div>
                    <div class="font-pixel text-[7px] text-[#B45309] mt-0.5">${formatCop(card.priceCop)}</div>
                    <button onclick="proposeInStoreTrade('${binder.player}', '${binder.table}', '${card.name}')"
                      class="mt-1 w-full pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[7px] py-1 font-bold">
                      🤝 PROPONER TRATO
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  window.toggleMyBinderPublic = function () {
    state.myBinderPublished = !state.myBinderPublished;
    window.showTavernToast(
      state.myBinderPublished
        ? `¡Tu carpeta ahora es visible para todos los jugadores del local en ${state.tableCode}!`
        : "Has puesto tu carpeta en modo privado.",
      "🦊"
    );
    renderPwaCurrentSection();
  };

  window.addCardToMyPublicBinderPrompt = function () {
    const newCard = DATA.initialCards[Math.floor(Math.random() * DATA.initialCards.length)];
    state.myTradeBinder.unshift({
      name: newCard.name,
      set: newCard.set,
      condition: "NM Foil",
      mode: "VENTA O CAMBIO",
      priceCop: newCard.priceCop,
      img: newCard.image
    });
    window.showTavernToast(`"${newCard.name}" agregada a tu carpeta pública del Mercado de Pulgas.`, "📖");
    renderPwaCurrentSection();
  };

  window.proposeInStoreTrade = function (player, table, cardName) {
    window.showTavernToast(
      `¡Aviso enviado a ${player} (${table})! Sabe que estás en ${state.tableCode} interesado en su "${cardName}".`,
      "🤝"
    );
  };

  function renderMoxfieldSubtab() {
    return `
      <!-- Importador Moxfield -->
      <div class="pixel-box bg-[#FFF9EE] p-3 mb-4">
        <label class="font-pixel text-[8px] text-[#92400E] font-bold block mb-1">
          🔗 SINCRONIZAR / EXPORTAR MAZO CON MOXFIELD:
        </label>
        <div class="flex gap-1.5">
          <input id="moxfieldUrlInput" type="text" placeholder="https://moxfield.com/decks/tu-mazo-commander..."
            class="flex-1 bg-[#ECE0C8] border-2 border-[#382414] px-2 py-1.5 font-mono-code text-xs text-[#2B1810]"/>
          <button onclick="importMoxfieldDeck()" class="pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] px-3 py-1.5 font-bold">
            IMPORTAR
          </button>
        </div>
      </div>

      <!-- Mi Bulk Box -->
      <div class="pixel-box bg-[#ECE0C8] p-3 mb-4 flex items-center justify-between">
        <div>
          <div class="font-pixel text-[9px] text-[#2B1810] font-bold">🗃️ MI BULK INVENTARIADO EN TOPDECK</div>
          <div class="font-mono-code text-xs text-[#5A4231] mt-0.5">
            1,420 cartas comunes/infrecuentes • 185 Raras de Bulk
          </div>
        </div>
        <button onclick="window.showTavernToast('Lista de Bulk exportada en formato CSV / Moxfield.', '📋')"
          class="pixel-btn bg-[#FFF9EE] text-[#2B1810] font-pixel text-[7px] px-2.5 py-1.5 font-bold">
          EXPORTAR BULK
        </button>
      </div>

      <!-- Lista de Mazos -->
      <div class="space-y-3">
        ${state.myDecks.map(d => `
          <div class="pixel-box bg-[#FFF9EE] p-3 flex gap-3 items-center">
            <img src="${d.featuredImg}" class="w-14 h-20 object-cover border-2 border-[#382414] shrink-0" alt="${d.name}"/>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="font-pixel text-[7px] bg-[#382414] text-[#FBBF24] px-1.5 py-0.5">${d.format}</span>
                <span class="font-pixel text-[8px] text-[#16A34A] font-bold">WR: ${d.winrate}</span>
              </div>
              <h4 class="font-pixel text-[9px] text-[#2B1810] font-bold mt-1 truncate">${d.name}</h4>
              <p class="font-mono-code text-[10px] text-[#6B5443]">Comandante: <strong>${d.commander}</strong></p>
              <div class="flex items-center justify-between mt-2">
                <span class="font-pixel text-[8px] text-[#B45309]">${formatUsd(d.estValueUsd)}</span>
                <button onclick="window.showTavernToast('Decklist de ${d.name} copiada en formato Moxfield.', '🦊')"
                  class="pixel-btn bg-[#ECE0C8] text-[#2B1810] font-pixel text-[7px] px-2 py-1">
                  📤 EXPORTAR MOXFIELD
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  window.importMoxfieldDeck = function () {
    const input = document.getElementById("moxfieldUrlInput");
    const val = input && input.value.trim() ? input.value.trim() : "Urza High Artificer Stax (Moxfield)";
    state.myDecks.unshift({
      id: "deck-" + Date.now(),
      name: val.replace("https://moxfield.com/decks/", ""),
      commander: "Urza, Lord High Artificer",
      format: "Commander / EDH",
      moxfieldUrl: val,
      colors: ["U"],
      cardCount: 100,
      estValueUsd: 950.00,
      winrate: "NUEVO",
      featuredImg: "https://cards.scryfall.io/large/front/9/e/9e7fb3c0-5159-4d1f-8490-ce4c9a60f567.jpg",
      keyCards: ["Urza, Lord High Artificer", "The One Ring", "Force of Will"]
    });
    window.showTavernToast("¡Mazo sincronizado desde Moxfield con éxito!", "🦊");
    renderPwaCurrentSection();
  };

  // --------------------------------------------------------------------------
  // SECCIÓN 3 PWA: COMPETITIVO & TORNEOS (MASCOTA: VULKAN)
  // --------------------------------------------------------------------------
  function renderPwaSectionCompetitivo(container) {
    container.innerHTML = `
      ${renderMascotHeaderBanner("vulkan")}

      <!-- Stats Rápidas del Jugador -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="pixel-box-sm bg-[#FFF9EE] p-2 text-center">
          <div class="font-pixel text-[7px] text-[#6B5443]">ELO TABERNA</div>
          <div class="font-pixel text-xs text-[#B45309] font-bold mt-1">1,790</div>
          <div class="font-mono-code text-[9px] text-[#16A34A] font-bold">Rango Mítico #2</div>
        </div>
        <div class="pixel-box-sm bg-[#FFF9EE] p-2 text-center">
          <div class="font-pixel text-[7px] text-[#6B5443]">WINRATE MES</div>
          <div class="font-pixel text-xs text-[#2B1810] font-bold mt-1">68.4%</div>
          <div class="font-mono-code text-[9px] text-[#6B5443]">26V - 12D</div>
        </div>
        <div class="pixel-box-sm bg-[#FFF9EE] p-2 text-center">
          <div class="font-pixel text-[7px] text-[#6B5443]">CRÉDITO TIENDA</div>
          <div class="font-pixel text-[10px] text-[#16A34A] font-bold mt-1">$185.000</div>
          <div class="font-mono-code text-[9px] text-[#6B5443]">Premios FNM</div>
        </div>
      </div>

      <!-- Ronda en Vivo & Pairing -->
      <div class="pixel-box bg-[#FEE2E2] border-[#991B1B] p-3 mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="font-pixel text-[8px] bg-[#DC2626] text-white px-2 py-0.5">⚔️ RONDA 3 EN VIVO • RELOJ: 34:18</span>
          <span class="font-pixel text-[8px] text-[#991B1B] font-bold">MESA TORNEO #02</span>
        </div>
        <div class="bg-[#FFF9EE] border-2 border-[#382414] p-2.5 flex items-center justify-between">
          <div>
            <div class="font-pixel text-[9px] text-[#2B1810] font-bold">TÚ (SANTIAGO) vs. ANDRÉS MEJÍA</div>
            <div class="font-mono-code text-[10px] text-[#6B5443]">Formato: Modern / Commander • Al mejor de 3</div>
          </div>
          ${state.matchResultReported ? `
            <span class="bg-[#16A34A] text-white font-pixel text-[8px] px-2 py-1">REPORTADO (${state.matchResultReported})</span>
          ` : ""}
        </div>
        ${!state.matchResultReported ? `
          <div class="mt-2 flex items-center justify-between gap-1.5">
            <span class="font-pixel text-[7px] text-[#991B1B]">REPORTAR RESULTADO:</span>
            <button onclick="reportTournamentMatch('2-0')" class="pixel-btn bg-[#16A34A] text-white font-pixel text-[7px] px-2 py-1 font-bold">GANÉ 2-0</button>
            <button onclick="reportTournamentMatch('2-1')" class="pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[7px] px-2 py-1 font-bold">GANÉ 2-1</button>
            <button onclick="reportTournamentMatch('1-2')" class="pixel-btn bg-[#ECE0C8] text-[#2B1810] font-pixel text-[7px] px-2 py-1">1-2</button>
          </div>
        ` : ""}
      </div>

      <!-- Tabla de Posiciones en Vivo (Standings) -->
      <div class="pixel-box bg-[#FFF9EE] p-3 mb-4">
        <h4 class="font-pixel text-[9px] text-[#382414] font-bold mb-2">🏆 STANDINGS EN VIVO (TOP 5 SUIZO)</h4>
        <div class="space-y-1">
          ${state.standings.map(s => `
            <div class="flex items-center justify-between text-xs font-mono-code px-2 py-1.5 border border-[#382414] ${
              s.isUser ? "bg-[#FEF3C7] font-bold" : "bg-[#ECE0C8]/60"
            }">
              <div class="flex items-center gap-2">
                <span class="font-pixel text-[8px] w-5 text-center bg-[#382414] text-[#FBBF24] py-0.5">#${s.rank}</span>
                <span>${s.player}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[10px] text-[#6B5443]">OMW ${s.omw}</span>
                <span class="font-pixel text-[8px] text-[#B45309]">${s.points} PTS (${s.record})</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Inscripción a Torneos de la Semana -->
      <h4 class="font-pixel text-[9px] text-[#382414] font-bold mb-2">📋 INSCRIPCIÓN A TORNEOS TOPDECK</h4>
      <div class="space-y-2.5">
        ${state.tournaments.map((t, idx) => `
          <div class="pixel-box-sm bg-[#FFF9EE] p-3">
            <div class="flex items-center justify-between">
              <span class="font-pixel text-[7px] bg-[#382414] text-[#F29F38] px-1.5 py-0.5">${t.time}</span>
              <span class="font-pixel text-[7px] text-[#16A34A] font-bold">${t.spotsLeft} CUPOS LIBRES</span>
            </div>
            <h5 class="font-pixel text-[9px] text-[#2B1810] font-bold mt-1.5">${t.name}</h5>
            <p class="font-mono-code text-[10px] text-[#6B5443] mt-0.5">Premios: ${t.prizePool}</p>
            <div class="mt-2 pt-2 border-t border-[#382414]/20 flex items-center justify-between">
              <span class="font-pixel text-[9px] text-[#B45309] font-bold">${formatCop(t.entryCop)}</span>
              <button onclick="toggleTournamentEnroll(${idx})" class="pixel-btn px-3 py-1.5 font-pixel text-[8px] font-bold ${
                t.enrolled ? "bg-[#16A34A] text-white" : "bg-[#F29F38] text-[#2B1810]"
              }">
                ${t.enrolled ? "✔️ INSCRITO" : "⚔️ INSCRIBIRME"}
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  window.reportTournamentMatch = function (score) {
    state.matchResultReported = score;
    const userStanding = state.standings.find(s => s.isUser);
    if (userStanding) {
      if (score.startsWith("2")) {
        userStanding.points = 9;
        userStanding.record = "3-1-0";
      } else {
        userStanding.record = "2-2-0";
      }
    }
    // Sort standings descending by points, then OMW%
    state.standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return parseFloat(b.omw) - parseFloat(a.omw);
    });
    // Re-assign ranks dynamically
    state.standings.forEach((s, idx) => {
      s.rank = idx + 1;
    });

    window.showTavernToast(`Resultado ${score} registrado por el juez Vulkan. ¡Tabla actualizada!`, "🦁");
    renderPwaCurrentSection();
  };

  window.toggleTournamentEnroll = function (idx) {
    const t = state.tournaments[idx];
    if (!t) return;
    t.enrolled = !t.enrolled;
    if (t.enrolled) {
      t.spotsLeft = Math.max(0, t.spotsLeft - 1);
    } else {
      t.spotsLeft += 1;
    }
    window.showTavernToast(
      t.enrolled ? `¡Te has inscrito a ${t.name}! Cupo reservado.` : `Inscripción cancelada para ${t.name}.`,
      "🏆"
    );
    renderPwaCurrentSection();
  };

  // --------------------------------------------------------------------------
  // SECCIÓN 4 PWA: CASUAL & CONTADOR DE VIDAS COMMANDER (MASCOTA: PIP)
  // --------------------------------------------------------------------------
  function renderPwaSectionCasual(container) {
    const activePlayers = state.casualMode === "commander" ? state.players : state.players.slice(0, 2);

    container.innerHTML = `
      ${renderMascotHeaderBanner("pip")}

      <!-- Barra de Modo Casual + Pedido Rápido a Mesa -->
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex gap-1">
          <button onclick="setCasualLifeMode('commander')" class="pixel-btn px-2.5 py-1.5 font-pixel text-[7px] font-bold ${
            state.casualMode === "commander" ? "bg-[#16A34A] text-white" : "bg-[#FFF9EE] text-[#2B1810]"
          }">
            4P COMMANDER (40❤️)
          </button>
          <button onclick="setCasualLifeMode('duel')" class="pixel-btn px-2.5 py-1.5 font-pixel text-[7px] font-bold ${
            state.casualMode === "duel" ? "bg-[#16A34A] text-white" : "bg-[#FFF9EE] text-[#2B1810]"
          }">
            1v1 DUELO (20❤️)
          </button>
        </div>
        <button onclick="resetCasualLifes()" class="pixel-btn bg-[#ECE0C8] text-[#2B1810] font-pixel text-[7px] px-2.5 py-1.5">
          🔄 REINICIAR
        </button>
      </div>

      <!-- Grid del Contador de Vidas -->
      <div class="grid ${state.casualMode === "commander" ? "grid-cols-2" : "grid-cols-1"} gap-2.5 mb-4">
        ${activePlayers.map((p, idx) => `
          <div class="pixel-box p-3 flex flex-col justify-between relative" style="background-color: ${p.color}; border-color: #382414;">
            <div class="flex items-center justify-between">
              <span class="font-pixel text-[8px] text-[#2B1810] font-bold truncate">${p.name}</span>
              <button onclick="setMonarchPlayer(${p.id})" title="Asignar El Monarca"
                class="text-xs px-1 border border-[#382414] ${state.monarchPlayer === p.id ? "bg-[#FBBF24]" : "bg-white/60 opacity-50"}">
                👑
              </button>
            </div>

            <!-- Vidas Principales -->
            <div class="my-2 flex items-center justify-between">
              <button onclick="adjustPlayerLife(${idx}, -1)"
                class="w-10 h-10 pixel-btn bg-[#C84630] text-white font-pixel text-sm flex items-center justify-center font-bold">
                -
              </button>
              <div class="text-center">
                <div class="font-pixel text-2xl text-[#2B1810] font-bold">${p.life}</div>
                <div class="font-pixel text-[8px] text-[#6B5443]">VIDAS</div>
              </div>
              <button onclick="adjustPlayerLife(${idx}, 1)"
                class="w-10 h-10 pixel-btn bg-[#16A34A] text-white font-pixel text-sm flex items-center justify-center font-bold">
                +
              </button>
            </div>

            <!-- Botones rápidos +5 / -5 y Contadores de Comandante/Veneno -->
            <div class="flex items-center justify-between text-[10px] font-mono-code pt-1.5 border-t border-[#382414]/20 gap-1">
              <button onclick="adjustPlayerLife(${idx}, -5)" class="px-2 py-1 bg-white/80 border border-[#382414] font-bold text-xs" title="Restar 5 vidas">-5</button>

              <!-- Stepper Daño Comandante -->
              <div class="flex items-center bg-white/90 border border-[#382414] px-1 py-0.5 rounded-sm" title="Daño de Comandante (21 pierde)">
                <button onclick="adjustCmdDmg(${idx}, -1)" class="w-4 h-5 flex items-center justify-center font-bold text-red-700 active:scale-90">-</button>
                <span class="px-1 text-[10px] font-bold">⚔️${p.cmdDmg}</span>
                <button onclick="adjustCmdDmg(${idx}, 1)" class="w-4 h-5 flex items-center justify-center font-bold text-green-700 active:scale-90">+</button>
              </div>

              <!-- Stepper Veneno -->
              <div class="flex items-center bg-white/90 border border-[#382414] px-1 py-0.5 rounded-sm" title="Contadores de Veneno (10 pierde)">
                <button onclick="adjustPoison(${idx}, -1)" class="w-4 h-5 flex items-center justify-center font-bold text-red-700 active:scale-90">-</button>
                <span class="px-1 text-[10px] font-bold">☠️${p.poison}</span>
                <button onclick="adjustPoison(${idx}, 1)" class="w-4 h-5 flex items-center justify-center font-bold text-green-700 active:scale-90">+</button>
              </div>

              <button onclick="adjustPlayerLife(${idx}, 5)" class="px-2 py-1 bg-white/80 border border-[#382414] font-bold text-xs" title="Sumar 5 vidas">+5</button>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Herramientas Casuales de Mesa: D20, Moneda, Quién Empieza -->
      <div class="pixel-box bg-[#FFF9EE] p-3 mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-pixel text-[8px] text-[#382414] font-bold">🎲 UTILIDADES DE MESA DE PIP:</span>
          ${state.lastDiceRoll ? `<span class="font-pixel text-[8px] bg-[#F29F38] text-[#2B1810] px-2 py-0.5 border border-[#382414]">${state.lastDiceRoll}</span>` : ""}
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="rollCasualD20()" class="pixel-btn bg-[#ECE0C8] hover:bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] py-2 font-bold">
            🎲 LANZAR D20
          </button>
          <button onclick="flipCasualCoin()" class="pixel-btn bg-[#ECE0C8] hover:bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] py-2 font-bold">
            🪙 MONEDA
          </button>
          <button onclick="pickRandomStarter()" class="pixel-btn bg-[#ECE0C8] hover:bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] py-2 font-bold">
            🎯 ¿QUIÉN SALE?
          </button>
        </div>
      </div>

      <!-- Atajo directo: Pedir a la Mesa sin salir de la partida -->
      <div class="pixel-box bg-[#FFEDD5] p-3 flex items-center justify-between gap-2">
        <div>
          <div class="font-pixel text-[8px] text-[#92400E] font-bold">🍕 ¿HAMBRE EN MEDIA PARTIDA EN ${state.tableCode}?</div>
          <p class="font-mono-code text-[10px] text-[#2B1810]">Pide bebidas o nachos con pinzas sin cerrar tu contador de vidas.</p>
        </div>
        <button onclick="switchPwaTab('mesa')" class="pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] px-3 py-2 shrink-0 font-bold">
          🍺 PEDIR A MESA
        </button>
      </div>
    `;
  }

  window.setCasualLifeMode = function (mode) {
    state.casualMode = mode;
    const startLife = mode === "commander" ? 40 : 20;
    state.players.forEach(p => {
      p.life = startLife;
      p.cmdDmg = 0;
      p.poison = 0;
    });
    renderPwaCurrentSection();
  };

  window.resetCasualLifes = function () {
    const startLife = state.casualMode === "commander" ? 40 : 20;
    state.players.forEach(p => {
      p.life = startLife;
      p.cmdDmg = 0;
      p.poison = 0;
    });
    window.showTavernToast(`Vidas reiniciadas a ${startLife}. ¡Buena partida!`, "👺");
    renderPwaCurrentSection();
  };

  window.adjustPlayerLife = function (idx, delta) {
    state.players[idx].life += delta;
    renderPwaCurrentSection();
  };

  window.adjustCmdDmg = function (idx, delta = 1) {
    const p = state.players[idx];
    if (!p) return;
    const oldDmg = p.cmdDmg;
    p.cmdDmg = Math.max(0, Math.min(21, p.cmdDmg + delta));
    const diff = p.cmdDmg - oldDmg;
    p.life = Math.max(0, p.life - diff);
    renderPwaCurrentSection();
  };

  window.adjustPoison = function (idx, delta = 1) {
    const p = state.players[idx];
    if (!p) return;
    p.poison = Math.max(0, Math.min(10, p.poison + delta));
    renderPwaCurrentSection();
  };

  window.setMonarchPlayer = function (id) {
    state.monarchPlayer = id;
    window.showTavernToast(`¡Jugador ${id} se convierte en El Monarca! Roba carta extra al final del turno.`, "👑");
    renderPwaCurrentSection();
  };

  window.rollCasualD20 = function () {
    const roll = Math.floor(Math.random() * 20) + 1;
    state.lastDiceRoll = `🎲 D20: ¡${roll}!`;
    window.showTavernToast(roll === 20 ? "🎉 ¡CRÍTICO 20 NATURAL EN EL D20!" : `Dado D20 rodó un ${roll}.`, "🎲");
    renderPwaCurrentSection();
  };

  window.flipCasualCoin = function () {
    const res = Math.random() > 0.5 ? "CARA (SOL RING)" : "SELLO (MANA CRYPT)";
    state.lastDiceRoll = `🪙 ${res}`;
    window.showTavernToast(`Moneda al aire: ¡${res}!`, "🪙");
    renderPwaCurrentSection();
  };

  window.pickRandomStarter = function () {
    const count = state.casualMode === "commander" ? 4 : 2;
    const winner = Math.floor(Math.random() * count) + 1;
    state.lastDiceRoll = `🎯 EMPIEZA JUGADOR ${winner}`;
    window.showTavernToast(`Pip ha elegido: ¡Empieza el Jugador ${winner}!`, "🎯");
    renderPwaCurrentSection();
  };

  // --------------------------------------------------------------------------
  // SECCIÓN 5 PWA: LA SUERTE & EL ORÁCULO (MASCOTA: MADAME VESPERA)
  // --------------------------------------------------------------------------
  function renderPwaSectionSuerte(container) {
    const allRevealed = state.tarotSpread.every(c => c.revealed);

    container.innerHTML = `
      ${renderMascotHeaderBanner("vespera")}

      <!-- Tarot del Planeswalker (3 Cartas Místicas) -->
      <div class="pixel-box bg-[#2E1065] text-[#FBF6EB] p-3.5 mb-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <span class="font-pixel text-[9px] text-[#FDE047] font-bold">🔮 EL TAROT DEL PLANESWALKER</span>
            <p class="font-mono-code text-[10px] text-[#E9D5FF]">Toca cada carta arcana para revelar la suerte de tus partidas hoy:</p>
          </div>
          <button onclick="shuffleNewTarotSpread()" class="pixel-btn bg-[#7C3AED] text-white font-pixel text-[7px] px-2.5 py-1.5">
            🔄 BARAJAR
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2.5 my-3">
          ${state.tarotSpread.map((card, idx) => `
            <div onclick="revealTarotCard(${idx})" class="cursor-pointer">
              <div class="text-center font-pixel text-[7px] text-[#C084FC] mb-1 truncate">${card.positionMeaning}</div>
              <div class="aspect-[63/88] rounded border-2 ${card.revealed ? "border-[#FDE047]" : "border-[#C084FC]"} overflow-hidden relative bg-[#1E1B4B] shadow-md transition-transform hover:scale-105">
                ${card.revealed ? `
                  <img src="${card.img}" alt="${card.cardName}" class="w-full h-full object-cover"/>
                  <div class="absolute inset-x-0 bottom-0 bg-black/85 p-1 text-center">
                    <span class="font-pixel text-[7px] text-[#FDE047] block">${card.arcanaTitle}</span>
                  </div>
                ` : `
                  <div class="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-[#4C1D95] to-[#1E1B4B]">
                    <span class="text-2xl mb-1 animate-pulse">🦉</span>
                    <span class="font-pixel text-[8px] text-[#FDE047]">TOCAR PARA REVELAR</span>
                  </div>
                `}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Lectura del Oráculo -->
        <div class="space-y-2 mt-3">
          ${state.tarotSpread.filter(c => c.revealed).map(c => `
            <div class="bg-[#1E1B4B] border border-[#C084FC] p-2.5 rounded-sm">
              <div class="flex items-center justify-between">
                <span class="font-pixel text-[8px] text-[#FDE047] font-bold">${c.arcanaTitle} — ${c.cardName}</span>
                <span class="font-mono-code text-[9px] text-[#38BDF8]">Maná: ${c.luckyColor}</span>
              </div>
              <p class="font-mono-code text-[11px] text-[#F3E8FF] mt-1 leading-snug">${c.reading}</p>
              ${c.rewardText ? `
                <div class="mt-2 bg-[#FEF08A] text-[#2B1810] p-2 border-2 border-[#F59E0B] font-mono-code text-[10px] font-bold">
                  ${c.rewardText}
                </div>
              ` : ""}
            </div>
          `).join("")}

          ${!allRevealed ? `
            <button onclick="revealAllTarotCards()" class="w-full pixel-btn bg-[#FDE047] text-[#2E1065] font-pixel text-[8px] py-2 font-bold">
              ✨ REVELAR LAS 3 CARTAS DEL DESTINO
            </button>
          ` : ""}
        </div>
      </div>

      <!-- Simulador de Sobre de la Fortuna (Mystery Pack Opener) -->
      <div class="pixel-box bg-[#FFF9EE] p-3">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-pixel text-[9px] text-[#382414] font-bold">🎁 SOBRE MISTERIOSO DE LA TABERNA</h4>
            <p class="font-mono-code text-[10px] text-[#6B5443]">Rasga un sobre virtual para probar tu suerte antes de comprar en vitrina.</p>
          </div>
          <button onclick="openLuckyBoosterPack()" class="pixel-btn bg-[#F29F38] text-[#2B1810] font-pixel text-[8px] px-3 py-2 font-bold shrink-0">
            ⚡ RASGAR SOBRE
          </button>
        </div>

        ${state.boosterOpened ? `
          <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t-2 border-[#382414]">
            ${state.boosterCards.map(bc => `
              <div class="bg-[#ECE0C8] border border-[#382414] p-1 text-center cursor-pointer" onclick="triggerCardSlideOut('${bc.id}', null)">
                <img src="${bc.image}" class="w-full aspect-[63/88] object-cover border border-[#382414]" alt="${bc.name}"/>
                <div class="font-pixel text-[8px] text-[#2B1810] truncate mt-1 font-bold">${bc.name}</div>
                <div class="font-pixel text-[8px] text-[#B45309]">$${bc.priceUsd.toFixed(2)}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }

  window.revealTarotCard = function (idx) {
    state.tarotSpread[idx].revealed = true;
    window.showTavernToast(`Revelaste: ${state.tarotSpread[idx].arcanaTitle} (${state.tarotSpread[idx].cardName})`, "🦉");
    renderPwaCurrentSection();
  };

  window.revealAllTarotCards = function () {
    state.tarotSpread.forEach(c => { c.revealed = true; });
    window.showTavernToast("¡Madame Vespera ha revelado tu lectura completa y desbloqueó un cupón en barra!", "🔮");
    renderPwaCurrentSection();
  };

  window.shuffleNewTarotSpread = function () {
    const shuffled = [...DATA.tarotArcana].sort(() => Math.random() - 0.5).slice(0, 3);
    const meanings = ["Tu Mano Inicial (El Pasado)", "El Campo de Batalla (El Presente)", "Tu Topdeck Decisivo (El Futuro)"];
    state.tarotSpread = shuffled.map((item, i) => ({
      ...item,
      positionMeaning: meanings[i],
      revealed: false
    }));
    window.showTavernToast("Las cartas astrales han sido barajadas de nuevo.", "🦉");
    renderPwaCurrentSection();
  };

  window.openLuckyBoosterPack = function () {
    const pool = [...DATA.initialCards].sort(() => Math.random() - 0.5);
    state.boosterCards = pool.slice(0, 3);
    state.boosterOpened = true;
    window.showTavernToast(`¡Sobre rasgado! Te salió ${state.boosterCards[0].name} ($${state.boosterCards[0].priceUsd.toFixed(2)})!`, "⚡");
    renderPwaCurrentSection();
  };

  // ==========================================================================
  // INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    renderSynergyPills();
    renderManaColorButtons();
    renderBinderPage();
    updateCartBadges();
    setup3DTactileStage();
    renderPwaCurrentSection();

    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.close3DCardInspector();
        window.closePersonalBinderCart();
      }
    });
  });
})();
