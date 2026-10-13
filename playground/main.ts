import { spinner } from '../src/index.js';
import '../src/styles/lumaspinner.css';
import type { LoaderType, SkeletonVariant } from '../src/types/index.js';

// ─── Theme toggle ──────────────────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// ─── Event Logger ──────────────────────────────────────────────────────────
const consoleBox = document.getElementById('console-logs');

function addLog(event: string, id: string, message?: string) {
  if (!consoleBox) return;
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const row = document.createElement('div');
  row.className = 'log-line';
  row.innerHTML = `
    <span class="log-time">[${time}]</span>
    <span class="log-event ${event}">${event.toUpperCase()}</span>
    <span class="log-msg">id: <b>${id}</b> ${message ? `— ${message}` : ''}</span>
  `;
  consoleBox.appendChild(row);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

spinner.on('start', (e) => addLog('start', e.id));
spinner.on('stop', (e) => addLog('stop', e.id));
spinner.on('update', (e) => addLog('update', e.id));
spinner.on('success', (e) => addLog('success', e.id, e.message));
spinner.on('error', (e) => addLog('error', e.id, e.message));

// ─── Modals Management ─────────────────────────────────────────────────────
const setupModal = document.getElementById('setup-modal');
const setupModalClose = document.getElementById('setup-modal-close');
const btnOpenSetup = document.getElementById('btn-open-setup');
const btnCopyInstall = document.getElementById('btn-copy-install');

btnOpenSetup?.addEventListener('click', () => {
  if (setupModal) setupModal.style.display = 'flex';
});

setupModalClose?.addEventListener('click', () => {
  if (setupModal) setupModal.style.display = 'none';
});

setupModal?.addEventListener('click', (e) => {
  if (e.target === setupModal) setupModal.style.display = 'none';
});

btnCopyInstall?.addEventListener('click', async () => {
  await navigator.clipboard.writeText('npm install lumaspinner');
  if (btnCopyInstall) {
    const original = btnCopyInstall.textContent;
    btnCopyInstall.textContent = '✓ Copied!';
    setTimeout(() => { btnCopyInstall.textContent = original; }, 2000);
  }
});

// Framework tabs switcher
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    ['vanilla', 'react', 'vue', 'angular'].forEach((t) => {
      const el = document.getElementById(`tab-content-${t}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
  });
});

// Dynamic Code Modal
const codeModal = document.getElementById('code-modal');
const codeModalClose = document.getElementById('code-modal-close');
const codeModalTitle = document.getElementById('code-modal-title');
const codeModalContent = document.getElementById('code-modal-content');
const codeModalTips = document.getElementById('code-modal-tips');
const codeModalCopy = document.getElementById('code-modal-copy');

let currentCodeSnippet = '';

function showCodeModal(title: string, code: string, tips: string) {
  if (!codeModal || !codeModalTitle || !codeModalContent || !codeModalTips) return;
  currentCodeSnippet = code;
  codeModalTitle.innerHTML = `<span>&lt;/&gt; ${title}</span>`;
  codeModalContent.textContent = code;
  codeModalTips.innerHTML = tips;
  codeModal.style.display = 'flex';
}

codeModalClose?.addEventListener('click', () => {
  if (codeModal) codeModal.style.display = 'none';
});

codeModal?.addEventListener('click', (e) => {
  if (e.target === codeModal) codeModal.style.display = 'none';
});

codeModalCopy?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(currentCodeSnippet);
  if (codeModalCopy) {
    const original = codeModalCopy.textContent;
    codeModalCopy.textContent = '✓ Copied!';
    setTimeout(() => { codeModalCopy.textContent = original; }, 2000);
  }
});

// Escape key closes modals & fullscreen spinners
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (setupModal) setupModal.style.display = 'none';
    if (codeModal) codeModal.style.display = 'none';
    const activePage = spinner.active().filter((s) => s.scope === 'page');
    activePage.forEach((s) => spinner.stop(s.id));
  }
});

// ─── Code Snippets Data ────────────────────────────────────────────────────
const LOADER_SNIPPETS: Record<LoaderType, { code: string; tips: string }> = {
  ring: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start classic circular ring loader
const id = spinner.start({
  id: 'my-ring-spinner',
  type: 'ring',
  size: 'medium',       // 'small' (20px) | 'medium' (36px) | 'large' (56px) | number
  color: '#6366f1',     // Any valid CSS color or 'currentColor'
  speed: 'normal',      // 'fast' (0.6s) | 'normal' (1.0s) | 'slow' (1.6s)
  text: 'Loading users...',
  textPosition: 'bottom', // 'top' | 'right' | 'bottom' | 'left'
});

// 2. Stop when task is completed
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> General HTTP requests, button actions, and page initialization. Uses hardware-accelerated CSS border spin rotation.',
  },
  dots: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 3-dot pulsing loader
const id = spinner.start({
  id: 'chat-typing',
  type: 'dots',
  size: 'small',
  color: '#6366f1',
  speed: 'normal',
  text: 'Assistant is typing...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Conversational AI, chatbots, search inputs, and inline action indicators.',
  },
  pulse: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start breathing scale pulse loader
const id = spinner.start({
  id: 'sync-status',
  type: 'pulse',
  size: 'medium',
  color: '#10b981', // green live status
  speed: 'normal',
  text: 'Checking server health...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Telemetry beacons, background sync heartbeats, and status indicators.',
  },
  bars: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 5-bar equalizer audio/streaming loader
const id = spinner.start({
  id: 'data-ingestion',
  type: 'bars',
  size: 'medium',
  color: '#6366f1',
  speed: 'fast',
  text: 'Ingesting data feed...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Audio visualization, streaming data pipelines, file ingestion, and batch analytics.',
  },
  wave: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start sequential wave dots loader
const id = spinner.start({
  id: 'file-upload',
  type: 'wave',
  size: 'medium',
  color: '#ec4899',
  speed: 'normal',
  text: 'Uploading assets...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Upload queues, file processing, and consumer-facing waiting states.',
  },
  orbit: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start orbital planetary satellite loader
const id = spinner.start({
  id: 'cloud-orbit',
  type: 'orbit',
  size: 'large',
  color: '#818cf8',
  speed: 'normal',
  text: 'Syncing cluster state...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Distributed network calls, cryptographic verification, and cloud synchronization.',
  },
  square: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 3D geometric rotating cube loader
const id = spinner.start({
  id: 'build-compiling',
  type: 'square',
  size: 'medium',
  color: '#f59e0b',
  speed: 'normal',
  text: 'Compiling modules...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Build systems, code compilation, CAD rendering, and computational workflows.',
  },
  skeleton: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start layout-preserving skeleton loader
const id = spinner.start({
  id: 'container-skeleton',
  type: 'skeleton',
  scope: 'container',
  container: '#target-container',
  skeleton: {
    variant: 'card',     // 'card' | 'list' | 'profile' | 'table' | 'line' | 'circle'
    lines: 3,
    shimmer: true,       // Hardware-accelerated GPU shimmer
  },
  overlay: true,
});

// 2. Stop when data is ready
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Dashboards, feeds, card grids, and tables where eventual content structure is predictable.',
  },
  'dual-ring': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start dual-ring loader (Loading.io / React-Spinners style)
const id = spinner.start({
  id: 'dual-ring-loader',
  type: 'dual-ring',
  size: 'medium',
  color: '#6366f1',
  speed: 'normal',
  text: 'Connecting...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Modern SaaS authentication, API handshakes, and high-tech loading screens.',
  },
  ripple: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start concentric expanding ripple loader
const id = spinner.start({
  id: 'ripple-loader',
  type: 'ripple',
  size: 'large',
  color: '#06b6d4',
  speed: 'normal',
  text: 'Locating nearby devices...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Geolocation searches, Bluetooth pairing, radar scans, and media playback buffering.',
  },
  'cube-grid': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 3x3 cube grid loader (SpinKit Tobias Ahlin style)
const id = spinner.start({
  id: 'cube-grid-loader',
  type: 'cube-grid',
  size: 'medium',
  color: '#a855f7',
  speed: 'normal',
  text: 'Building package bundle...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Webpack/Vite builds, 3D asset loading, data pipeline transformations, and analytics crunching.',
  },
  roller: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start roller loader (8 trailing dots with accelerated whip motion)
const id = spinner.start({
  id: 'roller-loader',
  type: 'roller',
  size: 'medium',
  color: '#10b981',
  speed: 'normal',
  text: 'Processing payment...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Checkout flows, banking transactions, payment verification, and security checks.',
  },
  'fading-circle': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 12-segment fading circle loader (iOS / macOS native style)
const id = spinner.start({
  id: 'fading-circle-loader',
  type: 'fading-circle',
  size: 'medium',       // 'small' | 'medium' | 'large' | number
  color: '#6366f1',     // Any valid CSS color or 'currentColor'
  speed: 'normal',      // 'fast' (0.7s) | 'normal' (1.1s) | 'slow' (1.6s)
  overlay: 'rgba(0, 0, 0, 0.7)', // Overlay string shorthand or boolean
  text: 'Checking system updates...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Native-like iOS and macOS web apps, system settings, and OS-style progress indicators. Features 12 radial blades fading sequentially in a smooth 360° circular sweep.',
  },
  'chasing-dots': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start chasing dots orbital loader (SpinKit / Flutter style)
const id = spinner.start({
  id: 'chasing-dots-loader',
  type: 'chasing-dots',
  size: 'medium',
  color: '#f43f5e',
  speed: 'normal',
  text: 'Syncing notifications...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Mobile web applications, messaging push syncs, and real-time feeds.',
  },
  hourglass: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start rotating hourglass sand timer loader
const id = spinner.start({
  id: 'hourglass-loader',
  type: 'hourglass',
  size: 'medium',
  color: '#eab308',
  speed: 'normal',
  text: 'Waiting for queue position...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Waiting rooms, queue position updates, countdowns, and ticket booking reservations.',
  },
  heart: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start pulsing heartbeat loader with custom icon color & overlay color
const id = spinner.start({
  id: 'heart-loader',
  type: 'heart',
  size: 'medium',
  color: '#ef4444',            // Customize icon color (vibrant red, pink, etc.)
  speed: 'fast',
  overlay: 'rgba(239, 68, 68, 0.08)', // Tinted overlay background
  text: 'Recording vital signs...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Healthcare portals, fitness telemetry, dating apps, and social favorite actions. Set <code>color: "#ef4444"</code> to style the loader icon, and <code>overlayColor</code> or <code>overlay: "rgba(...)"</code> for custom overlay background.',
  },
  infinity: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start continuous figure-8 infinity loop loader with revolving light beam
const id = spinner.start({
  id: 'infinity-loader',
  type: 'infinity',
  size: 'medium',
  color: '#8b5cf6',            // Neon purple beam and guide track
  speed: 'normal',             // Cycle duration for one full figure-8 loop
  overlay: 'rgba(15, 23, 42, 0.85)', // Dark backdrop with glowing light beam
  text: 'Streaming ledger updates...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Real-time websockets, blockchain transactions, infinite scrolling, and background telemetry. Features an SVG figure-8 track with a continuous revolving light beam.',
  },
  dna: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start DNA double-helix oscillating strand loader
const id = spinner.start({
  id: 'dna-loader',
  type: 'dna',
  size: 'large',
  color: '#14b8a6',
  speed: 'normal',
  text: 'Sequencing genomic data...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Scientific applications, biotech dashboards, machine-learning data pipelines, and genomics.',
  },
  'wandering-cubes': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start wandering cubes corner-orbit loader (SpinKit classic)
const id = spinner.start({
  id: 'wandering-cubes-loader',
  type: 'wandering-cubes',
  size: 'medium',
  color: '#3b82f6',
  speed: 'normal',
  text: 'Rebalancing shards...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Distributed storage, database migration, cluster rebalancing, and data node ingestion.',
  },
  'folding-cube': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 3D folding origami cube loader (SpinKit 3D classic)
const id = spinner.start({
  id: 'folding-cube-loader',
  type: 'folding-cube',
  size: 'medium',
  color: '#f97316',
  speed: 'normal',
  text: 'Rendering 3D mesh...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> WebGL graphics rendering, game engine assets, Three.js loading, and architectural CAD.',
  },
  circle: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 12-dot circular bounce wave loader (SpinKit style)
const id = spinner.start({
  id: 'circle-loader',
  type: 'circle',
  size: 'medium',
  color: '#6366f1',
  speed: 'normal',
  text: 'Loading workspace...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Circular wave animations, dashboard widgets, and user workspace initialization. Features 12 circular nodes in a sequential 360° bounce wave.',
  },
  circular: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start Material Design circular arc dash spin loader
const id = spinner.start({
  id: 'circular-loader',
  type: 'circular',
  size: 'medium',
  color: '#3b82f6',
  speed: 'normal',
  text: 'Syncing Google drive...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Material Design interfaces, Google Cloud APIs, and smooth expanding/contracting circular arc animations.',
  },
  atom: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start orbital electron atom loader (React / Physics / AI style)
const id = spinner.start({
  id: 'atom-loader',
  type: 'atom',
  size: 'medium',
  color: '#6366f1',
  speed: 'normal',
  text: 'Computing quantum tensors...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> AI models, LLM inferences, React web applications, scientific analysis, and quantum computing dashboards.',
  },
  pacman: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start classic arcade Pacman chomping loader
const id = spinner.start({
  id: 'pacman-loader',
  type: 'pacman',
  size: 'medium',
  color: '#eab308',
  speed: 'normal',
  text: 'Chomping data chunks...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Gaming interfaces, playful user flows, consumer apps, and file ingestion sequences.',
  },
  clock: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start analogue clock timer loader
const id = spinner.start({
  id: 'clock-loader',
  type: 'clock',
  size: 'medium',
  color: '#06b6d4',
  speed: 'normal',
  text: 'Confirming appointment slot...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Scheduling systems, calendar bookings, flight lookups, queue timeouts, and countdown estimators.',
  },
  'rotating-plane': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start 3D perspective flip card loader (SpinKit iconic classic)
const id = spinner.start({
  id: 'plane-loader',
  type: 'rotating-plane',
  size: 'medium',
  color: '#ec4899',
  speed: 'normal',
  text: 'Rendering graphics...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> 3D graphic rendering, card-flipping UI animations, and modern minimalist web portfolios.',
  },
  'newton-cradle': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start Newton cradle kinetic momentum loader
const id = spinner.start({
  id: 'newton-loader',
  type: 'newton-cradle',
  size: 'medium',
  color: '#3b82f6',
  speed: 'normal',
  text: 'Synchronizing cluster nodes...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Distributed systems, server cluster sync, executive analytics portals, and financial trading platforms.',
  },
  hash: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start interlocking hashtag grid loader (react-spinners classic)
const id = spinner.start({
  id: 'hash-loader',
  type: 'hash',
  size: 'medium',
  color: '#10b981',
  speed: 'normal',
  text: 'Generating cryptographic hash...',
});

// 2. Stop when done
spinner.stop(id);`,
    tips: '💡 <b>Best For:</b> Social media hashtag analysis, cryptographic hashing, Web3 contracts, and data tagging.',
  },
  interactive: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start interactive mini-game loader (Bubble Pop)
const id = spinner.start({
  id: 'game-loader',
  type: 'interactive',
  size: 'medium',       // Scales arena and bubbles proportionally
  color: '#6366f1',     // Bubble themes & glow colors
  speed: 'normal',      // Floating bubble speed
  text: 'Generating high-res report...',
});

// Users can click/tap bubbles or press Space/Enter to pop bubbles and rack up score combos!

// 2. Stop when task completes
spinner.stop(id);`,
    tips: '🎮 <b>Best For:</b> Long exports, AI workflows, uploads, and waiting screens! Lets users pop floating bubbles and score combo streaks to pass the time while waiting.',
  },
  'bubble-pop': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'interactive'
const id = spinner.start({
  type: 'bubble-pop',
  color: '#ec4899',
  text: 'Rendering video...',
});`,
    tips: '🎮 Alias for the interactive bubble-pop mini-game loader.',
  },
  'counter-ring': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start counter-rotating dual ring loader
// Inner ring spins clockwise, outer ring spins anti-clockwise!
const id = spinner.start({
  id: 'counter-ring-loader',
  type: 'counter-ring',
  size: 'medium',       // 'small' | 'medium' | 'large' | number (px)
  color: '#6366f1',     // Any valid CSS color or gradient
  speed: 'normal',      // 'fast' (0.7s) | 'normal' (1.2s) | 'slow' (1.8s)
  text: 'Syncing gyroscope...',
});

// 2. Stop when task completes
spinner.stop(id);`,
    tips: '⚡ <b>Best For:</b> High-tech dashboards, AI workflows, Web3 portals, and cybernetics. Outer ring rotates anti-clockwise while concentric inner ring rotates clockwise.',
  },
  'concentric-rings': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'counter-ring'
const id = spinner.start({
  type: 'concentric-rings',
  color: '#8b5cf6',
  text: 'Processing dual streams...',
});`,
    tips: '⚡ Concentric dual rings with opposing clockwise and counter-clockwise rotations.',
  },
  'dual-ring-reverse': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'counter-ring'
const id = spinner.start({
  type: 'dual-ring-reverse',
  color: '#06b6d4',
  text: 'Loading assets in reverse phase...',
});`,
    tips: '⚡ Dual ring with reverse anti-clockwise outer orbit.',
  },
  'progress-bar': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start modern linear progress bar (Vercel/Linear style)
const id = spinner.start({
  id: 'download-progress',
  type: 'progress-bar',
  color: '#6366f1',
  progress: 0,             // 0-100 determinate, or omit for sleek indeterminate laser beam
  showProgressText: true,  // Displays live percentage readout (e.g. 75%)
  text: 'Downloading assets...',
});

// 2. Increment progress dynamically
let pct = 0;
const interval = setInterval(() => {
  pct += 10;
  spinner.setProgress(id, pct);
  if (pct >= 100) {
    clearInterval(interval);
    spinner.success(id, 'Download complete!');
  }
}, 300);`,
    tips: '📊 <b>Best For:</b> File uploads, exports, installations, and linear workflows. Features a sleek glowing gradient bar with shimmering light beam and live tabular percentage readout.',
  },
  progress: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'progress-bar'
