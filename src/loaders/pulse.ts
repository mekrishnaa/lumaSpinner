import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const pulseLoader: LoaderDefinition = {
  name: 'pulse',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--pulse luma-loader luma-loader--pulse';
    el.setAttribute('aria-hidden', 'true');
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.8s', '2s', '1.2s') });
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.8s', '2s', '1.2s') });
  },
};
