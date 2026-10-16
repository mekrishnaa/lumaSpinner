import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const fadingCircleLoader: LoaderDefinition = {
  name: 'fading-circle',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--fading-circle luma-loader luma-loader--fading-circle';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.6s', '1.1s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 12; i++) {
      const blade = document.createElement('div');
      blade.className = 'luma-spinner-loader__fading-blade luma-loader__fading-blade';
      blade.style.transform = `rotate(${i * 30}deg)`;
      blade.style.setProperty('--luma-spinner-blade-index', `${i}`);
      blade.style.setProperty('--luma-blade-index', `${i}`);

      const segment = document.createElement('span');
      segment.className = 'luma-spinner-loader__fading-segment luma-loader__fading-segment';
      segment.style.animationDelay = `${((i - 12) * 0.0916).toFixed(3)}s`;

      blade.appendChild(segment);
      el.appendChild(blade);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.6s', '1.1s') });
  },
};
