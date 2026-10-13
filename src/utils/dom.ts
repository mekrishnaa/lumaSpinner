export function createElement<T extends HTMLElement = HTMLElement>(
  tag: string,
  classes: string[],
  attrs: Record<string, string> = {}
): T {
  const el = document.createElement(tag) as T;
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

export function ensureRelativePosition(el: HTMLElement): void {
  const position = window.getComputedStyle(el).position;
  if (position === 'static') {
    el.style.position = 'relative';
    el.dataset['lumaSpinnerAddedRelative'] = 'true';
    el.dataset['lumaAddedRelative'] = 'true';
  }
}

export function restorePosition(el: HTMLElement): void {
  if (el.dataset['lumaSpinnerAddedRelative'] === 'true' || el.dataset['lumaAddedRelative'] === 'true') {
    el.style.position = '';
    delete el.dataset['lumaSpinnerAddedRelative'];
    delete el.dataset['lumaAddedRelative'];
  }
}

export function safeRemove(el: HTMLElement | null | undefined): void {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

