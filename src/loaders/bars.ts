import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.7s';
    case 'slow': return '1.8s';
    default: return '1.1s';
  }
}

export const barsLoader: LoaderDefinition = {
  name: 'bars',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--bars luma-loader luma-loader--bars';
    el.setAttribute('aria-hidden', 'true');
    const size = getSizeValue(options.size);
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed) });
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('div');
      bar.className = 'luma-spinner-loader__bar luma-loader__bar';
      bar.style.animationDelay = `${i * 0.1}s`;
      el.appendChild(bar);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};
