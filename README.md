# 🃏 Top Deck TCG — Vault & Tavern

> Plataforma de coleccionismo competitivo para juegos de cartas coleccionables (MTG, Pokémon TCG, One Piece CG, Yu-Gi-Oh!).

## 📖 Descripción

**Top Deck** es una experiencia web inmersiva que combina una estética retro 16-bit de taberna medieval con la precisión de un catálogo profesional de cartas TCG. Permite explorar catálogos completos en álbumes interactivos con inspección 3D, gestionar mazos de torneo y mantener un perfil competitivo con estadísticas ELO.

## 🗂️ Estructura del Proyecto

```
stitch_binder_tavern_tcg/
├── index.html                          # Hub de navegación entre prototipos
├── top_deck_archival_collector/
│   └── DESIGN.md                       # Sistema de diseño y tokens (colores, tipografía, spacing)
├── top_deck_landing_page_.../
│   ├── code.html                       # Landing Page con pestañas de carpetas TCG
│   └── screen.png                      # Captura de referencia
├── top_deck_edici_n_retro_.../
│   ├── code.html                       # Bóveda de cartas con visor 3D
│   └── screen.png                      # Captura de referencia
└── top_deck_perfil_de_jugador_.../
    ├── code.html                       # Perfil de jugador y mazos de torneo
    └── screen.png                      # Captura de referencia
```

## 🚀 Cómo Visualizar

Abre `index.html` en tu navegador para acceder al hub de navegación que conecta los tres prototipos.

## 🎨 Stack Actual (Prototipos)

- **HTML5** — Páginas estáticas monolíticas
- **Tailwind CSS v3** (CDN) — Utilidades de estilos
- **JavaScript Vanilla** — Interactividad (pestañas, visor 3D, filtros)
- **Google Fonts** — Press Start 2P, EB Garamond, Manrope, Space Mono

## 🔮 Roadmap

- [ ] Migración a **Vite + React** con Tailwind compilado
- [ ] Componentización de UI (NavBar, CardSlot, FolderTabs, Footer)
- [ ] Integración con **Scryfall API** y servicios de datos de cartas
- [ ] Sistema de autenticación y perfiles de jugador
- [ ] Deckbuilder interactivo con validación de formatos

## 👥 Equipo

- **Frontend** — [Tu nombre]
- **Backend & Datos** — [Compañero]

## 📄 Licencia

Todos los derechos reservados © 2026 MetaLevel Code.  
Magic: The Gathering es marca registrada de Wizards of the Coast LLC.  
Pokémon es marca registrada de Nintendo/Creatures Inc./GAME FREAK inc.
