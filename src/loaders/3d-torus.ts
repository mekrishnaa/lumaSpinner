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

export const torus3dLoader: LoaderDefinition = {
  name: '3d-torus',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--3d-torus luma-loader luma-loader--3d-torus';
    setLoaderStyles(root, { size, color: options.color, speed: getSpeed(options.speed) });
    root.setAttribute('aria-hidden', 'true');

    const scene = document.createElement('div');
    scene.className = 'luma-spinner-3d-torus__scene luma-3d-torus__scene';

    const torus = document.createElement('div');
    torus.className = 'luma-spinner-3d-torus__donut luma-3d-torus__donut';

    // 8 rotating elliptical cross-section rings oriented radially forming a 3D donut ring
    for (let i = 0; i < 8; i++) {
      const ring = document.createElement('div');
      ring.className = `luma-spinner-3d-torus__ring luma-3d-torus__ring luma-spinner-3d-torus__ring--${i + 1}`;
      ring.style.transform = `rotateY(${i * 22.5}deg)`;
      torus.appendChild(ring);
    }

    scene.appendChild(torus);
    root.appendChild(scene);
    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};

