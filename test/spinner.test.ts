import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { spinner } from '../src/core/spinner-manager.js';
import { resetConfig } from '../src/core/configuration.js';

// Reset state between tests
beforeEach(() => {
  document.body.innerHTML = '';
  spinner.stopAll();
  resetConfig();
});

afterEach(() => {
  spinner.stopAll();
});

describe('spinner.start()', () => {
  it('returns a string ID', () => {
    const id = spinner.start();
    expect(typeof id).toBe('string');
    spinner.stop(id);
  });

  it('uses a provided custom ID', () => {
    const id = spinner.start({ id: 'my-custom-id' });
    expect(id).toBe('my-custom-id');
    spinner.stop(id);
  });

  it('throws if the same ID is started twice', () => {
    spinner.start({ id: 'dup' });
    expect(() => spinner.start({ id: 'dup' })).toThrow(/already exists/);
    spinner.stop('dup');
  });

  it('appends a wrapper element to document.body for page scope', () => {
    const id = spinner.start({ scope: 'page' });
    const el = document.body.querySelector('.luma-spinner--page');
    expect(el).not.toBeNull();
    spinner.stop(id);
  });

  it('removes the element from DOM after stop()', () => {
    const id = spinner.start({ scope: 'page' });
    spinner.stop(id);
    const el = document.body.querySelector('.luma-spinner--page');
    expect(el).toBeNull();
  });

  it('renders the ring loader by default', () => {
    const id = spinner.start();
    const loaderEl = document.body.querySelector('.luma-loader--ring');
    expect(loaderEl).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the dots loader when requested', () => {
    const id = spinner.start({ type: 'dots' });
    const loaderEl = document.body.querySelector('.luma-loader--dots');
    expect(loaderEl).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the pulse loader when requested', () => {
    const id = spinner.start({ type: 'pulse' });
    expect(document.body.querySelector('.luma-loader--pulse')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the bars loader when requested', () => {
    const id = spinner.start({ type: 'bars' });
    expect(document.body.querySelector('.luma-loader--bars')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the wave loader when requested', () => {
    const id = spinner.start({ type: 'wave' });
    expect(document.body.querySelector('.luma-loader--wave')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the orbit loader when requested', () => {
    const id = spinner.start({ type: 'orbit' });
    expect(document.body.querySelector('.luma-loader--orbit')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the square loader when requested', () => {
    const id = spinner.start({ type: 'square' });
    expect(document.body.querySelector('.luma-loader--square')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the skeleton loader when requested', () => {
    const id = spinner.start({ type: 'skeleton' });
    expect(document.body.querySelector('.luma-loader--skeleton')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the dual-ring loader when requested', () => {
    const id = spinner.start({ type: 'dual-ring' });
    expect(document.body.querySelector('.luma-loader--dual-ring')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the ripple loader when requested', () => {
    const id = spinner.start({ type: 'ripple' });
    expect(document.body.querySelector('.luma-loader--ripple')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the cube-grid loader when requested', () => {
    const id = spinner.start({ type: 'cube-grid' });
    expect(document.body.querySelector('.luma-loader--cube-grid')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the roller loader when requested', () => {
    const id = spinner.start({ type: 'roller' });
    expect(document.body.querySelector('.luma-loader--roller')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the fading-circle loader with 12 sequential fading segments', () => {
    const id = spinner.start({ type: 'fading-circle' });
    const loader = document.body.querySelector('.luma-loader--fading-circle');
    expect(loader).not.toBeNull();
    const blades = document.body.querySelectorAll('.luma-loader__fading-blade');
    expect(blades).toHaveLength(12);
    const segments = document.body.querySelectorAll('.luma-loader__fading-segment');
    expect(segments).toHaveLength(12);
    // Ensure sequential delays exist
    expect((segments[0] as HTMLElement).style.animationDelay).toBe('-1.099s');
    expect((segments[11] as HTMLElement).style.animationDelay).toBe('-0.092s');
    spinner.stop(id);
  });

  it('renders the chasing-dots loader when requested', () => {
    const id = spinner.start({ type: 'chasing-dots' });
    expect(document.body.querySelector('.luma-loader--chasing-dots')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the hourglass loader when requested', () => {
    const id = spinner.start({ type: 'hourglass' });
    expect(document.body.querySelector('.luma-loader--hourglass')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the heart loader with custom color', () => {
    const id = spinner.start({ type: 'heart', color: '#ef4444' });
    const heart = document.body.querySelector<HTMLElement>('.luma-loader--heart');
    expect(heart).not.toBeNull();
    expect(heart?.style.getPropertyValue('--luma-color')).toBe('#ef4444');
    spinner.stop(id);
  });

  it('renders the infinity loader with SVG track and continuous revolving beam', () => {
    const id = spinner.start({ type: 'infinity' });
    expect(document.body.querySelector('.luma-loader--infinity')).not.toBeNull();
    const svg = document.body.querySelector('.luma-loader__infinity-svg');
    expect(svg).not.toBeNull();
    expect(document.body.querySelector('.luma-loader__infinity-track')).not.toBeNull();
    const beam = document.body.querySelector('.luma-loader__infinity-beam');
    expect(beam).not.toBeNull();
    expect(beam?.getAttribute('pathLength')).toBe('100');
    spinner.stop(id);
  });

  it('renders the dna loader when requested', () => {
    const id = spinner.start({ type: 'dna' });
    expect(document.body.querySelector('.luma-loader--dna')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the wandering-cubes loader when requested', () => {
    const id = spinner.start({ type: 'wandering-cubes' });
    expect(document.body.querySelector('.luma-loader--wandering-cubes')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the folding-cube loader when requested', () => {
    const id = spinner.start({ type: 'folding-cube' });
    expect(document.body.querySelector('.luma-loader--folding-cube')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the circle loader when requested', () => {
    const id = spinner.start({ type: 'circle' });
    expect(document.body.querySelector('.luma-loader--circle')).not.toBeNull();
    expect(document.body.querySelectorAll('.luma-loader__circle-dot')).toHaveLength(12);
    spinner.stop(id);
  });

  it('renders the circular loader when requested', () => {
    const id = spinner.start({ type: 'circular' });
    expect(document.body.querySelector('.luma-loader--circular')).not.toBeNull();
    expect(document.body.querySelector('.luma-loader__circular-svg')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the atom loader when requested', () => {
    const id = spinner.start({ type: 'atom' });
    expect(document.body.querySelector('.luma-loader--atom')).not.toBeNull();
    expect(document.body.querySelector('.luma-loader__atom-nucleus')).not.toBeNull();
    expect(document.body.querySelectorAll('.luma-loader__atom-ring')).toHaveLength(3);
    spinner.stop(id);
  });

  it('renders the pacman loader when requested', () => {
    const id = spinner.start({ type: 'pacman' });
    expect(document.body.querySelector('.luma-loader--pacman')).not.toBeNull();
    expect(document.body.querySelector('.luma-loader__pacman-head')).not.toBeNull();
    expect(document.body.querySelectorAll('.luma-loader__pacman-dot')).toHaveLength(3);
    spinner.stop(id);
  });

  it('renders the clock loader when requested', () => {
    const id = spinner.start({ type: 'clock' });
    expect(document.body.querySelector('.luma-loader--clock')).not.toBeNull();
    expect(document.body.querySelector('.luma-loader__clock-hand--hour')).not.toBeNull();
    expect(document.body.querySelector('.luma-loader__clock-hand--minute')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the rotating-plane loader when requested', () => {
    const id = spinner.start({ type: 'rotating-plane' });
    expect(document.body.querySelector('.luma-loader--rotating-plane')).not.toBeNull();
    spinner.stop(id);
  });

  it('renders the newton-cradle loader when requested', () => {
    const id = spinner.start({ type: 'newton-cradle' });
    expect(document.body.querySelector('.luma-loader--newton-cradle')).not.toBeNull();
    expect(document.body.querySelectorAll('.luma-loader__newton-dot')).toHaveLength(4);
    spinner.stop(id);
  });

  it('renders the hash loader when requested', () => {
    const id = spinner.start({ type: 'hash' });
    expect(document.body.querySelector('.luma-loader--hash')).not.toBeNull();
    expect(document.querySelectorAll('.luma-loader__hash-bar')).toHaveLength(2);
    spinner.stop(id);
  });

  it('renders the interactive mini-game loader with arena, score badge, and bubbles', () => {
    const id = spinner.start({ type: 'interactive', color: '#6366f1' });
    const loader = document.body.querySelector('.luma-loader--interactive');
    expect(loader).not.toBeNull();
    const arena = document.body.querySelector('.luma-interactive__arena');
    expect(arena).not.toBeNull();
    const scoreBadge = document.body.querySelector('.luma-interactive__badge');
    expect(scoreBadge).not.toBeNull();
    const scoreNum = document.body.querySelector('.luma-interactive__score-num');
    expect(scoreNum?.textContent).toBe('0');
    const bubbles = document.body.querySelectorAll('.luma-interactive__bubble');
    expect(bubbles.length).toBeGreaterThanOrEqual(5);
    spinner.stop(id);
  });

  it('supports bubble popping interaction and score increment', () => {
    const id = spinner.start({ type: 'interactive' });
    const scoreNum = document.body.querySelector('.luma-interactive__score-num');
    const bubble = document.body.querySelector('.luma-interactive__bubble') as HTMLElement;
    expect(scoreNum?.textContent).toBe('0');
    expect(bubble).not.toBeNull();

    // Trigger pointerdown on bubble
    bubble.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));

    expect(scoreNum?.textContent).toBe('1');
    expect(bubble.classList.contains('luma-interactive__bubble--popped')).toBe(true);

    const floater = document.body.querySelector('.luma-interactive__floater');
    expect(floater).not.toBeNull();
    expect(floater?.textContent).toContain('+');

    spinner.stop(id);
  });

  it('supports keyboard Space/Enter interaction on arena', () => {
    const id = spinner.start({ type: 'interactive' });
    const arena = document.body.querySelector('.luma-interactive__arena') as HTMLElement;
    const scoreNum = document.body.querySelector('.luma-interactive__score-num');
    expect(scoreNum?.textContent).toBe('0');

    arena.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(scoreNum?.textContent).toBe('1');

    spinner.stop(id);
  });

  it('renders interactive loader using bubble-pop alias', () => {
    const id = spinner.start({ type: 'bubble-pop' });
    expect(document.body.querySelector('.luma-loader--interactive')).not.toBeNull();
    spinner.stop(id);
  });

  it('adds overlay class when overlay: true', () => {
    const id = spinner.start({ overlay: true });
    const el = document.body.querySelector('.luma-spinner--overlay');
    expect(el).not.toBeNull();
    spinner.stop(id);
  });

  it('supports string shorthand overlay and custom overlayColor', () => {
    const id = spinner.start({ overlay: 'rgba(0, 0, 0, 0.85)' });
    const el = document.body.querySelector<HTMLElement>('.luma-spinner--overlay');
    expect(el).not.toBeNull();
    expect(el?.style.getPropertyValue('--luma-overlay-color')).toBe('rgba(0, 0, 0, 0.85)');
    spinner.stop(id);

    const id2 = spinner.start({ overlayColor: '#1e293b' });
    const el2 = document.body.querySelector<HTMLElement>('.luma-spinner--overlay');
    expect(el2).not.toBeNull();
    expect(el2?.style.getPropertyValue('--luma-overlay-color')).toBe('#1e293b');
    spinner.stop(id2);
  });

  it('renders the text when provided', () => {
    const id = spinner.start({ text: 'Please wait...' });
    const textEl = document.body.querySelector('.luma-spinner__text');
    expect(textEl?.textContent).toBe('Please wait...');
    spinner.stop(id);
  });

  it('applies custom textColor to wrapper and text element', () => {
    const id = spinner.start({ text: 'Custom Text', textColor: '#f43f5e' });
    const wrapper = document.body.querySelector<HTMLElement>('.luma-spinner');
    expect(wrapper?.style.getPropertyValue('--luma-text-color')).toBe('#f43f5e');
    const textEl = document.body.querySelector<HTMLElement>('.luma-spinner__text');
    expect(textEl?.style.color).toBe('rgb(244, 63, 94)');
    spinner.stop(id);
  });

  it('auto-dismisses spinner after specified duration expires', async () => {
    const id = spinner.start({ duration: 50 });
    expect(spinner.isActive(id)).toBe(true);
    await new Promise((r) => setTimeout(r, 80));
    expect(spinner.isActive(id)).toBe(false);
  });
});

describe('spinner.stop()', () => {
  it('stops a spinner by ID', () => {
    const id = spinner.start();
    expect(spinner.isActive(id)).toBe(true);
    spinner.stop(id);
    expect(spinner.isActive(id)).toBe(false);
  });

  it('stops the only active spinner when no ID given', () => {
    const id = spinner.start();
    spinner.stop();
    expect(spinner.isActive(id)).toBe(false);
  });

  it('stops the most recent active spinner when multiple are active and no ID given', () => {
    const id1 = spinner.start({ id: 'spin-1' });
    const id2 = spinner.start({ id: 'spin-2' });
    expect(spinner.isActive(id1)).toBe(true);
    expect(spinner.isActive(id2)).toBe(true);

    // Calling stop() with no ID stops the most recently started (spin-2)
    spinner.stop();
    expect(spinner.isActive(id2)).toBe(false);
    expect(spinner.isActive(id1)).toBe(true);

    // Calling stop() again with no ID stops spin-1
    spinner.stop();
    expect(spinner.isActive(id1)).toBe(false);
  });
});

describe('spinner.update()', () => {
  it('updates the text of an active spinner', () => {
    const id = spinner.start({ text: 'Loading...' });
    spinner.update(id, { text: 'Almost done!' });
    const textEl = document.body.querySelector('.luma-spinner__text');
    expect(textEl?.textContent).toBe('Almost done!');
    spinner.stop(id);
  });

  it('updates the active spinner when called without ID', () => {
    const id = spinner.start({ text: 'Loading...' });
    spinner.update({ text: 'Updated without ID!' });
    const textEl = document.body.querySelector('.luma-spinner__text');
    expect(textEl?.textContent).toBe('Updated without ID!');
    spinner.stop(id);
  });
});

describe('spinner.setText()', () => {
  it('updates the text of an active spinner', () => {
    const id = spinner.start({ text: 'Start' });
    spinner.setText(id, 'Updated text');
    const textEl = document.body.querySelector('.luma-spinner__text');
    expect(textEl?.textContent).toBe('Updated text');
    spinner.stop(id);
  });

  it('updates the text without passing ID', () => {
    const id = spinner.start({ text: 'Start' });
    spinner.setText('No ID text');
    const textEl = document.body.querySelector('.luma-spinner__text');
    expect(textEl?.textContent).toBe('No ID text');
    spinner.stop(id);
  });
});

describe('spinner.isActive()', () => {
  it('returns true for an active spinner', () => {
    const id = spinner.start();
    expect(spinner.isActive(id)).toBe(true);
    spinner.stop(id);
  });

  it('returns false for a stopped spinner', () => {
    const id = spinner.start();
    spinner.stop(id);
    expect(spinner.isActive(id)).toBe(false);
  });

  it('returns false for an unknown ID', () => {
    expect(spinner.isActive('does-not-exist')).toBe(false);
  });
});

describe('spinner.active()', () => {
  it('returns all active spinner instances', () => {
    const id1 = spinner.start({ id: 'a1' });
    const id2 = spinner.start({ id: 'a2' });
    const active = spinner.active();
    expect(active.map((i) => i.id)).toContain(id1);
    expect(active.map((i) => i.id)).toContain(id2);
    spinner.stop(id1);
    spinner.stop(id2);
  });
});

describe('spinner.stopAll()', () => {
  it('stops all active spinners', () => {
    spinner.start({ id: 's1' });
    spinner.start({ id: 's2' });
    spinner.stopAll();
    expect(spinner.isActive('s1')).toBe(false);
    expect(spinner.isActive('s2')).toBe(false);
  });
});

describe('spinner.on() events', () => {
  it('fires the "start" event when a spinner starts', () => {
    const handler = vi.fn();
    const off = spinner.on('start', handler);
    const id = spinner.start();
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ id }));
    off();
    spinner.stop(id);
  });

  it('fires the "stop" event when a spinner stops', () => {
    const handler = vi.fn();
    const off = spinner.on('stop', handler);
    const id = spinner.start();
    spinner.stop(id);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ id }));
    off();
  });

  it('returns an unsubscribe function that removes the listener', () => {
    const handler = vi.fn();
    const off = spinner.on('start', handler);
    off();
    const id = spinner.start();
    expect(handler).not.toHaveBeenCalled();
    spinner.stop(id);
  });
});

describe('spinner.success() / spinner.error()', () => {
  it('adds luma-spinner--success class', () => {
    const id = spinner.start();
    spinner.success(id, 'Done!');
    const el = document.body.querySelector('.luma-spinner--success');
    expect(el).not.toBeNull();
  });

  it('adds luma-spinner--error class', () => {
    const id = spinner.start();
    spinner.error(id, 'Something went wrong');
    const el = document.body.querySelector('.luma-spinner--error');
    expect(el).not.toBeNull();
  });
});

describe('spinner.wrap()', () => {
  it('starts and stops around an async operation', async () => {
    let wasActive = false;
    await spinner.wrap('wrap-test', async () => {
      wasActive = spinner.isActive('wrap-test');
      return 42;
    });
    expect(wasActive).toBe(true);
    expect(spinner.isActive('wrap-test')).toBe(false);
  });

  it('stops the spinner even if the operation throws', async () => {
    await expect(
      spinner.wrap('wrap-err', async () => {
        throw new Error('oops');
      })
    ).rejects.toThrow('oops');
    expect(spinner.isActive('wrap-err')).toBe(false);
  });

  it('works when calling wrap() without an explicit ID', async () => {
    let wasActive = false;
    const result = await spinner.wrap(async () => {
      wasActive = spinner.active().length > 0;
      return 'success';
    });
    expect(result).toBe('success');
    expect(wasActive).toBe(true);
    expect(spinner.active().length).toBe(0);
  });
});

describe('container scope', () => {
  it('mounts inside a provided container element', () => {
    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    const id = spinner.start({ scope: 'container', container: '#test-container' });
    const el = container.querySelector('.luma-spinner--container');
    expect(el).not.toBeNull();
    spinner.stop(id);
  });

  it('sets aria-busy on container when mounted', () => {
    const container = document.createElement('div');
    container.id = 'aria-container';
    document.body.appendChild(container);

    const id = spinner.start({ scope: 'container', container: '#aria-container' });
    expect(container.getAttribute('aria-busy')).toBe('true');
    spinner.stop(id);
    expect(container.getAttribute('aria-busy')).toBe('false');
  });
});

describe('accessibility', () => {
  it('renders a visually hidden text element', () => {
    const id = spinner.start({ text: 'Loading data' });
    const srEl = document.body.querySelector('.luma-sr-only');
    expect(srEl?.textContent).toBe('Loading data');
    spinner.stop(id);
  });

  it('adds role=status to the wrapper', () => {
    const id = spinner.start();
    const wrapper = document.body.querySelector('[role="status"]');
    expect(wrapper).not.toBeNull();
    spinner.stop(id);
  });
});

describe('custom loader registration', () => {
  it('allows registering and using a custom loader', () => {
    spinner.registerLoader('custom-test', {
      name: 'custom-test',
      create() {
        const el = document.createElement('div');
        el.className = 'my-custom-loader';
        return el;
      },
    });
    // @ts-expect-error custom type not in union
    const id = spinner.start({ type: 'custom-test' });
    expect(document.body.querySelector('.my-custom-loader')).not.toBeNull();
    spinner.stop(id);
  });
});

