import type { SpinnerScope } from '../types/index.js';

export function setupAccessibility(
  element: HTMLElement,
  scope: SpinnerScope,
  text: string,
  container?: HTMLElement | null
): void {
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-label', text || 'Loading');

  if (scope === 'container' && container) {
    container.setAttribute('aria-busy', 'true');
  } else if (scope === 'page') {
    document.body.setAttribute('aria-busy', 'true');
  }
}

export function teardownAccessibility(
  scope: SpinnerScope,
  container?: HTMLElement | null
): void {
  if (scope === 'container' && container) {
    container.setAttribute('aria-busy', 'false');
  } else if (scope === 'page') {
    document.body.setAttribute('aria-busy', 'false');
  }
}

export function createVisuallyHidden(text: string): HTMLElement {
  const span = document.createElement('span');
  span.className = 'luma-spinner-sr-only luma-sr-only';
  span.textContent = text || 'Loading';
  return span;
}

