import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const cube3dLoader: LoaderDefinition = {
  name: '3d-cube',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const root = document.createElement('div');
    root.className = 'luma-spinner-loader luma-spinner-loader--3d-cube luma-loader luma-loader--3d-cube';
    setLoaderStyles(root, { size, color: options.color, speed: getSpeed(options.speed, '1.5s', '4s', '2.6s') });
    root.setAttribute('aria-hidden', 'true');

    // 3D Perspective Scene
    const scene = document.createElement('div');
    scene.className = 'luma-spinner-3d-cube__scene luma-3d-cube__scene';

    // 3D Cube Container
    const cube = document.createElement('div');
    cube.className = 'luma-spinner-3d-cube__box luma-3d-cube__box';

    // 6 Faces
    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    for (const face of faces) {
      const faceEl = document.createElement('div');
      faceEl.className = `luma-spinner-3d-cube__face luma-3d-cube__face luma-spinner-3d-cube__face--${face} luma-3d-cube__face--${face}`;
      cube.appendChild(faceEl);
    }

    scene.appendChild(cube);
    root.appendChild(scene);
    return root;
  },

  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.5s', '4s', '2.6s') });
  },
};

