import { LUMA_CORE_CSS } from './css-content.js';
import { getLoaderStyles } from './loader-styles.js';

export interface StyleInjectorOptions {
  /**
   * Explicit CSP nonce string for environments with strict Content-Security-Policy.
   * If omitted, LumaSpinner will attempt to auto-detect the nonce from `<meta name="csp-nonce">`,
   * `<script nonce="...">`, or `window.__CSP_NONCE__`.
   */
  nonce?: string;

  /**
   * Whether to automatically inject styles into the DOM.
   * Default: `true`. Set to `false` if you prefer to import `lumaspinner/styles.css` manually.
   */
  injectStyles?: boolean;
}

let injected = false;
let adoptedSheet: CSSStyleSheet | null = null;
const injectedLoaders = new Set<string>();

/**
 * Automatically inspects the current DOM/environment for an active CSP nonce.
 */
export function getAutoNonce(): string | undefined {
  if (typeof document === 'undefined') return undefined;

  try {
    // 1. Check meta tag: <meta name="csp-nonce" content="...">
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="csp-nonce"], meta[property="csp-nonce"], meta[name="nonce"]'
    );
    if (meta && meta.content) {
      return meta.content;
    }

    // 2. Check window global: window.__CSP_NONCE__
    const win = (typeof window !== 'undefined' ? window : {}) as any;
    if (win.__CSP_NONCE__ && typeof win.__CSP_NONCE__ === 'string') {
      return win.__CSP_NONCE__;
    }

    // 3. Check any existing script with nonce
    const scriptWithNonce = document.querySelector<HTMLScriptElement>('script[nonce]');
    if (scriptWithNonce && scriptWithNonce.nonce) {
      return scriptWithNonce.nonce;
    }
  } catch {
    // Graceful fallback in sandboxed environments
  }

  return undefined;
}

/**
 * Lazily injects LumaSpinner core stylesheets into the DOM.
 * Uses modern Constructable Stylesheets (CSSOM) where available to avoid inline-script/style CSP violations,
 * and falls back to a `<style>` element tagged with an auto-detected or configured CSP nonce.
 */
export function ensureStylesInjected(options?: StyleInjectorOptions): void {
  // Safe guard: Server-Side Rendering (Node.js, Next.js server runtime, Nuxt, etc.)
  if (typeof document === 'undefined') return;

  // Opt-out guard: consumer prefers manual CSS import
  if (options?.injectStyles === false) return;

  // Deduplication guard
  if (injected) return;

  // 1. Primary Modern Path: Constructable Stylesheets via CSSOM
  if (
    'adoptedStyleSheets' in document &&
    typeof CSSStyleSheet !== 'undefined'
  ) {
    try {
      if (!adoptedSheet) {
        adoptedSheet = new CSSStyleSheet();
        if (typeof (adoptedSheet as any).replaceSync === 'function') {
          (adoptedSheet as any).replaceSync(LUMA_CORE_CSS);
        }
      }

      if (!document.adoptedStyleSheets.includes(adoptedSheet)) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, adoptedSheet];
      }
      injected = true;
      return;
    } catch {
      // If adoptedStyleSheets throws (e.g. older browser or security boundary), fallback to <style> tag
    }
  }

  // 2. Fallback Path: Injected <style> Element with CSP Nonce
  if (document.getElementById('luma-spinner-styles')) {
    injected = true;
    return;
  }

  try {
    const styleEl = document.createElement('style');
    styleEl.id = 'luma-spinner-styles';
    styleEl.textContent = LUMA_CORE_CSS;

    const nonce = options?.nonce || getAutoNonce();
    if (nonce) {
      styleEl.setAttribute('nonce', nonce);
      try {
        (styleEl as any).nonce = nonce;
      } catch {
        // Safe ignore
      }
    }

    const targetHead =
      document.head ||
      document.getElementsByTagName('head')[0] ||
      document.documentElement;

    targetHead.appendChild(styleEl);
    injected = true;
  } catch {
    // Safe ignore
  }
}

/**
 * On-demand injection for specific loader styles and keyframes.
 * Injects only the small CSS block required by the active loader.
 */
export function ensureLoaderStylesInjected(
  loaderName: string,
  options?: StyleInjectorOptions,
  customStyles?: string
): void {
  if (typeof document === 'undefined') return;
  if (options?.injectStyles === false) return;

  // Ensure base core styles exist
  ensureStylesInjected(options);

  if (injectedLoaders.has(loaderName)) return;

  const styles = customStyles || getLoaderStyles(loaderName);
  if (!styles || !styles.trim()) return;

  injectedLoaders.add(loaderName);

  // Modern Path: Constructable Stylesheets
  if (
    adoptedSheet &&
    'adoptedStyleSheets' in document &&
    document.adoptedStyleSheets.includes(adoptedSheet)
  ) {
    try {
      const currentCss = (adoptedSheet as any).cssRules
        ? Array.from((adoptedSheet as any).cssRules).map((r: any) => r.cssText).join('\n')
        : LUMA_CORE_CSS;
      (adoptedSheet as any).replaceSync(currentCss + '\n' + styles);
      return;
    } catch {
      // Fallback
    }
  }

  // Fallback: Append to the existing #luma-spinner-styles tag
  const styleEl = document.getElementById('luma-spinner-styles') as HTMLStyleElement | null;
  if (styleEl) {
    styleEl.textContent = (styleEl.textContent || '') + '\n' + styles;
  } else {
    try {
      const el = document.createElement('style');
      el.id = `luma-spinner-styles-${loaderName}`;
      el.dataset['lumaLoader'] = loaderName;
      el.textContent = styles;
      const nonce = options?.nonce || getAutoNonce();
      if (nonce) {
        el.setAttribute('nonce', nonce);
      }
      const targetHead = document.head || document.documentElement;
      targetHead.appendChild(el);
    } catch {
      // Safe ignore
    }
  }
}

/**
 * Resets style injection state (primarily for test environments).
 */
export function resetStyleInjection(): void {
  injected = false;
  injectedLoaders.clear();
  if (typeof document !== 'undefined') {
    const existing = document.getElementById('luma-spinner-styles');
    if (existing) {
      existing.remove();
    }
    const extraStyles = document.querySelectorAll('style[data-luma-loader]');
    extraStyles.forEach((s) => s.remove());

    if (adoptedSheet && 'adoptedStyleSheets' in Document.prototype) {
      try {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== adoptedSheet);
      } catch {
        // Safe ignore
      }
    }
  }
  adoptedSheet = null;
}
