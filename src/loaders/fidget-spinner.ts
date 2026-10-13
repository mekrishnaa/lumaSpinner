import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

interface FidgetState {
  angle: number;
  velocity: number;
  totalSpins: number;
  lastAngle: number;
  rafId: number | null;
  cleanups: Array<() => void>;
  timers: Set<ReturnType<typeof setTimeout>>;
}

const stateMap = new WeakMap<HTMLElement, FidgetState>();

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '1.5s';
    case 'slow': return '4s';
    default: return '2.5s';
  }
}

export const fidgetSpinnerLoader: LoaderDefinition = {
  name: 'fidget-spinner',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const rawSize = getSizeValue(options.size);
    const scale = rawSize / 36;
    const stageSize = Math.max(160, Math.min(260, Math.round(180 * scale)));
    const rotorSize = Math.max(120, Math.min(200, Math.round(140 * scale)));

    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--fidget-spinner luma-loader luma-loader--fidget-spinner';
    setLoaderStyles(root, { size: rawSize, color: options.color, speed: getSpeed(options.speed) });
    root.style.setProperty('--luma-spinner-fidget-stage-size', `${stageSize}px`);
    root.style.setProperty('--luma-fidget-stage-size', `${stageSize}px`);
    root.style.setProperty('--luma-spinner-fidget-rotor-size', `${rotorSize}px`);
    root.style.setProperty('--luma-fidget-rotor-size', `${rotorSize}px`);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Interactive fidget spinner');

    // Header bar with RPM badge & status text
    const header = document.createElement('div');
    header.className = 'luma-spinner-fidget__header luma-fidget__header';

    const rpmBadge = document.createElement('div');
    rpmBadge.className = 'luma-spinner-fidget__badge luma-fidget__badge';
    rpmBadge.innerHTML = '⚡ <span class="luma-spinner-fidget__rpm luma-fidget__rpm">120 RPM</span>';

    const statusBadge = document.createElement('div');
    statusBadge.className = 'luma-spinner-fidget__status luma-fidget__status';
    statusBadge.textContent = 'Flick or tap to spin!';

    header.appendChild(rpmBadge);
    header.appendChild(statusBadge);
    root.appendChild(header);

    // Interactive Stage Arena
    const stage = document.createElement('div');
    stage.className = 'luma-spinner-fidget__stage luma-fidget__stage';
    stage.tabIndex = 0;
    stage.setAttribute('role', 'button');
    stage.setAttribute('aria-label', 'Click, flick, or press Space to spin the fidget');

    // Fidget Rotor Container
    const rotor = document.createElement('div');
    rotor.className = 'luma-spinner-fidget__rotor luma-fidget__rotor';

    // 3 Tri-Blades
    for (let i = 0; i < 3; i++) {
      const blade = document.createElement('div');
      blade.className = `luma-spinner-fidget__blade luma-fidget__blade luma-spinner-fidget__blade--${i + 1}`;
      blade.style.transform = `rotate(${i * 120}deg)`;

      const weight = document.createElement('div');
      weight.className = 'luma-spinner-fidget__blade-weight luma-fidget__blade-weight';
      blade.appendChild(weight);

      rotor.appendChild(blade);
    }

    // Center Bearing Core
    const core = document.createElement('div');
    core.className = 'luma-spinner-fidget__core luma-fidget__core';
    rotor.appendChild(core);

    stage.appendChild(rotor);
    root.appendChild(stage);

    // Subtitle Hint
    const hint = document.createElement('div');
    hint.className = 'luma-spinner-fidget__hint luma-fidget__hint';
    hint.textContent = 'Click / Drag to spin faster 🌀';
    root.appendChild(hint);

    // Physics & Interaction State
    const state: FidgetState = {
      angle: 0,
      velocity: 2.5, // baseline idle spin
      totalSpins: 0,
      lastAngle: 0,
      rafId: null,
      cleanups: [],
      timers: new Set(),
    };
    stateMap.set(root, state);

    const rpmNumEl = rpmBadge.querySelector<HTMLElement>('.luma-fidget__rpm')!;

    // Animation & Physics Loop
    let lastTime = performance.now();
    const updatePhysics = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 16.666; // normalize to 60fps
      lastTime = now;

      state.angle = (state.angle + state.velocity * dt) % 360;
      rotor.style.transform = `rotate(${state.angle.toFixed(2)}deg)`;

      // Friction towards minimum cruising speed (1.5 deg/frame)
      const baseSpeed = 1.8;
      if (Math.abs(state.velocity) > baseSpeed) {
        state.velocity *= Math.pow(0.988, dt);
      } else {
        state.velocity = baseSpeed;
      }

      // Compute estimated RPM (degrees/frame * 60fps * 60s / 360deg)
      const currentRpm = Math.round((Math.abs(state.velocity) * 60 * 60) / 360);
      rpmNumEl.textContent = `${currentRpm} RPM`;

      // Status messages based on speed tier
      if (currentRpm > 1200) {
        statusBadge.textContent = '🌟 SUPERNOVA SPINS!';
        rpmBadge.classList.add('luma-spinner-fidget__badge--hyper');
      } else if (currentRpm > 600) {
        statusBadge.textContent = '🔥 Hyperspeed!';
        rpmBadge.classList.add('luma-spinner-fidget__badge--fast');
        rpmBadge.classList.remove('luma-spinner-fidget__badge--hyper');
      } else if (currentRpm > 250) {
        statusBadge.textContent = '⚡ Blazing fast!';
        rpmBadge.classList.remove('luma-spinner-fidget__badge--fast', 'luma-spinner-fidget__badge--hyper');
      } else {
        statusBadge.textContent = 'Tap or flick to spin!';
        rpmBadge.classList.remove('luma-spinner-fidget__badge--fast', 'luma-spinner-fidget__badge--hyper');
      }

      state.rafId = requestAnimationFrame(updatePhysics);
    };

    state.rafId = requestAnimationFrame(updatePhysics);

    // Pointer Drag / Flick Interaction
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastPointerTime = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      lastPointerTime = performance.now();
      stage.setPointerCapture(e.pointerId);

      // Instant boost on click
      state.velocity += 12;
      stage.classList.add('luma-spinner-fidget__stage--pressed');
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('luma-spinner-fidget__stage--pressed');

      const dt = Math.max(16, performance.now() - lastPointerTime);
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        // Flick boost proportional to swipe velocity
        const flickSpeed = Math.min(38, (dist / dt) * 16);
        state.velocity += flickSpeed;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        state.velocity += 14;
        rpmBadge.classList.add('luma-spinner-fidget__badge--bounce');
        const t = setTimeout(() => {
          state.timers.delete(t);
          rpmBadge.classList.remove('luma-spinner-fidget__badge--bounce');
        }, 150);
        state.timers.add(t);
      }
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('keydown', onKeyDown);

    state.cleanups.push(() => {
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerUp);
      stage.removeEventListener('keydown', onKeyDown);
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    });

    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const rawSize = getSizeValue(options.size);
    const scale = rawSize / 36;
    const stageSize = Math.max(160, Math.min(260, Math.round(180 * scale)));
    const rotorSize = Math.max(120, Math.min(200, Math.round(140 * scale)));
    setLoaderStyles(element, { size: rawSize, color: options.color, speed: getSpeed(options.speed) });
    element.style.setProperty('--luma-spinner-fidget-stage-size', `${stageSize}px`);
    element.style.setProperty('--luma-fidget-stage-size', `${stageSize}px`);
    element.style.setProperty('--luma-spinner-fidget-rotor-size', `${rotorSize}px`);
    element.style.setProperty('--luma-fidget-rotor-size', `${rotorSize}px`);
  },

  destroy(element: HTMLElement): void {
    const state = stateMap.get(element);
    if (state) {
      state.cleanups.forEach((fn) => fn());
      state.cleanups = [];
      state.timers.forEach((t) => clearTimeout(t));
      state.timers.clear();
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
      stateMap.delete(element);
    }
  },
};
