import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const hashLoader: LoaderDefinition = {
  name: 'hash',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--hash luma-loader luma-loader--hash';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '2.6s', '1.8s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 2; i++) {
      const bar = document.createElement('div');
      bar.className = `luma-spinner-loader__hash-bar luma-spinner-loader__hash-bar--${i} luma-loader__hash-bar luma-loader__hash-bar--${i}`;
      el.appendChild(bar);
    }

    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '2.6s', '1.8s') });
  },
};
