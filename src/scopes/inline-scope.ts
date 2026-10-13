import type { ResolvedSpinnerOptions } from '../types/index.js';
import { createElement } from '../utils/dom.js';

function applyTheme(el: HTMLElement, theme: string): void {
  if (theme === 'dark') el.classList.add('luma-spinner-theme--dark', 'luma-theme--dark');
  else if (theme === 'light') el.classList.add('luma-spinner-theme--light', 'luma-theme--light');
  else el.classList.add('luma-spinner-theme--auto', 'luma-theme--auto');
}

export function mountInlineScope(
  mountTarget: HTMLElement,
  loaderEl: HTMLElement,
  srText: HTMLElement,
  options: ResolvedSpinnerOptions
): HTMLElement {
  const wrapper = createElement('span', ['luma-spinner', 'luma-spinner--inline']);
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  if (options.textColor) {
    wrapper.style.setProperty('--luma-spinner-text-color', options.textColor);
    wrapper.style.setProperty('--luma-text-color', options.textColor);
  }

  wrapper.appendChild(loaderEl);
  if (options.text) {
    const textEl = document.createElement('span');
    textEl.className = 'luma-spinner__text luma-spinner__text--inline';
    textEl.textContent = options.text;
    if (options.textColor) {
      textEl.style.color = options.textColor;
    }
    wrapper.appendChild(textEl);
  }
  wrapper.appendChild(srText);

  mountTarget.appendChild(wrapper);
  return wrapper;
}

export function unmountInlineScope(wrapper: HTMLElement): void {
  if (wrapper.parentNode) {
    wrapper.parentNode.removeChild(wrapper);
  }
}

