import type { SpinnerInstance, SpinnerOptions, SpinnerState, ResolvedSpinnerOptions } from '../types/index.js';
import { getConfig } from './configuration.js';

export function resolveOptions(options: SpinnerOptions, id: string): ResolvedSpinnerOptions {
  const global = getConfig();

  let container: HTMLElement | null = null;
  if (options.container) {
    if (typeof options.container === 'string') {
      container = document.querySelector<HTMLElement>(options.container);
      if (!container) {
        throw new Error(`[LumaSpinner] Container not found: "${options.container}"`);
      }
    } else {
      container = options.container;
    }
  }

  const resolved: ResolvedSpinnerOptions = {
    id,
    type: options.type ?? global.type ?? 'ring',
    scope: options.scope ?? (container ? 'container' : global.scope ?? 'page'),
    container,
    size: options.size ?? global.size ?? 'medium',
    color: options.color ?? global.color ?? 'currentColor',
    text: options.text ?? global.text ?? '',
    textColor: options.textColor ?? global.textColor ?? '',
    textPosition: options.textPosition ?? global.textPosition ?? 'bottom',
    theme: options.theme ?? global.theme ?? 'auto',
    speed: options.speed ?? global.speed ?? 'normal',
    overlay: options.overlay ?? (options.overlayColor ? true : global.overlay ?? false),
    overlayColor:
      options.overlayColor ??
      (typeof options.overlay === 'string'
        ? options.overlay
        : typeof options.overlay === 'object' && options.overlay !== null
        ? options.overlay.color ?? ''
        : global.overlayColor ?? ''),
    preventInteraction: options.preventInteraction ?? global.preventInteraction ?? false,
    position: options.position ?? global.position ?? 'center',
    delay: options.delay ?? global.delay ?? 0,
    duration: options.duration ?? global.duration ?? 0,
    minDuration: options.minDuration ?? global.minDuration ?? 0,
    animation: options.animation ?? {},
    skeleton: options.skeleton ?? {},
    zIndex: options.zIndex ?? global.zIndex ?? (container ? 10 : 9999),
    nonce: options.nonce ?? global.nonce ?? '',
    injectStyles: options.injectStyles ?? global.injectStyles ?? true,
    progress: options.progress ?? global.progress ?? -1,
    showProgressText: options.showProgressText ?? global.showProgressText ?? false,
  };

  return resolved;
}

export function createInstance(
  id: string,
  element: HTMLElement,
  options: ResolvedSpinnerOptions
): SpinnerInstance {
  return {
    id,
    type: options.type,
    scope: options.scope,
    element,
    container: options.container ?? undefined,
    state: 'loading' as SpinnerState,
    options,
    createdAt: Date.now(),
  };
}