const id = spinner.start({
  type: 'progress',
  color: '#3b82f6',
  progress: 45,
  showProgressText: true,
  text: 'Processing video...',
});`,
    tips: '📊 Alias for modern linear progress bar.',
  },
  'linear-progress': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'progress-bar'
const id = spinner.start({
  type: 'linear-progress',
  color: '#10b981',
  progress: 60,
  text: 'Deploying release...',
});`,
    tips: '📊 Alias for modern linear progress bar.',
  },
  'progress-ring': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start modern Apple Watch style circular progress gauge
const id = spinner.start({
  id: 'upload-ring',
  type: 'progress-ring',
  size: 'large',           // 'small' | 'medium' | 'large' | number (px)
  color: '#06b6d4',        // Neon glow or brand color
  progress: 25,            // 0-100 or omit for indeterminate spinning arc
  showProgressText: true,  // Displays centered percentage readout (e.g. 25%)
  text: 'Backing up files...',
});

// 2. Update progress dynamically
spinner.setProgress(id, 85);

// 3. Mark complete
spinner.success(id, 'Backup ready!');`,
    tips: '⏱️ <b>Best For:</b> Dashboards, cloud backups, health gauges, and battery rings. Features an SVG radial meter with rounded stroke caps, neon bloom glow, and centered tabular numerals.',
  },
  'circular-progress': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'progress-ring'
const id = spinner.start({
  type: 'circular-progress',
  color: '#ec4899',
  progress: 50,
  text: 'Synchronizing...',
});`,
    tips: '⏱️ Alias for circular progress ring gauge.',
  },
  'ring-progress': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'progress-ring'
