# ⟳ LumaSpinner

> **A framework-independent, platform-independent, responsive loading and progress library for the web.**

[![npm version](https://img.shields.io/npm/v/lumaspinner)](https://npmjs.com/package/lumaspinner)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://npmjs.com/package/lumaspinner)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`lumaspinner` is a lightweight, zero-dependency loading UI library engineered to handle every asynchronous and loading state across modern web platforms. LumaSpinner provides **30+ animated spinners, progress gauges, 3D perspective loaders, interactive mini-games, and responsive skeletons with shimmer effects** — all controlled through an isolated, ID-driven architecture with zero required CSS imports.

---

## 🌟 Key Differentiators

- 🚀 **Zero Runtime Dependencies** — Pure DOM APIs and hardware-accelerated CSS animations.
- ⚡ **Featherweight & Fast** — Only **15.5 KB gzipped** for the full suite, or **< 1 KB** with tree-shaking.
- 🧩 **100% Framework Agnostic** — Native support for React, Angular, Vue, Svelte, Solid, or Vanilla JS.
- 🔑 **Unique Identity Registry** — Every spinner is identified by a unique ID (`one ID = one active instance`). No accidental state clashes.
- 🛡️ **Three Boundary Scopes**:
  - `page` — Viewport-level backdrop overlay and interaction blocking.
  - `container` — Elements are bounded strictly inside their parent container (never leaks out).
  - `inline` — No overlay; integrates seamlessly inside buttons, inputs, and badges.
- 🎨 **Fully Configurable Loaders** — Every loader supports custom colors, sizes, speeds, themes, text, delays, overlays, and live updates.
- 💀 **First-Class Skeletons** — 8 responsive skeleton layouts with smooth shimmer animations to prevent layout shifts.
- 🎮 **Playful Mini-Games** — Interactive bubble pops, fidget spinners, and pong mini-games to turn long wait times into delightful user experiences.
- ♿ **Accessible by Default** — Automatic `role="status"`, `aria-live="polite"`, `aria-busy="true/false"`, and `@media (prefers-reduced-motion: reduce)`.
- 🔒 **Strict CSP Compliant** — Automatic nonce discovery and CSSOM Constructable Stylesheets.
- 🔄 **Promise Helpers** — Built-in `spinner.wrap(...)` handles start/stop lifecycles automatically.

---

## 📦 Installation

Install with your package manager of choice:

```bash
# npm
npm install lumaspinner

# pnpm
pnpm add lumaspinner

# yarn
yarn add lumaspinner
```

---

## ⚡ Bundle Size & Performance

LumaSpinner uses **on-demand dynamic CSS injection** and **modular subpath exports**:

| Distribution Target | Raw Size | Gzipped | Brotli | Description |
|---|---|---|---|---|
| `lumaspinner` (ESM) | **100 KB** | **15.5 KB** | **13.1 KB** | Full suite (all 30+ loaders, skeletons, progress gauges, games, manager) |
| `lumaspinner/loaders` | **0.82 KB** | **0.37 KB** | **0.33 KB** | Tree-shakeable loader definitions (drops unused loaders down to ~1 KB) |
| In-DOM Core Styles | **1.4 KB** | — | — | Base layout styles injected once into DOM at runtime |
| Active Loader Style | **~0.3 KB** | — | — | Injected on-demand **only** for the loader currently in use |

> **No CSS Import Needed**: LumaSpinner automatically injects styles into the document on demand with strict CSP support.

---

## ⚡ Quick Start

```ts
import { spinner } from 'lumaspinner';

// 1. Start a spinner (zero CSS import needed!)
const id = spinner.start({
  type: 'ring',
  text: 'Loading data...',
  color: '#6366f1',
  size: 'medium',
});

// 2. Stop it when complete
spinner.stop(id);
```

### 🌲 Tree-Shaking Usage (`lumaspinner/loaders`)

For minimum bundle size in modern bundlers (Vite, Webpack, Rollup), you can import specific loaders directly:

```ts
import { spinner, registerLoader } from 'lumaspinner';
import { ringLoader, dotsLoader } from 'lumaspinner/loaders';

// Register only the loaders your app needs
registerLoader('ring', ringLoader);
registerLoader('dots', dotsLoader);

spinner.start({ type: 'ring' });
```

---

## 🎛️ Are All Loaders Configurable?

**Yes! Every loader in LumaSpinner is 100% configurable.** 

You can configure options globally across your whole app, per-instance when starting a spinner, or dynamically on an active spinner in real-time.

### Full Options Matrix:

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `LoaderType` | `'ring'` | Any of the 30+ built-in loader types |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` (36px) | Preset or exact pixel size (e.g. `size: 48`) |
| `color` | `string` | `'currentColor'` | Any CSS color (`#6366f1`, `rgb(...)`, `hsl(...)`, or CSS var) |
| `speed` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Animation rotation/pulse speed multiplier |
| `scope` | `'page' \| 'container' \| 'inline'` | `'page'` | Positioning boundary and backdrop scope |
| `container` | `string \| HTMLElement` | `document.body` | Target selector or DOM node (e.g. `'#my-card'`) |
| `text` | `string` | `''` | Text displayed alongside the loader |
| `textColor` | `string` | `color` | Custom color for the text label |
| `textPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position of the text relative to the loader |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Color mode (respects system dark mode) |
| `position` | `'center' \| 'top' \| 'right' \| 'bottom' \| 'left'` | `'center'` | Alignment within the container |
| `overlay` | `boolean \| string \| OverlayOptions` | `false` | Enable backdrop blur/overlay or pass custom color string |
| `overlayColor` | `string` | `'rgba(255,255,255,0.9)'` | Custom backdrop overlay color |
| `preventInteraction`| `boolean` | `false` | Block clicks on the underlying page/container |
| `delay` | `number` | `0` | Delay in ms before mounting (prevents quick flash) |
| `duration` | `number` | `0` | Auto-dismiss duration in ms (`0` = manual stop) |
| `minDuration` | `number` | `0` | Minimum display duration in ms to avoid flicker |
| `skeleton` | `SkeletonOptions` | `{}` | Variant, rows, lines, shimmer, avatar settings |
| `progress` | `number` | `0` | Progress percentage (`0`–`100`) for gauges |
| `showProgressText` | `boolean` | `true` | Display tabular numeric percentage |
| `zIndex` | `number` | `9999` (page) / `10` (container) | Custom CSS z-index stacking layer |
| `nonce` | `string` | Auto-detected | CSP nonce string for strict enterprise security |
| `injectStyles` | `boolean` | `true` | Set to `false` if using manual CSS import |

---

## 🚀 Examples

### 1. Minimal One-Liner
```ts
const id = spinner.start();
spinner.stop(id);
```

### 2. Full-Page Loading with Overlay
```ts
spinner.start({
  id: 'app-init',
  scope: 'page',
  type: 'ring',
  text: 'Loading workspace...',
  color: '#6366f1',
  overlay: true,
  preventInteraction: true,
});

// Later
spinner.stop('app-init');
```

### 3. Container-Scoped Skeleton (e.g. Dashboard Panel)
```ts
spinner.start({
  id: 'users-list',
  scope: 'container',
  container: '#users-panel',
  type: 'skeleton',
  skeleton: {
    variant: 'list',
    rows: 5,
    avatar: true,
    shimmer: true,
  },
});

spinner.stop('users-list');
```

### 4. Inline Button Spinner
```ts
spinner.start({
  id: 'save-btn-loader',
  scope: 'inline',
  container: document.querySelector('#save-btn')!,
  type: 'dots',
  size: 'small',
  color: '#ffffff',
});
```

### 5. Dynamic Determinate Progress Bar & Ring
```ts
const id = spinner.start({
  type: 'progress-bar',
  text: 'Uploading files...',
  showProgressText: true,
});

// Dynamically update progress (0-100)
spinner.setProgress(id, 35);
spinner.setProgress(id, 75);
spinner.setProgress(id, 100);

// Transition into success
spinner.success(id, 'Upload complete!');
```

### 6. Dynamic Live Updates
Modify any property of an active spinner without destroying the DOM:
```ts
const id = spinner.start({ text: 'Starting step 1...' });

// Update text dynamically
spinner.setText(id, 'Step 2: Processing data...');

// Update color and speed on the fly
spinner.update(id, { color: '#10b981', speed: 'fast' });

// Mark as complete
spinner.success(id, 'All tasks done!');
```

### 7. Automatic Promise Lifecycle (`wrap`)
```ts
const data = await spinner.wrap(
  'fetch-data',
  async () => {
    const res = await fetch('/api/data');
    return res.json();
  },
  {
    type: 'wave',
    text: 'Syncing with cloud...',
    color: '#06b6d4',
  }
);
```

### 8. Interactive Mini-Game Loaders
Keep users delighted during long waiting times (exports, AI pipelines, builds):
```ts
// Tri-blade fidget spinner with inertia physics & RPM gauge
spinner.start({
  type: 'fidget-spinner',
  text: 'Rendering 4K video... Spin while waiting!',
  color: '#8b5cf6',
});

// Retro arcade Pong mini-game
spinner.start({
  type: 'pong',
  text: 'Compiling shaders... Play pong!',
});

// Cosmic clicker with combo shockwaves
spinner.start({
  type: 'tap-burst',
  text: 'Provisioning cluster nodes...',
});

// Floating bubble popper
spinner.start({
  type: 'interactive', // or 'bubble-pop'
  text: 'Downloading assets... Pop bubbles!',
});
```

---

## 🧩 Framework Integrations

LumaSpinner is 100% framework-agnostic and works natively across all modern web frameworks with standard DOM refs and zero required CSS imports:

### 1. Svelte (Svelte 4 & Svelte 5)

```svelte
<script>
  import { onMount } from 'svelte';
  import { spinner } from 'lumaspinner';

  let containerRef;

  // Option A: Automatic promise binding (auto-stops when finished)
  onMount(async () => {
    await spinner.wrap(fetchDashboardData, {
      container: containerRef,
      type: 'skeleton',
      skeleton: { variant: 'card', shimmer: true }
    });
  });

  // Option B: Svelte 5 runes ($effect)
  let { loading = false } = $props();
  $effect(() => {
    if (loading && containerRef) {
      const id = spinner.start({
        container: containerRef,
        type: 'dots',
        text: 'Loading updates...'
      });
      return () => spinner.stop(id);
    }
  });
</script>

<div bind:this={containerRef} class="card">
  <!-- Content mounts here -->
</div>
```

### 2. React / Next.js (App & Pages Router)

```tsx
import { useEffect, useRef } from 'react';
import { spinner } from 'lumaspinner';

export function UserList({ isLoading }: { isLoading: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading && panelRef.current) {
      const id = spinner.start({
        container: panelRef.current,
        type: 'skeleton',
        skeleton: { variant: 'list', rows: 4, avatar: true }
      });
      return () => spinner.stop(id);
    }
  }, [isLoading]);

  return <div ref={panelRef} className="user-panel" />;
}
```

### 3. Vue 3 / Nuxt (Composition API)

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { spinner } from 'lumaspinner';

const container = ref(null);

onMounted(async () => {
  // Promise wrap: 0 manual cleanup needed
  await spinner.wrap(fetchOrders, {
    container: container.value,
    type: 'bars',
    text: 'Loading orders...'
  });
});
</script>

<template>
  <div ref="container" class="orders-container"></div>
</template>
```

