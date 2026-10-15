import type { SpinnerInstance, ResolvedSpinnerOptions } from '../types/index.js';
import { createVisuallyHidden, setupAccessibility, teardownAccessibility } from '../accessibility/aria.js';
import { mountPageScope, unmountPageScope } from '../scopes/page-scope.js';
import { mountContainerScope, unmountContainerScope } from '../scopes/container-scope.js';
import { mountInlineScope, unmountInlineScope } from '../scopes/inline-scope.js';
import { getLoader } from '../loaders/loader-registry.js';
import { log } from './configuration.js';
import { ensureStylesInjected, ensureLoaderStylesInjected } from '../styles/injector.js';

export function mountSpinner(id: string, options: ResolvedSpinnerOptions): HTMLElement {
  ensureStylesInjected({ nonce: options.nonce, injectStyles: options.injectStyles });

  const loader = getLoader(options.type);
  ensureLoaderStylesInjected(options.type, { nonce: options.nonce, injectStyles: options.injectStyles }, loader.styles);

  const loaderEl = loader.create(options);
  loaderEl.classList.add(`luma-spinner-loader--type-${options.type}`, `luma-loader--type-${options.type}`);

  const srText = createVisuallyHidden(options.text || 'Loading');

  setupAccessibility(loaderEl, options.scope, options.text, options.container);

  let wrapper: HTMLElement;

  if (options.scope === 'page') {
    wrapper = mountPageScope(loaderEl, srText, options);
    document.body.setAttribute('aria-busy', 'true');
  } else if (options.scope === 'container' && options.container) {
    wrapper = mountContainerScope(options.container, loaderEl, srText, options);
    options.container.setAttribute('aria-busy', 'true');
  } else {
    // inline or container without explicit container element
    const target = options.container ?? document.body;
    wrapper = mountInlineScope(target, loaderEl, srText, options);
  }

  wrapper.dataset['lumaId'] = id;
  log(`Started: ${id}`);
  return wrapper;
}

export function unmountSpinner(instance: SpinnerInstance): void {
  const loaderEl = instance.element.querySelector<HTMLElement>('.luma-spinner-loader, .luma-loader');
  if (loaderEl) {
    const loader = getLoader(instance.type);
    if (loader.destroy) {
      try {
        loader.destroy(loaderEl);
      } catch (_e) {
        // Safe ignore
      }
    }
  }

  teardownAccessibility(instance.scope, instance.container ?? null);

  if (instance.scope === 'page') {
    unmountPageScope(instance.element);
  } else if (instance.scope === 'container' && instance.container) {
    unmountContainerScope(instance.element, instance.container);
  } else {
    unmountInlineScope(instance.element);
  }

  log(`Stopped: ${instance.id}`);
}

export function updateSpinnerElement(instance: SpinnerInstance, options: Partial<ResolvedSpinnerOptions>): void {
  const merged = { ...instance.options, ...options } as ResolvedSpinnerOptions;

  // Update text
  const textEl = instance.element.querySelector<HTMLElement>('.luma-spinner__text');
  if (textEl && merged.text !== undefined) {
    textEl.textContent = merged.text;
  }

  // Update text color
  if (merged.textColor !== undefined) {
    instance.element.style.setProperty('--luma-spinner-text-color', merged.textColor);
    instance.element.style.setProperty('--luma-text-color', merged.textColor);
    if (textEl) {
      textEl.style.color = merged.textColor;
    }
  }

  // Update sr text
  const srEl = instance.element.querySelector<HTMLElement>('.luma-spinner-sr-only, .luma-sr-only');
  if (srEl && merged.text !== undefined) {
    srEl.textContent = merged.text || 'Loading';
  }

  // Update loader via its update method
  const loaderEl = instance.element.querySelector<HTMLElement>('.luma-spinner-loader, .luma-loader');
  if (loaderEl && merged.type === instance.type) {
    const loader = getLoader(instance.type);
    if (loader.update) {
      loader.update(loaderEl, merged);
    }
  }

  log(`Updated: ${instance.id}`);
}

