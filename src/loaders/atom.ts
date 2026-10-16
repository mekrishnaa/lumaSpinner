import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const atomLoader: LoaderDefinition = {
  name: 'atom',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--atom luma-loader luma-loader--atom';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.2s') });
    el.setAttribute('aria-hidden', 'true');

    // Nucleus
    const nucleus = document.createElement('div');
    nucleus.className = 'luma-spinner-loader__atom-nucleus luma-loader__atom-nucleus';
    el.appendChild(nucleus);

    // 3 orbital rings
    for (let i = 1; i <= 3; i++) {
      const ring = document.createElement('div');
      ring.className = `luma-spinner-loader__atom-ring luma-spinner-loader__atom-ring--${i} luma-loader__atom-ring luma-loader__atom-ring--${i}`;
      el.appendChild(ring);
    }

    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.2s') });
  },
};
