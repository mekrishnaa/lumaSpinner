/**
 * Utility to set CSS custom properties with both --luma-spinner-* and legacy --luma-* prefixes.
 */
export function setLoaderStyles(
  el: HTMLElement,
  props: {
    size?: number;
    color?: string;
    speed?: string;
    dotSize?: number;
    extra?: Record<string, string>;
  }
): void {
  if (props.size !== undefined) {
    el.style.setProperty('--luma-spinner-loader-size', `${props.size}px`);
    el.style.setProperty('--luma-loader-size', `${props.size}px`);
  }
  if (props.color !== undefined) {
    el.style.setProperty('--luma-spinner-color', props.color);
    el.style.setProperty('--luma-color', props.color);
  }
  if (props.speed !== undefined) {
    el.style.setProperty('--luma-spinner-speed', props.speed);
    el.style.setProperty('--luma-speed', props.speed);
  }
  if (props.dotSize !== undefined) {
    el.style.setProperty('--luma-spinner-dot-size', `${props.dotSize}px`);
    el.style.setProperty('--luma-dot-size', `${props.dotSize}px`);
  }
  if (props.extra) {
    for (const [k, v] of Object.entries(props.extra)) {
      const prefixed = k.startsWith('--luma-') ? k.replace('--luma-', '--luma-spinner-') : `--luma-spinner-${k}`;
      el.style.setProperty(prefixed, v);
      el.style.setProperty(k, v);
    }
  }
}

