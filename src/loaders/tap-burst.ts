import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

interface TapBurstState {
  taps: number;
  energy: number;
  combo: number;
  lastTapTime: number;
  decayTimer: ReturnType<typeof setInterval> | null;
  cleanups: Array<() => void>;
  timers: Set<ReturnType<typeof setTimeout>>;
}

const stateMap = new WeakMap<HTMLElement, TapBurstState>();



export const tapBurstLoader: LoaderDefinition = {
  name: 'tap-burst',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const rawSize = getSizeValue(options.size);
    const scale = rawSize / 36;
    const orbSize = Math.max(64, Math.min(110, Math.round(80 * scale)));

    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--tap-burst luma-loader luma-loader--tap-burst';
    setLoaderStyles(root, { size: rawSize, color: options.color, speed: getSpeed(options.speed, '1.5s', '4s', '2.5s') });
    root.style.setProperty('--luma-spinner-tapburst-size', `${orbSize}px`);
    root.style.setProperty('--luma-tapburst-size', `${orbSize}px`);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Interactive cosmic energy tap burst');

    // Header bar with energy status & combo streak
    const header = document.createElement('div');
    header.className = 'luma-spinner-tapburst__header luma-tapburst__header';

    const energyBadge = document.createElement('div');
    energyBadge.className = 'luma-spinner-tapburst__badge luma-tapburst__badge';
    energyBadge.innerHTML = '⚡ <span class="luma-spinner-tapburst__pct luma-tapburst__pct">0%</span> Energy';

    const statusBadge = document.createElement('div');
    statusBadge.className = 'luma-spinner-tapburst__status luma-tapburst__status';
    statusBadge.textContent = 'Tap orb to charge!';

    header.appendChild(energyBadge);
    header.appendChild(statusBadge);
    root.appendChild(header);

    // Arena Stage
    const stage = document.createElement('div');
    stage.className = 'luma-spinner-tapburst__stage luma-tapburst__stage';
    stage.tabIndex = 0;
    stage.setAttribute('role', 'button');
    stage.setAttribute('aria-label', 'Click or press Space repeatedly to charge the core');

    // Orbital Containment Ring
    const ring = document.createElement('div');
    ring.className = 'luma-spinner-tapburst__ring luma-tapburst__ring';
    stage.appendChild(ring);

    // Glowing Central Core Orb
    const orb = document.createElement('div');
    orb.className = 'luma-spinner-tapburst__orb luma-tapburst__orb';

    const corePulse = document.createElement('div');
    corePulse.className = 'luma-spinner-tapburst__core-inner luma-tapburst__core-inner';
    orb.appendChild(corePulse);

    stage.appendChild(orb);
    root.appendChild(stage);

    // Subtitle Hint
    const hint = document.createElement('div');
    hint.className = 'luma-spinner-tapburst__hint luma-tapburst__hint';
    hint.textContent = 'Rapid clicks trigger Supernova 💥';
    root.appendChild(hint);

    const state: TapBurstState = {
      taps: 0,
      energy: 0,
      combo: 0,
      lastTapTime: 0,
      decayTimer: null,
      cleanups: [],
      timers: new Set(),
    };
    stateMap.set(root, state);

    const pctNumEl = energyBadge.querySelector<HTMLElement>('.luma-tapburst__pct')!;

    // Tap action handler
    const handleTap = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - state.lastTapTime < 900) {
        state.combo += 1;
      } else {
        state.combo = 1;
      }
      state.lastTapTime = now;
      state.taps += 1;

      // Energy increases per tap
      state.energy = Math.min(100, state.energy + Math.min(18, 8 + state.combo * 2));
      pctNumEl.textContent = `${Math.round(state.energy)}%`;

      // Visual scale pulse on orb
      orb.classList.remove('luma-spinner-tapburst__orb--pulse');
      void orb.offsetWidth; // reflow
      orb.classList.add('luma-spinner-tapburst__orb--pulse');

      // Spawn shockwave ring
      const shockwave = document.createElement('div');
      shockwave.className = 'luma-spinner-tapburst__shockwave luma-tapburst__shockwave';
      stage.appendChild(shockwave);
      const t1 = setTimeout(() => {
        state.timers.delete(t1);
        shockwave.remove();
      }, 600);
      state.timers.add(t1);

      // Status text updates
      if (state.energy >= 100) {
        statusBadge.textContent = '🌟 SUPERNOVA OVERLOAD!';
        energyBadge.classList.add('luma-spinner-tapburst__badge--overload');

        // Reset after explosion
        const t2 = setTimeout(() => {
          state.timers.delete(t2);
          state.energy = 20;
          pctNumEl.textContent = '20%';
          energyBadge.classList.remove('luma-spinner-tapburst__badge--overload');
          statusBadge.textContent = 'Core recharged! Tap again!';
        }, 800);
        state.timers.add(t2);
      } else if (state.combo >= 8) {
        statusBadge.textContent = `🔥 ${state.combo}x ULTRA COMBO!`;
      } else if (state.combo >= 4) {
        statusBadge.textContent = `⚡ ${state.combo}x Combo!`;
      } else {
        statusBadge.textContent = 'Charging core...';
      }
    };

    // Gradual energy decay
    state.decayTimer = setInterval(() => {
      if (performance.now() - state.lastTapTime > 1200 && state.energy > 0) {
        state.energy = Math.max(0, state.energy - 3);
        pctNumEl.textContent = `${Math.round(state.energy)}%`;
        if (state.energy === 0) {
          statusBadge.textContent = 'Tap orb to charge!';
        }
      }
    }, 200);

    const onTriggerTap = (e: MouseEvent | PointerEvent) => {
      handleTap(e.clientX, e.clientY);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const rect = stage.getBoundingClientRect();
        handleTap(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    };

    stage.addEventListener('pointerdown', onTriggerTap);
    stage.addEventListener('mousedown', onTriggerTap);
    stage.addEventListener('keydown', onKeyDown);

    state.cleanups.push(() => {
      stage.removeEventListener('pointerdown', onTriggerTap);
      stage.removeEventListener('mousedown', onTriggerTap);
      stage.removeEventListener('keydown', onKeyDown);
      if (state.decayTimer) {
        clearInterval(state.decayTimer);
        state.decayTimer = null;
      }
    });

    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const rawSize = getSizeValue(options.size);
    setLoaderStyles(element, { size: rawSize, color: options.color });
  },

  destroy(element: HTMLElement): void {
    const state = stateMap.get(element);
    if (state) {
      state.cleanups.forEach((fn) => fn());
      state.cleanups = [];
      state.timers.forEach((t) => clearTimeout(t));
      state.timers.clear();
      if (state.decayTimer) {
        clearInterval(state.decayTimer);
        state.decayTimer = null;
      }
      stateMap.delete(element);
    }
  },
};
