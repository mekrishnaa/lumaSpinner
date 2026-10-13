import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spinner } from '../src/core/spinner-manager.js';
import { clear } from '../src/core/spinner-registry.js';

describe('Progress Loaders (progress-bar, progress-ring, progress-steps)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    clear();
  });

  afterEach(() => {
    spinner.destroyAll();
    document.body.innerHTML = '';
  });

  describe('progress-bar', () => {
    it('mounts with dual classes and track structure in indeterminate mode', () => {
      const id = spinner.start({
        id: 'test-bar',
        type: 'progress-bar',
        scope: 'inline',
        color: '#6366f1',
      });

      const loader = document.querySelector('.luma-spinner-loader--progress-bar');
      expect(loader).toBeTruthy();
      expect(loader?.classList.contains('luma-loader--progress-bar')).toBe(true);

      const track = loader?.querySelector('.luma-spinner-progress__track');
      expect(track).toBeTruthy();
      expect(track?.classList.contains('luma-progress__track')).toBe(true);

      const fill = track?.querySelector('.luma-spinner-progress__fill');
      expect(fill).toBeTruthy();
      expect(fill?.classList.contains('luma-progress__fill')).toBe(true);
      expect(fill?.classList.contains('luma-spinner-progress__fill--indeterminate')).toBe(true);
      expect(fill?.querySelector('.luma-spinner-progress__sheen')).toBeTruthy();

      spinner.stop(id);
    });

    it('mounts directly in determinate mode when progress option is specified', () => {
      const id = spinner.start({
        id: 'test-determinate-bar',
        type: 'progress-bar',
        scope: 'inline',
        progress: 65,
        showProgressText: true,
      });

      const fill = document.querySelector<HTMLElement>('.luma-spinner-progress__fill');
      expect(fill).toBeTruthy();
      expect(fill?.style.width).toBe('65%');
      expect(fill?.classList.contains('luma-spinner-progress__fill--determinate')).toBe(true);

      const text = document.querySelector('.luma-spinner-progress__text');
      expect(text?.textContent).toBe('65%');

      spinner.stop(id);
    });

    it('updates width and text dynamically via spinner.setProgress()', () => {
      const id = spinner.start({
        id: 'test-dynamic-bar',
        type: 'progress-bar',
        scope: 'inline',
        showProgressText: true,
      });

      spinner.setProgress(id, 42);

      const fill = document.querySelector<HTMLElement>('.luma-spinner-progress__fill');
      expect(fill?.style.width).toBe('42%');
      expect(fill?.classList.contains('luma-spinner-progress__fill--determinate')).toBe(true);
      expect(fill?.classList.contains('luma-spinner-progress__fill--indeterminate')).toBe(false);

      const text = document.querySelector('.luma-spinner-progress__text');
      expect(text?.textContent).toBe('42%');

      // Clamps to 100
      spinner.setProgress(id, 125);
      expect(fill?.style.width).toBe('100%');
      expect(text?.textContent).toBe('100%');

      spinner.stop(id);
    });

    it('supports aliases "progress" and "linear-progress"', () => {
      const id1 = spinner.start({ id: 'alias-1', type: 'progress', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--progress-bar')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'alias-2', type: 'linear-progress', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--progress-bar')).toBeTruthy();
      spinner.stop(id2);
    });
  });

  describe('progress-ring', () => {
    it('mounts with SVG radial meter, track, and circle', () => {
      const id = spinner.start({
        id: 'test-ring',
        type: 'progress-ring',
        scope: 'inline',
        color: '#06b6d4',
      });

      const loader = document.querySelector('.luma-spinner-loader--progress-ring');
      expect(loader).toBeTruthy();
      expect(loader?.classList.contains('luma-loader--progress-ring')).toBe(true);

      const svg = loader?.querySelector('.luma-spinner-progress-ring__svg');
      expect(svg).toBeTruthy();
      expect(svg?.classList.contains('luma-progress-ring__svg')).toBe(true);

      const circle = svg?.querySelector('.luma-spinner-progress-ring__circle');
      expect(circle).toBeTruthy();
      expect(circle?.classList.contains('luma-progress-ring__circle')).toBe(true);

      spinner.stop(id);
    });

    it('updates strokeDashoffset and centered text dynamically via spinner.setProgress()', () => {
      const id = spinner.start({
        id: 'test-dynamic-ring',
        type: 'progress-ring',
        scope: 'inline',
        showProgressText: true,
      });

      spinner.setProgress(id, 50);

      const circle = document.querySelector<SVGCircleElement>('.luma-spinner-progress-ring__circle');
      expect(circle).toBeTruthy();
      expect(circle?.classList.contains('luma-spinner-progress-ring__circle--determinate')).toBe(true);
      // Circumference is 2 * PI * 21 ~= 131.95. At 50%, offset is ~65.97
      const offset = parseFloat(circle?.style.strokeDashoffset || '0');
      expect(offset).toBeCloseTo(65.97, 1);

      const text = document.querySelector('.luma-spinner-progress-ring__text');
      expect(text?.textContent).toBe('50%');

      spinner.stop(id);
    });

    it('supports aliases "circular-progress" and "ring-progress"', () => {
      const id1 = spinner.start({ id: 'ring-alias-1', type: 'circular-progress', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--progress-ring')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'ring-alias-2', type: 'ring-progress', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--progress-ring')).toBeTruthy();
      spinner.stop(id2);
    });
  });

  describe('progress-steps', () => {
    it('mounts with 5 segmented pill steps in indeterminate mode', () => {
      const id = spinner.start({
        id: 'test-steps',
        type: 'progress-steps',
        scope: 'inline',
      });

      const loader = document.querySelector('.luma-spinner-loader--progress-steps');
      expect(loader).toBeTruthy();
      expect(loader?.classList.contains('luma-loader--progress-steps')).toBe(true);

      const steps = loader?.querySelectorAll('.luma-spinner-progress-steps__step');
      expect(steps?.length).toBe(5);

      steps?.forEach((step, idx) => {
        expect(step.classList.contains('luma-spinner-progress-steps__step--indeterminate')).toBe(true);
        expect((step as HTMLElement).style.animationDelay).toBe(`${idx * 0.15}s`);
      });

      spinner.stop(id);
    });

    it('illuminates step segments proportionally via spinner.setProgress()', () => {
      const id = spinner.start({
        id: 'test-dynamic-steps',
        type: 'progress-steps',
        scope: 'inline',
        showProgressText: true,
      });

      // 60% progress = 3 out of 5 steps fully filled
      spinner.setProgress(id, 60);

      const steps = document.querySelectorAll<HTMLElement>('.luma-spinner-progress-steps__step');
      expect(steps.length).toBe(5);

      expect(steps[0].classList.contains('luma-spinner-progress-steps__step--filled')).toBe(true);
      expect(steps[1].classList.contains('luma-spinner-progress-steps__step--filled')).toBe(true);
      expect(steps[2].classList.contains('luma-spinner-progress-steps__step--filled')).toBe(true);
      expect(steps[3].classList.contains('luma-spinner-progress-steps__step--filled')).toBe(false);
      expect(steps[4].classList.contains('luma-spinner-progress-steps__step--filled')).toBe(false);

      const text = document.querySelector('.luma-spinner-progress__text');
      expect(text?.textContent).toBe('60%');

      spinner.stop(id);
    });

    it('supports aliases "steps" and "stepped-progress"', () => {
      const id1 = spinner.start({ id: 'step-alias-1', type: 'steps', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--progress-steps')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'step-alias-2', type: 'stepped-progress', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--progress-steps')).toBeTruthy();
      spinner.stop(id2);
    });
  });
});

