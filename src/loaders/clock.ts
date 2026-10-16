import { getSpeed } from '../utils/speed.js';
import type { LoaderDefinition, ResolvedSpinnerOptions } from '../types/index.js';
import { getSizeValue } from '../utils/size.js';
import { setLoaderStyles } from '../utils/css-props.js';



export const clockLoader: LoaderDefinition = {
  name: 'clock',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const size = getSizeValue(options.size);
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--clock luma-loader luma-loader--clock';
    setLoaderStyles(el, { size, color: options.color, speed: getSpeed(options.speed, '1s', '3s', '2s') });
    el.setAttribute('aria-hidden', 'true');

    // Hour hand
    const hourHand = document.createElement('div');
    hourHand.className = 'luma-spinner-loader__clock-hand luma-spinner-loader__clock-hand--hour luma-loader__clock-hand luma-loader__clock-hand--hour';

    // Minute hand
    const minuteHand = document.createElement('div');
    minuteHand.className = 'luma-spinner-loader__clock-hand luma-spinner-loader__clock-hand--minute luma-loader__clock-hand luma-loader__clock-hand--minute';

    // Center pin
    const pin = document.createElement('div');
    pin.className = 'luma-spinner-loader__clock-pin luma-loader__clock-pin';

    el.appendChild(hourHand);
    el.appendChild(minuteHand);
    el.appendChild(pin);
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    const size = getSizeValue(options.size);
    setLoaderStyles(element, { size, color: options.color, speed: getSpeed(options.speed, '1s', '3s', '2s') });
  },
};
