import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const wanderingCubesLoader: LoaderDefinition = {
  name: 'wandering-cubes',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--wandering-cubes luma-loader luma-loader--wandering-cubes';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '2.6s', '1.8s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 2; i++) {
      const cube = document.createElement('div');
      cube.className = `luma-spinner-loader__wandering-cube luma-spinner-loader__wandering-cube--${i} luma-loader__wandering-cube luma-loader__wandering-cube--${i}`;
      el.appendChild(cube);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '2.6s', '1.8s') });
  },
};
