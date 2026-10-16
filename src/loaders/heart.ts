import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const heartLoader: LoaderDefinition = {
  name: 'heart',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--heart luma-loader luma-loader--heart';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.6s', '1.6s', '1.0s') });
    el.setAttribute('aria-hidden', 'true');
    const shape = document.createElement('div');
    shape.className = 'luma-spinner-loader__heart-shape luma-loader__heart-shape';
    el.appendChild(shape);
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.6s', '1.6s', '1.0s') });
  },
};
