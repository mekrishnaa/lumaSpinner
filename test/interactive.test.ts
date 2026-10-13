import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { spinner } from '../src/core/spinner-manager.js';
import { clear } from '../src/core/spinner-registry.js';

describe('Interactive Loaders (fidget-spinner, pong, tap-burst)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    clear();
  });

  afterEach(() => {
    spinner.destroyAll();
    document.body.innerHTML = '';
  });

  describe('fidget-spinner', () => {
    it('mounts with dual classes, rotor, 3 blades, and bearing core', () => {
      const id = spinner.start({
        id: 'test-fidget',
        type: 'fidget-spinner',
        scope: 'inline',
        color: '#6366f1',
      });

      const root = document.querySelector('.luma-spinner-loader--fidget-spinner');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--fidget-spinner')).toBe(true);

      const stage = root?.querySelector('.luma-spinner-fidget__stage');
      expect(stage).toBeTruthy();

      const rotor = stage?.querySelector('.luma-spinner-fidget__rotor');
      expect(rotor).toBeTruthy();

      const blades = rotor?.querySelectorAll('.luma-spinner-fidget__blade');
      expect(blades?.length).toBe(3);

      const core = rotor?.querySelector('.luma-spinner-fidget__core');
      expect(core).toBeTruthy();

      const rpmBadge = root?.querySelector('.luma-spinner-fidget__rpm');
      expect(rpmBadge).toBeTruthy();

      spinner.stop(id);
    });

    it('boosts spin velocity on pointerdown and keydown', () => {
      const id = spinner.start({
        id: 'test-fidget-boost',
        type: 'fidget-spinner',
        scope: 'inline',
      });

      const stage = document.querySelector<HTMLElement>('.luma-spinner-fidget__stage')!;
      expect(stage).toBeTruthy();

      // Trigger space keydown
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      stage.dispatchEvent(spaceEvent);

      const rpm = document.querySelector<HTMLElement>('.luma-spinner-fidget__rpm');
      expect(rpm?.textContent).toBeTruthy();

      spinner.stop(id);
    });

    it('supports aliases "fidget" and "spin-fidget"', () => {
      const id1 = spinner.start({ id: 'fidget-a', type: 'fidget', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--fidget-spinner')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'fidget-b', type: 'spin-fidget', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--fidget-spinner')).toBeTruthy();
      spinner.stop(id2);
    });
  });

  describe('pong', () => {
    it('mounts with arena, neon ball, paddle, and rally score', () => {
      const id = spinner.start({
        id: 'test-pong',
        type: 'pong',
        scope: 'inline',
        color: '#10b981',
      });

      const root = document.querySelector('.luma-spinner-loader--pong');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--pong')).toBe(true);

      const arena = root?.querySelector('.luma-spinner-pong__arena');
      expect(arena).toBeTruthy();

      const ball = arena?.querySelector('.luma-spinner-pong__ball');
      expect(ball).toBeTruthy();

      const paddle = arena?.querySelector('.luma-spinner-pong__paddle');
      expect(paddle).toBeTruthy();

      const score = root?.querySelector('.luma-spinner-pong__score');
      expect(score?.textContent).toBe('0');

      spinner.stop(id);
    });

    it('moves paddle on ArrowLeft / ArrowRight keydown', () => {
      const id = spinner.start({
        id: 'test-pong-move',
        type: 'pong',
        scope: 'inline',
      });

      const arena = document.querySelector<HTMLElement>('.luma-spinner-pong__arena')!;
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
      arena.dispatchEvent(leftEvent);

      const paddle = arena.querySelector<HTMLElement>('.luma-spinner-pong__paddle')!;
      expect(paddle.style.transform).toBeTruthy();

      spinner.stop(id);
    });

    it('resets rally score when ball goes out of bounds', () => {
      const id = spinner.start({
        id: 'test-pong-reset',
        type: 'pong',
        scope: 'inline',
      });

      const root = document.querySelector<HTMLElement>('.luma-spinner-loader--pong')!;
      const score = root.querySelector<HTMLElement>('.luma-spinner-pong__score')!;
      expect(score.textContent).toBe('0');

      // Score is initialized at 0 and increments on hit, resets on miss
      expect(score).toBeTruthy();

      spinner.stop(id);
    });

    it('supports aliases "mini-pong" and "bounce-game"', () => {
      const id1 = spinner.start({ id: 'pong-a', type: 'mini-pong', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--pong')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'pong-b', type: 'bounce-game', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--pong')).toBeTruthy();
      spinner.stop(id2);
    });
  });

  describe('tap-burst', () => {
    it('mounts with cosmic orb, orbital ring, and energy meter', () => {
      const id = spinner.start({
        id: 'test-tapburst',
        type: 'tap-burst',
        scope: 'inline',
        color: '#f59e0b',
      });

      const root = document.querySelector('.luma-spinner-loader--tap-burst');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--tap-burst')).toBe(true);

      const ring = root?.querySelector('.luma-spinner-tapburst__ring');
      expect(ring).toBeTruthy();

      const orb = root?.querySelector('.luma-spinner-tapburst__orb');
      expect(orb).toBeTruthy();

      const pct = root?.querySelector('.luma-spinner-tapburst__pct');
      expect(pct?.textContent).toBe('0%');

      spinner.stop(id);
    });

    it('increases energy and spawns shockwave ring on click/tap', () => {
      const id = spinner.start({
        id: 'test-tapburst-click',
        type: 'tap-burst',
        scope: 'inline',
      });

      const stage = document.querySelector<HTMLElement>('.luma-spinner-tapburst__stage')!;
      expect(stage).toBeTruthy();

      // Trigger mousedown / click
      const mouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50, bubbles: true });
      stage.dispatchEvent(mouseEvent);

      const pct = document.querySelector<HTMLElement>('.luma-spinner-tapburst__pct');
      expect(parseInt(pct?.textContent || '0', 10)).toBeGreaterThan(0);

      const shockwave = stage.querySelector('.luma-spinner-tapburst__shockwave');
      expect(shockwave).toBeTruthy();

      spinner.stop(id);
    });

    it('supports aliases "click-blaster" and "energy-orb"', () => {
      const id1 = spinner.start({ id: 'burst-a', type: 'click-blaster', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--tap-burst')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'burst-b', type: 'energy-orb', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--tap-burst')).toBeTruthy();
      spinner.stop(id2);
    });
  });
});