const id = spinner.start({
  type: 'ring-progress',
  color: '#8b5cf6',
  progress: 75,
  text: 'Calculating metrics...',
});`,
    tips: '⏱️ Alias for circular progress ring gauge.',
  },
  'progress-steps': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start modern segmented pill step progress (Story / Tesla style)
const id = spinner.start({
  id: 'setup-steps',
  type: 'progress-steps',
  color: '#f59e0b',
  progress: 40,            // Proportionally illuminates the pill capsules
  showProgressText: true,  // Displays percentage text
  text: 'Configuring database (Step 2 of 5)...',
});

// 2. Progress through steps
spinner.setProgress(id, 80);

// 3. Finish
spinner.success(id, 'Setup complete!');`,
    tips: '🪜 <b>Best For:</b> Multi-stage wizards, verification sequences, onboarding flows, and batch operations. Features 5 sleek pill capsules that pulse in indeterminate mode and illuminate in steps in determinate mode.',
  },
  steps: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'progress-steps'
const id = spinner.start({
  type: 'steps',
  color: '#10b981',
  progress: 60,
  text: 'Stage 3 of 5 complete...',
});`,
    tips: '🪜 Alias for segmented pill step progress.',
  },
  'stepped-progress': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'progress-steps'
const id = spinner.start({
  type: 'stepped-progress',
  color: '#6366f1',
  progress: 100,
  text: 'All stages finished!',
});`,
    tips: '🪜 Alias for segmented pill step progress.',
  },
  'fidget-spinner': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start interactive tri-blade fidget spinner
const id = spinner.start({
  id: 'fidget-loader',
  type: 'fidget-spinner',
  size: 'large',       // Scales arena & tri-blades
  color: '#6366f1',    // Blade color & theme
  text: 'Exporting 4K video...',
});

// Users can click/tap, drag, flick, or press Space to spin faster with realistic RPM physics!

// 2. Stop when task is done
spinner.stop(id);`,
    tips: '🌀 <b>Best For:</b> Stress-relief waiting screens, long renders, and file downloads. Features inertia momentum physics, flick velocity detection, and live RPM counter.',
  },
  fidget: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'fidget-spinner'
const id = spinner.start({
  type: 'fidget',
  color: '#8b5cf6',
  text: 'Generating models...',
});`,
    tips: '🌀 Alias for interactive fidget spinner loader.',
  },
  'spin-fidget': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'fidget-spinner'
const id = spinner.start({
  type: 'spin-fidget',
  color: '#06b6d4',
  text: 'Loading assets...',
});`,
    tips: '🌀 Alias for interactive fidget spinner loader.',
  },
  pong: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start retro arcade mini-pong rally loader
const id = spinner.start({
  id: 'pong-loader',
  type: 'pong',
  size: 'large',
  color: '#10b981',    // Neon green paddle & neon glow
  text: 'Compiling project shaders...',
});

// Users can control the paddle with mouse / touch or Left/Right arrow keys!
// Features smart autoplay backup so it stays animated even when idle.

// 2. Stop when task finishes
spinner.stop(id);`,
    tips: '🏓 <b>Best For:</b> Build tools, compilers, code migrations, and downloads. Features an arcade paddle ball rally with live streak counter and smart idle autoplay.',
  },
  'mini-pong': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'pong'
