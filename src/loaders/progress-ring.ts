import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.8s';
    case 'slow': return '2s';
    default: return '1.2s';
  }
}

const CIRCUMFERENCE = 132; // 2 * Math.PI * 21 ~= 131.95

export const progressRingLoader: LoaderDefinition = {
  name: 'progress-ring',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const container = document.createElement('div');
    container.className = 'luma-spinner-loader luma-spinner-loader--progress-ring luma-loader luma-loader--progress-ring';
    setLoaderStyles(container, { size, color: options.color, speed: getSpeed(options.speed) });
    container.setAttribute('aria-hidden', 'true');

    const isDeterminate = options.progress !== undefined && options.progress >= 0;
    const pct = isDeterminate ? Math.max(0, Math.min(100, options.progress)) : 0;

    // SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 50 50');
    svg.setAttribute('class', `luma-spinner-progress-ring__svg luma-progress-ring__svg ${
      isDeterminate
        ? 'luma-spinner-progress-ring__svg--determinate luma-progress-ring__svg--determinate'
        : 'luma-spinner-progress-ring__svg--indeterminate luma-progress-ring__svg--indeterminate'
    }`);

    // Track circle
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('cx', '25');
    track.setAttribute('cy', '25');
    track.setAttribute('r', '21');
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke-width', '4');
    track.setAttribute('class', 'luma-spinner-progress-ring__track luma-progress-ring__track');
    svg.appendChild(track);

    // Active progress arc circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '25');
    circle.setAttribute('cy', '25');
    circle.setAttribute('r', '21');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke-width', '4');
    circle.setAttribute('stroke-linecap', 'round');
    circle.setAttribute('stroke-dasharray', `${CIRCUMFERENCE}`);
    circle.setAttribute('class', `luma-spinner-progress-ring__circle luma-progress-ring__circle ${
      isDeterminate
        ? 'luma-spinner-progress-ring__circle--determinate luma-progress-ring__circle--determinate'
        : 'luma-spinner-progress-ring__circle--indeterminate luma-progress-ring__circle--indeterminate'
    }`);

    if (isDeterminate) {
      const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
      circle.style.strokeDashoffset = `${offset}`;
    }

    svg.appendChild(circle);
    container.appendChild(svg);

    // Center percentage text
    if (options.showProgressText || isDeterminate) {
      const text = document.createElement('div');
      text.className = 'luma-spinner-progress-ring__text luma-progress-ring__text luma-spinner-progress__text luma-progress__text';
      text.textContent = isDeterminate ? `${Math.round(pct)}%` : '0%';
      container.appendChild(text);
    }

    return container;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });

    if (options.progress !== undefined && options.progress >= 0) {
      const pct = Math.max(0, Math.min(100, options.progress));
      const circle = element.querySelector<SVGCircleElement>('.luma-spinner-progress-ring__circle, .luma-progress-ring__circle');
      if (circle) {
        const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
        circle.style.strokeDashoffset = `${offset}`;
        circle.classList.remove('luma-spinner-progress-ring__circle--indeterminate', 'luma-progress-ring__circle--indeterminate');
      }
      const svg = element.querySelector<SVGElement>('.luma-spinner-progress-ring__svg, .luma-progress-ring__svg');
      if (svg) {
        svg.classList.remove('luma-spinner-progress-ring__svg--indeterminate', 'luma-progress-ring__svg--indeterminate');
      }
      const text = element.querySelector<HTMLElement>('.luma-spinner-progress-ring__text, .luma-progress-ring__text');
      if (text) {
        text.textContent = `${Math.round(pct)}%`;
      }
    }
  },
};

