import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.8s';
    case 'slow': return '1.8s';
    default: return '1.2s';
  }
}

export const rollerLoader: LoaderDefinition = {
  name: 'roller',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--roller luma-loader luma-loader--roller';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed) });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.className = 'luma-spinner-loader__roller-dot luma-loader__roller-dot';
      dot.style.animationDelay = `${-0.036 * (i + 1)}s`;
      el.appendChild(dot);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};