const id = spinner.start({
  type: 'mini-pong',
  color: '#3b82f6',
  text: 'Building container image...',
});`,
    tips: '🏓 Alias for mini-pong arcade loader.',
  },
  'bounce-game': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'pong'
const id = spinner.start({
  type: 'bounce-game',
  color: '#ec4899',
  text: 'Syncing game state...',
});`,
    tips: '🏓 Alias for mini-pong arcade loader.',
  },
  'tap-burst': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Start cosmic energy core tap clicker
const id = spinner.start({
  id: 'tap-burst-loader',
  type: 'tap-burst',
  size: 'large',
  color: '#f59e0b',    // Glowing core & plasma shockwaves
  text: 'Provisioning cloud cluster...',
});

// Users click or tap the core orb to build up energy from 0% to 100% Supernova!

// 2. Stop when ready
spinner.stop(id);`,
    tips: '💥 <b>Best For:</b> Cloud provisioning, database backups, and AI batch tasks. Features clickable cosmic reactor orb with expanding shockwave ripples and combo multipliers.',
  },
  'click-blaster': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'tap-burst'
const id = spinner.start({
  type: 'click-blaster',
  color: '#ef4444',
  text: 'Calibrating lasers...',
});`,
    tips: '💥 Alias for tap-burst cosmic clicker loader.',
  },
  'energy-orb': {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Alias for 'tap-burst'
const id = spinner.start({
  type: 'energy-orb',
  color: '#8b5cf6',
  text: 'Generating power matrix...',
});`,
    tips: '💥 Alias for tap-burst cosmic clicker loader.',
  },
};

// ─── 1. Loader Types Showcase ──────────────────────────────────────────────
const LOADERS: { type: LoaderType; title: string; desc: string }[] = [
  { type: 'ring', title: 'Ring Loader', desc: 'Classic circular SVG/CSS spinner with customizable stroke and speed' },
  { type: 'counter-ring', title: 'Counter-Rotating Dual Ring ⚡', desc: 'Concentric dual rings rotating in opposing directions (inner clockwise, outer anti-clockwise)' },
  { type: 'progress-bar', title: 'Progress Bar (Linear Glow) 📊', desc: 'Modern glowing linear bar with fluid laser beam & live percentage readout (Vercel/Linear style)' },
  { type: 'progress-ring', title: 'Progress Ring (Apple Radial) ⏱️', desc: 'Apple Watch style circular progress gauge with rounded caps and centered percentage' },
  { type: 'progress-steps', title: 'Progress Steps (Segmented) 🪜', desc: 'Segmented pill capsule progress sequence for staged pipelines and multi-step workflows' },
  { type: 'circle', title: 'Circle Loader', desc: '12-dot circular wave bounce animation with 360° staggered delay (SpinKit classic)' },
  { type: 'circular', title: 'Circular Arc Loader', desc: 'Material Design smooth expanding and contracting circular arc dash animation' },
  { type: 'dots', title: 'Dots Loader', desc: 'Sequential pulsing dot trio ideal for conversational/chat UI' },
  { type: 'pulse', title: 'Pulse Loader', desc: 'Breathing scale beacon designed for status updates' },
  { type: 'bars', title: 'Bars Loader', desc: 'Rhythmic audio-style equalizer bars for ingestion & streaming' },
  { type: 'wave', title: 'Wave Loader', desc: 'Cascading sine-wave dot sequence for high-engagement tasks' },
  { type: 'orbit', title: 'Orbit Loader', desc: 'Planetary satellite circling a central core element' },
  { type: 'square', title: 'Square Loader', desc: 'Geometric flipping & folding cube animation' },
  { type: 'dual-ring', title: 'Dual Ring Loader', desc: 'Opposing dual-arc rotating rings (inspired by Loading.io & React-Spinners)' },
  { type: 'ripple', title: 'Ripple Loader', desc: 'Concentric expanding water ripples (inspired by Loading.io & Material Design)' },
  { type: 'cube-grid', title: 'Cube Grid Loader', desc: '3x3 9-cube diagonal wave grid (inspired by Tobias Ahlin’s SpinKit)' },
  { type: 'roller', title: 'Roller Loader', desc: '8 trailing orbiting dots with orbital acceleration (inspired by CSS Loaders)' },
  { type: 'fading-circle', title: 'Fading Circle Loader', desc: '12-segment radial clock fade with trailing 360° circular sweep (Apple iOS / macOS native style)' },
  { type: 'chasing-dots', title: 'Chasing Dots Loader', desc: 'Two rotating orbital spheres pulsing in tandem (inspired by SpinKit & Flutter)' },
  { type: 'hourglass', title: 'Hourglass Loader', desc: 'Rotating sand timer with smooth 180° rotation (CSS-Loaders & Loading.io)' },
  { type: 'heart', title: 'Heartbeat Loader', desc: 'Pulsing cardiac rhythm with customizable icon color (e.g. vibrant red #ef4444)' },
  { type: 'infinity', title: 'Infinity Loop Loader', desc: 'Continuous glowing light beam revolving around an SVG figure-8 loop' },
  { type: 'dna', title: 'DNA Helix Loader', desc: 'Double-helix oscillating node strand for scientific & analytics data' },
  { type: 'wandering-cubes', title: 'Wandering Cubes', desc: 'Corner-travelling rotating cubes (SpinKit iconic classic)' },
  { type: 'folding-cube', title: 'Folding Cube 3D', desc: 'Perspective origami folding cube for 3D/WebGL environments' },
  { type: 'atom', title: 'Atom Loader', desc: '3 orbital electron rings spinning around a glowing nucleus (React & AI style)' },
  { type: 'pacman', title: 'Pacman Loader', desc: 'Classic retro arcade chomping character with incoming food dots' },
  { type: 'clock', title: 'Clock Timer', desc: 'Analogue clock face with revolving hour and minute hands' },
  { type: 'rotating-plane', title: 'Rotating Plane', desc: 'Minimalist 3D perspective card flip (SpinKit iconic classic #1)' },
  { type: 'newton-cradle', title: 'Newton Cradle', desc: 'Kinetic momentum pendulum swing with end-to-end impulse transfer' },
  { type: 'hash', title: 'Hash Loader', desc: 'Interlocking dancing hashtag lines (popularized by react-spinners)' },
  { type: 'interactive', title: 'Interactive Bubble-Pop 🫧', desc: 'Playful clickable bubble-pop mini-game with live score, combos, and tactile pops while waiting' },
  { type: 'fidget-spinner', title: 'Interactive Fidget Spinner 🌀', desc: 'Flickable 3-blade fidget spinner with realistic inertia momentum, touch swipes, and live RPM counter' },
  { type: 'pong', title: 'Interactive Mini-Pong 🏓', desc: 'Retro arcade paddle bounce game with live rally scoring and smart autoplay idle tracking' },
  { type: 'tap-burst', title: 'Interactive Cosmic Tap 💥', desc: 'Clickable energy reactor core with expanding shockwave ripples, combo streaks, and 100% Supernova burst' },
  { type: 'skeleton', title: 'Skeleton Loader', desc: 'Layout-preserving placeholder with smooth shimmer animation' },
];

const loadersGrid = document.getElementById('loaders-grid');

LOADERS.forEach(({ type, title, desc }) => {
  const isInteractive = type === 'interactive' || type === 'fidget-spinner' || type === 'pong' || type === 'tap-burst';
  const card = document.createElement('div');
  card.className = 'card';

  const stage = document.createElement('div');
  stage.className = 'stage';
  stage.id = `stage-${type}`;
  if (isInteractive) {
    stage.style.minHeight = '210px';
  }

  const info = document.createElement('div');
  info.innerHTML = `
    <div class="stage-title">${title}</div>
    <div class="stage-desc">${desc}</div>
  `;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const btnTry = document.createElement('button');
  btnTry.className = 'btn btn-outline btn-sm';
  btnTry.textContent = isInteractive ? '▶ Play Fullscreen 🎮' : '▶ Trigger Fullscreen';
  btnTry.onclick = () => {
    // Dismiss any previously running page spinner first
    const activePage = spinner.active().filter((s) => s.scope === 'page');
    activePage.forEach((s) => spinner.stop(s.id));

    const id = `fullscreen-${type}-${Date.now()}`;
    const isProgress = type === 'progress-bar' || type === 'progress-ring' || type === 'progress-steps';
    const totalDuration = isInteractive ? 10000 : isProgress ? 3600 : 3000;
    let remaining = Math.round(totalDuration / 1000);

    const initialText = type === 'interactive'
      ? `🎮 Pop bubbles to score points! (Closing in ${remaining}s · Press ESC to exit)`
      : type === 'fidget-spinner'
      ? `🌀 Flick or drag to spin the fidget spinner! (Closing in ${remaining}s · Press ESC to exit)`
      : type === 'pong'
      ? `🏓 Slide mouse or touch to bounce the neon ball! (Closing in ${remaining}s · Press ESC to exit)`
      : type === 'tap-burst'
      ? `💥 Tap the glowing reactor core to charge energy! (Closing in ${remaining}s · Press ESC to exit)`
      : isProgress
      ? `Simulating dynamic progress... (Press ESC to exit)`
      : `Loading with ${title}... (Closing in ${remaining}s · Press ESC to exit)`;

    spinner.start({
      id,
      type,
      scope: 'page',
      size: 'large',
      color: type === 'heart' ? '#ef4444' : isProgress ? '#6366f1' : '#6366f1',
      text: initialText,
      overlay: true,
      preventInteraction: isInteractive ? true : false,
      progress: isProgress ? 0 : undefined,
      showProgressText: isProgress ? true : undefined,
      skeleton: type === 'skeleton' ? { variant: 'card', shimmer: true } : undefined,
    });

    if (isProgress) {
      let currentPct = 0;
      const progressInterval = setInterval(() => {
        if (!spinner.isActive(id)) {
          clearInterval(progressInterval);
          return;
        }
        currentPct += Math.min(100 - currentPct, Math.floor(Math.random() * 8) + 4);
        spinner.setProgress(id, currentPct);
        if (currentPct >= 100) {
          clearInterval(progressInterval);
          spinner.success(id, '100% Processed successfully! ✨');
        }
      }, 100);
      return;
    }

    const countdownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining > 0 && spinner.isActive(id)) {
        const text = type === 'interactive'
          ? `🎮 Pop bubbles to score points! (Closing in ${remaining}s · Press ESC to exit)`
          : `Loading with ${title}... (Closing in ${remaining}s · Press ESC to exit)`;
        spinner.setText(id, text);
      } else {
        clearInterval(countdownTimer);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownTimer);
      if (spinner.isActive(id)) {
        spinner.stop(id);
      }
    }, totalDuration);
  };

  const btnCode = document.createElement('button');
  btnCode.className = 'btn btn-secondary btn-sm';
  btnCode.textContent = '</> Code';
  btnCode.onclick = () => {
    const item = LOADER_SNIPPETS[type];
    showCodeModal(`${title} Implementation`, item.code, item.tips);
  };

  btnGroup.appendChild(btnTry);
  btnGroup.appendChild(btnCode);

  card.appendChild(stage);
  card.appendChild(info);
  card.appendChild(btnGroup);
  loadersGrid?.appendChild(card);

  // Mount ambient continuous loader inside stage
  const ambientId = `ambient-${type}`;
  spinner.start({
    id: ambientId,
    type,
    scope: 'container',
    container: stage,
    color: type === 'heart' ? '#ef4444' : undefined,
    skeleton: type === 'skeleton' ? { variant: 'card', lines: 2, shimmer: true } : undefined,
  });
});

// ─── 2. Scope Isolation Controls & Whole-Screen Controller ────────────────
const pageCfgType = document.getElementById('page-cfg-type') as HTMLSelectElement | null;
const pageCfgDuration = document.getElementById('page-cfg-duration') as HTMLInputElement | null;
const pageCfgSize = document.getElementById('page-cfg-size') as HTMLSelectElement | null;
const pageCfgColorPicker = document.getElementById('page-cfg-color-picker') as HTMLInputElement | null;
const pageCfgColor = document.getElementById('page-cfg-color') as HTMLInputElement | null;
const pageCfgTextColorPicker = document.getElementById('page-cfg-text-color-picker') as HTMLInputElement | null;
const pageCfgTextColor = document.getElementById('page-cfg-text-color') as HTMLInputElement | null;
const pageCfgText = document.getElementById('page-cfg-text') as HTMLInputElement | null;
const pageCfgOverlay = document.getElementById('page-cfg-overlay') as HTMLInputElement | null;
const pageCfgPrevent = document.getElementById('page-cfg-prevent') as HTMLInputElement | null;
const pageCfgCountdown = document.getElementById('page-cfg-countdown') as HTMLInputElement | null;
const pageStatusBadge = document.getElementById('page-status-badge');
const btnTriggerPage = document.getElementById('btn-trigger-page-duration');
const btnStopPage = document.getElementById('btn-stop-page-duration');
const btnCodePage = document.getElementById('btn-code-page-duration');
const durationChips = document.querySelectorAll('#page-duration-chips .duration-chip');

// Sync color inputs
pageCfgColorPicker?.addEventListener('input', (e) => {
  if (pageCfgColor) pageCfgColor.value = (e.target as HTMLInputElement).value;
});
pageCfgColor?.addEventListener('input', (e) => {
  if (pageCfgColorPicker) pageCfgColorPicker.value = (e.target as HTMLInputElement).value;
});

// Sync text color inputs
pageCfgTextColorPicker?.addEventListener('input', (e) => {
  if (pageCfgTextColor) pageCfgTextColor.value = (e.target as HTMLInputElement).value;
});
pageCfgTextColor?.addEventListener('input', (e) => {
  if (pageCfgTextColorPicker) pageCfgTextColorPicker.value = (e.target as HTMLInputElement).value;
});

// Update duration from chips
durationChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    durationChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const ms = chip.getAttribute('data-ms');
    if (ms !== null && pageCfgDuration) {
      pageCfgDuration.value = ms;
    }
  });
});

let pageCountdownInterval: ReturnType<typeof setInterval> | null = null;
const PAGE_SPINNER_ID = 'whole-screen-page-spinner';

function setPageStatus(state: 'idle' | 'running', text?: string) {
  if (!pageStatusBadge) return;
  if (state === 'running') {
    pageStatusBadge.textContent = text || '● Running';
    pageStatusBadge.style.background = 'rgba(99, 102, 241, 0.2)';
    pageStatusBadge.style.borderColor = 'rgba(99, 102, 241, 0.5)';
    pageStatusBadge.style.color = '#a5b4fc';
  } else {
    pageStatusBadge.textContent = 'Idle';
    pageStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
    pageStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    pageStatusBadge.style.color = '#34d399';
  }
}

// Reset status when stopped
spinner.on('stop', (ev) => {
  if (ev.id === PAGE_SPINNER_ID) {
    if (pageCountdownInterval) {
      clearInterval(pageCountdownInterval);
      pageCountdownInterval = null;
    }
    setPageStatus('idle');
  }
});

btnTriggerPage?.addEventListener('click', () => {
  if (spinner.isActive(PAGE_SPINNER_ID)) {
    spinner.stop(PAGE_SPINNER_ID);
  }
  if (pageCountdownInterval) {
    clearInterval(pageCountdownInterval);
    pageCountdownInterval = null;
  }

  const type = (pageCfgType?.value ?? 'ring') as LoaderType;
  const rawDuration = parseInt(pageCfgDuration?.value ?? '3000', 10);
  const duration = isNaN(rawDuration) || rawDuration < 0 ? 0 : rawDuration;
  const sizeVal = pageCfgSize?.value ?? 'large';
  const size = sizeVal === '72' ? 72 : (sizeVal as 'small' | 'medium' | 'large');
  const color = pageCfgColor?.value || '#6366f1';
  const baseText = pageCfgText?.value || 'Loading application...';
  const overlay = pageCfgOverlay?.checked ?? true;
  const preventInteraction = pageCfgPrevent?.checked ?? true;
  const enableCountdown = (pageCfgCountdown?.checked ?? true) && duration > 0;

  let initialText = baseText;
  if (enableCountdown) {
    const totalSec = Math.ceil(duration / 1000);
    initialText = `${baseText} (auto-closing in ${totalSec}s)`;
  }

  const textColor = pageCfgTextColor?.value || undefined;

  // Start whole-screen spinner with given duration
  spinner.start({
    id: PAGE_SPINNER_ID,
    scope: 'page',
    type,
    size,
    color,
    text: initialText,
    textColor,
    duration, // Automatically dismisses after `duration` ms!
    overlay,
    preventInteraction,
  });

  setPageStatus('running', duration > 0 ? `● Running (${duration}ms)` : '● Running (manual stop)');

  if (enableCountdown) {
    let remainingMs = duration;
    pageCountdownInterval = setInterval(() => {
      remainingMs -= 1000;
      if (remainingMs <= 0) {
        if (pageCountdownInterval) {
          clearInterval(pageCountdownInterval);
          pageCountdownInterval = null;
        }
      } else {
        const remainingSec = Math.ceil(remainingMs / 1000);
        spinner.setText(PAGE_SPINNER_ID, `${baseText} (auto-closing in ${remainingSec}s)`);
      }
    }, 1000);
  }
});

btnStopPage?.addEventListener('click', () => {
  if (pageCountdownInterval) {
    clearInterval(pageCountdownInterval);
    pageCountdownInterval = null;
  }
  if (spinner.isActive(PAGE_SPINNER_ID)) {
    spinner.stop(PAGE_SPINNER_ID);
  }
  setPageStatus('idle');
});

btnCodePage?.addEventListener('click', () => {
  const type = pageCfgType?.value ?? 'ring';
  const duration = pageCfgDuration?.value ?? '3000';
  const size = pageCfgSize?.value ?? 'large';
  const color = pageCfgColor?.value || '#6366f1';
  const textColor = pageCfgTextColor?.value || '#cbd5e1';
  const text = pageCfgText?.value || 'Loading application... please wait';

  showCodeModal(
    'Whole-Screen Page Spinner with Duration',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Trigger whole-screen spinner that automatically closes after given duration
const id = spinner.start({
  id: 'whole-screen-loader',
  scope: 'page',                 // Covers entire viewport with fixed overlay
  type: '${type}',               // Any of 22 loader types (ring, infinity, heart, etc.)
  duration: ${duration},         // Auto-dismisses after ${duration}ms! (0 = manual)
  size: '${size}',               // 'small' | 'medium' | 'large' | number (e.g. 72)
  color: '${color}',             // Any valid CSS color for spinner icon
  text: '${text}',
  textColor: '${textColor}',     // Custom text label color
  overlay: true,                 // Translucent backdrop with backdrop-filter blur
  preventInteraction: true,      // Blocks clicks to background elements
});

// Or stop early anytime before duration expires:
// spinner.stop('whole-screen-loader');`,
    '💡 <b>Auto-Dismiss Guarantee:</b> Setting <code>duration: ' + duration + '</code> creates an internal timer in LumaSpinner that cleans up the full-screen overlay, DOM elements, and resets <code>document.body</code>\'s <code>aria-busy="false"</code> automatically without requiring manual <code>setTimeout</code> handling in your app.'
  );
});

