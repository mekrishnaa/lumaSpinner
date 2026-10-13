import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';

function getSpeed(speed: string): string {
  switch (speed) {
    case 'fast': return '0.5s';
    case 'slow': return '1.2s';
    default: return '0.8s';
  }
}

export const pacmanLoader: LoaderDefinition = {
  name: 'pacman',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--pacman luma-loader luma-loader--pacman';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed) });
    el.setAttribute('aria-hidden', 'true');

    // Pacman head/jaws
    const head = document.createElement('div');
    head.className = 'luma-spinner-loader__pacman-head luma-loader__pacman-head';

    const jawTop = document.createElement('div');
    jawTop.className = 'luma-spinner-loader__pacman-jaw luma-spinner-loader__pacman-jaw--top luma-loader__pacman-jaw luma-loader__pacman-jaw--top';
    const jawBottom = document.createElement('div');
    jawBottom.className = 'luma-spinner-loader__pacman-jaw luma-spinner-loader__pacman-jaw--bottom luma-loader__pacman-jaw luma-loader__pacman-jaw--bottom';
    head.appendChild(jawTop);
    head.appendChild(jawBottom);
    el.appendChild(head);

    // 3 food dots being chomped
    const feed = document.createElement('div');
    feed.className = 'luma-spinner-loader__pacman-feed luma-loader__pacman-feed';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'luma-spinner-loader__pacman-dot luma-loader__pacman-dot';
      dot.style.animationDelay = `${(i * -0.27).toFixed(2)}s`;
      feed.appendChild(dot);
    }
    el.appendChild(feed);

    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed) });
  },
};
