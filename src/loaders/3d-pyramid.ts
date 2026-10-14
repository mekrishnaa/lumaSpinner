import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '1.2s';
    case 'slow': return '3.2s';
    default: return '2.2s';
  }
}

export const pyramid3dLoader: LoaderDefinition = {
  name: '3d-pyramid',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--3d-pyramid luma-loader luma-loader--3d-pyramid';
    setLoaderStyles(root, { size, color: options.color, speed: getSpeed(options.speed) });
    root.setAttribute('aria-hidden', 'true');

    const scene = document.createElement('div');
    scene.className = 'luma-spinner-3d-pyramid__scene luma-3d-pyramid__scene';

    const pyramid = document.createElement('div');
    pyramid.className = 'luma-spinner-3d-pyramid__shape luma-3d-pyramid__shape';

    // 4 Triangular sides + 1 base
    const faces = ['front', 'back', 'right', 'left', 'base'];
    for (const face of faces) {
      const faceEl = document.createElement('div');
      faceEl.className = `luma-spinner-3d-pyramid__face luma-3d-pyramid__face luma-spinner-3d-pyramid__face--${face} luma-3d-pyramid__face--${face}`;
      pyramid.appendChild(faceEl);
    }

    scene.appendChild(pyramid);
    root.appendChild(scene);
    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};

