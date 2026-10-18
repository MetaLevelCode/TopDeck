# 🃏 Top Deck TCG — Vault & Tavern (Interactive Sales Demo)

> **Demo Comercial por MetaLevel:** Plataforma dual (Tienda Web Inmersiva 3D + PWA Móvil Presencial) para **Top Deck**, enfocada en **Magic: The Gathering (MTG)**.

---

## 🌟 Arquitectura de la Experiencia Dual

### 1. 💻 Plataforma Web (Usuarios Virtuales / Desde Casa)
Diseñada para transmitir la calidez y magia del local físico de TopDeck en una experiencia e-commerce inmersiva única en Colombia:
- **Landing & Identidad de Taberna:** Presentación cálida del santuario de juego.
- **🦊 Dexter (El Zorro Mago Archivista):** Recibe al comprador con diálogos estilo RPG y lo guía en su búsqueda.
- **Búsqueda en Vivo con Scryfall API:** Busca entre más de 27,000 cartas de Magic por **nombre propio**, **color de maná (WUBRGC)**, **tipo de carta** y **7 botones de sinergia y rol** (*Ramp & Maná Rápido*, *Robo de Cartas*, *Cementerio & Reanimar*, *Removal & Control*, *Tokens & Tesoros*, *Comandantes Top Tier*).
- **Carpeta de Cuero & Animación "Slide-Out":** Las cartas aparecen dentro de las fundas plásticas de un álbum de 9 bolsillos; al seleccionar una carta, **se desliza hacia afuera de la funda** y pasa al escenario de inspección.
- **Inspección Física 3D ("Como si la tocaras"):** Rotación 360° e inclinación táctil en tiempo real, brillo **Foil Holográfico dinámico** que reacciona a la luz, reverso oficial de MTG y selector de condición (`NM`, `EX`, `LP`).
- **Carrito "Mi Carpeta Propia" & Ritual de Empaque Animado:**
  - Las cartas que llevas se acomodan dentro de tu propia carpeta personal.
  - Al pagar en la pasarela, se ejecuta la secuencia animada en 3 pasos:
    1. **Sleeving:** Las cartas se deslizan dentro de fundas protectoras doradas *Dragon Shield*.
    2. **Deckbox:** Se guardan y sellan en una caja rígida de bóveda *TopDeck*.
    3. **Despacho:** El camión repartidor pixel-art de *TopDeck Express* arranca rumbo a casa con número de guía.

---

### 2. 📱 Plataforma PWA (Usuarios Físicos en el Local TopDeck)
Diseñada con estética unificada de taberna y **5 secciones diferenciadas por su propia mascota**:

| # | Sección | Mascota | Funcionalidades Clave |
| :- | :--- | :--- | :--- |
| **1** | **Mesa & Comida** | 🍺 **Barnaby** *(El Tejón Tabernero)* | Ingreso de código de mesa / QR y pedido de bebidas, cafés y comida del local directo a la partida. |
| **2** | **Coleccionista & Pulgas** | 🦊 **Dexter** *(El Zorro Archivista)* | Importación/exportación de mazos con **Moxfield**, control de **Bulk**, y el **Mercado de Pulgas P2P** para habilitar tu carpeta en vivo en la tienda y vender o intercambiar con otras mesas. |
| **3** | **Competitivo** | 🦁 **Vulkan** *(El Grifo Juez)* | Inscripción a torneos (FNM, Qualifier, Draft), pairings de ronda en vivo, reporte de resultados y ranking ELO. |
| **4** | **Casual** | 👺 **Pip** *(El Duendecillo de Mesa)* | Contador de vidas para Commander (4 jugadores) y 1v1, daño de comandante, veneno, Monarca, dado D20, moneda y pedido rápido a mesa. |
| **5** | **La Suerte** | 🦉 **Madame Vespera** *(La Lechuza Vidente)* | **El Tarot del Planeswalker** (tirada mística de 3 cartas MTG para leer la fortuna de tus partidas hoy con premios en barra) + Simulador de apertura de sobres. |

---

## 📂 Estructura del Proyecto

```
topdeck/
├── index.html                          # Aplicación principal (Web 3D + PWA 5 Secciones)
├── manifest.json                       # Manifiesto oficial para instalación PWA
├── css/
│   └── demo.css                        # Estilos 16-bit, carpeta cuero, visor 3D y animaciones
├── js/
│   ├── data.js                         # Mascotas, catálogo MTG, menú, mercado de pulgas y tarot
│   └── app.js                          # Motor Scryfall API, física 3D, checkout y controlador PWA
├── top_deck_archival_collector/        # Sistema de diseño y tokens base (DESIGN.md)
├── top_deck_landing_page_.../          # Prototipo estático base 01 (Landing)
├── top_deck_edici_n_retro_.../         # Prototipo estático base 02 (Bóveda)
└── top_deck_perfil_de_jugador_.../     # Prototipo estático base 03 (Perfil)
```

## 🚀 Cómo Ejecutar

Abre [`index.html`](./index.html) directamente en cualquier navegador o sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
```
