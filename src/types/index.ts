export type SpinnerScope = 'page' | 'container' | 'inline';

export type LoaderType =
  | 'ring'
  | 'dots'
  | 'pulse'
  | 'bars'
  | 'wave'
  | 'orbit'
  | 'square'
  | 'skeleton'
  | 'dual-ring'
  | 'ripple'
  | 'cube-grid'
  | 'roller'
  | 'fading-circle'
  | 'chasing-dots'
  | 'hourglass'
  | 'heart'
  | 'infinity'
  | 'dna'
  | 'wandering-cubes'
  | 'folding-cube'
  | 'circle'
  | 'circular'
  | 'atom'
  | 'pacman'
  | 'clock'
  | 'rotating-plane'
  | 'newton-cradle'
  | 'hash'
  | 'interactive'
  | 'bubble-pop'
  | 'counter-ring'
  | 'concentric-rings'
  | 'dual-ring-reverse'
  | 'progress-bar'
  | 'progress'
  | 'linear-progress'
  | 'progress-ring'
  | 'circular-progress'
  | 'ring-progress'
  | 'progress-steps'
  | 'steps'
  | 'stepped-progress'
  | 'fidget-spinner'
  | 'fidget'
  | 'spin-fidget'
  | 'pong'
  | 'mini-pong'
  | 'bounce-game'
  | 'tap-burst'
  | 'click-blaster'
  | 'energy-orb'
  | '3d-cube'
  | 'cube-3d'
  | 'cube3d'
  | '3d-sphere'
  | 'sphere-3d'
  | 'sphere3d'
  | '3d-helix'
  | 'helix-3d'
  | 'helix3d'
  | '3d-pyramid'
  | 'pyramid-3d'
  | 'pyramid3d'
  | '3d-torus'
  | 'torus-3d'
  | 'torus3d';

export type SpinnerSize = 'small' | 'medium' | 'large' | number;

export type SpinnerTheme = 'light' | 'dark' | 'auto';

export type TextPosition = 'top' | 'right' | 'bottom' | 'left';

export type SpinnerPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';

export type SpinnerSpeed = 'fast' | 'normal' | 'slow';

export type SpinnerState = 'idle' | 'loading' | 'success' | 'error';

export type SkeletonVariant =
  | 'line'
  | 'circle'
  | 'rectangle'
  | 'avatar'
  | 'card'
  | 'list'
  | 'table'
  | 'profile';

export interface SkeletonOptions {
  variant?: SkeletonVariant;
  rows?: number;
  lines?: number;
  avatar?: boolean;
  shimmer?: boolean;
  gap?: number;
  element?: HTMLElement;
}

export interface AnimationOptions {
  duration?: number;
  timingFunction?: string;
  iterationCount?: string | number;
  direction?: string;
}

export interface OverlayOptions {
  enabled?: boolean;
  color?: string;
}

export interface SpinnerOptions {
  id?: string;
  type?: LoaderType;
  scope?: SpinnerScope;
  container?: string | HTMLElement;
  size?: SpinnerSize;
  color?: string;
  text?: string;
  textColor?: string;
  textPosition?: TextPosition;
  theme?: SpinnerTheme;
  speed?: SpinnerSpeed;
  overlay?: boolean | string | OverlayOptions;
  overlayColor?: string;
  preventInteraction?: boolean;
  position?: SpinnerPosition;
  delay?: number;
  duration?: number;
  minDuration?: number;
  animation?: AnimationOptions;
  skeleton?: SkeletonOptions;
  zIndex?: number;
  nonce?: string;
  injectStyles?: boolean;
  progress?: number;
  showProgressText?: boolean;
}

export interface SpinnerInstance {
  readonly id: string;
  readonly type: LoaderType;
  readonly scope: SpinnerScope;
  readonly element: HTMLElement;
  readonly container?: HTMLElement;
  state: SpinnerState;
  readonly options: ResolvedSpinnerOptions;
  readonly createdAt: number;
}

export interface GlobalConfig {
  type?: LoaderType;
  scope?: SpinnerScope;
  size?: SpinnerSize;
  speed?: SpinnerSpeed;
  theme?: SpinnerTheme;
  color?: string;
  text?: string;
  textColor?: string;
  textPosition?: TextPosition;
  position?: SpinnerPosition;
  overlay?: boolean | string | OverlayOptions;
  overlayColor?: string;
  preventInteraction?: boolean;
  delay?: number;
  duration?: number;
  minDuration?: number;
  zIndex?: number;
  nonce?: string;
  injectStyles?: boolean;
  progress?: number;
  showProgressText?: boolean;
  debug?: boolean;
}

export interface LoaderDefinition {
  name: string;
  create(options: ResolvedSpinnerOptions): HTMLElement;
  update?(element: HTMLElement, options: ResolvedSpinnerOptions): void;
  destroy?(element: HTMLElement): void;
  styles?: string;
}

export interface ResolvedSpinnerOptions extends Required<Omit<SpinnerOptions, 'container'>> {
  container: HTMLElement | null;
}

export type SpinnerEvent = 'start' | 'stop' | 'update' | 'destroy' | 'success' | 'error';

export interface SpinnerEventData {
  id: string;
  instance?: SpinnerInstance;
  message?: string;
}

export type SpinnerEventCallback = (data: SpinnerEventData) => void;

export interface SpinnerManager {
  start(options?: SpinnerOptions): string;
  stop(id?: string): void;
  update(id: string, options: Partial<SpinnerOptions>): void;
  setText(id: string, text: string): void;
  setType(id: string, type: LoaderType): void;
  setProgress(idOrValue: string | number, value?: number): void;
  success(idOrMessage?: string, message?: string): void;
  error(idOrMessage?: string, message?: string): void;
  destroy(id: string): void;
  stopAll(): void;
  destroyAll(): void;
  isActive(id: string): boolean;
  active(): SpinnerInstance[];
  wrap<T>(id: string, operation: () => Promise<T>, options?: SpinnerOptions): Promise<T>;
  configure(config: GlobalConfig): void;
  registerLoader(name: string, definition: LoaderDefinition): void;
  on(event: SpinnerEvent, callback: SpinnerEventCallback): () => void;
}

