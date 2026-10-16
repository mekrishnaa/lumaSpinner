import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const foldingCubeLoader: LoaderDefinition = {
  name: 'folding-cube',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--folding-cube luma-loader luma-loader--folding-cube';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '1.5s', '3.2s', '2.4s') });
    el.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 4; i++) {
      const cube = document.createElement('div');
      cube.className = `luma-spinner-loader__folding-cube-leaf luma-spinner-loader__folding-cube-leaf--${i} luma-loader__folding-cube-leaf luma-loader__folding-cube-leaf--${i}`;
      el.appendChild(cube);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.5s', '3.2s', '2.4s') });
  },
};
