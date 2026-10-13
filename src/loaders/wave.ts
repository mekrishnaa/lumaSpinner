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

export const waveLoader: LoaderDefinition = {
  name: 'wave',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--wave luma-loader luma-loader--wave';
    el.setAttribute('aria-hidden', 'true');
    const size = getSizeValue(options.size);
    const dotSize = Math.max(8, Math.round(size * 0.2));
    setLoaderStyles(el, { color: options.color, speed: getSpeed(options.speed), dotSize });
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'luma-spinner-loader__wave-dot luma-loader__wave-dot';
      dot.style.animationDelay = `${i * 0.12}s`;
      el.appendChild(dot);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    const dotSize = Math.max(8, Math.round(size * 0.2));
    setLoaderStyles(element, { color: options.color, speed: getSpeed(options.speed), dotSize });
  },
};
