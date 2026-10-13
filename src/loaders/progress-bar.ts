import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '1s';
    case 'slow': return '2.5s';
    default: return '1.6s';
  }
}

export const progressBarLoader: LoaderDefinition = {
  name: 'progress-bar',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const container = document.createElement('div');
    container.className = 'luma-spinner-loader luma-spinner-loader--progress-bar luma-loader luma-loader--progress-bar';
    setLoaderStyles(container, { size, color: options.color, speed: getSpeed(options.speed) });
    container.setAttribute('aria-hidden', 'true');

    // Progress Track
    const track = document.createElement('div');
    track.className = 'luma-spinner-progress__track luma-progress__track';

    // Active Fill
    const fill = document.createElement('div');
    const isDeterminate = options.progress !== undefined && options.progress >= 0;
    const pct = isDeterminate ? Math.max(0, Math.min(100, options.progress)) : 0;

    fill.className = `luma-spinner-progress__fill luma-progress__fill ${
      isDeterminate
        ? 'luma-spinner-progress__fill--determinate luma-progress__fill--determinate'
        : 'luma-spinner-progress__fill--indeterminate luma-progress__fill--indeterminate'
    }`;
    if (isDeterminate) {
      fill.style.width = `${pct}%`;
    }

    // Sheen glossy shimmer
    const sheen = document.createElement('div');
    sheen.className = 'luma-spinner-progress__sheen luma-progress__sheen';
    fill.appendChild(sheen);

    track.appendChild(fill);
    container.appendChild(track);

    // Percentage text
    if (options.showProgressText || isDeterminate) {
      const text = document.createElement('div');
      text.className = 'luma-spinner-progress__text luma-progress__text';
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
      const fill = element.querySelector<HTMLElement>('.luma-spinner-progress__fill, .luma-progress__fill');
      if (fill) {
        fill.style.width = `${pct}%`;
        fill.classList.remove('luma-spinner-progress__fill--indeterminate', 'luma-progress__fill--indeterminate');
        fill.classList.add('luma-spinner-progress__fill--determinate', 'luma-progress__fill--determinate');
      }
      const text = element.querySelector<HTMLElement>('.luma-spinner-progress__text, .luma-progress__text');
      if (text) {
        text.textContent = `${Math.round(pct)}%`;
      }
    }
  },
};

