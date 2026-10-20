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
      { id: 1, name: "Tú (Mesa 04)", life: 40, cmdDmg: 0, poison: 0, color: "#F1E8D9", border: "#C55A3F" },
      { id: 2, name: "Jugador 2", life: 40, cmdDmg: 0, poison: 0, color: "#689F77", border: "#4A7C59" },
      { id: 3, name: "Jugador 3", life: 40, cmdDmg: 0, poison: 0, color: "#C55A3F", border: "#A2412A" },
      { id: 4, name: "Jugador 4", life: 40, cmdDmg: 0, poison: 0, color: "#BCAAA4", border: "#795548" }
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
    toast.className = "tavern-box bg-mocha-brown text-parchment-white border-2 border-cocoa-gray px-4 py-3 flex items-center gap-3 shadow-2xl rounded-xl transform transition-all duration-300 translate-y-2 opacity-0 max-w-sm";
    toast.innerHTML = `
      <span class="text-xl">${icon}</span>
      <div class="font-body-sans text-xs font-semibold leading-snug text-parchment-white">${msg}</div>
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
      btnWeb.className = "btn-primary text-xs sm:text-sm px-4 sm:px-5 py-2 font-bold rounded-xl shadow-md";
      btnPwa.className = "nav-pill text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl text-latte-gray hover:text-parchment-white";
    } else {
      webView.classList.add("hidden");
      pwaView.classList.remove("hidden");
      btnPwa.className = "btn-secondary text-fresh-sage text-xs sm:text-sm px-4 sm:px-5 py-2 font-bold rounded-xl shadow-md";
      btnWeb.className = "nav-pill text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl text-latte-gray hover:text-parchment-white";
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
    if (speechEl) speechEl.textContent = text;

    const liveHintTopic = document.getElementById("dexterLiveHintTopic");
    const liveHintText = document.getElementById("dexterLiveHintText");
    if (liveHintTopic) liveHintTopic.textContent = `🦊 DEXTER: ${badge}`;
    if (liveHintText) liveHintText.textContent = `"${text}"`;
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
      dexterNote: `Carta sincronizada en vivo desde Scryfall (${scryCard.set_name}). Excelente adición para Commander y juego de alto nivel.`,
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
  let searchDebounceTimer = null;

  // Real-time input listener with 400ms debounce
  window.onVaultSearchInput = function (val) {
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.toggle("hidden", !val || val.trim().length === 0);

    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      window.executeVaultSearch();
    }, 420);
  };

  // Quick suggestion click from Dexter
  window.quickSearchDexter = function (cardName) {
    const input = document.getElementById("vaultSearchInput");
    if (input) {
      input.value = cardName;
      const clearBtn = document.getElementById("clearSearchBtn");
      if (clearBtn) clearBtn.classList.remove("hidden");
    }
    state.activeSynergy = "all";
    renderSynergyPills();
    window.executeVaultSearch();
  };

  // Reset search and restore default vault cards
  window.resetVaultSearch = function () {
    const input = document.getElementById("vaultSearchInput");
    if (input) input.value = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.add("hidden");
    window.resetVaultFilters();
  };

  // Trigger Live Scryfall Search
  window.executeVaultSearch = async function (customScryfallQuery = null) {
    if (currentSearchController) {
      currentSearchController.abort();
    }
    currentSearchController = new AbortController();

    const searchInput = document.getElementById("vaultSearchInput");
    const rawText = searchInput ? searchInput.value.trim() : "";
    state.searchQuery = rawText;

    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.toggle("hidden", rawText.length === 0);

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
      const statusBadge = document.getElementById("scryfallLiveStatus");
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-botanical-green animate-ping"></span><span>SCRYFALL LIVE: LISTO</span>`;
      }
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
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-clay-terracotta animate-pulse"></span><span>CONSULTANDO SCRYFALL...</span>`;
    }

    setDexterSpeech(`Estoy buscando en los archivos de Scryfall cartas que coincidan con "${rawText || queryParts.join(" • ")}"...`, "CONSULTANDO SCRYFALL API");

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
          statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-botanical-green"></span><span>SCRYFALL: ${data.total_cards || scryCards.length} CARTAS</span>`;
        }
        const synObj = DATA.synergies.find(s => s.id === state.activeSynergy);
        if (rawText) {
          setDexterSpeech(`¡Encontré ${data.total_cards || scryCards.length} cartas en Scryfall para "${rawText}"! Las he colocado en tu carpeta. Toca cualquier carta para sacarla e inspeccionarla en 3D.`, `RESULTADOS EN VIVO: ${rawText.toUpperCase()}`);
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
        setDexterSpeech(`No encontré más resultados externos en Scryfall, pero te muestro ${localMatches.length} cartas de la bóveda local que encajan con tu búsqueda.`, "COINCIDENCIAS EN BÓVEDA");
      } else {
        state.filteredCards = [...DATA.initialCards];
        setDexterSpeech(`No encontré cartas con esa combinación exacta en Scryfall. He restaurado las joyas recomendadas de la bóveda para que sigas explorando.`, "SUGERENCIAS DE DEXTER");
        window.showTavernToast("Sin resultados en Scryfall para esa búsqueda exacta; mostrando sugerencias de la bóveda.", "🦊");
      }
      state.binderPage = 1;
      renderBinderPage();
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-fresh-sage"></span><span>BÓVEDA (${state.filteredCards.length} CARTAS)</span>`;
      }
    }
  };

  window.selectSynergy = function (synergyId) {
    state.activeSynergy = synergyId;
    const searchInput = document.getElementById("vaultSearchInput");
    if (searchInput && synergyId !== "all") searchInput.value = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn && synergyId !== "all") clearBtn.classList.add("hidden");

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
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.add("hidden");
    const typeSelect = document.getElementById("vaultTypeSelect");
    if (typeSelect) typeSelect.value = "";
    renderSynergyPills();
    renderManaColorButtons();
    state.filteredCards = [...DATA.initialCards];
    state.binderPage = 1;
    renderBinderPage();
    const statusBadge = document.getElementById("scryfallLiveStatus");
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-botanical-green"></span><span>SCRYFALL LIVE: LISTO</span>`;
    }
    setDexterSpeech(DATA.mascots.dexter.welcomeWeb, "BÓVEDA RESTAURADA");
  };

  function renderSynergyPills() {
    const container = document.getElementById("dexterSynergyPills");
    if (!container) return;
    container.innerHTML = DATA.synergies.map(s => {
      const isActive = state.activeSynergy === s.id;
      return `
        <button onclick="selectSynergy('${s.id}')" class="px-3 py-1.5 text-xs font-body-sans font-bold flex items-center gap-1.5 transition-all rounded-xl ${
          isActive
            ? "bg-clay-terracotta text-parchment-white shadow-md border-2 border-brick-terracotta"
            : "bg-mocha-brown hover:bg-[#4A3228] text-latte-gray hover:text-parchment-white border-2 border-cocoa-gray"
        }">
          <span>${s.label}</span>
        </button>
      `;
    }).join("");
  }

  function renderManaColorButtons() {
    const colors = [
      { code: "W", label: "Blanco (W)", bg: "#F1E8D9", text: "#2C1E16" },
      { code: "U", label: "Azul (U)", bg: "#3A6073", text: "#F1E8D9" },
      { code: "B", label: "Negro (B)", bg: "#1E140E", text: "#F1E8D9" },
      { code: "R", label: "Rojo (R)", bg: "#C55A3F", text: "#F1E8D9" },
      { code: "G", label: "Verde (G)", bg: "#4A7C59", text: "#F1E8D9" },
      { code: "C", label: "Incoloro (C)", bg: "#795548", text: "#F1E8D9" }
    ];
    const container = document.getElementById("manaColorFilterBar");
    if (!container) return;
    container.innerHTML = colors.map(c => {
      const active = state.activeColors.includes(c.code);
      return `
        <button onclick="toggleManaColor('${c.code}')" title="${c.label}"
          style="background-color:${c.bg}; color:${c.text};"
          class="w-8 h-8 font-mono text-xs font-bold flex items-center justify-center transition-all rounded-xl ${
            active
              ? "border-2 border-fresh-sage ring-2 ring-clay-terracotta/50 scale-110 shadow-lg"
              : "border-2 border-cocoa-gray opacity-80 hover:opacity-100"
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
      countLabel.textContent = `${state.filteredCards.length} CARTAS EN BÓVEDA`;
    }

    // Always render 9 pockets so it looks like a real physical 9-pocket binder sheet!
    let pocketsHtml = "";
    for (let i = 0; i < 9; i++) {
      const card = pageCards[i];
      if (card) {
        const rarityBadge = card.rarity === "mythic" ? "MÍTICA" : card.rarity === "rare" ? "RARA" : "SINGLES";
        const rarityColor = card.rarity === "mythic" ? "bg-brick-terracotta text-parchment-white" : "bg-clay-terracotta text-parchment-white";
        pocketsHtml += `
          <div class="binder-pocket rounded-xl flex flex-col justify-between cursor-pointer group bg-dark-roast border-2 border-cocoa-gray p-2.5 hover:border-clay-terracotta transition-all shadow"
               onclick="triggerCardSlideOut('${card.id}', this)">
            <div class="pocket-card-inner bg-[#1A110B] border-2 border-cocoa-gray/60 rounded-lg overflow-hidden aspect-[63/88] relative shadow-sm">
              <img src="${card.image}" alt="${card.name}" loading="lazy"
                   class="w-full h-full object-cover pointer-events-none"
                   onerror="this.src='${MTG_CARD_BACK}'"/>
              ${card.isFoil ? `<span class="absolute top-1.5 left-1.5 bg-dark-roast/90 text-fresh-sage font-mono text-[9px] px-1.5 py-0.5 rounded border border-fresh-sage/50 font-bold">✨ FOIL</span>` : ""}
              <span class="absolute top-1.5 right-1.5 ${rarityColor} font-mono text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">${rarityBadge}</span>
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="btn-primary text-xs px-3 py-1 font-bold rounded-xl shadow-lg">
                  🖐️ Tocar en 3D
                </span>
              </div>
            </div>
            <div class="mt-2 px-0.5 z-20">
              <div class="flex items-center justify-between gap-1">
                <span class="font-body-sans text-xs text-parchment-white truncate font-bold" title="${card.name}">${card.name}</span>
                <span class="font-mono text-xs text-clay-terracotta font-bold shrink-0">$${card.priceUsd.toFixed(2)}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] font-body-sans text-latte-gray mt-0.5">
                <span>${card.set} #${card.collector_number} • <strong class="text-fresh-sage">${card.condition}</strong></span>
                <span class="font-bold text-parchment-white font-mono">${formatCop(card.priceCop)}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // Empty binder pocket slot
        pocketsHtml += `
          <div class="binder-pocket rounded-xl flex flex-col items-center justify-center aspect-[63/88] bg-dark-roast/60 border-2 border-dashed border-cocoa-gray/70 opacity-60">
            <div class="text-center p-4">
              <div class="font-display text-sm text-latte-gray font-bold mb-0.5">Bolsillo Vacío</div>
              <div class="font-mono text-[10px] text-cocoa-gray">ULTRA•PRO 9-POCKET</div>
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

    // Populate modal fields safely
    const frontEl = document.getElementById("inspect3DFrontImg");
    if (frontEl) frontEl.src = card.image;
    const backEl = document.getElementById("inspect3DBackImg");
    if (backEl) backEl.src = card.backImage || MTG_CARD_BACK;
    const nameEl = document.getElementById("inspectCardName");
    if (nameEl) nameEl.textContent = card.name;
    const setEl = document.getElementById("inspectCardSet");
    if (setEl) setEl.textContent = `${card.set_name || "MTG"} (${card.set} #${card.collector_number || "1"})`;
    const manaEl = document.getElementById("inspectCardMana");
    if (manaEl) manaEl.textContent = card.mana_cost || "SIN COSTO";
    const typeEl = document.getElementById("inspectCardType");
    if (typeEl) typeEl.textContent = card.type_line;
    const oracleEl = document.getElementById("inspectCardOracle");
    if (oracleEl) oracleEl.textContent = card.oracle_text;
    const tipEl = document.getElementById("inspectDexterTip");
    if (tipEl) tipEl.textContent = card.dexterNote || `¡Excelente carta! Sincronizada en vivo desde Scryfall (${card.set_name || card.set}). Gran staple para Commander y juego competitivo.`;
    const stockEl = document.getElementById("inspectStockBadge");
    if (stockEl) stockEl.textContent = `${card.stock || 3} DISPONIBLES EN BÓVEDA`;

    // Render legalities
    const legContainer = document.getElementById("inspectLegalities");
    if (legContainer && card.legalities) {
      const formats = ["commander", "modern", "pioneer", "standard", "legacy"];
      legContainer.innerHTML = formats.map(fmt => {
        const status = card.legalities[fmt] || "not_legal";
        const isLegal = status === "legal";
        return `
          <span class="px-2 py-0.5 font-mono text-[9px] font-bold rounded-lg border-2 ${
            isLegal ? "bg-botanical-green/20 text-fresh-sage border-botanical-green/50" : "bg-brick-terracotta/20 text-clay-terracotta border-brick-terracotta/50"
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
    ["NM", "LP", "MP"].forEach(cond => {
      const btn = document.getElementById(`condBtn-${cond}`);
      if (btn) {
        if (state.inspectCondition === cond) {
          btn.className = "btn-primary flex-1 py-1.5 text-xs text-parchment-white font-bold text-center rounded-xl";
        } else {
          btn.className = "nav-pill flex-1 py-1.5 text-xs text-latte-gray font-bold text-center rounded-xl";
        }
      }
    });

    // Foil toggle button
    const foilBtn = document.getElementById("toggleFoil3DBtn");
    if (foilBtn) {
      foilBtn.innerHTML = state.inspectFoil
        ? `<span>✨ FOIL ON</span>`
        : `<span>🃏 FOIL OFF</span>`;
      foilBtn.className = state.inspectFoil
        ? "btn-primary px-3 py-1.5 text-xs font-bold text-parchment-white rounded-xl"
        : "nav-pill px-3 py-1.5 text-xs font-bold text-latte-gray rounded-xl";
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
  window.addInspectedCardToCart = window.addInspectedCardToBinderCart;

  window.addSealedProductToCart = function (productName, priceUsd, priceCop, img, category) {
    state.cart.push({
      id: "sealed-" + Date.now(),
      name: productName,
      mana_cost: "",
      type_line: category || "Producto Sellado WPN",
      set_name: "TopDeck Oficial",
      image: img,
      finalPriceUsd: priceUsd,
      finalPriceCop: priceCop,
      selectedCondition: "NUEVO SELLADO",
      selectedFoil: false,
      cartItemId: "cart-sealed-" + Date.now()
    });
    updateCartBadges();
    window.showTavernToast(`¡"${productName}" añadido a tu Baraja!`, "📦");
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
          <div class="binder-pocket rounded-xl p-2.5 flex flex-col justify-between bg-dark-roast border-2 border-cocoa-gray relative shadow">
            <button onclick="removeFromBinderCart(${i})" title="Sacar de mi carpeta"
              class="absolute top-1.5 right-1.5 z-30 w-6 h-6 bg-clay-terracotta hover:bg-brick-terracotta text-parchment-white font-bold text-xs rounded-full flex items-center justify-center cursor-pointer shadow border border-cocoa-gray transition-colors">
              ✕
            </button>
            <div class="aspect-[63/88] bg-black/40 rounded-lg border-2 border-cocoa-gray/60 overflow-hidden relative shadow-md">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"
                   onerror="this.src='${MTG_CARD_BACK}'"/>
              ${item.selectedFoil ? `<span class="absolute bottom-1 left-1 bg-dark-roast/90 text-fresh-sage font-mono text-[9px] px-1.5 py-0.5 rounded font-bold border border-fresh-sage/50">FOIL</span>` : ""}
            </div>
            <div class="mt-2 z-20">
              <div class="font-body-sans text-xs text-parchment-white truncate font-bold">${item.name}</div>
              <div class="flex justify-between items-center mt-1">
                <span class="font-mono text-[11px] font-bold text-fresh-sage bg-botanical-green/20 px-1.5 py-0.5 rounded border border-botanical-green/40">${item.selectedCondition}</span>
                <span class="font-mono text-xs text-clay-terracotta font-bold">${formatCop(item.finalPriceCop)}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="binder-pocket rounded-xl p-2.5 flex flex-col items-center justify-center aspect-[63/88] bg-dark-roast/40 border-2 border-cocoa-gray border-dashed opacity-60">
            <span class="text-2xl mb-1 opacity-50">🃏</span>
            <span class="font-body-sans text-xs text-latte-gray text-center font-semibold">Bolsillo Libre</span>
          </div>
        `;
      }
    }
    grid.innerHTML = html;

    const totalCop = state.cart.reduce((s, c) => s + c.finalPriceCop, 0);
    const totalUsd = state.cart.reduce((s, c) => s + c.finalPriceUsd, 0);
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="space-y-2 w-full">
          <div class="flex justify-between text-xs font-body-sans text-latte-gray">
            <span>Cartas seleccionadas:</span>
            <strong class="font-mono text-parchment-white">${state.cart.length} Singles MTG</strong>
          </div>
          <div class="flex justify-between text-xs font-body-sans text-latte-gray">
            <span>Fundas Dragon Shield de cortesía:</span>
            <strong class="text-fresh-sage font-bold">¡GRATIS! ($0)</strong>
          </div>
          <div class="flex justify-between text-xs font-body-sans text-latte-gray">
            <span>Cofre de Bóveda TopDeck:</span>
            <strong class="text-fresh-sage font-bold">INCLUIDO</strong>
          </div>
          <div class="border-t-2 border-cocoa-gray pt-3 mt-3 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span class="text-xs font-bold text-latte-gray font-body-sans block uppercase tracking-wider">TOTAL ORDEN:</span>
              <div class="font-mono text-2xl text-clay-terracotta font-bold leading-tight">${formatCop(totalCop)}</div>
              <div class="font-mono text-xs text-latte-gray">(${formatUsd(totalUsd)})</div>
            </div>
            <button id="startCheckoutAnimBtn" onclick="runCheckoutPackagingAnimation()"
              ${state.cart.length === 0 ? "disabled" : ""}
              class="btn-primary text-parchment-white px-6 py-2.5 text-sm font-bold flex items-center gap-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
              <span>✨</span>
              <span>PAGAR Y EMPACAR PEDIDO</span>
            </button>
          </div>
        </div>
      `;
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
        <div class="absolute inset-0 bg-gradient-to-b from-clay-terracotta/20 to-botanical-green/20 border-2 border-clay-terracotta rounded-xl shadow-[0_12px_30px_rgba(197,90,63,0.35)] overflow-hidden z-20 pointer-events-none">
          <div class="sleeve-shine-bar"></div>
          <div class="absolute bottom-2 inset-x-0 text-center font-body-sans font-bold text-[9px] text-parchment-white bg-dark-roast/90 py-1 border-t-2 border-cocoa-gray">
            🛡️ DRAGON SHIELD ARCHIVAL SLEEVE
          </div>
        </div>
        <!-- Card sliding inside the sleeve -->
        <div class="w-36 h-52 rounded-lg border-2 border-cocoa-gray overflow-hidden shadow-lg anim-sleeve-card z-10">
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
          <div class="w-28 h-40 rounded-lg border-2 border-clay-terracotta overflow-hidden shadow-md anim-pack-box mb-[-25px] z-10">
            <img src="${sampleCard.image}" class="w-full h-full object-cover" alt="Sleeved Card"
                 onerror="this.src='${MTG_CARD_BACK}'"/>
          </div>
          <!-- Armored TopDeck Vault Box -->
          <div class="w-52 h-32 bg-mocha-brown border-2 border-cocoa-gray shadow-xl rounded-xl relative z-20 flex flex-col items-center justify-center p-3">
            <div class="w-full h-3 bg-clay-terracotta border-b-2 border-cocoa-gray absolute top-0 inset-x-0 rounded-t-xl"></div>
            <div class="w-9 h-9 rounded-full bg-botanical-green border-2 border-fresh-sage flex items-center justify-center text-sm text-parchment-white shadow mb-1">
              🃏
            </div>
            <span class="font-display text-xs text-parchment-white font-bold">COFRE TOPDECK</span>
            <span class="font-mono text-[11px] text-fresh-sage font-bold mt-0.5">${cardCount} CARTAS PROTEGIDAS</span>
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
      stepTitle.textContent = "PASO 3/3: ¡DESPACHADO EN EL TRANSPORTE EXPRESO TOPDECK!";
      stepDesc.textContent = "¡Tu pedido va en camino! Saliendo de la taberna TopDeck directo a tus manos.";
      const guideCode = "TD-COL-" + Math.floor(100000 + Math.random() * 900000);
      visualCanvas.innerHTML = `
        <div class="w-full flex flex-col items-center justify-center overflow-hidden py-4">
          <div class="relative w-full max-w-md h-36 flex items-end justify-center border-b-2 border-cocoa-gray pb-2 overflow-hidden">
            <!-- Delivery Truck -->
            <div class="anim-truck-move flex items-end gap-1">
              <!-- Smoke puffs -->
              <div class="flex gap-1 items-center mr-1 mb-4 animate-pulse">
                <span class="w-3 h-3 rounded-full bg-clay-terracotta/40 inline-block"></span>
                <span class="w-4 h-4 rounded-full bg-fresh-sage/60 inline-block"></span>
              </div>
              <div class="anim-truck-body flex items-end">
                <!-- Cargo Box -->
                <div class="w-36 h-24 bg-mocha-brown border-2 border-cocoa-gray flex flex-col items-center justify-center p-2 relative rounded-l-lg shadow">
                  <span class="font-display text-xs text-clay-terracotta font-bold">TOPDECK</span>
                  <span class="text-[10px] text-latte-gray font-body-sans mt-0.5">EXPRESS VAULT</span>
                  <div class="mt-1 bg-botanical-green text-parchment-white text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                    📦 ${cardCount} CARTAS
                  </div>
                </div>
                <!-- Truck Cabin -->
                <div class="w-16 h-16 bg-clay-terracotta border-2 border-l-0 border-cocoa-gray rounded-r-lg relative flex flex-col justify-between p-1.5">
                  <div class="w-9 h-6 bg-mocha-brown border border-cocoa-gray rounded-sm ml-auto"></div>
                  <div class="w-3 h-3 bg-fresh-sage rounded-full border border-cocoa-gray ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- Confirmation Ticket -->
          <div class="mt-4 bg-mocha-brown border-2 border-botanical-green p-4 w-full max-w-md text-center rounded-2xl shadow-xl">
            <div class="font-display text-sm text-fresh-sage font-bold">✅ ¡PAGO APROBADO Y CARPETA DESPACHADA!</div>
            <div class="font-mono text-xs text-latte-gray mt-1">
              Guía de Rastreo: <strong class="text-parchment-white">${guideCode}</strong> • Empaque: <strong class="text-parchment-white">Sleeve + Deckbox</strong>
            </div>
            <button onclick="finishCheckoutOrder()" class="mt-3 btn-primary text-parchment-white text-xs px-5 py-2 font-bold rounded-xl">
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
      { id: "mesa", label: "Mesa", icon: "🍺", mascot: "Barnaby" },
      { id: "coleccion", label: "Pulgas", icon: "🦊", mascot: "Dexter" },
      { id: "competitivo", label: "Torneo", icon: "🦁", mascot: "Vulkan" },
      { id: "casual", label: "Casual", icon: "👺", mascot: "Pip" },
      { id: "suerte", label: "Suerte", icon: "🦉", mascot: "Vespera" }
    ];

    const navBar = document.getElementById("pwaBottomNavBar");
    if (!navBar) return;
    navBar.innerHTML = tabs.map(t => {
      const active = state.pwaTab === t.id;
      return `
        <button onclick="switchPwaTab('${t.id}')"
          class="flex-1 py-2 px-1 flex flex-col items-center justify-center transition-all border-r-2 last:border-r-0 border-cocoa-gray cursor-pointer ${
            active ? "bg-mocha-brown text-clay-terracotta border-t-2 border-clay-terracotta font-bold shadow-inner" : "bg-dark-roast text-latte-gray hover:bg-mocha-brown hover:text-parchment-white"
          }">
          <span class="text-base leading-none">${t.icon}</span>
          <span class="font-body-sans font-bold text-xs mt-0.5 tracking-tight">${t.label}</span>
          <span class="text-[10px] font-body-sans opacity-75">${t.mascot}</span>
        </button>
      `;
    }).join("");
  }

  function renderMascotHeaderBanner(mascotKey, customSubtitle = null) {
    const m = DATA.mascots[mascotKey];
    return `
      <div class="tavern-box p-4 mb-4 flex items-center gap-3.5 bg-mocha-brown border-2 border-cocoa-gray shadow-md rounded-2xl">
        <div class="w-14 h-14 sm:w-16 sm:h-16 shrink-0 border-2 border-cocoa-gray rounded-xl overflow-hidden bg-dark-roast p-1 flex items-center justify-center shadow">
          ${mascotKey === "dexter"
            ? `<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsF8Fr-Ep6TTMcZfAPSz3jHNSwglKG-3yIXbintNVH1VurfFygzES3tiTDHz0Oe7YpIrXU0UfJYfo7BtvkkbNxStIvyx8pw-5MtT1sgWt0YHiqkGjJbwhWxVddNlOPUNHW9d0c22G0ne9NS2402z2htbnjjnltk_N2dV_95xHcONS0Uu3nSsZp450vDelNg0yLof0xrtfKPXH-sLUhIXyyCK0TKH3LomhQpRzYnbp4f9olyJnBl460_kVOktR24dt_Fw" class="w-full h-full object-cover rounded-lg"/>`
            : `<div class="text-3xl">${m.emoji}</div>`
          }
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-display text-lg sm:text-xl text-parchment-white font-bold">
              ${m.name}
            </span>
            <span class="text-xs font-bold text-fresh-sage font-body-sans">
              • ${m.title}
            </span>
          </div>
          <p class="text-xs text-latte-gray mt-1 font-body-sans leading-relaxed italic">
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
      <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 mb-4 rounded-2xl shadow-md">
        <div class="flex items-center justify-between mb-2">
          <label class="font-body-sans text-xs text-clay-terracotta font-bold uppercase tracking-wider">📍 Código de tu Mesa en la Taberna:</label>
          <span class="bg-botanical-green/25 text-fresh-sage font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-botanical-green/40">CONECTADO</span>
        </div>
        <div class="flex gap-2">
          <select onchange="updateTableCode(this.value)" class="flex-1 bg-dark-roast border-2 border-cocoa-gray rounded-xl font-body-sans text-xs text-parchment-white px-3 py-2 font-bold focus:outline-none focus:border-clay-terracotta">
            ${DATA.tavernTables.map(t => `
              <option value="${t.code}" ${state.tableCode === t.code ? "selected" : ""}>
                ${t.code} — ${t.zone}
              </option>
            `).join("")}
          </select>
          <button onclick="simulateQrTableScan()" class="btn-primary text-xs px-3.5 py-2 shrink-0 font-bold rounded-xl">
            📷 QR MESA
          </button>
        </div>
      </div>

      ${state.activeTableOrder ? `
        <div class="tavern-box bg-mocha-brown border-2 border-botanical-green p-4 mb-4 rounded-2xl shadow-md">
          <div class="flex items-center justify-between">
            <span class="font-display text-lg text-fresh-sage font-bold">🍺 Comanda en Preparación para ${state.activeTableOrder.table}</span>
            <span class="font-mono text-[10px] bg-botanical-green text-parchment-white px-2 py-0.5 rounded animate-pulse font-bold">EN BARRA</span>
          </div>
          <p class="font-body-sans text-xs text-parchment-white mt-1.5 leading-relaxed">
            Barnaby está despachando tus <strong>${state.activeTableOrder.itemsCount} producto(s)</strong> (<span class="text-clay-terracotta font-bold">${formatCop(state.activeTableOrder.total)}</span>). Llegará a tu mesa en ~4 min sin interrumpir tu partida.
          </p>
        </div>
      ` : ""}

      <!-- Menú de Comida y Bebida del Local -->
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-display text-xl sm:text-2xl text-clay-terracotta font-bold">🍔 Menú de Taberna TopDeck</h3>
        <span class="font-body-sans text-xs text-latte-gray font-semibold">Servicio directo a <strong class="text-fresh-sage">${state.tableCode}</strong></span>
      </div>

      <div class="space-y-2.5 mb-5">
        ${DATA.tavernMenu.map(item => `
          <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-3.5 flex items-center justify-between gap-3 rounded-2xl shadow-sm hover:border-fresh-sage transition-colors">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-12 h-12 bg-dark-roast border-2 border-cocoa-gray rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner">
                ${item.icon}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-body-sans text-sm text-parchment-white font-bold">${item.name}</span>
                  <span class="bg-clay-terracotta/25 text-parchment-white font-body-sans text-[10px] px-2 py-0.5 rounded border border-clay-terracotta/40 font-bold">${item.tag}</span>
                </div>
                <p class="font-body-sans text-xs text-latte-gray leading-snug mt-0.5">${item.desc}</p>
                <div class="font-mono text-xs text-clay-terracotta font-bold mt-1">${formatCop(item.priceCop)}</div>
              </div>
            </div>
            <button onclick="addTavernMenuItem('${item.id}')" class="btn-secondary text-xs px-3.5 py-2 shrink-0 font-bold rounded-xl shadow">
              + PEDIR
            </button>
          </div>
        `).join("")}
      </div>

      <!-- Resumen de Comanda de la Mesa -->
      <div class="tavern-box bg-dark-roast border-2 border-cocoa-gray p-4 rounded-2xl shadow-md">
        <div class="flex items-center justify-between border-b-2 border-cocoa-gray pb-2.5 mb-2.5">
          <span class="font-display text-lg text-parchment-white font-bold">🧾 Comanda Activa (${state.tableCode})</span>
          <span class="font-mono text-base text-clay-terracotta font-bold">${formatCop(totalTableCop)}</span>
        </div>
        ${state.tableCart.length === 0 ? `
          <p class="font-body-sans text-xs text-latte-gray py-2 text-center italic">Aún no has agregado bebidas ni comida a tu mesa.</p>
        ` : `
          <div class="space-y-1.5 mb-3">
            ${state.tableCart.map((c, idx) => `
              <div class="flex items-center justify-between text-xs font-mono bg-mocha-brown px-3 py-2 border-2 border-cocoa-gray rounded-xl">
                <span class="truncate text-parchment-white">${c.icon} ${c.qty}x ${c.name}</span>
                <div class="flex items-center gap-2.5 shrink-0">
                  <strong class="text-clay-terracotta">${formatCop(c.priceCop * c.qty)}</strong>
                  <button onclick="removeTavernMenuItem(${idx})" class="text-clay-terracotta hover:text-brick-terracotta font-bold">✕</button>
                </div>
              </div>
            `).join("")}
          </div>
          <button onclick="submitTableOrder()" class="w-full btn-primary text-parchment-white text-sm py-2.5 font-bold rounded-xl shadow-lg">
            🍺 ENVIAR PEDIDO A COCINA (${formatCop(totalTableCop)})
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
        <button onclick="setCollectorSubtab('pulgas')" class="py-2 text-xs font-bold font-body-sans rounded-xl transition-all ${
          state.collectorSubtab === "pulgas" ? "btn-primary text-parchment-white shadow-md" : "nav-pill text-latte-gray"
        }">
          🔥 MERCADO DE PULGAS (EN TIENDA)
        </button>
        <button onclick="setCollectorSubtab('mazos')" class="py-2 text-xs font-bold font-body-sans rounded-xl transition-all ${
          state.collectorSubtab === "mazos" ? "btn-primary text-parchment-white shadow-md" : "nav-pill text-latte-gray"
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
      <div class="tavern-box p-4 mb-4 rounded-2xl border-2 transition-all ${state.myBinderPublished ? "bg-dark-roast border-botanical-green shadow-[0_0_15px_rgba(74,124,89,0.2)]" : "bg-mocha-brown border-cocoa-gray"}">
        <div class="flex items-center justify-between gap-2">
          <div>
            <div class="font-display text-base sm:text-lg text-parchment-white font-bold flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${state.myBinderPublished ? "bg-fresh-sage animate-ping" : "bg-cocoa-gray"}"></span>
              <span>Mi Carpeta en la Taberna (${state.tableCode})</span>
            </div>
            <p class="font-body-sans text-xs text-latte-gray mt-0.5 leading-relaxed">
              ${state.myBinderPublished
                ? "¡Tu carpeta está PÚBLICA! Los jugadores en TopDeck pueden ver tus cartas y acercarse a tu mesa a comprar o intercambiar."
                : "Tu carpeta está oculta. Actívala para que los demás jugadores del local vean qué vendes o cambias."}
            </p>
          </div>
          <button onclick="toggleMyBinderPublic()" class="px-3.5 py-2 text-xs font-bold shrink-0 font-body-sans rounded-xl ${
            state.myBinderPublished ? "btn-secondary text-fresh-sage" : "nav-pill text-latte-gray"
          }">
            ${state.myBinderPublished ? "🟢 VISIBLE" : "⚪ OCULTA"}
          </button>
        </div>

        <!-- Mis cartas publicadas en mi carpeta -->
        <div class="mt-3 pt-3 border-t-2 border-cocoa-gray">
          <div class="flex items-center justify-between mb-2">
            <span class="font-body-sans text-xs font-bold text-latte-gray uppercase tracking-wider">Mis Cartas Publicadas (${state.myTradeBinder.length}):</span>
            <button onclick="addCardToMyPublicBinderPrompt()" class="btn-primary text-xs text-parchment-white px-3 py-1 font-bold rounded-xl shadow">
              + PUBLICAR CARTA
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            ${state.myTradeBinder.map(c => `
              <div class="bg-dark-roast border-2 border-cocoa-gray p-2 flex items-center gap-2.5 rounded-xl shadow-sm">
                <img src="${c.img}" class="w-9 h-12 object-cover border-2 border-cocoa-gray shrink-0 rounded" alt="${c.name}"/>
                <div class="min-w-0">
                  <div class="font-body-sans text-xs text-parchment-white truncate font-bold">${c.name}</div>
                  <div class="font-mono text-[9px] text-fresh-sage font-bold">${c.mode}</div>
                  <div class="font-mono text-xs text-clay-terracotta font-bold">${formatCop(c.priceCop)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Explorador de Carpetas Abiertas Ahora en TopDeck -->
      <div class="mb-3 flex items-center justify-between">
        <h4 class="font-display text-xl text-clay-terracotta font-bold">🤝 Carpetas Abiertas en Otras Mesas</h4>
        <span class="font-mono text-[10px] bg-clay-terracotta/25 text-parchment-white px-2 py-0.5 border border-clay-terracotta/40 rounded font-bold">P2P EN VIVO</span>
      </div>

      <div class="space-y-3.5">
        ${DATA.fleaMarketBinders.map(binder => `
          <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 rounded-2xl shadow-md">
            <div class="flex items-center justify-between border-b-2 border-cocoa-gray pb-2 mb-2.5">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-display text-lg text-parchment-white font-bold">${binder.player}</span>
                  <span class="bg-dark-roast text-clay-terracotta font-mono text-[11px] font-bold px-2 py-0.5 rounded border-2 border-cocoa-gray">${binder.table}</span>
                </div>
                <div class="font-body-sans text-xs text-fresh-sage font-bold mt-0.5">${binder.status}</div>
              </div>
              <span class="font-mono text-xs text-clay-terracotta font-bold">${binder.reputation}</span>
            </div>

            <div class="grid grid-cols-3 gap-2.5">
              ${binder.cards.map(card => `
                <div class="bg-dark-roast border-2 border-cocoa-gray p-2 flex flex-col justify-between rounded-xl shadow-sm">
                  <div class="aspect-[63/88] bg-black/50 border-2 border-cocoa-gray overflow-hidden relative rounded-lg">
                    <img src="${card.img}" alt="${card.name}" class="w-full h-full object-cover"/>
                    <span class="absolute top-1 left-1 bg-dark-roast/90 text-clay-terracotta font-mono text-[8px] px-1 rounded">${card.mode}</span>
                  </div>
                  <div class="mt-2">
                    <div class="font-body-sans text-xs text-parchment-white truncate font-bold">${card.name}</div>
                    <div class="font-mono text-xs text-clay-terracotta font-bold mt-0.5">${formatCop(card.priceCop)}</div>
                    <button onclick="proposeInStoreTrade('${binder.player}', '${binder.table}', '${card.name}')"
                      class="mt-2 w-full btn-primary text-parchment-white text-[11px] py-1.5 font-bold rounded-xl shadow">
                      🤝 TRATAR
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
      <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 mb-4 rounded-2xl shadow-md">
        <label class="font-body-sans text-xs text-clay-terracotta font-bold block mb-1.5 uppercase tracking-wider">
          🔗 Sincronizar o Exportar Mazo con Moxfield:
        </label>
        <div class="flex gap-2">
          <input id="moxfieldUrlInput" type="text" placeholder="https://moxfield.com/decks/tu-mazo-commander..."
            class="flex-1 bg-dark-roast border-2 border-cocoa-gray px-3 py-2 font-mono text-xs text-parchment-white rounded-xl focus:outline-none focus:border-clay-terracotta"/>
          <button onclick="importMoxfieldDeck()" class="btn-primary text-parchment-white text-xs px-4 py-2 font-bold rounded-xl shadow">
            IMPORTAR
          </button>
        </div>
      </div>

      <!-- Mi Bulk Box -->
      <div class="tavern-box bg-dark-roast border-2 border-cocoa-gray p-4 mb-4 flex items-center justify-between rounded-2xl shadow-md">
        <div>
          <div class="font-display text-base text-parchment-white font-bold">🗃️ Mi Bulk Inventariado en TopDeck</div>
          <div class="font-body-sans text-xs text-latte-gray mt-0.5">
            1,420 cartas comunes/infrecuentes • 185 Raras de Bulk
          </div>
        </div>
        <button onclick="window.showTavernToast('Lista de Bulk exportada en formato CSV / Moxfield.', '📋')"
          class="nav-pill text-parchment-white text-xs px-3.5 py-2 font-bold rounded-xl">
          EXPORTAR BULK
        </button>
      </div>

      <!-- Lista de Mazos -->
      <div class="space-y-3">
        ${state.myDecks.map(d => `
          <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 flex gap-3.5 items-center rounded-2xl shadow-md">
            <img src="${d.featuredImg}" class="w-16 h-22 object-cover border-2 border-cocoa-gray shrink-0 rounded-xl shadow" alt="${d.name}"/>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="font-mono text-[11px] bg-dark-roast text-clay-terracotta px-2 py-0.5 rounded border-2 border-cocoa-gray font-bold">${d.format}</span>
                <span class="font-body-sans text-xs text-fresh-sage font-bold">WR: ${d.winrate}</span>
              </div>
              <h4 class="font-display text-lg text-parchment-white font-bold mt-1 truncate">${d.name}</h4>
              <p class="font-body-sans text-xs text-latte-gray">Comandante: <strong class="text-parchment-white">${d.commander}</strong></p>
              <div class="flex items-center justify-between mt-2.5 pt-2 border-t-2 border-cocoa-gray">
                <span class="font-mono text-sm font-bold text-clay-terracotta">${formatUsd(d.estValueUsd)}</span>
                <button onclick="window.showTavernToast('Decklist de ${d.name} copiada en formato Moxfield.', '🦊')"
                  class="btn-secondary text-fresh-sage text-xs px-3 py-1.5 font-bold rounded-xl">
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
      <div class="grid grid-cols-3 gap-2.5 mb-4">
        <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-3 text-center rounded-2xl shadow-sm">
          <div class="font-body-sans text-[11px] text-latte-gray font-bold uppercase tracking-wider">ELO Taberna</div>
          <div class="font-mono text-xl text-clay-terracotta font-bold mt-0.5">1,790</div>
          <div class="font-body-sans text-[11px] text-fresh-sage font-bold">Mítico #2</div>
        </div>
        <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-3 text-center rounded-2xl shadow-sm">
          <div class="font-body-sans text-[11px] text-latte-gray font-bold uppercase tracking-wider">Winrate Mes</div>
          <div class="font-mono text-xl text-parchment-white font-bold mt-0.5">68.4%</div>
          <div class="font-mono text-[11px] text-latte-gray">26V - 12D</div>
        </div>
        <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-3 text-center rounded-2xl shadow-sm">
          <div class="font-body-sans text-[11px] text-latte-gray font-bold uppercase tracking-wider">Crédito Tienda</div>
          <div class="font-mono text-lg text-fresh-sage font-bold mt-0.5">$185.000</div>
          <div class="font-body-sans text-[10px] text-latte-gray">Premios FNM</div>
        </div>
      </div>

      <!-- Ronda en Vivo & Pairing -->
      <div class="tavern-box bg-mocha-brown border-2 border-brick-terracotta p-4 mb-4 rounded-2xl shadow-md">
        <div class="flex items-center justify-between mb-2.5">
          <span class="font-mono text-xs bg-brick-terracotta text-parchment-white px-2 py-0.5 rounded font-bold">⚔️ RONDA 3 EN VIVO • RELOJ: 34:18</span>
          <span class="font-body-sans text-xs text-fresh-sage font-bold">MESA TORNEO #02</span>
        </div>
        <div class="bg-dark-roast border-2 border-cocoa-gray p-3 rounded-xl flex items-center justify-between">
          <div>
            <div class="font-display text-lg text-parchment-white font-bold">TÚ (SANTIAGO) vs. ANDRÉS MEJÍA</div>
            <div class="font-body-sans text-xs text-latte-gray mt-0.5">Formato: Modern / Commander • Al mejor de 3</div>
          </div>
          ${state.matchResultReported ? `
            <span class="bg-botanical-green text-parchment-white font-mono text-xs px-2.5 py-1 rounded-lg font-bold">REPORTADO (${state.matchResultReported})</span>
          ` : ""}
        </div>
        ${!state.matchResultReported ? `
          <div class="mt-3 flex items-center justify-between gap-2">
            <span class="font-body-sans text-xs text-fresh-sage font-bold">Reportar resultado:</span>
            <button onclick="reportTournamentMatch('2-0')" class="btn-secondary text-xs px-3 py-1.5 font-bold rounded-xl shadow">GANÉ 2-0</button>
            <button onclick="reportTournamentMatch('2-1')" class="btn-primary text-xs px-3 py-1.5 font-bold rounded-xl shadow">GANÉ 2-1</button>
            <button onclick="reportTournamentMatch('1-2')" class="nav-pill text-xs px-3 py-1.5 font-bold rounded-xl">1-2</button>
          </div>
        ` : ""}
      </div>

      <!-- Tabla de Posiciones en Vivo (Standings) -->
      <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 mb-4 rounded-2xl shadow-md">
        <h4 class="font-display text-xl text-clay-terracotta font-bold mb-3">🏆 Standings en Vivo (Top 5 Suizo)</h4>
        <div class="space-y-2">
          ${state.standings.map(s => `
            <div class="flex items-center justify-between text-xs font-mono px-3 py-2.5 border-2 rounded-xl ${
              s.isUser ? "bg-dark-roast border-clay-terracotta font-bold shadow-sm" : "bg-dark-roast border-cocoa-gray"
            }">
              <div class="flex items-center gap-2.5">
                <span class="w-6 text-center bg-dark-roast text-clay-terracotta font-bold py-0.5 rounded border border-cocoa-gray">#${s.rank}</span>
                <span class="font-body-sans font-bold text-sm text-parchment-white">${s.player}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[11px] text-latte-gray">OMW ${s.omw}</span>
                <span class="font-mono text-xs text-fresh-sage font-bold">${s.points} PTS (${s.record})</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Inscripción a Torneos de la Semana -->
      <h4 class="font-display text-2xl text-clay-terracotta font-bold mb-3">📋 Inscripción a Torneos TopDeck</h4>
      <div class="space-y-3">
        ${state.tournaments.map((t, idx) => `
          <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 rounded-2xl shadow-md">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs bg-dark-roast text-clay-terracotta px-2.5 py-0.5 rounded border border-cocoa-gray font-bold">${t.time}</span>
              <span class="font-body-sans text-xs text-fresh-sage font-bold">${t.spotsLeft} CUPOS LIBRES</span>
            </div>
            <h5 class="font-display text-lg text-parchment-white font-bold mt-2">${t.name}</h5>
            <p class="font-body-sans text-xs text-latte-gray mt-0.5">Premios: <strong class="text-parchment-white">${t.prizePool}</strong></p>
            <div class="mt-3 pt-2.5 border-t-2 border-cocoa-gray flex items-center justify-between">
              <span class="font-mono text-base text-clay-terracotta font-bold">${formatCop(t.entryCop)}</span>
              <button onclick="toggleTournamentEnroll(${idx})" class="px-4 py-2 text-xs font-bold rounded-xl shadow ${
                t.enrolled ? "btn-secondary text-fresh-sage" : "btn-primary text-parchment-white"
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
      <div class="flex items-center justify-between gap-2 mb-4">
        <div class="flex gap-2">
          <button onclick="setCasualLifeMode('commander')" class="px-3 py-1.5 text-xs font-bold font-body-sans rounded-xl transition-all ${
            state.casualMode === "commander" ? "btn-primary text-parchment-white shadow-md" : "nav-pill text-latte-gray"
          }">
            4P COMMANDER (40❤️)
          </button>
          <button onclick="setCasualLifeMode('duel')" class="px-3 py-1.5 text-xs font-bold font-body-sans rounded-xl transition-all ${
            state.casualMode === "duel" ? "btn-primary text-parchment-white shadow-md" : "nav-pill text-latte-gray"
          }">
            1v1 DUELO (20❤️)
          </button>
        </div>
        <button onclick="resetCasualLifes()" class="nav-pill text-latte-gray text-xs px-3 py-1.5 font-bold rounded-xl">
          🔄 REINICIAR
        </button>
      </div>

      <!-- Grid del Contador de Vidas -->
      <div class="grid ${state.casualMode === "commander" ? "grid-cols-2" : "grid-cols-1"} gap-3 mb-4">
        ${activePlayers.map((p, idx) => `
          <div class="tavern-box p-4 flex flex-col justify-between relative bg-mocha-brown border-2 border-cocoa-gray rounded-2xl shadow-md">
            <div class="flex items-center justify-between">
              <span class="font-display text-base text-parchment-white font-bold truncate">${p.name}</span>
              <button onclick="setMonarchPlayer(${p.id})" title="Asignar El Monarca"
                class="text-sm px-2 py-0.5 rounded-lg border-2 border-cocoa-gray ${state.monarchPlayer === p.id ? "bg-clay-terracotta text-parchment-white font-bold" : "bg-dark-roast text-latte-gray opacity-70"}">
                👑
              </button>
            </div>

            <!-- Vidas Principales -->
            <div class="my-3 flex items-center justify-between">
              <button onclick="adjustPlayerLife(${idx}, -1)"
                class="w-12 h-12 btn-primary text-parchment-white text-xl flex items-center justify-center font-bold rounded-xl shadow">
                -
              </button>
              <div class="text-center">
                <div class="font-display text-4xl sm:text-5xl text-clay-terracotta font-bold leading-none">${p.life}</div>
                <div class="font-body-sans text-[10px] text-latte-gray font-bold uppercase tracking-wider mt-1">VIDAS</div>
              </div>
              <button onclick="adjustPlayerLife(${idx}, 1)"
                class="w-12 h-12 btn-secondary text-fresh-sage text-xl flex items-center justify-center font-bold rounded-xl shadow">
                +
              </button>
            </div>

            <!-- Botones rápidos +5 / -5 y Contadores de Comandante/Veneno -->
            <div class="flex items-center justify-between text-xs font-mono pt-2.5 border-t-2 border-cocoa-gray gap-1.5">
              <button onclick="adjustPlayerLife(${idx}, -5)" class="px-2 py-1 bg-dark-roast text-latte-gray hover:text-parchment-white border-2 border-cocoa-gray rounded-lg font-bold" title="Restar 5 vidas">-5</button>

              <!-- Stepper Daño Comandante -->
              <div class="flex items-center bg-dark-roast border-2 border-cocoa-gray px-1.5 py-0.5 rounded-lg text-parchment-white" title="Daño de Comandante (21 pierde)">
                <button onclick="adjustCmdDmg(${idx}, -1)" class="w-4 h-5 flex items-center justify-center font-bold text-clay-terracotta active:scale-90">-</button>
                <span class="px-1 text-xs font-bold">⚔️${p.cmdDmg}</span>
                <button onclick="adjustCmdDmg(${idx}, 1)" class="w-4 h-5 flex items-center justify-center font-bold text-fresh-sage active:scale-90">+</button>
              </div>

              <!-- Stepper Veneno -->
              <div class="flex items-center bg-dark-roast border-2 border-cocoa-gray px-1.5 py-0.5 rounded-lg text-parchment-white" title="Contadores de Veneno (10 pierde)">
                <button onclick="adjustPoison(${idx}, -1)" class="w-4 h-5 flex items-center justify-center font-bold text-clay-terracotta active:scale-90">-</button>
                <span class="px-1 text-xs font-bold">☠️${p.poison}</span>
                <button onclick="adjustPoison(${idx}, 1)" class="w-4 h-5 flex items-center justify-center font-bold text-fresh-sage active:scale-90">+</button>
              </div>

              <button onclick="adjustPlayerLife(${idx}, 5)" class="px-2 py-1 bg-dark-roast text-latte-gray hover:text-parchment-white border-2 border-cocoa-gray rounded-lg font-bold" title="Sumar 5 vidas">+5</button>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Herramientas Casuales de Mesa: D20, Moneda, Quién Empieza -->
      <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 mb-4 rounded-2xl shadow-md">
        <div class="flex items-center justify-between mb-2.5">
          <span class="font-display text-base text-parchment-white font-bold">🎲 Utilidades de Mesa de Pip:</span>
          ${state.lastDiceRoll ? `<span class="font-mono text-xs bg-dark-roast text-clay-terracotta px-2 py-0.5 border border-cocoa-gray rounded font-bold">${state.lastDiceRoll}</span>` : ""}
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="rollCasualD20()" class="nav-pill text-parchment-white text-xs py-2.5 font-bold rounded-xl">
            🎲 LANZAR D20
          </button>
          <button onclick="flipCasualCoin()" class="nav-pill text-parchment-white text-xs py-2.5 font-bold rounded-xl">
            🪙 MONEDA
          </button>
          <button onclick="pickRandomStarter()" class="nav-pill text-parchment-white text-xs py-2.5 font-bold rounded-xl">
            🎯 ¿QUIÉN SALE?
          </button>
        </div>
      </div>

      <!-- Atajo directo: Pedir a la Mesa sin salir de la partida -->
      <div class="tavern-box bg-mocha-brown border-2 border-clay-terracotta p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
        <div>
          <div class="font-display text-base text-clay-terracotta font-bold">🍕 ¿Hambre o sed en ${state.tableCode}?</div>
          <p class="font-body-sans text-xs text-latte-gray">Pide bebidas o comida sin pausar tu partida con los amigos.</p>
        </div>
        <button onclick="switchPwaTab('mesa')" class="btn-secondary text-fresh-sage text-xs px-4 py-2 shrink-0 font-bold rounded-xl shadow">
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
      <div class="tavern-box bg-mocha-brown text-parchment-white border-2 border-brick-terracotta p-4 mb-4 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between mb-2.5">
          <div>
            <span class="font-display text-xl text-clay-terracotta font-bold">🔮 El Tarot del Planeswalker</span>
            <p class="font-body-sans text-xs text-latte-gray mt-0.5">Toca cada carta arcana para revelar el destino de tus partidas:</p>
          </div>
          <button onclick="shuffleNewTarotSpread()" class="nav-pill text-parchment-white text-xs px-3 py-1.5 font-bold rounded-xl">
            🔄 BARAJAR
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2.5 my-3.5">
          ${state.tarotSpread.map((card, idx) => `
            <div onclick="revealTarotCard(${idx})" class="cursor-pointer">
              <div class="text-center font-body-sans text-[11px] text-fresh-sage mb-1 truncate font-bold">${card.positionMeaning}</div>
              <div class="aspect-[63/88] rounded-xl border-2 ${card.revealed ? "border-clay-terracotta" : "border-cocoa-gray"} overflow-hidden relative bg-dark-roast shadow-md transition-transform hover:scale-105">
                ${card.revealed ? `
                  <img src="${card.img}" alt="${card.cardName}" class="w-full h-full object-cover"/>
                  <div class="absolute inset-x-0 bottom-0 bg-black/85 p-1 text-center">
                    <span class="font-display text-xs text-parchment-white block font-bold">${card.arcanaTitle}</span>
                  </div>
                ` : `
                  <div class="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-mocha-brown to-dark-roast">
                    <span class="text-3xl mb-1 animate-pulse">🦉</span>
                    <span class="font-body-sans text-[11px] text-clay-terracotta font-bold uppercase tracking-wider">Tocar</span>
                  </div>
                `}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Lectura del Oráculo -->
        <div class="space-y-2.5 mt-3.5">
          ${state.tarotSpread.filter(c => c.revealed).map(c => `
            <div class="bg-dark-roast border-2 border-cocoa-gray p-3.5 rounded-xl shadow-sm">
              <div class="flex items-center justify-between">
                <span class="font-display text-base text-clay-terracotta font-bold">${c.arcanaTitle} — ${c.cardName}</span>
                <span class="font-mono text-xs text-fresh-sage font-bold">Maná: ${c.luckyColor}</span>
              </div>
              <p class="font-body-sans text-xs text-parchment-white mt-1.5 leading-relaxed">${c.reading}</p>
              ${c.rewardText ? `
                <div class="mt-2.5 bg-mocha-brown text-fresh-sage p-2.5 border-2 border-botanical-green font-mono text-xs font-bold rounded-xl">
                  ${c.rewardText}
                </div>
              ` : ""}
            </div>
          `).join("")}

          ${!allRevealed ? `
            <button onclick="revealAllTarotCards()" class="w-full btn-primary text-parchment-white text-xs py-2.5 font-bold rounded-xl shadow-md">
              ✨ REVELAR LAS 3 CARTAS DEL DESTINO
            </button>
          ` : ""}
        </div>
      </div>

      <!-- Simulador de Sobre de la Fortuna (Mystery Pack Opener) -->
      <div class="tavern-box bg-mocha-brown border-2 border-cocoa-gray p-4 rounded-2xl shadow-md">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-display text-xl text-clay-terracotta font-bold">🎁 Sobre Misterioso de la Taberna</h4>
            <p class="font-body-sans text-xs text-latte-gray">Rasga un sobre virtual para probar tu suerte antes de comprar en vitrina.</p>
          </div>
          <button onclick="openLuckyBoosterPack()" class="btn-primary text-parchment-white text-xs px-4 py-2 font-bold shrink-0 rounded-xl shadow">
            ⚡ RASGAR SOBRE
          </button>
        </div>

        ${state.boosterOpened ? `
          <div class="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t-2 border-cocoa-gray">
            ${state.boosterCards.map(bc => `
              <div class="bg-dark-roast border-2 border-cocoa-gray p-2 text-center cursor-pointer rounded-xl shadow-sm hover:border-clay-terracotta transition-all" onclick="triggerCardSlideOut('${bc.id}', null)">
                <img src="${bc.image}" class="w-full aspect-[63/88] object-cover border-2 border-cocoa-gray rounded-lg" alt="${bc.name}"/>
                <div class="font-body-sans text-xs text-parchment-white truncate mt-1 font-bold">${bc.name}</div>
                <div class="font-mono text-xs text-clay-terracotta font-bold mt-0.5">$${bc.priceUsd.toFixed(2)}</div>
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
  // GLOBAL ALIASES (Compatibilidad con index.html)
  // ==========================================================================
  window.addInspectedCardToCart = window.addInspectedCardToBinderCart;
  window.resetAllVaultFilters = window.resetVaultFilters;
  window.flip3DCardInspector = window.flip3DCard;
  window.toggleFoilHoloSheen = window.toggleInspectFoil;

  // ==========================================================================
  // TOPDECK.SHOP HERO SLIDESHOW CONTROLLER (5 BANNERS INTERACTIVOS)
  // ==========================================================================
  let currentHeroSlide = 0;
  const totalHeroSlides = 5;
  let heroSlideInterval = null;

  window.goToHeroSlide = function (index) {
    currentHeroSlide = (index + totalHeroSlides) % totalHeroSlides;
    updateHeroSlideUI();
  };

  window.nextHeroSlide = function () {
    window.goToHeroSlide(currentHeroSlide + 1);
  };

  window.prevHeroSlide = function () {
    window.goToHeroSlide(currentHeroSlide - 1);
  };

  function updateHeroSlideUI() {
    for (let i = 0; i < totalHeroSlides; i++) {
      const slide = document.getElementById(`heroSlide-${i}`);
      const dot = document.getElementById(`heroDot-${i}`);
      if (slide) {
        if (i === currentHeroSlide) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      }
      if (dot) {
        if (i === currentHeroSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      }
    }
  }

  function startHeroSlideTimer() {
    if (heroSlideInterval) clearInterval(heroSlideInterval);
    heroSlideInterval = setInterval(() => {
      window.nextHeroSlide();
    }, 5500);
  }

  window.pauseHeroSlideTimer = function () {
    if (heroSlideInterval) clearInterval(heroSlideInterval);
  };

  window.resumeHeroSlideTimer = function () {
    startHeroSlideTimer();
  };

  // ==========================================================================
  // FEATURED PRODUCT: THE CHRONICLES DECK (TOPDECK.SHOP)
  // ==========================================================================
  let chroniclesQty = 1;

  window.adjustChroniclesQty = function (delta) {
    chroniclesQty = Math.max(1, Math.min(10, chroniclesQty + delta));
    const el = document.getElementById("chroniclesQtyDisplay");
    if (el) el.textContent = chroniclesQty;
  };

  window.buyChroniclesDeck = function () {
    const item = {
      id: "chronicles-deck-" + Date.now(),
      name: "THE CHRONICLES DECK: The Fallen & The Virtuous",
      set: "CH01",
      condition: "NM Sealed",
      priceUsd: 28.50,
      priceCop: 120000,
      finalPriceCop: 120000 * chroniclesQty,
      finalPriceUsd: 28.50 * chroniclesQty,
      image: "https://www.topdeck.shop/cdn/shop/files/CH01-Tuck-01-EN_8f9ff6e9-b915-4b75-bdd7-955224807536.webp?v=1760571011&width=800",
      selectedCondition: "Sealed",
      selectedFoil: true,
      isFoil: true,
      qty: chroniclesQty
    };
    state.cart.push(item);
    updateCartBadges();
    window.showTavernToast(`¡${chroniclesQty}x The Chronicles Deck agregado a tu orden de la taberna!`, "📦");
    window.openPersonalBinderCart();
  };

  // ==========================================================================
  // NEWSLETTER SUBSCRIPTION HANDLER
  // ==========================================================================
  window.subscribeNewsletter = function (e) {
    if (e) e.preventDefault();
    const input = document.getElementById("newsletterEmailInput");
    const email = input ? input.value.trim() : "";
    if (!email || !email.includes("@")) {
      window.showTavernToast("Por favor ingresa un correo electrónico válido.", "⚠️");
      return;
    }
    if (input) input.value = "";
    window.showTavernToast(`¡Bienvenido al gremio! Se enviaron las alertas a ${email}`, "📬");
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
    startHeroSlideTimer();

    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.close3DCardInspector();
        window.closePersonalBinderCart();
      }
    });
  });
})();
