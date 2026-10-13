export { spinner } from './core/spinner-manager.js';
export { registerLoader, getRegisteredLoaderNames } from './loaders/loader-registry.js';
export { setConfig as configure, getConfig, resetConfig } from './core/configuration.js';
export { ensureStylesInjected } from './styles/injector.js';

export type {
  SpinnerOptions,
  SpinnerScope,
  LoaderType,
  SpinnerSize,
  SpinnerTheme,
  TextPosition,
  SpinnerPosition,
  SpinnerSpeed,
  SpinnerState,
  SpinnerInstance,
  SkeletonOptions,
  SkeletonVariant,
  AnimationOptions,
  OverlayOptions,
  GlobalConfig,
  LoaderDefinition,
  ResolvedSpinnerOptions,
  SpinnerManager,
  SpinnerEvent,
  SpinnerEventCallback,
  SpinnerEventData,
} from './types/index.js';

