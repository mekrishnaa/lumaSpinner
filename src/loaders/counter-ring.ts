import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const counterRingLoader: LoaderDefinition = {
  name: 'counter-ring',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--counter-ring luma-loader luma-loader--counter-ring';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.2s') });
    el.setAttribute('aria-hidden', 'true');

    // Outer ring (rotates counter-clockwise / anti-clockwise)
    const outer = document.createElement('div');
    outer.className = 'luma-spinner-loader__counter-ring-outer luma-loader__counter-ring-outer';
    el.appendChild(outer);

    // Inner ring (rotates clockwise)
    const inner = document.createElement('div');
    inner.className = 'luma-spinner-loader__counter-ring-inner luma-loader__counter-ring-inner';
    el.appendChild(inner);

    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.2s') });
  },
};

