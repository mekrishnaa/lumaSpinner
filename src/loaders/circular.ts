import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const circularLoader: LoaderDefinition = {
  name: 'circular',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--circular luma-loader luma-loader--circular';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '1.0s', '2.2s', '1.4s') });
    el.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '25 25 50 50');
    svg.setAttribute('class', 'luma-spinner-loader__circular-svg luma-loader__circular-svg');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke-width', '4');
    circle.setAttribute('stroke-miterlimit', '10');
    circle.setAttribute('class', 'luma-spinner-loader__circular-path luma-loader__circular-path');

    svg.appendChild(circle);
    el.appendChild(svg);
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1.0s', '2.2s', '1.4s') });
  },
};
