import type { ResolvedSpinnerOptions } from '../types/index.js';
import { createElement, ensureRelativePosition, restorePosition } from '../utils/dom.js';

function buildText(text: string, position: string, textColor?: string): HTMLElement {
  const el = document.createElement('p');
  el.className = `luma-spinner__text luma-spinner__text--${position}`;
  el.textContent = text;
  if (textColor) {
    el.style.color = textColor;
  }
  return el;
}

function applyTheme(el: HTMLElement, theme: string): void {
  if (theme === 'dark') el.classList.add('luma-spinner-theme--dark', 'luma-theme--dark');
  else if (theme === 'light') el.classList.add('luma-spinner-theme--light', 'luma-theme--light');
  else el.classList.add('luma-spinner-theme--auto', 'luma-theme--auto');
}

export function mountContainerScope(
  container: HTMLElement,
  loaderEl: HTMLElement,
  srText: HTMLElement,
  options: ResolvedSpinnerOptions
): HTMLElement {
  ensureRelativePosition(container);

  const wrapper = createElement('div', ['luma-spinner', 'luma-spinner--container']);
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  const zIndex = options.zIndex ?? 10;
  wrapper.style.setProperty('--luma-spinner-z-index', `${zIndex}`);
  wrapper.style.setProperty('--luma-z-index', `${zIndex}`);

  if (options.textColor) {
    wrapper.style.setProperty('--luma-spinner-text-color', options.textColor);
    wrapper.style.setProperty('--luma-text-color', options.textColor);
  }

  applyTheme(wrapper, options.theme);

  const isOverlayString = typeof options.overlay === 'string' && options.overlay.length > 0;
  const overlayObj = typeof options.overlay === 'object' && options.overlay !== null ? options.overlay : null;
  const overlayEnabled =
    options.overlay === true ||
    isOverlayString ||
    (overlayObj !== null && overlayObj.enabled !== false) ||
    Boolean(options.overlayColor);

  if (overlayEnabled) {
    wrapper.classList.add('luma-spinner--overlay');
    const overlayColor =
      options.overlayColor ||
      (isOverlayString ? (options.overlay as string) : undefined) ||
      overlayObj?.color;
    if (overlayColor) {
      wrapper.style.setProperty('--luma-spinner-overlay-color', overlayColor);
      wrapper.style.setProperty('--luma-overlay-color', overlayColor);
    }
  }

  if (options.preventInteraction) {
    wrapper.classList.add('luma-spinner--no-interaction');
  }

  if (options.type === 'skeleton') {
    wrapper.classList.add('luma-spinner--skeleton-mode');
  }

  const inner = createElement('div', ['luma-spinner__inner', `luma-spinner__inner--${options.position}`]);
  inner.appendChild(loaderEl);

  if (options.text) {
    const textEl = buildText(options.text, options.textPosition, options.textColor);
    if (options.textPosition === 'top') {
      inner.insertBefore(textEl, loaderEl);
    } else {
      inner.appendChild(textEl);
    }
  }

  wrapper.appendChild(srText);
  wrapper.appendChild(inner);
  container.appendChild(wrapper);
  return wrapper;
}

export function unmountContainerScope(wrapper: HTMLElement, container: HTMLElement): void {
  if (wrapper.parentNode) {
    wrapper.parentNode.removeChild(wrapper);
  }
  restorePosition(container);
  container.setAttribute('aria-busy', 'false');
}