### 4. Angular (Standalone Components & Signals)

```ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { spinner } from 'lumaspinner';

@Component({
  selector: 'app-orders',
  standalone: true,
  template: `<div #card class="card-panel"></div>`
})
export class OrdersComponent implements OnInit {
  @ViewChild('card', { static: true }) card!: ElementRef<HTMLDivElement>;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    // ✨ ZERO ngOnDestroy needed! Automatically cleans up on completion:
    await spinner.wrap(async () => {
      return await firstValueFrom(this.http.get('/api/orders'));
    }, {
      container: this.card.nativeElement,
      type: 'ring',
      text: 'Loading orders...'
    });
  }
}
```

### 5. SolidJS

```tsx
import { onMount } from 'solid-js';
import { spinner } from 'lumaspinner';

export function AnalyticsCard() {
  let panelRef: HTMLDivElement | undefined;

  onMount(async () => {
    await spinner.wrap(fetchAnalytics, {
      container: panelRef,
      type: 'wave',
      text: 'Crunching analytics...'
    });
  });

  return <div ref={panelRef} class="analytics-card" />;
}
```

---

## 🛠️ Built-in Loaders (30+ Styles)

| Type | Name | Best For |
|---|---|---|
| `ring` | Classic Circular Spinner | Buttons, page loading, general HTTP requests |
| `counter-ring` | Counter-Rotating Dual Ring ⚡ | Dual concentric rings (high-tech dashboards) |
| `circle` | 12-Dot Circular Bounce Wave | Workspace loads, analytics panels |
| `circular` | Material Circular Arc Dash | Material UI applications, smooth expanding arcs |
| `dots` | Sequential Bouncing Dots | Chatbots, conversational UI, inline buttons |
| `pulse` | Breathing Scale Shape | Status indicators, live heartbeats, health checks |
| `bars` | Audio Equalizer Bars | File ingestion, batch processing, telemetry |
| `wave` | Sine Wave Dots | Media uploads, consumer loading |
| `orbit` | Planetary Satellite | Cloud syncing, cryptographic processing |
| `square` | Geometric Cube | Code compilation, build tools |
| `dual-ring` | Dual Opposing Ring | SaaS authentication, API handshakes |
| `ripple` | Concentric Water Ripple | Radar scans, Bluetooth pairing, device discovery |
| `cube-grid` | 3x3 Wave Cube Grid | Package building, 3D assets |
| `roller` | 8 Trailing Orbital Dots | Payment processing, transaction verification |
| `fading-circle` | 12-Segment Radial Clock | Native-like web apps, OS settings |
| `chasing-dots` | Dual Orbital Spheres | Mobile web applications, notification syncing |
| `hourglass` | Rotating Sand Hourglass | Queue positions, ticket bookings, waiting rooms |
| `heart` | Pulsing Cardiac Heartbeat | Vital telemetry, patient portals |
| `infinity` | Figure-8 Continuous Loop | Blockchain streaming, websockets, infinite data |
| `dna` | Double-Helix Strand | Genomic sequencing, ML model pipelines |
| `wandering-cubes` | Corner-Orbiting Cubes | Shard rebalancing, data migration |
| `folding-cube` | 3D Perspective Origami Cube | WebGL scenes, Three.js 3D assets |
| `atom` | 3 Orbital Electron Rings | AI models, LLM inferences, React apps |
| `pacman` | Classic Arcade Chomping Dots | Gamified flows, playful screens |
| `clock` | Analogue Hour & Minute Hands | Appointment bookings, queue timers |
| `rotating-plane` | 3D Perspective Card Flip | 3D graphics rendering, card-flipping UI |
| `newton-cradle` | Kinetic Momentum Pendulum | Cluster node sync, data pipelines |
| `hash` | Interlocking Hashtag # Grid | Social media analysis, cryptographic hashing |
| `progress-bar` | Linear Progress Bar (Gradient Sheen) 📊 | File uploads, downloads, installations |
| `progress-ring` | Circular Progress Gauge (Radial Bloom) ⏱️ | Cloud backup, health gauges, battery levels |
| `progress-steps` | Segmented Pill Step Progress 🪜 | Multi-stage wizards, verification pipelines |
| `interactive` | Bubble-Pop Mini-Game 🫧 | Long exports, AI workflows, uploads |
| `fidget-spinner` | Interactive Fidget Spinner 🌀 | Long downloads, stress-relief screens |
| `pong` | Interactive Mini-Pong Arcade 🏓 | Code compilers, build tasks |
| `tap-burst` | Interactive Cosmic Tap Core 💥 | Cloud provisioning, ML model inference |
| `3d-cube` | 3D Isometric Wireframe Cube 🧊 | 3D CAD, WebGL, geometry loading |
| `3d-sphere` | 3D Orbital Sphere Gyroscope 🌐 | Aerospace, coordinate calculation |
| `3d-helix` | 3D Double-Helix DNA Strand 🧬 | Biotech, scientific computing |
| `3d-pyramid` | 3D Tumbling Prism Pyramid 🔺 | Mesh generation, geometric solvers |
| `3d-torus` | 3D Wireframe Torus Donut 🍩 | Cybernetics, particle accelerators |
| `skeleton` | Layout-Preserving Skeleton | Tables, feeds, cards, profile screens |

---

## 💀 Skeleton Variants

| Variant | Elements Generated |
|---|---|
| `card` | Header image / banner + multiple body text lines |
| `list` | Row items with optional avatars and multi-line descriptions |
| `profile` | Large avatar circle + user name & bio lines |
| `table` | Column headers + alternating row cells |
| `avatar` | Standalone avatar placeholder |
| `line` | Text lines of variable widths |
| `circle` | Generic circular shape |
| `rectangle` | Generic block shape |

---

## 🔒 Content Security Policy (CSP)

LumaSpinner is built to run smoothly in banking and enterprise environments with strict `style-src 'self'`:

- **CSSOM Constructable Stylesheets**: Uses `document.adoptedStyleSheets` where supported. Because no inline `<style>` strings are injected into the HTML, browsers do not flag CSP violations.
- **Auto Nonce**: Automatically detects `<meta name="csp-nonce">`, `<script nonce="...">`, or `window.__CSP_NONCE__`.
- **Global Nonce**: Or supply your nonce once at startup:
  ```ts
  spinner.configure({ nonce: 'server-generated-nonce' });
  ```
- **Manual CSS Opt-Out**: If your build pipeline uses precompiled stylesheets:
  ```ts
  import { spinner } from 'lumaspinner';
  import 'lumaspinner/styles.css';

  spinner.configure({ injectStyles: false });
  ```

---

## 📖 Global Configuration

Set application-wide defaults once at startup:

```ts
import { spinner } from 'lumaspinner';

spinner.configure({
  type: 'ring',
  size: 'medium',
  speed: 'normal',
  color: '#6366f1',
  theme: 'auto',
  overlay: true,
  preventInteraction: false,
  delay: 150,        // Avoids spinner flash on quick network responses
  minDuration: 300,  // Prevents abrupt UI changes
});
```

---

## ♿ Accessibility

LumaSpinner treats accessibility as a first-class requirement:

1. **Role & Live Region**: Mounts with `role="status"` and `aria-live="polite"`.
2. **`aria-busy`**: Sets `aria-busy="true"` on the target container or `document.body` during loading, and restores `aria-busy="false"` on teardown.
3. **Screen Readers**: Includes visually-hidden screen-reader text (`.luma-sr-only`).
4. **Reduced Motion**: Fully respects `@media (prefers-reduced-motion: reduce)` by pausing spinning animations.

---

## 📄 License

MIT © Krishna Kumar
