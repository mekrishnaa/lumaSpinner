import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';

interface InteractiveState {
  score: number;
  combo: number;
  lastPopTime: number;
  cleanups: Array<() => void>;
  timers: Set<ReturnType<typeof setTimeout>>;
}

const stateMap = new WeakMap<HTMLElement, InteractiveState>();

const BUBBLE_ICONS = ['🫧', '🎈', '⭐', '💎', '🍬', '✨', '⚡'];



export const interactiveLoader: LoaderDefinition = {
  name: 'interactive',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const rawSize = getSizeValue(options.size);
    const scale = rawSize / 36; // scale relative to normal 36px spinner
    const arenaWidth = Math.max(180, Math.min(320, Math.round(220 * scale)));
    const arenaHeight = Math.max(120, Math.min(220, Math.round(140 * scale)));
    const bubbleSize = Math.max(24, Math.min(42, Math.round(30 * scale)));

    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--interactive luma-loader luma-loader--interactive';
    root.style.setProperty('--luma-spinner-color', options.color);
    root.style.setProperty('--luma-color', options.color);
    root.style.setProperty('--luma-spinner-speed', getSpeed(options.speed, '2s', '5s', '3.2s'));
    root.style.setProperty('--luma-speed', getSpeed(options.speed, '2s', '5s', '3.2s'));
    root.style.setProperty('--luma-spinner-arena-w', `${arenaWidth}px`);
    root.style.setProperty('--luma-arena-w', `${arenaWidth}px`);
    root.style.setProperty('--luma-spinner-arena-h', `${arenaHeight}px`);
    root.style.setProperty('--luma-arena-h', `${arenaHeight}px`);
    root.style.setProperty('--luma-spinner-bubble-size', `${bubbleSize}px`);
    root.style.setProperty('--luma-bubble-size', `${bubbleSize}px`);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Interactive mini-game while waiting');

    // Header bar with live score and status message
    const header = document.createElement('div');
    header.className = 'luma-spinner-interactive__header luma-interactive__header';

    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'luma-spinner-interactive__badge luma-interactive__badge';
    scoreBadge.innerHTML = '🎯 <span class="luma-spinner-interactive__score-num luma-interactive__score-num">0</span>';

    const statusBadge = document.createElement('div');
    statusBadge.className = 'luma-spinner-interactive__status luma-interactive__status';
    statusBadge.textContent = 'Tap bubbles to pop!';

    header.appendChild(scoreBadge);
    header.appendChild(statusBadge);
    root.appendChild(header);

    // Arena container
    const arena = document.createElement('div');
    arena.className = 'luma-spinner-interactive__arena luma-interactive__arena';
    arena.tabIndex = 0;
    arena.setAttribute('role', 'button');
    arena.setAttribute('aria-label', 'Click or tap floating bubbles to pop them');

    const state: InteractiveState = {
      score: 0,
      combo: 0,
      lastPopTime: 0,
      cleanups: [],
      timers: new Set(),
    };
    stateMap.set(root, state);

    const scoreNumEl = scoreBadge.querySelector<HTMLElement>('.luma-interactive__score-num')!;

    // Create 6 floating bubbles
    const bubbleCount = 6;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = createBubble(i, bubbleCount, arenaWidth);
      arena.appendChild(bubble);
    }

    // Helper to spawn floating +1 indicator at click position
    const showFloater = (x: number, y: number, text: string) => {
      const floater = document.createElement('div');
      floater.className = 'luma-interactive__floater';
      floater.textContent = text;
      floater.style.left = `${x}px`;
      floater.style.top = `${y}px`;
      arena.appendChild(floater);
      const timer = setTimeout(() => {
        state.timers.delete(timer);
        floater.remove();
      }, 700);
      state.timers.add(timer);
    };

    // Bubble pop handler
    const popBubble = (bubbleEl: HTMLElement, clickX?: number, clickY?: number) => {
      if (bubbleEl.dataset['popping'] === 'true') return;
      bubbleEl.dataset['popping'] = 'true';

      state.score += 1;
      const now = Date.now();
      if (now - state.lastPopTime < 1200) {
        state.combo += 1;
      } else {
        state.combo = 1;
      }
      state.lastPopTime = now;

      // Haptic feedback if supported
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(10);
        }
      } catch {
        // Safe ignore
      }

      // Update score display
      scoreNumEl.textContent = String(state.score);
      scoreBadge.classList.add('luma-interactive__badge--bounce');
      const bounceTimer = setTimeout(() => {
        state.timers.delete(bounceTimer);
        scoreBadge.classList.remove('luma-interactive__badge--bounce');
      }, 300);
      state.timers.add(bounceTimer);

      // Update status feedback based on score & combo
      if (state.combo >= 4) {
        statusBadge.textContent = `Combo x${state.combo}! 🔥`;
      } else if (state.score >= 20) {
        statusBadge.textContent = 'Unstoppable! 🚀🎉';
      } else if (state.score >= 10) {
        statusBadge.textContent = 'Bubble Master! ⚡';
      } else if (state.score >= 5) {
        statusBadge.textContent = 'Great reflexes! ✨';
      } else {
        statusBadge.textContent = 'Nice pop! 🎈';
      }

      // Floater text
      const arenaRect = arena.getBoundingClientRect();
      const fx = clickX !== undefined ? clickX - arenaRect.left : parseFloat(bubbleEl.style.left) || 20;
      const fy = clickY !== undefined ? clickY - arenaRect.top : 40;
      const floatText = state.combo >= 3 ? `+${state.combo} 🔥` : '+1';
      showFloater(fx, fy, floatText);

      // Add pop animation class
      bubbleEl.classList.add('luma-interactive__bubble--popped');

      // Respawn bubble at bottom after pop animation finishes
      const respawnTimer = setTimeout(() => {
        state.timers.delete(respawnTimer);
        delete bubbleEl.dataset['popping'];
        bubbleEl.classList.remove('luma-interactive__bubble--popped');

        // Randomize icon and new horizontal track
        const icon = BUBBLE_ICONS[Math.floor(Math.random() * BUBBLE_ICONS.length)];
        bubbleEl.textContent = icon;
        const newLeft = 10 + Math.random() * (arenaWidth - bubbleSize - 20);
        bubbleEl.style.left = `${newLeft}px`;

        // Restart animation
        bubbleEl.style.animation = 'none';
        void bubbleEl.offsetHeight; // trigger reflow
        const duration = (2.2 + Math.random() * 1.6).toFixed(2);
        bubbleEl.style.animation = `luma-bubble-float ${duration}s infinite linear`;
      }, 350);
      state.timers.add(respawnTimer);
    };

    // Pointer event listener on arena
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('.luma-interactive__bubble') as HTMLElement | null;
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        let cx: number | undefined;
        let cy: number | undefined;
        if ('clientX' in e) {
          cx = (e as MouseEvent).clientX;
          cy = (e as MouseEvent).clientY;
        } else if ('touches' in e && (e as TouchEvent).touches.length > 0) {
          cx = (e as TouchEvent).touches[0].clientX;
          cy = (e as TouchEvent).touches[0].clientY;
        }
        popBubble(target, cx, cy);
      }
    };

    // Keyboard support: Space/Enter pops the first available bubble
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const bubbles = Array.from(arena.querySelectorAll<HTMLElement>('.luma-interactive__bubble:not([data-popping="true"])'));
        if (bubbles.length > 0) {
          const randomBubble = bubbles[Math.floor(Math.random() * bubbles.length)];
          popBubble(randomBubble);
        }
      }
    };

    arena.addEventListener('pointerdown', handlePointerDown);
    arena.addEventListener('keydown', handleKeyDown);

    state.cleanups.push(() => {
      arena.removeEventListener('pointerdown', handlePointerDown);
      arena.removeEventListener('keydown', handleKeyDown);
    });

    root.appendChild(arena);

    // Subtitle helper
    const hint = document.createElement('div');
    hint.className = 'luma-spinner-interactive__hint luma-interactive__hint';
    hint.textContent = 'Pop bubbles while you wait! ⏳';
    root.appendChild(hint);

    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    element.style.setProperty('--luma-spinner-color', options.color);
    element.style.setProperty('--luma-color', options.color);
    element.style.setProperty('--luma-spinner-speed', getSpeed(options.speed, '2s', '5s', '3.2s'));
    element.style.setProperty('--luma-speed', getSpeed(options.speed, '2s', '5s', '3.2s'));
  },

  destroy(element: HTMLElement): void {
    const state = stateMap.get(element);
    if (state) {
      state.cleanups.forEach((fn) => fn());
      state.cleanups = [];
      state.timers.forEach((t) => clearTimeout(t));
      state.timers.clear();
      stateMap.delete(element);
    }
  },
};

function createBubble(index: number, total: number, arenaWidth: number): HTMLElement {
  const bubble = document.createElement('div');
  bubble.className = 'luma-spinner-interactive__bubble luma-interactive__bubble';
  bubble.setAttribute('role', 'button');
  bubble.setAttribute('aria-label', 'Bubble');

  const icon = BUBBLE_ICONS[index % BUBBLE_ICONS.length];
  bubble.textContent = icon;

  // Staggered horizontal positioning
  const leftPct = 8 + (index / (total - 1 || 1)) * 74 + (Math.random() * 8 - 4);
  bubble.style.left = `${Math.max(5, Math.min(arenaWidth - 35, (leftPct / 100) * arenaWidth))}px`;

  // Staggered animation delay
  const delay = (index * 0.45).toFixed(2);
  const duration = (2.4 + (index % 3) * 0.5).toFixed(2);
  bubble.style.animation = `luma-bubble-float ${duration}s infinite linear`;
  bubble.style.animationDelay = `${delay}s`;

  return bubble;
}

