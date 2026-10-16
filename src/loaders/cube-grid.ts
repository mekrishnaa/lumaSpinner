import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const cubeGridLoader: LoaderDefinition = {
  name: 'cube-grid',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--cube-grid luma-loader luma-loader--cube-grid';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.8s', '1.8s', '1.3s') });
    el.setAttribute('aria-hidden', 'true');

    // 9 cubes with diagonal delays
    const delays = [0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0.0, 0.1, 0.2];
    for (let i = 0; i < 9; i++) {
      const cube = document.createElement('div');
      cube.className = 'luma-spinner-loader__cube luma-loader__cube';
      cube.style.animationDelay = `${delays[i]}s`;
      el.appendChild(cube);
    }
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.8s', '1.8s', '1.3s') });
  },
};