// Panel User Directory
document.getElementById('btn-panel-users')?.addEventListener('click', () => {
  const id = 'panel-users-spin';
  if (spinner.isActive(id)) return;
  spinner.start({
    id,
    scope: 'container',
    container: '#panel-users',
    type: 'skeleton',
    skeleton: { variant: 'list', rows: 3, avatar: true, shimmer: true, lines: 2 },
    overlay: true,
  });
});
document.getElementById('btn-panel-users-stop')?.addEventListener('click', () => {
  spinner.stop('panel-users-spin');
});
document.getElementById('btn-code-users')?.addEventListener('click', () => {
  showCodeModal(
    'Container Scope (User List Skeleton)',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Confines the loader inside the #panel-users element
spinner.start({
  id: 'panel-users-spin',
  scope: 'container',
  container: '#panel-users', // CSS selector or HTMLElement
  type: 'skeleton',
  skeleton: {
    variant: 'list',
    rows: 3,
    avatar: true,
    lines: 2,
    shimmer: true,
  },
  overlay: true,
});

// Later when users API resolves:
spinner.stop('panel-users-spin');`,
    '💡 <b>Container Isolation:</b> LumaSpinner establishes <code>position: relative</code> on the target element so the loader cannot escape the container bounds.'
  );
});

// Panel Analytics
document.getElementById('btn-panel-analytics')?.addEventListener('click', () => {
  const id = 'panel-analytics-spin';
  if (spinner.isActive(id)) return;
  spinner.start({
    id,
    scope: 'container',
    container: '#panel-analytics',
    type: 'bars',
    text: 'Ingesting Telemetry...',
    overlay: true,
  });
});
document.getElementById('btn-panel-analytics-stop')?.addEventListener('click', () => {
  spinner.stop('panel-analytics-spin');
});
document.getElementById('btn-code-analytics')?.addEventListener('click', () => {
  showCodeModal(
    'Container Scope (Bars Loader)',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

spinner.start({
  id: 'panel-analytics-spin',
  scope: 'container',
  container: '#panel-analytics',
  type: 'bars',
  color: '#6366f1',
  text: 'Ingesting Telemetry...',
  overlay: true,
});

// Stop on ingestion complete:
spinner.stop('panel-analytics-spin');`,
    '💡 <b>Independent Control:</b> Stopping this spinner does not affect any other running container spinners.'
  );
});

