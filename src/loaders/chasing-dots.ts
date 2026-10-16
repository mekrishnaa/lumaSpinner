import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const chasingDotsLoader: LoaderDefinition = {
  name: 'chasing-dots',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--chasing-dots luma-loader luma-loader--chasing-dots';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '2.6s', '1.8s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 2; i++) {
      const dot = document.createElement('div');
      dot.className = `luma-spinner-loader__chase-dot luma-spinner-loader__chase-dot--${i + 1} luma-loader__chase-dot luma-loader__chase-dot--${i + 1}`;
      el.appendChild(dot);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '2.6s', '1.8s') });
  },
};
