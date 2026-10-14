import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '1.2s';
    case 'slow': return '3.2s';
    default: return '2s';
  }
}

export const helix3dLoader: LoaderDefinition = {
  name: '3d-helix',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--3d-helix luma-loader luma-loader--3d-helix';
    setLoaderStyles(root, { size, color: options.color, speed: getSpeed(options.speed) });
    root.setAttribute('aria-hidden', 'true');

    const scene = document.createElement('div');
    scene.className = 'luma-spinner-3d-helix__scene luma-3d-helix__scene';

    const strand = document.createElement('div');
    strand.className = 'luma-spinner-3d-helix__strand luma-3d-helix__strand';

    // 8 3D particle nodes spiraling in cylindrical space
    for (let i = 0; i < 8; i++) {
      const node = document.createElement('div');
      node.className = `luma-spinner-3d-helix__node luma-3d-helix__node luma-spinner-3d-helix__node--${i + 1}`;
      node.style.setProperty('--node-idx', `${i}`);
      strand.appendChild(node);
    }

    scene.appendChild(strand);
    root.appendChild(scene);
    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};

