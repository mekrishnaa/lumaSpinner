import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.7s';
    case 'slow': return '2s';
    default: return '1.2s';
  }
}

export const orbitLoader: LoaderDefinition = {
  name: 'orbit',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--orbit luma-loader luma-loader--orbit';
    el.setAttribute('aria-hidden', 'true');
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed) });
    const core = document.createElement('div');
    core.className = 'luma-spinner-loader__orbit-core luma-loader__orbit-core';
    const satellite = document.createElement('div');
    satellite.className = 'luma-spinner-loader__orbit-satellite luma-loader__orbit-satellite';
    el.appendChild(core);
    el.appendChild(satellite);
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};
