import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const infinityLoader: LoaderDefinition = {
  name: 'infinity',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--infinity luma-loader luma-loader--infinity';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.2s') });
    el.setAttribute('aria-hidden', 'true');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'luma-spinner-loader__infinity-svg luma-loader__infinity-svg');
    svg.setAttribute('viewBox', '0 0 100 50');
    svg.setAttribute('aria-hidden', 'true');

    // Continuous figure-8 lemniscate path
    const pathData = 'M 50,25 C 37.5,10 12.5,10 12.5,25 C 12.5,40 37.5,40 50,25 C 62.5,10 87.5,10 87.5,25 C 87.5,40 62.5,40 50,25 Z';

    // Background track guide
    const track = document.createElementNS(svgNS, 'path');
    track.setAttribute('class', 'luma-spinner-loader__infinity-track luma-loader__infinity-track');
    track.setAttribute('d', pathData);

    // Revolving beam of light along the infinity track
    const beam = document.createElementNS(svgNS, 'path');
    beam.setAttribute('class', 'luma-spinner-loader__infinity-beam luma-loader__infinity-beam');
    beam.setAttribute('d', pathData);
    beam.setAttribute('pathLength', '100');

    svg.appendChild(track);
    svg.appendChild(beam);
    el.appendChild(svg);
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.7s', '1.8s', '1.2s') });
  },
};