// Panel Orders
document.getElementById('btn-panel-orders')?.addEventListener('click', () => {
  const id = 'panel-orders-spin';
  if (spinner.isActive(id)) return;
  spinner.start({
    id,
    scope: 'container',
    container: '#panel-orders',
    type: 'orbit',
    color: '#818cf8',
    text: 'Syncing Order Queue...',
    overlay: true,
  });
});
document.getElementById('btn-panel-orders-stop')?.addEventListener('click', () => {
  spinner.stop('panel-orders-spin');
});
document.getElementById('btn-code-orders')?.addEventListener('click', () => {
  showCodeModal(
    'Container Scope (Orbit Loader)',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

spinner.start({
  id: 'panel-orders-spin',
  scope: 'container',
  container: '#panel-orders',
  type: 'orbit',
  color: '#818cf8',
  text: 'Syncing Order Queue...',
  overlay: true,
});

spinner.stop('panel-orders-spin');`,
    '💡 <b>Custom Accent:</b> You can customize the color per-instance or rely on CSS custom property <code>--luma-color: currentColor</code>.'
  );
});

// Trigger All 3 Panels Concurrently
document.getElementById('btn-load-all')?.addEventListener('click', () => {
  document.getElementById('btn-panel-users')?.click();
  document.getElementById('btn-panel-analytics')?.click();
  document.getElementById('btn-panel-orders')?.click();
});

// Stop All
document.getElementById('btn-stop-all')?.addEventListener('click', () => {
  spinner.stop('panel-users-spin');
  spinner.stop('panel-analytics-spin');
  spinner.stop('panel-orders-spin');
  spinner.stop('page-demo');
});

// ─── 3. Skeleton Variants Showcase ─────────────────────────────────────────
const SKELETON_SNIPPETS: Record<SkeletonVariant, { code: string; tips: string }> = {
  card: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

spinner.start({
  id: 'article-card',
  type: 'skeleton',
  scope: 'container',
  container: '#card-container',
  skeleton: {
    variant: 'card',
    lines: 2,
    shimmer: true,
  },
  overlay: true,
});`,
    tips: '💡 Includes author header avatar, media cover image, title, variable-width body lines, and footer action pill.',
  },
  list: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

spinner.start({
  id: 'feed-list',
  type: 'skeleton',
  scope: 'container',
  container: '#feed-container',
  skeleton: {
    variant: 'list',
    rows: 3,
    avatar: true,
    lines: 2,
    shimmer: true,
  },
  overlay: true,
});`,
    tips: '💡 Each row includes an avatar circle, title bone, description bone, and right-aligned timestamp pill.',
  },
  profile: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

spinner.start({
  id: 'profile-header',
  type: 'skeleton',
  scope: 'container',
  container: '#profile-container',
  skeleton: {
    variant: 'profile',
    lines: 2,
    shimmer: true,
  },
  overlay: true,
});`,
    tips: '💡 Includes banner cover, horizontal avatar + action button bar, username/handle lines, bio, and bottom stats row.',
  },
  table: {
    code: `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

spinner.start({
  id: 'data-table',
  type: 'skeleton',
  scope: 'container',
  container: '#table-container',
  skeleton: {
    variant: 'table',
    rows: 4,
    shimmer: true,
  },
  overlay: true,
});`,
    tips: '💡 Grid-aligned table header with 4 columns (2fr 3.5fr 2fr 1.5fr) and alternating row cell widths.',
  },
  line: { code: '', tips: '' },
  circle: { code: '', tips: '' },
  rectangle: { code: '', tips: '' },
  avatar: { code: '', tips: '' },
};

