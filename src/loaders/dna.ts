import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const dnaLoader: LoaderDefinition = {
  name: 'dna',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--dna luma-loader luma-loader--dna';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.6s', '1.1s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 5; i++) {
      const col = document.createElement('div');
      col.className = 'luma-spinner-loader__dna-pair luma-loader__dna-pair';
      col.style.animationDelay = `${i * 0.12}s`;
      const dotA = document.createElement('span');
      dotA.className = 'luma-spinner-loader__dna-dot luma-spinner-loader__dna-dot--top luma-loader__dna-dot luma-loader__dna-dot--top';
      const dotB = document.createElement('span');
      dotB.className = 'luma-spinner-loader__dna-dot luma-spinner-loader__dna-dot--bottom luma-loader__dna-dot luma-loader__dna-dot--bottom';
      col.appendChild(dotA);
      col.appendChild(dotB);
      el.appendChild(col);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.6s', '1.1s') });
  },
};
