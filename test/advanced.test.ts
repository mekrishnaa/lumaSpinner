import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { spinner } from '../src/core/spinner-manager.js';
import { resetConfig } from '../src/core/configuration.js';

beforeEach(() => {
  document.body.innerHTML = '';
  spinner.stopAll();
  resetConfig();
});

afterEach(() => {
  spinner.destroyAll();
});

describe('inline scope', () => {
  it('mounts an inline element without overlay', () => {
    const target = document.createElement('span');
    target.id = 'inline-target';
    document.body.appendChild(target);

    const id = spinner.start({
      id: 'inline-test',
      scope: 'inline',
      container: target,
      type: 'dots',
      size: 'small',
    });

    const el = target.querySelector('.luma-spinner--inline');
    expect(el).not.toBeNull();
    expect(target.querySelector('.luma-spinner--overlay')).toBeNull();
    spinner.stop(id);
    expect(target.querySelector('.luma-spinner--inline')).toBeNull();
  });
});

describe('spinner.setType()', () => {
  it('changes the active loader type on the fly', () => {
    const id = spinner.start({ id: 'type-test', type: 'ring' });
    expect(document.body.querySelector('.luma-loader--ring')).not.toBeNull();

    spinner.setType(id, 'dots');
    expect(document.body.querySelector('.luma-loader--dots')).not.toBeNull();
    expect(document.body.querySelector('.luma-loader--ring')).toBeNull();

    spinner.stop(id);
  });
});

describe('spinner.destroy() and destroyAll()', () => {
  it('cleans up resources and unmounts', () => {
    const id = spinner.start({ id: 'dest-1' });
    expect(spinner.isActive(id)).toBe(true);

    spinner.destroy(id);
    expect(spinner.isActive(id)).toBe(false);
    expect(document.body.querySelector('.luma-spinner')).toBeNull();
  });

  it('destroyAll cleans up everything', () => {
    spinner.start({ id: 'd1' });
    spinner.start({ id: 'd2' });
    expect(spinner.active()).toHaveLength(2);

    spinner.destroyAll();
    expect(spinner.active()).toHaveLength(0);
    expect(document.body.querySelector('.luma-spinner')).toBeNull();
  });
});

describe('spinner.configure() global defaults', () => {
  it('respects globally configured defaults', () => {
    spinner.configure({
      type: 'orbit',
      speed: 'fast',
      color: '#10b981',
      text: 'Global text',
    });

    const id = spinner.start({ id: 'conf-test' });
    expect(document.body.querySelector('.luma-loader--orbit')).not.toBeNull();
    const textEl = document.body.querySelector('.luma-spinner__text');
    expect(textEl?.textContent).toBe('Global text');
    spinner.stop(id);
  });

  it('supports global auto-dismiss duration', async () => {
    spinner.configure({
      duration: 100,
    });

    const id = spinner.start({ id: 'auto-dismiss-test' });
    expect(spinner.isActive(id)).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(spinner.isActive(id)).toBe(false);
  });

  it('supports resetConfig()', () => {
    spinner.configure({
      type: 'wave',
      speed: 'slow',
    });
    expect(spinner.getConfig().type).toBe('wave');
    spinner.resetConfig();
    expect(spinner.getConfig().type).toBe('ring');
  });
});

describe('independent concurrent instances', () => {
  it('maintains independent lifecycles when stopping one of many', () => {
    const c1 = document.createElement('div');
    c1.id = 'panel-1';
    const c2 = document.createElement('div');
    c2.id = 'panel-2';
    document.body.appendChild(c1);
    document.body.appendChild(c2);

    spinner.start({ id: 's1', scope: 'container', container: '#panel-1', type: 'bars' });
    spinner.start({ id: 's2', scope: 'container', container: '#panel-2', type: 'pulse' });

    expect(spinner.isActive('s1')).toBe(true);
    expect(spinner.isActive('s2')).toBe(true);

    // Stop only s1
    spinner.stop('s1');
    expect(spinner.isActive('s1')).toBe(false);
    expect(spinner.isActive('s2')).toBe(true);
    expect(c1.querySelector('.luma-spinner')).toBeNull();
    expect(c2.querySelector('.luma-spinner')).not.toBeNull();

    // Stop s2
    spinner.stop('s2');
    expect(spinner.isActive('s2')).toBe(false);
    expect(c2.querySelector('.luma-spinner')).toBeNull();
  });
});

