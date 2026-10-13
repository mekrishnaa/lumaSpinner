import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.7s';
    case 'slow': return '1.8s';
    default: return '1.2s';
  }
}

export const dualRingLoader: LoaderDefinition = {
  name: 'dual-ring',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--dual-ring luma-loader luma-loader--dual-ring';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed) });
    el.setAttribute('aria-hidden', 'true');
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};
