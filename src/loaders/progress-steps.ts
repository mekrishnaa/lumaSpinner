import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



const STEP_COUNT = 5;

export const progressStepsLoader: LoaderDefinition = {
  name: 'progress-steps',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const container = document.createElement('div');
    container.className = 'luma-spinner-loader luma-spinner-loader--progress-steps luma-loader luma-loader--progress-steps';
    setLoaderStyles(container, { size, color: options.color, speed: getSpeed(options.speed, '0.8s', '2s', '1.2s') });
    container.setAttribute('aria-hidden', 'true');

    const track = document.createElement('div');
    track.className = 'luma-spinner-progress-steps__track luma-progress-steps__track';

    const isDeterminate = options.progress !== undefined && options.progress >= 0;
    const pct = isDeterminate ? Math.max(0, Math.min(100, options.progress)) : 0;

    for (let i = 0; i < STEP_COUNT; i++) {
      const step = document.createElement('div');
      step.className = 'luma-spinner-progress-steps__step luma-progress-steps__step';

      if (isDeterminate) {
        const stepThreshold = ((i + 1) / STEP_COUNT) * 100;
        const prevThreshold = (i / STEP_COUNT) * 100;
        if (pct >= stepThreshold) {
          step.style.opacity = '1';
          step.classList.add('luma-spinner-progress-steps__step--filled', 'luma-progress-steps__step--filled');
        } else if (pct > prevThreshold) {
          const ratio = (pct - prevThreshold) / (100 / STEP_COUNT);
          step.style.opacity = `${0.3 + 0.7 * ratio}`;
          step.classList.add('luma-spinner-progress-steps__step--active', 'luma-progress-steps__step--active');
        } else {
          step.style.opacity = '0.2';
        }
      } else {
        step.classList.add('luma-spinner-progress-steps__step--indeterminate', 'luma-progress-steps__step--indeterminate');
        step.style.animationDelay = `${i * 0.15}s`;
      }

      track.appendChild(step);
    }

    container.appendChild(track);

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
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '0.8s', '2s', '1.2s') });

    if (options.progress !== undefined && options.progress >= 0) {
      const pct = Math.max(0, Math.min(100, options.progress));
      const steps = element.querySelectorAll<HTMLElement>('.luma-spinner-progress-steps__step, .luma-progress-steps__step');
      steps.forEach((step, i) => {
        step.classList.remove('luma-spinner-progress-steps__step--indeterminate', 'luma-progress-steps__step--indeterminate');
        const stepThreshold = ((i + 1) / STEP_COUNT) * 100;
        const prevThreshold = (i / STEP_COUNT) * 100;
        if (pct >= stepThreshold) {
          step.style.opacity = '1';
          step.classList.add('luma-spinner-progress-steps__step--filled', 'luma-progress-steps__step--filled');
          step.classList.remove('luma-spinner-progress-steps__step--active', 'luma-progress-steps__step--active');
        } else if (pct > prevThreshold) {
          const ratio = (pct - prevThreshold) / (100 / STEP_COUNT);
          step.style.opacity = `${0.3 + 0.7 * ratio}`;
          step.classList.add('luma-spinner-progress-steps__step--active', 'luma-progress-steps__step--active');
          step.classList.remove('luma-spinner-progress-steps__step--filled', 'luma-progress-steps__step--filled');
        } else {
          step.style.opacity = '0.2';
          step.classList.remove(
            'luma-spinner-progress-steps__step--filled',
            'luma-progress-steps__step--filled',
            'luma-spinner-progress-steps__step--active',
            'luma-progress-steps__step--active'
          );
        }
      });
      const text = element.querySelector<HTMLElement>('.luma-spinner-progress__text, .luma-progress__text');
      if (text) {
        text.textContent = `${Math.round(pct)}%`;
      }
    }
  },
};

