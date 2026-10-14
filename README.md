# ⟳ LumaSpinner

> **A framework-independent, platform-independent, responsive loading and progress library for the web.**

[![npm version](https://img.shields.io/npm/v/lumaspinner)](https://npmjs.com/package/lumaspinner)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://npmjs.com/package/lumaspinner)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`lumaspinner` is a lightweight, zero-dependency loading UI library engineered to handle every asynchronous and loading state across modern web platforms. Unlike traditional spinner libraries that only render a single spinning circle, LumaSpinner provides **spinners, animated loaders, wave effects, orbital rings, and responsive skeleton placeholders with shimmer effects** — all controlled through an isolated, ID-driven architecture.

---

## 🌟 Key Differentiators

- 🚀 **Zero Runtime Dependencies** — Pure DOM APIs and hardware-accelerated CSS animations.
- 🧩 **100% Framework Agnostic** — Native support for React, Angular, Vue, Svelte, Solid, or Vanilla JS.
- 🔑 **Unique Identity Registry** — Every spinner is identified by a unique ID (`one ID = one active instance`). No accidental state clashes.
- 🛡️ **Three Boundary Scopes**:
  - `page` — Viewport-level backdrop overlay and interaction blocking.
  - `container` — Elements are bounded strictly inside their parent container (never leaks out).
  - `inline` — No overlay; integrates seamlessly inside buttons, inputs, and badges.
- 💀 **First-Class Skeletons** — 8 responsive skeleton layouts with smooth shimmer animations to prevent layout shifts.
- 🎨 **8 Built-in Loaders** — Ring, Dots, Pulse, Bars, Wave, Orbit, Square, Skeleton.
- ♿ **Accessible by Default** — Automatic `role="status"`, `aria-live="polite"`, `aria-busy="true/false"`, and `@media (prefers-reduced-motion: reduce)`.
- 🔄 **Promise Helpers** — Built-in `spinner.wrap(...)` handles start/stop lifecycles automatically.

---

## 📦 Installation

```bash
npm install lumaspinner
```

### ⚡ Zero-Config Quick Start (No CSS Import Needed!)

Styles are **automatically injected into the DOM with zero setup**. You do **not** need to manually import any CSS file!

```ts
import { spinner } from 'lumaspinner';

// 1. Start a spinner — styles auto-inject instantly with strict CSP compliance
const id = spinner.start({
  type: 'ring',
  text: 'Loading...',
});

// 2. Stop it when your work is finished
spinner.stop(id);
```

### 🔒 Strict Content Security Policy (CSP) Support

LumaSpinner is engineered to work out of the box in enterprise and banking environments with strict CSP (`style-src 'self'`):

- **Modern Browsers (CSSOM `adoptedStyleSheets`)**: Uses constructable stylesheets in memory. Because no inline HTML `<style>` string is parsed, browsers **do not block them under `style-src` CSP rules**.
- **Automatic Nonce Detection**: Falls back to an auto-detected `nonce` from `<meta name="csp-nonce">`, `<script nonce="...">`, or `window.__CSP_NONCE__`.
- **Explicit Nonce**: Or provide your server nonce once: `spinner.configure({ nonce: 'your-secret-nonce' })`.
- **Manual CSS Opt-Out**: If your build pipeline prefers static stylesheets:
  ```ts
  import { spinner } from 'lumaspinner';
  import 'lumaspinner/styles.css'; // Optional manual import

  spinner.configure({ injectStyles: false });
  ```

---

## 🚀 Examples

### 1. Minimal One-Liner

```ts
const id = spinner.start();
spinner.stop(id);
```

### 2. Full-Page Loading

```ts
spinner.start({
  id: 'app-init',
  scope: 'page',
  type: 'ring',
  text: 'Loading workspace...',
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

// When fetch completes
spinner.stop('users-list');
```

### 4. Inline Button Spinner

```ts
spinner.start({
  id: 'save-btn-loader',
  scope: 'inline',
  container: document.querySelector('#save-btn-icon')!,
  type: 'dots',
  size: 'small',
});
```

### 5. Automatic Promise Lifecycle (`wrap`)

```ts
const users = await spinner.wrap(
  'fetch-users',
  async () => {
    const res = await fetch('/api/users');
    return res.json();
  },
  {
    scope: 'container',
    container: '#users-table',
    type: 'skeleton',
    skeleton: { variant: 'table', rows: 4 },
  }
);
```

### 6. Playful Interactive Mini-Game Loader

Turn boring wait times into a delightful mini-game! Users can click/tap floating bubbles or press Space/Enter to pop bubbles and rack up combo scores while waiting:

```ts
const id = spinner.start({
  id: 'export-job',
  type: 'interactive',  // or 'bubble-pop'
  text: 'Exporting 4K video... Pop bubbles while waiting! 🎈',
  color: '#6366f1',
  overlay: true,
  preventInteraction: true, // Blocks underlying page, but keeps game arena clickable!
});

// Clean up when loading completes
spinner.stop(id);
```

---

## 🎭 Multiple Simultaneous Spinners

Independent spinners can run concurrently without interfering with each other:

```ts
// Start 3 different loaders at the same time
spinner.start({ id: 'users', container: '#users', type: 'skeleton' });
spinner.start({ id: 'orders', container: '#orders', type: 'bars' });
spinner.start({ id: 'profile', container: '#profile', type: 'ring' });

// Stop only users:
spinner.stop('users'); // orders and profile remain actively loading!
```

---

## 🛠️ Built-in Loaders (30 Styles + Mini-Game)

| Type | Name | Reference Inspiration | Best For |
|---|---|---|---|
| `ring` | Classic Circular Spinner | Standard Web & Material | Buttons, page loading, general HTTP requests |
| `counter-ring` | Counter-Rotating Dual Ring ⚡ | Gyroscopic / Modern High-Tech | Dual concentric rings: outer spins anti-clockwise, inner spins clockwise |
| `circle` | 12-Dot Circular Bounce Wave | SpinKit (Tobias Ahlin) | Circular wave animation, dashboard widgets, workspace loads |
| `circular` | Material Circular Arc Dash | Google Material Design | Material UI applications, smooth expanding/contracting arcs |
| `dots` | Sequential Bouncing Dots | Chat UI / Slack / iMessage | Chatbots, conversational UI, inline buttons |
| `pulse` | Breathing Scale Shape | Heartbeat / Live beacon | Status indicators, live heartbeats, health checks |
| `bars` | Audio Equalizer Bars | Streaming / Audio tools | File ingestion, batch processing, telemetry |
| `wave` | Sine Wave Dots | Media / Creative apps | Media uploads, high-engagement consumer loading |
| `orbit` | Planetary Satellite | Space / Cloud tech | Cloud syncing, cryptographic processing |
| `square` | Geometric 3D Cube | CAD / Compiler | Code compilation, build tools, computational workflows |
| `dual-ring` | Dual Opposing Ring | Loading.io & React-Spinners | Modern SaaS authentication, API handshakes |
| `ripple` | Concentric Water Ripple | Material UI & Loading.io | Radar scans, Bluetooth pairing, device discovery |
| `cube-grid` | 3x3 Wave Cube Grid | SpinKit (Tobias Ahlin) | Package building, 3D assets, data transformation |
| `roller` | 8 Trailing Orbital Dots | CSS-Loaders & Loading.io | Payment processing, checkout, transaction verification |
| `fading-circle` | 12-Segment Radial Clock | SpinKit & Apple iOS / macOS | Native-like web apps, OS settings, system updates |
| `chasing-dots` | Dual Orbital Spheres | SpinKit & Flutter | Mobile web applications, notification syncing |
| `hourglass` | Rotating Sand Hourglass | CSS-Loaders & Loading.io | Queue positions, ticket bookings, waiting rooms |
| `heart` | Pulsing Cardiac Heartbeat | Health & Dating apps | Vital telemetry, patient portals, favorite actions |
| `infinity` | Figure-8 Continuous Loop | Web3 & Loading.io | Blockchain streaming, websockets, infinite data |
| `dna` | Double-Helix Strand | Biotech & Scientific tools | Genomic sequencing, ML model pipelines, analytics |
| `wandering-cubes` | Corner-Orbiting Cubes | SpinKit (Tobias Ahlin) | Shard rebalancing, data migration, distributed storage |
| `folding-cube` | 3D Perspective Origami Cube | SpinKit 3D | WebGL scenes, Three.js 3D assets, architectural CAD |
| `atom` | 3 Orbital Electron Rings | React & Physics / AI | AI models, LLM inferences, React web apps, science |
| `pacman` | Classic Arcade Chomping Dots | Retro Gaming & loaders.css | Gamified flows, consumer apps, playful loading screens |
| `clock` | Analogue Hour & Minute Hands | Material & Scheduling apps | Appointment bookings, queue timers, flight searches |
| `rotating-plane` | 3D Perspective Card Flip | SpinKit #1 (Tobias Ahlin) | 3D graphics rendering, minimalist card-flipping UI |
| `newton-cradle` | Kinetic Momentum Pendulum | Physics & Executive tools | Cluster node sync, financial markets, data pipelines |
| `hash` | Interlocking Hashtag # Grid | react-spinners (David Hu) | Social media hashtag analysis, cryptographic hashing |
| `counter-ring` | Counter-Rotating Concentric Dual Ring ⚡ | Dual-direction gyroscope | High-tech dashboards, AI workflows, Web3 portals |
| `progress-bar` | Linear Progress Bar (Gradient Sheen) 📊 | Modern Web (Vercel / Linear) | File uploads, downloads, installations, linear workflows |
| `progress-ring` | Circular Progress Gauge (Radial Bloom) ⏱️ | Apple Watch / Dashboard Gauge | Cloud backup, health gauges, battery levels, radial metrics |
| `progress-steps` | Segmented Pill Step Progress 🪜 | Stories / Multi-stage Wizards | Multi-stage workflows, verification pipelines, onboarding |
| `interactive` | Bubble-Pop Mini-Game 🫧 | Interactive Game Loader | Long exports, AI workflows, uploads, playful wait screens |
| `fidget-spinner` | Interactive Fidget Spinner 🌀 | Inertia physics & RPM meter | Long downloads, stress-relief screens, video renders |
| `pong` | Interactive Mini-Pong Arcade 🏓 | Retro paddle & neon ball bounce | Code compilers, build tasks, shader processing |
| `tap-burst` | Interactive Cosmic Tap Core 💥 | Shockwave ripples & combo bursts | Cloud provisioning, ML model inference, database sync |
| `3d-cube` | 3D Isometric Wireframe Cube 🧊 | 3D Geometry / CAD / WebGL | 3D graphics rendering, CAD design, Three.js loading screens |
| `3d-sphere` | 3D Orbital Sphere Gyroscope 🌐 | Aerospace / Geospatial | Coordinate calculation, cryptographic gyroscopes, global sync |
| `3d-helix` | 3D Double-Helix DNA Strand 🧬 | Biotech / Genomics | DNA sequencing, scientific computing, molecular data pipelines |
| `3d-pyramid` | 3D Tumbling Prism Pyramid 🔺 | Math / Computational Geometry | Mesh generation, geometric solvers, physics engines |
| `3d-torus` | 3D Wireframe Torus Donut 🍩 | Quantum Physics / High-Tech | Particle accelerators, cybernetics, high-tech dashboards |
| `skeleton` | Layout-Preserving Skeleton | Modern Web (GitHub/Twitter) | Tables, feeds, cards, profile screens |

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

## 🎮 Interactive Mini-Game Loaders

Turn agonizing waiting times (video exports, database migrations, package installations, AI prompts) into delightfully engaging mini-games! All interactive loaders feature zero external dependencies, keyboard & touch accessibility, and automatic idle fallback:

```ts
import { spinner } from 'lumaspinner';

// 1. Interactive Tri-Blade Fidget Spinner (Flick / RPM Physics)
const id = spinner.start({
  type: 'fidget-spinner',
  text: 'Rendering 4K export...',
});

// 2. Interactive Retro Arcade Mini-Pong
const pongId = spinner.start({
  type: 'pong',
  text: 'Compiling shaders...',
});

// 3. Interactive Cosmic Core Clicker (Shockwaves & 100% Supernova)
const burstId = spinner.start({
  type: 'tap-burst',
  text: 'Provisioning cluster nodes...',
});

// 4. Interactive Bubble-Pop Game
const bubbleId = spinner.start({
  type: 'interactive',
  text: 'Downloading assets...',
});
```

---

## 📖 API Reference

### `spinner.start(options?: SpinnerOptions): string`
Starts a new spinner instance and returns its unique ID. Throws an error if an active spinner already exists with that ID.

### `spinner.stop(id?: string): void`
Stops the spinner. If an ID is provided, stops that specific spinner. If called without an ID, stops the most recently started active spinner (LIFO resolution).

### `spinner.configure(config: GlobalConfig): void`
Sets application-wide default settings once at startup. All subsequent `spinner.start()` calls inherit these options automatically:

```ts
spinner.configure({
  type: 'dots',              // Default loader type ('ring' | 'dots' | 'pulse' | 'bars' | 'wave' | 'orbit' | 'square' | 'skeleton')
  size: 'medium',            // Default size ('small' | 'medium' | 'large' | number)
  speed: 'normal',           // Default speed ('fast' | 'normal' | 'slow')
  color: '#6366f1',          // Default color
  text: 'Loading...',        // Default text
  duration: 3000,            // Auto-dismiss duration in ms (0 = manual stop)
  delay: 200,                // Start delay in ms (prevents loader flash on quick responses)
  theme: 'auto',             // 'auto' | 'dark' | 'light'
  overlay: true,             // Enable backdrop overlay
  preventInteraction: true,  // Block background clicks
  nonce: 'my-nonce',         // Explicit CSP nonce (or auto-detected from DOM)
  injectStyles: true,        // Auto-inject CSS (set false if importing CSS manually)
});
```

### `spinner.getConfig(): Required<GlobalConfig>`
Returns the current active global configuration.

### `spinner.resetConfig(): void`
Resets all global configuration back to the library defaults.

### `spinner.update(idOrOptions: string | Partial<SpinnerOptions>, options?: Partial<SpinnerOptions>): void`
Updates properties (such as `text`, `color`, `speed`) of a running spinner without recreating DOM nodes. If called without an ID, updates the active spinner.

### `spinner.setText(idOrText: string, text?: string): void`
Convenience helper to update visible and accessible screen-reader text. Can be called with just `spinner.setText('Loading...')` to update the active spinner.

### `spinner.setType(idOrType: string | LoaderType, type?: LoaderType): void`
Switches the active loader animation on the fly.

### `spinner.setProgress(idOrValue: string | number, value?: number): void`
Dynamically updates the determinate progress (0–100%) for linear progress bars (`progress-bar`), circular gauges (`progress-ring`), and segmented steps (`progress-steps`).
Automatically switches indeterminate animations to smooth determinate transitions and updates live tabular percentage indicators:

```ts
const id = spinner.start({
  type: 'progress-bar',
  showProgressText: true,
  text: 'Uploading video...',
});

// Update progress dynamically
spinner.setProgress(id, 45); // Sets 45% fill and updates label to "45%"

// Complete
spinner.setProgress(id, 100);
spinner.success(id, 'Upload complete!');
```

### `spinner.success(idOrMessage?: string, message?: string): void`
Transitions the spinner to a success state with an optional message before cleanly removing it.

### `spinner.error(idOrMessage?: string, message?: string): void`
Transitions the spinner to an error state with an optional message before cleanly removing it.

### `spinner.destroy(id?: string): void`
Stops and immediately frees all memory, DOM nodes, and registry references.

### `spinner.stopAll(): void`
Stops all currently running spinners across all scopes.

### `spinner.destroyAll(): void`
Clears the entire registry and all managed instances.

### `spinner.isActive(id: string): boolean`
Returns `true` if a spinner with the given ID is actively mounted or queued.

### `spinner.active(): SpinnerInstance[]`
Returns an array of all active spinner instances.

### `spinner.wrap<T>(id: string, fn: () => Promise<T>, options?: SpinnerOptions): Promise<T>`
Wraps an asynchronous promise function. Guarantees that `spinner.stop(id)` is called whether the promise resolves or rejects.

### `spinner.configure(config: GlobalConfig): void`
Sets global defaults applied to all newly created spinners.

### `spinner.on(event: SpinnerEvent, callback: SpinnerEventCallback): () => void`
Subscribes to lifecycle events (`start`, `stop`, `update`, `destroy`, `success`, `error`). Returns an unsubscribe function.

### `spinner.registerLoader(name: string, definition: LoaderDefinition): void`
Registers a custom loader implementation.

---

## 🎨 Styling: Colors & Overlays

LumaSpinner gives you complete, flexible control over loader icon colors and backdrop overlay colors via JavaScript options or CSS variables:

### 1. Customizing Loader Icon Color
Pass any valid CSS color string (`hex`, `rgb`, `rgba`, `hsl`, or named color) in `options.color`:

```ts
// Vibrant red beating heart
spinner.start({
  type: 'heart',
  color: '#ef4444',
  text: 'Recording vital signs...',
});

// Glowing neon purple infinity loop
spinner.start({
  type: 'infinity',
  color: '#8b5cf6',
});

// Dynamic color update on an active spinner
spinner.update('my-spinner', { color: '#10b981' });
```

### 2. Customizing Backdrop Overlay Color
Configure overlay background color using string shorthand, the `overlayColor` property, or an `OverlayOptions` object:

```ts
// Option A: String shorthand (enables overlay and sets backdrop color)
spinner.start({
  overlay: 'rgba(0, 0, 0, 0.85)',
});

// Option B: overlayColor property
spinner.start({
  overlayColor: '#0f172aee',
  color: '#38bdf8',
});

// Option C: OverlayOptions object
spinner.start({
  overlay: {
    enabled: true,
    color: 'rgba(30, 41, 59, 0.75)',
  },
});
```

### 3. Application-Wide Color Defaults
Set default brand colors once via `configure`:

```ts
spinner.configure({
  color: '#6366f1',
  overlayColor: 'rgba(15, 23, 42, 0.8)',
});
```

---

## 🎨 CSS Variables & Token Prefixing

To guarantee zero class collisions and token clashes with existing projects and libraries, all design tokens, CSS variables, and DOM classes are strictly prefixed with `--luma-spinner-*` and `.luma-spinner-*` (while retaining `--luma-*` as backward-compatibility aliases):

```css
:root {
  /* Primary Prefixed Design Tokens */
  --luma-spinner-color: #6366f1;
  --luma-spinner-size: 40px;
  --luma-spinner-speed: 0.8s;
  --luma-spinner-text-size: 14px;
  --luma-spinner-text-color: #1e293b;
  --luma-spinner-overlay-color: rgba(255, 255, 255, 0.8);
  --luma-spinner-skeleton-color: #e2e8f0;
  --luma-spinner-skeleton-highlight: #f8fafc;
  --luma-spinner-z-index: 9999;

  /* Backward-Compatibility Aliases (supported automatically) */
  --luma-color: var(--luma-spinner-color);
  --luma-size: var(--luma-spinner-size);
  --luma-speed: var(--luma-spinner-speed);
}
```

---

## ♿ Accessibility

LumaSpinner treats accessibility as a first-class requirement:

1. **Role & Live Region**: Mounts with `role="status"` and `aria-live="polite"` by default.
2. **`aria-busy`**: Toggles `aria-busy="true"` on the target container or `document.body` during loading, and restores `aria-busy="false"` on teardown.
3. **Visually Hidden Text**: Automatically includes screen-reader-only labels (`.luma-sr-only`) so visually impaired users receive loading state announcements.
4. **Reduced Motion**: Fully respects `@media (prefers-reduced-motion: reduce)`. Animations gracefully pause or switch to subtle static indicators.

---

## 📄 License

MIT © [Krishna Kumar](https://github.com/mekrishnaa)

