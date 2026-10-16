import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const rippleLoader: LoaderDefinition = {
  name: 'ripple',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--ripple luma-loader luma-loader--ripple';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.1s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 2; i++) {
      const ring = document.createElement('div');
      ring.className = 'luma-spinner-loader__ripple-disc luma-loader__ripple-disc';
      ring.style.animationDelay = `${i * -0.55}s`;
      el.appendChild(ring);
    }

    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.1s') });
  },
};
