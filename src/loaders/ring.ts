import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const ringLoader: LoaderDefinition = {
  name: 'ring',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--ring luma-loader luma-loader--ring';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.6s', '1.6s', '1s') });
    el.setAttribute('aria-hidden', 'true');
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.6s', '1.6s', '1s') });
  },
};
