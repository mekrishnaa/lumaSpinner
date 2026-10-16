import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const sphere3dLoader: LoaderDefinition = {
  name: '3d-sphere',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--3d-sphere luma-loader luma-loader--3d-sphere';
    setLoaderStyles(root, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '3.2s', '2s') });
    root.setAttribute('aria-hidden', 'true');

    const scene = document.createElement('div');
    scene.className = 'luma-spinner-3d-sphere__scene luma-3d-sphere__scene';

    const sphere = document.createElement('div');
    sphere.className = 'luma-spinner-3d-sphere__globe luma-3d-sphere__globe';

    // 4 intersecting 3D rings with different axes (horizontal, vertical, 45deg, -45deg)
    for (let i = 1; i <= 4; i++) {
      const ring = document.createElement('div');
      ring.className = `luma-spinner-3d-sphere__ring luma-3d-sphere__ring luma-spinner-3d-sphere__ring--${i} luma-3d-sphere__ring--${i}`;
      sphere.appendChild(ring);
    }

    // Glowing core
    const core = document.createElement('div');
    core.className = 'luma-spinner-3d-sphere__core luma-3d-sphere__core';
    sphere.appendChild(core);

    scene.appendChild(sphere);
    root.appendChild(scene);
    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.2s', '3.2s', '2s') });
  },
};

