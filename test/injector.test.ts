import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ensureStylesInjected, resetStyleInjection, getAutoNonce } from '../src/styles/injector.js';
import { spinner } from '../src/core/spinner-manager.js';
import { resetConfig, setConfig } from '../src/core/configuration.js';

describe('Style Injector & Strict CSP Support', () => {
  beforeEach(() => {
    resetStyleInjection();
    resetConfig();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    spinner.destroyAll();
    resetStyleInjection();
    resetConfig();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('automatically injects style tag if adoptedStyleSheets is not used', () => {
    ensureStylesInjected();
    // In jsdom without adoptedStyleSheets, it injects a <style id="luma-spinner-styles"> tag
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.textContent).toContain('.luma-spinner');
  });

  it('deduplicates and does not inject multiple style tags', () => {
    ensureStylesInjected();
    ensureStylesInjected();
    ensureStylesInjected();
    const styleEls = document.querySelectorAll('#luma-spinner-styles');
    expect(styleEls.length).toBe(1);
  });

  it('respects injectStyles: false opt-out', () => {
    ensureStylesInjected({ injectStyles: false });
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl).toBeNull();
  });

  it('attaches explicit nonce attribute for strict CSP', () => {
    ensureStylesInjected({ nonce: 'test-nonce-12345' });
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.getAttribute('nonce')).toBe('test-nonce-12345');
  });

  it('auto-detects nonce from meta[name="csp-nonce"]', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'csp-nonce');
    meta.setAttribute('content', 'meta-secret-nonce');
    document.head.appendChild(meta);

    expect(getAutoNonce()).toBe('meta-secret-nonce');

    ensureStylesInjected();
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl?.getAttribute('nonce')).toBe('meta-secret-nonce');
  });

  it('auto-detects nonce from existing script[nonce]', () => {
    const script = document.createElement('script');
    script.setAttribute('nonce', 'script-secret-nonce');
    document.head.appendChild(script);

    expect(getAutoNonce()).toBe('script-secret-nonce');

    ensureStylesInjected();
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl?.getAttribute('nonce')).toBe('script-secret-nonce');
  });

  it('auto-detects nonce from window.__CSP_NONCE__', () => {
    (window as any).__CSP_NONCE__ = 'global-window-nonce';

    expect(getAutoNonce()).toBe('global-window-nonce');

    ensureStylesInjected();
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl?.getAttribute('nonce')).toBe('global-window-nonce');

    delete (window as any).__CSP_NONCE__;
  });

  it('injects styles automatically on spinner.start() without manual CSS import', () => {
    const styleBefore = document.getElementById('luma-spinner-styles');
    expect(styleBefore).toBeNull();

    const id = spinner.start({ type: 'ring' });
    const styleAfter = document.getElementById('luma-spinner-styles');
    expect(styleAfter).not.toBeNull();
    expect(styleAfter?.textContent).toContain('--luma-color');

    spinner.stop(id);
  });

  it('supports globalConfig nonce configuration', () => {
    setConfig({ nonce: 'global-config-nonce' });

    const id = spinner.start({ type: 'dots' });
    const styleEl = document.getElementById('luma-spinner-styles');
    expect(styleEl?.getAttribute('nonce')).toBe('global-config-nonce');

    spinner.stop(id);
  });

  it('supports adoptedStyleSheets when available in modern browser environments', () => {
    const mockSheets: any[] = [];
    const origAdopted = (document as any).adoptedStyleSheets;

    // Simulate modern browser adoptedStyleSheets
    Object.defineProperty(document, 'adoptedStyleSheets', {
      get() { return mockSheets; },
      set(val) { mockSheets.length = 0; mockSheets.push(...val); },
      configurable: true,
    });

    try {
      resetStyleInjection();
      ensureStylesInjected();
      // In adoptedStyleSheets-compatible environments, no style tag is injected
      // and sheet is adopted into document.adoptedStyleSheets
      expect(document.getElementById('luma-spinner-styles')).toBeNull();
      expect(mockSheets.length).toBe(1);
    } finally {
      Object.defineProperty(document, 'adoptedStyleSheets', {
        value: origAdopted,
        configurable: true,
      });
    }
  });
});

