import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.8s';
    case 'slow': return '1.8s';
    default: return '1.2s';
  }
}

export const circleLoader: LoaderDefinition = {
  name: 'circle',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--circle luma-loader luma-loader--circle';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed) });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 12; i++) {
      const child = document.createElement('div');
      child.className = 'luma-spinner-loader__circle-child luma-loader__circle-child';
      child.style.transform = `rotate(${i * 30}deg)`;
      const dot = document.createElement('span');
      dot.className = 'luma-spinner-loader__circle-dot luma-loader__circle-dot';
      dot.style.animationDelay = `${(i - 12) * 0.1}s`;
      child.appendChild(dot);
      el.appendChild(child);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};
