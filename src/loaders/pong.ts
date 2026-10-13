import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

interface PongState {
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  paddleX: number;
  rallies: number;
  lastInteraction: number;
  rafId: number | null;
  cleanups: Array<() => void>;
  timers: Set<ReturnType<typeof setTimeout>>;
}

const stateMap = new WeakMap<HTMLElement, PongState>();

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '1.5s';
    case 'slow': return '4s';
    default: return '2.5s';
  }
}

export const pongLoader: LoaderDefinition = {
  name: 'pong',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const rawSize = getSizeValue(options.size);
    const scale = rawSize / 36;
    const arenaW = Math.max(180, Math.min(280, Math.round(210 * scale)));
    const arenaH = Math.max(120, Math.min(200, Math.round(135 * scale)));
    const paddleW = Math.max(38, Math.min(60, Math.round(46 * scale)));
    const paddleH = 7;
    const ballR = 5;

    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--pong luma-loader luma-loader--pong';
    setLoaderStyles(root, { size: rawSize, color: options.color, speed: getSpeed(options.speed) });
    root.style.setProperty('--luma-spinner-pong-w', `${arenaW}px`);
    root.style.setProperty('--luma-pong-w', `${arenaW}px`);
    root.style.setProperty('--luma-spinner-pong-h', `${arenaH}px`);
    root.style.setProperty('--luma-pong-h', `${arenaH}px`);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Interactive mini-pong game');

    // Header bar with rally count & status
    const header = document.createElement('div');
    header.className = 'luma-spinner-pong__header luma-pong__header';

    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'luma-spinner-pong__badge luma-pong__badge';
    scoreBadge.innerHTML = '🏓 <span class="luma-spinner-pong__score luma-pong__score">0</span> Rallies';

    const statusBadge = document.createElement('div');
    statusBadge.className = 'luma-spinner-pong__status luma-pong__status';
    statusBadge.textContent = 'Slide paddle to bounce!';

    header.appendChild(scoreBadge);
    header.appendChild(statusBadge);
    root.appendChild(header);

    // Arena container
    const arena = document.createElement('div');
    arena.className = 'luma-spinner-pong__arena luma-pong__arena';
    arena.tabIndex = 0;
    arena.setAttribute('role', 'button');
    arena.setAttribute('aria-label', 'Control paddle with mouse or touch');

    // Glowing Neon Ball
    const ball = document.createElement('div');
    ball.className = 'luma-spinner-pong__ball luma-pong__ball';
    arena.appendChild(ball);

    // Player Paddle
    const paddle = document.createElement('div');
    paddle.className = 'luma-spinner-pong__paddle luma-pong__paddle';
    arena.appendChild(paddle);

    root.appendChild(arena);

    // Subtitle Hint
    const hint = document.createElement('div');
    hint.className = 'luma-spinner-pong__hint luma-pong__hint';
    hint.textContent = 'Keep the rally going! ⚡';
    root.appendChild(hint);

    // Game Physics State
    const state: PongState = {
      ballX: arenaW / 2,
      ballY: 20,
      ballVx: 2.2,
      ballVy: 2.5,
      paddleX: arenaW / 2 - paddleW / 2,
      rallies: 0,
      lastInteraction: 0,
      rafId: null,
      cleanups: [],
      timers: new Set(),
    };
    stateMap.set(root, state);

    const scoreNumEl = scoreBadge.querySelector<HTMLElement>('.luma-pong__score')!;

    // Animation & Game Loop
    let lastTime = performance.now();
    const gameLoop = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 16.666;
      lastTime = now;

      // Autoplay AI when user is idle for >2.5s
      const isUserActive = performance.now() - state.lastInteraction < 2500;
      if (!isUserActive) {
        // Smoothly steer paddle towards ball center
        const targetPaddleX = state.ballX - paddleW / 2;
        state.paddleX += (targetPaddleX - state.paddleX) * 0.12 * dt;
      }

      // Clamp paddle inside arena bounds
      state.paddleX = Math.max(2, Math.min(arenaW - paddleW - 2, state.paddleX));
      paddle.style.transform = `translateX(${state.paddleX.toFixed(1)}px)`;

      // Move ball
      state.ballX += state.ballVx * dt;
      state.ballY += state.ballVy * dt;

      // Bounce off Left & Right walls
      if (state.ballX <= ballR) {
        state.ballX = ballR;
        state.ballVx = Math.abs(state.ballVx);
      } else if (state.ballX >= arenaW - ballR) {
        state.ballX = arenaW - ballR;
        state.ballVx = -Math.abs(state.ballVx);
      }

      // Bounce off Top ceiling
      if (state.ballY <= ballR) {
        state.ballY = ballR;
        state.ballVy = Math.abs(state.ballVy);
      }

      // Paddle Collision (paddle is at y = arenaH - paddleH - 8)
      const paddleY = arenaH - paddleH - 8;
      if (
        state.ballY >= paddleY - ballR &&
        state.ballY <= paddleY + paddleH &&
        state.ballVy > 0 &&
        state.ballX >= state.paddleX - 4 &&
        state.ballX <= state.paddleX + paddleW + 4
      ) {
        // Successful return!
        state.ballY = paddleY - ballR;
        state.ballVy = -Math.abs(state.ballVy);

        // Adjust horizontal angle depending on impact offset from center
        const hitOffset = (state.ballX - (state.paddleX + paddleW / 2)) / (paddleW / 2);
        state.ballVx = hitOffset * 3.2;

        state.rallies += 1;
        scoreNumEl.textContent = `${state.rallies}`;

        scoreBadge.classList.add('luma-spinner-pong__badge--bounce');
        const t = setTimeout(() => {
          state.timers.delete(t);
          scoreBadge.classList.remove('luma-spinner-pong__badge--bounce');
        }, 150);
        state.timers.add(t);

        // Update status encouragement
        if (state.rallies >= 15) {
          statusBadge.textContent = '🔥 Grandmaster Rally!';
        } else if (state.rallies >= 8) {
          statusBadge.textContent = '⚡ On Fire!';
        } else {
          statusBadge.textContent = 'Great bounce! Keep going!';
        }
      }

      // Ball missed bottom - reset rally streak & soft launch from top
      if (state.ballY > arenaH + 10) {
        state.ballX = arenaW / 2;
        state.ballY = 16;
        state.ballVy = 2.4;
        state.ballVx = (Math.random() - 0.5) * 3;
        if (state.rallies > 0) {
          state.rallies = 0;
          scoreNumEl.textContent = '0';
          statusBadge.textContent = 'Missed! Keep practicing!';
        }
      }

      ball.style.transform = `translate(${state.ballX.toFixed(1)}px, ${state.ballY.toFixed(1)}px)`;

      state.rafId = requestAnimationFrame(gameLoop);
    };

    state.rafId = requestAnimationFrame(gameLoop);

    // Pointer tracking
    const onPointerMove = (e: PointerEvent) => {
      const rect = arena.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      state.paddleX = relX - paddleW / 2;
      state.lastInteraction = performance.now();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const step = 20;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        state.paddleX -= step;
        state.lastInteraction = performance.now();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        state.paddleX += step;
        state.lastInteraction = performance.now();
      }
      state.paddleX = Math.max(2, Math.min(arenaW - paddleW - 2, state.paddleX));
      paddle.style.transform = `translateX(${state.paddleX.toFixed(1)}px)`;
    };

    arena.addEventListener('pointermove', onPointerMove);
    arena.addEventListener('pointerdown', onPointerMove);
    arena.addEventListener('keydown', onKeyDown);

    state.cleanups.push(() => {
      arena.removeEventListener('pointermove', onPointerMove);
      arena.removeEventListener('pointerdown', onPointerMove);
      arena.removeEventListener('keydown', onKeyDown);
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
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
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
      stateMap.delete(element);
    }
  },
};
