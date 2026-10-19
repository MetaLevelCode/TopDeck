# Skill: UI Taberna de Fantasía (Anime/RPG)

## Descripción
Esta skill configura el motor de diseño (como Antigravity) para generar interfaces modernas con una dirección de arte enfocada en la estética de una taberna de fantasía. Combina estructuras de UI convencionales (ej. apps de delivery, dashboards) con una atmósfera cálida, orgánica y toques sutiles de RPG y anime, sin sacrificar la usabilidad.

## Sistema de Diseño (Design System)

### 1. Paleta de Colores
- **Fondo Principal (Base):** Tonos café oscuro, evocando madera y tuestes intensos (`#2C1E16`, `#3E2723`). Reemplaza los fondos oscuros genéricos para dar una sensación de interior acogedor.
- **Acentos Primarios (Terracota):** Tonos arcilla y ladrillo (`#C55A3F`, `#A2412A`). Usado para botones de acción secundaria, bordes activos o contenedores destacados.
- **Acentos Secundarios (Verde Botánica):** Tonos de hierbas aromáticas o ingredientes frescos (`#4A7C59`, `#689F77`). Ideal para los "Call to Action" (CTAs) principales, indicadores de éxito y elementos interactivos clave.
- **Texto:** Blanco pergamino o crema apagado (`#F1E8D9`) para asegurar contraste sin fatigar la vista.

### 2. Tipografía
- **Titulares (Headings):** Fuentes sans-serif con bordes redondeados o serifas cálidas que evoquen los menús de videojuegos RPG o novelas visuales (ej. *Nunito*, *Quicksand*, o *Merriweather*).
- **Cuerpo de Texto (Body):** Limpia, legible y moderna (ej. *Inter* o *Roboto*), manteniendo un interletrado amplio.

### 3. Componentes y Geometría
- **Bordes:** Esquinas redondeadas (`border-radius: 12px` a `16px`) para suavizar la interfaz, acercándose al estilo amigable del anime y alejándose del minimalismo corporativo frío.
- **Sombras e Iluminación:** Sombras cálidas y difusas (tonos ámbar o café oscuro) para emular la luz de faroles sobre los elementos elevados (cards, modales).
- **Texturas (Opcional):** Ruido muy sutil (grain) en los fondos para dar un toque táctil. Cero uso de gradientes metálicos, vidrio (glassmorphism) o neón.

### 4. Directrices de Estructura (Esqueleto)
- Mantener la jerarquía visual de aplicaciones modernas (barras de navegación inferiores, tarjetas de ítems, carruseles).
- **Regla de Oro:** La temática se aplica exclusivamente en la capa de estilos (colores, formas, sombras). El esqueleto, el layout y el flujo de usuario deben ser tan rigurosos y estandarizados como en cualquier producto de alto rendimiento.

## Instrucciones para el Generador (LLM/IDE)
Al aplicar esta skill, el motor de diseño DEBE:
1. Reemplazar cualquier paleta predeterminada (blanco/negro/azul) por el esquema Café/Terracota/Verde.
2. Inyectar estilos que generen calidez visual.
3. Respetar estrictamente el wireframe o captura de referencia para la disposición de elementos.
4. Definir y utilizar variables semánticas (ej. `bg-tavern-base`, `text-parchment-light`, `btn-herb-green`).