const SKELETONS: { variant: SkeletonVariant; title: string; rows?: number; lines?: number; avatar?: boolean }[] = [
  { variant: 'card', title: 'Card Skeleton (Author + Media + Body + Pill)', lines: 2 },
  { variant: 'list', title: 'List View (Avatar + Title + Desc + Timestamp)', rows: 3, lines: 2, avatar: true },
  { variant: 'profile', title: 'Profile Header (Banner + Avatar + Handle + Stats)', lines: 2 },
  { variant: 'table', title: 'Data Table (Headers + Varied Column Cells)', rows: 4 },
];

const skeletonsGrid = document.getElementById('skeletons-grid');

SKELETONS.forEach(({ variant, title, rows, lines, avatar }) => {
  const card = document.createElement('div');
  card.className = 'card';

  const stage = document.createElement('div');
  stage.className = 'stage';
  stage.style.cssText = 'min-height: 250px; padding: 18px; align-items: stretch; justify-content: flex-start; overflow: hidden;';
  stage.id = `sk-stage-${variant}`;

  const info = document.createElement('div');
  info.innerHTML = `
    <div class="stage-title">${title}</div>
    <div class="stage-desc">GPU hardware-accelerated shimmer on translucent surfaces.</div>
  `;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const btnTry = document.createElement('button');
  btnTry.className = 'btn btn-outline btn-sm';
  btnTry.textContent = 'Simulate 3s Load';
  btnTry.onclick = () => {
    const id = `sk-demo-${variant}-${Date.now()}`;
    spinner.start({
      id,
      type: 'skeleton',
      scope: 'container',
      container: stage,
      overlay: true,
      skeleton: {
        variant,
        rows,
        lines,
        avatar,
        shimmer: true,
      },
    });
    setTimeout(() => {
      if (spinner.isActive(id)) spinner.stop(id);
    }, 3000);
  };

  const btnCode = document.createElement('button');
  btnCode.className = 'btn btn-secondary btn-sm';
  btnCode.textContent = '</> Code';
  btnCode.onclick = () => {
    const item = SKELETON_SNIPPETS[variant];
    showCodeModal(`${title} Implementation`, item.code, item.tips);
  };

  btnGroup.appendChild(btnTry);
  btnGroup.appendChild(btnCode);

  card.appendChild(stage);
  card.appendChild(info);
  card.appendChild(btnGroup);
  skeletonsGrid?.appendChild(card);

  spinner.start({
    id: `sk-ambient-${variant}`,
    type: 'skeleton',
    scope: 'container',
    container: stage,
    skeleton: {
      variant,
      rows,
      lines,
      avatar,
      shimmer: true,
    },
  });
});

// ─── 4. Inline Button Examples ─────────────────────────────────────────────
const btnInlineSubmit = document.getElementById('btn-inline-submit');
const targetInlineSubmit = document.getElementById('target-inline-submit');

btnInlineSubmit?.addEventListener('click', () => {
  if (!targetInlineSubmit) return;
  const id = 'btn-save-inline';
  if (spinner.isActive(id)) return;

  btnInlineSubmit.setAttribute('disabled', 'true');
  spinner.start({
    id,
    scope: 'inline',
    type: 'ring',
    container: targetInlineSubmit,
    size: 'small',
    color: '#ffffff',
  });

  setTimeout(() => {
    spinner.success(id, 'Saved!');
    btnInlineSubmit.removeAttribute('disabled');
  }, 2000);
});

document.getElementById('btn-code-inline-btn')?.addEventListener('click', () => {
  showCodeModal(
    'Inline Button Spinner',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

const submitBtn = document.querySelector('#submit-button');
const target = document.querySelector('#btn-spinner-slot');

// 1. Mount inline inside button flow without overlay
submitBtn.setAttribute('disabled', 'true');
const id = spinner.start({
  id: 'save-action',
  scope: 'inline',
  container: target,
  type: 'ring',
  size: 'small',
  color: '#ffffff',
});

// 2. Transition into success state
setTimeout(() => {
  spinner.success(id, 'Saved!');
  submitBtn.removeAttribute('disabled');
}, 2000);`,
    '💡 <b>No Overlay:</b> <code>scope: "inline"</code> renders directly in normal text/button flow without blocking pointer interactions.'
  );
});

const btnInlineSync = document.getElementById('btn-inline-sync');
const targetInlineSync = document.getElementById('target-inline-sync');

btnInlineSync?.addEventListener('click', () => {
  if (!targetInlineSync) return;
  const id = 'btn-sync-inline';
  if (spinner.isActive(id)) return;

  btnInlineSync.setAttribute('disabled', 'true');
  spinner.start({
    id,
    scope: 'inline',
    type: 'dots',
    container: targetInlineSync,
    size: 'small',
    color: '#818cf8',
  });

  setTimeout(() => {
    spinner.setText(id, 'Syncing...');
  }, 1000);

  setTimeout(() => {
    spinner.stop(id);
    btnInlineSync.removeAttribute('disabled');
  }, 2500);
});

document.getElementById('btn-code-inline-sync')?.addEventListener('click', () => {
  showCodeModal(
    'Inline Dots & Runtime Text Update',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

const id = spinner.start({
  id: 'sync-dots',
  scope: 'inline',
  container: '#sync-target',
  type: 'dots',
  size: 'small',
  color: '#818cf8',
});

// Update text at runtime without recreating DOM nodes
setTimeout(() => {
  spinner.setText(id, 'Syncing cloud data...');
}, 1000);

// Stop when done
setTimeout(() => {
  spinner.stop(id);
}, 2500);`,
    '💡 <b>Runtime Updates:</b> Use <code>spinner.setText(id, text)</code> or <code>spinner.update(id, options)</code> to mutate properties without restarting animations.'
  );
});

// ─── 5. Promise Wrap API ───────────────────────────────────────────────────
const btnTriggerWrap = document.getElementById('btn-trigger-wrap');
const wrapResult = document.getElementById('wrap-result');

