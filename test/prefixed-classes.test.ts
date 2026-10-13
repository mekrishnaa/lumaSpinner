import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spinner } from '../src/core/spinner-manager.js';
import { clear } from '../src/core/spinner-registry.js';
import { getRegisteredLoaderNames } from '../src/loaders/loader-registry.js';
import type { LoaderType } from '../src/types/index.js';

describe('Prefix Consistency: .luma-spinner-* and --luma-spinner-*', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    clear();
  });

  afterEach(() => {
    spinner.destroyAll();
    document.body.innerHTML = '';
  });

  it('every registered loader element carries the .luma-spinner-loader class', () => {
    const loaderNames = getRegisteredLoaderNames() as LoaderType[];
    expect(loaderNames.length).toBeGreaterThanOrEqual(28);

    for (const name of loaderNames) {
      const id = spinner.start({ type: name, scope: 'page', color: '#6366f1', size: 40 });
      const el = document.querySelector(`.luma-spinner-loader--type-${name}`) as HTMLElement;
      expect(el, `Loader "${name}" should have class .luma-spinner-loader--type-${name}`).not.toBeNull();
      expect(el.classList.contains('luma-spinner-loader'), `Loader "${name}" should have class .luma-spinner-loader`).toBe(true);

      // Verify custom properties
      expect(el?.style.getPropertyValue('--luma-spinner-color'), `Loader "${name}" should have --luma-spinner-color`).toBe('#6366f1');
      if (name !== 'skeleton') {
        expect(el?.style.getPropertyValue('--luma-spinner-speed')).toBeTruthy();
      }

      spinner.stop(id);
    }
  });

  it('skeleton loader applies .luma-spinner-skeleton and .luma-spinner-skeleton__bone to variant elements', () => {
    const variants = ['card', 'list', 'profile', 'table', 'avatar', 'line', 'circle', 'rectangle'] as const;

    for (const variant of variants) {
      const id = spinner.start({
        type: 'skeleton',
        scope: 'page',
        skeleton: { variant, shimmer: true, rows: 2, lines: 2 },
      });

      const skeletonEl = document.querySelector('.luma-spinner-skeleton, .luma-spinner-loader--skeleton');
      expect(skeletonEl, `Skeleton variant "${variant}" should mount`).not.toBeNull();

      const bones = document.querySelectorAll('.luma-spinner-skeleton__bone');
      expect(bones.length, `Skeleton variant "${variant}" should have bones with prefix`).toBeGreaterThan(0);

      spinner.stop(id);
    }
  });

  it('screen reader helper uses .luma-spinner-sr-only', () => {
    const id = spinner.start({ type: 'ring', text: 'Processing request' });
    const srEl = document.querySelector('.luma-spinner-sr-only');
    expect(srEl).not.toBeNull();
    expect(srEl?.textContent).toBe('Processing request');
    spinner.stop(id);
  });

  it('theme classes apply .luma-spinner-theme--*', () => {
    const idDark = spinner.start({ type: 'ring', theme: 'dark' });
    const wrapperDark = document.querySelector('.luma-spinner');
    expect(wrapperDark?.classList.contains('luma-spinner-theme--dark')).toBe(true);
    spinner.stop(idDark);

    const idLight = spinner.start({ type: 'ring', theme: 'light' });
    const wrapperLight = document.querySelector('.luma-spinner');
    expect(wrapperLight?.classList.contains('luma-spinner-theme--light')).toBe(true);
    spinner.stop(idLight);
  });

  it('interactive loader uses .luma-spinner-interactive__* classes', () => {
    const id = spinner.start({ type: 'interactive', scope: 'page' });
    const interactiveRoot = document.querySelector('.luma-spinner-loader--interactive');
    expect(interactiveRoot).not.toBeNull();

    expect(document.querySelector('.luma-spinner-interactive__header')).not.toBeNull();
    expect(document.querySelector('.luma-spinner-interactive__arena')).not.toBeNull();
    expect(document.querySelector('.luma-spinner-interactive__hint')).not.toBeNull();
    expect(document.querySelectorAll('.luma-spinner-interactive__bubble').length).toBe(6);

    spinner.stop(id);
  });

  it('counter-ring loader mounts outer anti-clockwise ring and inner clockwise ring', () => {
    const id = spinner.start({ type: 'counter-ring', scope: 'page', color: '#ec4899', size: 48 });
    const root = document.querySelector('.luma-spinner-loader--counter-ring');
    expect(root).not.toBeNull();
    expect(root?.classList.contains('luma-spinner-loader')).toBe(true);

    const outer = root?.querySelector('.luma-spinner-loader__counter-ring-outer');
    expect(outer).not.toBeNull();

    const inner = root?.querySelector('.luma-spinner-loader__counter-ring-inner');
    expect(inner).not.toBeNull();

    // Verify alias concentric-rings also works
    spinner.stop(id);
    const aliasId = spinner.start({ type: 'concentric-rings', scope: 'page' });
    expect(document.querySelector('.luma-spinner-loader--counter-ring')).not.toBeNull();
    spinner.stop(aliasId);
  });
});
  