btnTriggerWrap?.addEventListener('click', async () => {
  if (wrapResult) wrapResult.textContent = '';
  await spinner.wrap(
    'async-fetch-wrap',
    async () => {
      // Simulate real asynchronous network latency
      await new Promise((r) => setTimeout(r, 2200));
      return { status: 200, records: 142 };
    },
    {
      scope: 'container',
      container: '#panel-wrap-demo',
      type: 'ring',
      text: 'Synchronizing with remote cluster...',
      overlay: true,
    }
  );

  if (wrapResult) {
    wrapResult.textContent = '✓ Successfully received 142 records (HTTP 200 OK)';
  }
});

document.getElementById('btn-code-wrap')?.addEventListener('click', () => {
  showCodeModal(
    'Promise Wrap API (Automatic Lifecycle)',
    `import { spinner } from 'lumaspinner';
import 'lumaspinner/styles.css';

// Automatically starts spinner before the async task,
// and guarantees spinner.stop() is called whether it resolves OR rejects!
const data = await spinner.wrap(
  'fetch-records',
  async () => {
    const res = await fetch('/api/telemetry');
    if (!res.ok) throw new Error('Network failure');
    return res.json();
  },
  {
    scope: 'container',
    container: '#panel-wrap-demo',
    type: 'ring',
    text: 'Synchronizing with remote cluster...',
    overlay: true,
  }
);`,
    '💡 <b>Exception Safety:</b> Even if the wrapped promise throws an uncaught error, LumaSpinner cleans up the DOM and accessibility attributes in a guaranteed <code>finally</code> block.'
  );
});

// ─── Global Configuration Controller ───────────────────────────────────────
const cfgType = document.getElementById('cfg-type') as HTMLSelectElement | null;
const cfgSize = document.getElementById('cfg-size') as HTMLSelectElement | null;
const cfgSpeed = document.getElementById('cfg-speed') as HTMLSelectElement | null;
const cfgColorPicker = document.getElementById('cfg-color-picker') as HTMLInputElement | null;
const cfgColor = document.getElementById('cfg-color') as HTMLInputElement | null;
const cfgTextColorPicker = document.getElementById('cfg-text-color-picker') as HTMLInputElement | null;
const cfgTextColor = document.getElementById('cfg-text-color') as HTMLInputElement | null;
const cfgText = document.getElementById('cfg-text') as HTMLInputElement | null;
const cfgDuration = document.getElementById('cfg-duration') as HTMLInputElement | null;
const cfgDelay = document.getElementById('cfg-delay') as HTMLInputElement | null;
const cfgTheme = document.getElementById('cfg-theme') as HTMLSelectElement | null;
const cfgOverlay = document.getElementById('cfg-overlay') as HTMLInputElement | null;
const cfgPrevent = document.getElementById('cfg-prevent') as HTMLInputElement | null;
const statusBadge = document.getElementById('cfg-status-badge');

// Sync color inputs
cfgColorPicker?.addEventListener('input', (e) => {
  if (cfgColor) cfgColor.value = (e.target as HTMLInputElement).value;
});
cfgColor?.addEventListener('input', (e) => {
  if (cfgColorPicker) cfgColorPicker.value = (e.target as HTMLInputElement).value;
});

// Sync text color inputs
cfgTextColorPicker?.addEventListener('input', (e) => {
  if (cfgTextColor) cfgTextColor.value = (e.target as HTMLInputElement).value;
});
cfgTextColor?.addEventListener('input', (e) => {
  if (cfgTextColorPicker) cfgTextColorPicker.value = (e.target as HTMLInputElement).value;
});

function getFormConfig() {
  const sizeVal = cfgSize?.value ?? 'medium';
  const parsedSize = sizeVal === '48' ? 48 : (sizeVal as 'small' | 'medium' | 'large');
  const durationVal = parseInt(cfgDuration?.value ?? '0', 10);
  const delayVal = parseInt(cfgDelay?.value ?? '0', 10);

  return {
    type: (cfgType?.value ?? 'ring') as LoaderType,
    size: parsedSize,
    speed: (cfgSpeed?.value ?? 'normal') as 'fast' | 'normal' | 'slow',
    color: cfgColor?.value || '#6366f1',
    text: cfgText?.value ?? '',
    textColor: cfgTextColor?.value || undefined,
    duration: isNaN(durationVal) ? 0 : durationVal,
    delay: isNaN(delayVal) ? 0 : delayVal,
    theme: (cfgTheme?.value ?? 'auto') as 'auto' | 'dark' | 'light',
    overlay: cfgOverlay?.checked ?? true,
    preventInteraction: cfgPrevent?.checked ?? false,
  };
}

function updateStatusBadge(conf: ReturnType<typeof getFormConfig>) {
  if (!statusBadge) return;
  const durStr = conf.duration > 0 ? ` · ${conf.duration}ms` : '';
  statusBadge.textContent = `✓ Active: ${conf.type} · ${conf.size} · ${conf.speed} · ${conf.color}${durStr}`;
}

// Initial configuration sync on load
spinner.configure(getFormConfig());

document.getElementById('btn-apply-config')?.addEventListener('click', () => {
  const conf = getFormConfig();
  spinner.configure(conf);
  updateStatusBadge(conf);
  if (statusBadge) {
    statusBadge.style.background = 'rgba(99, 102, 241, 0.25)';
    statusBadge.style.color = '#a5b4fc';
    setTimeout(() => {
      statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      statusBadge.style.color = '#34d399';
    }, 1200);
  }
});

document.getElementById('btn-test-config')?.addEventListener('click', () => {
  // Starts a spinner using global config defaults with NO parameters!
  spinner.start();
});

document.getElementById('btn-stop-config')?.addEventListener('click', () => {
  // Stops the active spinner with NO parameters!
  spinner.stop();
});

document.getElementById('btn-reset-config')?.addEventListener('click', () => {
  spinner.resetConfig();
  if (cfgType) cfgType.value = 'ring';
  if (cfgSize) cfgSize.value = 'medium';
  if (cfgSpeed) cfgSpeed.value = 'normal';
  if (cfgColor) cfgColor.value = 'currentColor';
  if (cfgColorPicker) cfgColorPicker.value = '#6366f1';
  if (cfgText) cfgText.value = '';
  if (cfgDuration) cfgDuration.value = '0';
  if (cfgDelay) cfgDelay.value = '0';
  if (cfgTheme) cfgTheme.value = 'auto';
  if (cfgOverlay) cfgOverlay.checked = false;
  if (cfgPrevent) cfgPrevent.checked = false;
  if (statusBadge) statusBadge.textContent = '✓ Active: ring · medium · normal (Defaults)';
});

document.getElementById('btn-code-config')?.addEventListener('click', () => {
  const conf = getFormConfig();
  const code = `import { spinner, configure } from 'lumaspinner';
import 'lumaspinner/styles.css';

// 1. Configure global defaults once at app startup (e.g. main.ts / App.tsx)
spinner.configure({
  type: '${conf.type}',
  size: ${typeof conf.size === 'number' ? conf.size : `'${conf.size}'`},
  speed: '${conf.speed}',
  color: '${conf.color}',
  text: '${conf.text}',
  duration: ${conf.duration}, // ${conf.duration > 0 ? `auto-dismiss after ${conf.duration}ms` : '0 = manual stop'}
  delay: ${conf.delay},       // start delay in ms
  theme: '${conf.theme}',
  overlay: ${conf.overlay},
  preventInteraction: ${conf.preventInteraction},
});

// 2. Now call spinner.start() anywhere with zero boilerplate!
// It automatically inherits all global settings configured above:
spinner.start();

// 3. Stop whenever your async operation finishes:
spinner.stop();`;

  showCodeModal(
    'Global Configuration Setup',
    code,
    '💡 <b>Set Once, Use Everywhere:</b> Any property defined in <code>configure()</code> acts as the fallback default for all loaders. Individual <code>spinner.start({ ... })</code> calls can still override any property as needed.'
  );
});
