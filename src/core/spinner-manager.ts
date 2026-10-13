import type {
  SpinnerOptions,
  SpinnerInstance,
  GlobalConfig,
  LoaderType,
  SpinnerEvent,
  SpinnerEventCallback,
  SpinnerEventData,
  ResolvedSpinnerOptions,
  LoaderDefinition,
} from '../types/index.js';
import { generateId, register, lookup, remove, exists, list, clear } from './spinner-registry.js';
import { resolveOptions, createInstance } from './spinner-instance.js';
import { mountSpinner, unmountSpinner, updateSpinnerElement } from './spinner-lifecycle.js';
import { setConfig, getConfig, resetConfig, log, warn } from './configuration.js';
import { registerLoader } from '../loaders/loader-registry.js';

type EventListeners = Map<SpinnerEvent, Set<SpinnerEventCallback>>;

class SpinnerManager {
  private listeners: EventListeners = new Map();
  private delayTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private minDurationTimers: Map<string, number> = new Map();
  private autoDismissTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  start(options: SpinnerOptions = {}): string {
    const id = options.id ?? generateId();

    if (exists(id)) {
      throw new Error(
        `[LumaSpinner] Spinner with ID "${id}" already exists. Call spinner.stop("${id}") first or use spinner.update("${id}", ...).`
      );
    }

    const resolved = resolveOptions(options, id);

    if (resolved.delay && resolved.delay > 0) {
      const timer = setTimeout(() => {
        this.delayTimers.delete(id);
        if (exists(id)) remove(id);
        this._doMount(id, resolved);
      }, resolved.delay);
      this.delayTimers.set(id, timer);
      // Register a placeholder so duplicate-ID check works
      const placeholder = this._createPlaceholder(id, resolved);
      register(placeholder);
      return id;
    }

    this._doMount(id, resolved);
    return id;
  }

  private _doMount(id: string, resolved: ResolvedSpinnerOptions): void {
    const element = mountSpinner(id, resolved);
    const instance = createInstance(id, element, resolved);
    register(instance);
    if (resolved.minDuration > 0) {
      this.minDurationTimers.set(id, Date.now());
    }
    if (resolved.duration > 0) {
      const dismissTimer = setTimeout(() => {
        this.autoDismissTimers.delete(id);
        if (this.isActive(id)) {
          this.stop(id);
        }
      }, resolved.duration);
      this.autoDismissTimers.set(id, dismissTimer);
    }
    this._emit('start', { id, instance });
  }

  private _createPlaceholder(id: string, resolved: ResolvedSpinnerOptions): SpinnerInstance {
    return {
      id,
      type: resolved.type,
      scope: resolved.scope,
      element: document.createElement('div'),
      container: resolved.container ?? undefined,
      state: 'loading',
      options: resolved,
      createdAt: Date.now(),
    };
  }

  stop(id?: string): void {
    const targetId = id ?? this._getDefaultId();
    if (!targetId) {
      warn('stop() called with no active spinner to stop');
      return;
    }

    // Cancel pending delay timer
    const timer = this.delayTimers.get(targetId);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.delayTimers.delete(targetId);
      remove(targetId);
      return;
    }

    const instance = lookup(targetId);
    if (!instance) {
      warn(`stop(): No active spinner found with ID "${targetId}"`);
      return;
    }

    const minStart = this.minDurationTimers.get(targetId);
    if (minStart !== undefined) {
      const elapsed = Date.now() - minStart;
      const remaining = instance.options.minDuration - elapsed;
      if (remaining > 0) {
        setTimeout(() => this._doStop(targetId), remaining);
        return;
      }
      this.minDurationTimers.delete(targetId);
    }

    this._doStop(targetId);
  }

  private _doStop(id: string): void {
    const autoTimer = this.autoDismissTimers.get(id);
    if (autoTimer !== undefined) {
      clearTimeout(autoTimer);
      this.autoDismissTimers.delete(id);
    }
    const instance = lookup(id);
    if (!instance) return;
    unmountSpinner(instance);
    remove(id);
    this._emit('stop', { id, instance });
  }

  update(idOrOptions: string | Partial<SpinnerOptions>, options?: Partial<SpinnerOptions>): void {
    let targetId: string | undefined;
    let resolvedOpts: Partial<SpinnerOptions>;

    if (typeof idOrOptions === 'string') {
      targetId = idOrOptions;
      resolvedOpts = options ?? {};
    } else {
      resolvedOpts = idOrOptions ?? {};
      targetId = resolvedOpts.id ?? this._getDefaultId();
    }

    if (!targetId) {
      warn('update() called with no active spinner to update');
      return;
    }
    const instance = lookup(targetId);
    if (!instance) {
      warn(`update(): No active spinner found with ID "${targetId}"`);
      return;
    }
    updateSpinnerElement(instance, resolvedOpts as Partial<ResolvedSpinnerOptions>);
    Object.assign(instance.options, resolvedOpts);
    this._emit('update', { id: targetId, instance });
    log(`Updated: ${targetId}`);
  }

  setText(idOrText: string, text?: string): void {
    if (text === undefined) {
      const targetId = this._getDefaultId();
      if (!targetId) {
        warn('setText(): No active spinner found');
        return;
      }
      this.update(targetId, { text: idOrText });
    } else {
      this.update(idOrText, { text });
    }
  }

  setType(idOrType: string | LoaderType, type?: LoaderType): void {
    let targetId: string | undefined;
    let targetType: LoaderType;

    if (type === undefined) {
      targetId = this._getDefaultId();
      targetType = idOrType as LoaderType;
    } else {
      targetId = idOrType;
      targetType = type;
    }

    if (!targetId) {
      warn('setType(): No active spinner found');
      return;
    }
    const instance = lookup(targetId);
    if (!instance) {
      warn(`setType(): No active spinner found with ID "${targetId}"`);
      return;
    }
    const currentOptions = { ...instance.options, type: targetType, id: targetId };
    this._doStop(targetId);
    this._doMount(targetId, currentOptions as ResolvedSpinnerOptions);
  }

  setProgress(idOrValue: string | number, value?: number): void {
    let targetId: string | undefined;
    let targetVal: number;

    if (typeof idOrValue === 'number') {
      targetId = this._getDefaultId();
      targetVal = idOrValue;
    } else {
      targetId = idOrValue;
      targetVal = value ?? 0;
    }

    if (!targetId) {
      warn('setProgress(): No active spinner found');
      return;
    }
    const instance = lookup(targetId);
    if (!instance) {
      warn(`setProgress(): No active spinner found with ID "${targetId}"`);
      return;
    }
    const pct = Math.max(0, Math.min(100, targetVal));

    // 1. Linear progress bar fill
    const progressEl = instance.element.querySelector<HTMLElement>('.luma-spinner-progress__fill, .luma-progress__fill');
    if (progressEl) {
      progressEl.style.width = `${pct}%`;
      progressEl.classList.remove('luma-spinner-progress__fill--indeterminate', 'luma-progress__fill--indeterminate');
      progressEl.classList.add('luma-spinner-progress__fill--determinate', 'luma-progress__fill--determinate');
    }

    // 2. Circular progress ring
    const ringCircle = instance.element.querySelector<SVGCircleElement>('.luma-spinner-progress-ring__circle, .luma-progress-ring__circle');
    if (ringCircle) {
      const radius = parseFloat(ringCircle.getAttribute('r') || '21');
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (pct / 100) * circumference;
      ringCircle.style.strokeDashoffset = `${offset}`;
      ringCircle.classList.remove('luma-spinner-progress-ring__circle--indeterminate', 'luma-progress-ring__circle--indeterminate');
      ringCircle.classList.add('luma-spinner-progress-ring__circle--determinate', 'luma-progress-ring__circle--determinate');

      const ringSvg = instance.element.querySelector<SVGElement>('.luma-spinner-progress-ring__svg, .luma-progress-ring__svg');
      if (ringSvg) {
        ringSvg.classList.remove('luma-spinner-progress-ring__svg--indeterminate', 'luma-progress-ring__svg--indeterminate');
        ringSvg.classList.add('luma-spinner-progress-ring__svg--determinate', 'luma-progress-ring__svg--determinate');
      }
    }

    // 3. Segmented steps
    const stepEls = instance.element.querySelectorAll<HTMLElement>('.luma-spinner-progress-steps__step, .luma-progress-steps__step');
    if (stepEls.length > 0) {
      const totalSteps = stepEls.length;
      stepEls.forEach((step, idx) => {
        step.classList.remove('luma-spinner-progress-steps__step--indeterminate', 'luma-progress-steps__step--indeterminate');
        const stepThreshold = ((idx + 1) / totalSteps) * 100;
        const prevThreshold = (idx / totalSteps) * 100;
        if (pct >= stepThreshold) {
          step.style.opacity = '1';
          step.classList.add('luma-spinner-progress-steps__step--filled', 'luma-progress-steps__step--filled');
          step.classList.remove('luma-spinner-progress-steps__step--active', 'luma-progress-steps__step--active');
        } else if (pct > prevThreshold) {
          const ratio = (pct - prevThreshold) / (100 / totalSteps);
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
    }

    // 4. Update percentage text display
    const textEls = instance.element.querySelectorAll<HTMLElement>(
      '.luma-spinner-progress__text, .luma-progress__text, .luma-spinner-progress-ring__text, .luma-progress-ring__text'
    );
    textEls.forEach((el) => {
      el.textContent = `${Math.round(pct)}%`;
    });

    log(`Progress: ${targetId} = ${pct}%`);
  }

  success(idOrMessage?: string, message?: string): void {
    let targetId: string | undefined;
    let targetMsg: string | undefined;

    if (message !== undefined) {
      targetId = idOrMessage;
      targetMsg = message;
    } else if (idOrMessage && exists(idOrMessage)) {
      targetId = idOrMessage;
      targetMsg = undefined;
    } else {
      targetId = this._getDefaultId();
      targetMsg = idOrMessage;
    }

    if (!targetId) {
      warn('success(): No active spinner found');
      return;
    }
    const instance = lookup(targetId);
    if (!instance) {
      warn(`success(): No active spinner found with ID "${targetId}"`);
      return;
    }
    instance.state = 'success';
    instance.element.classList.add('luma-spinner--success');
    if (targetMsg) {
      const textEl = instance.element.querySelector<HTMLElement>('.luma-spinner__text');
      if (textEl) textEl.textContent = targetMsg;
      const srEl = instance.element.querySelector<HTMLElement>('.luma-sr-only');
      if (srEl) srEl.textContent = targetMsg;
    }
    this._emit('success', { id: targetId, instance, message: targetMsg });
    setTimeout(() => this._doStop(targetId), 800);
  }

  error(idOrMessage?: string, message?: string): void {
    let targetId: string | undefined;
    let targetMsg: string | undefined;

    if (message !== undefined) {
      targetId = idOrMessage;
      targetMsg = message;
    } else if (idOrMessage && exists(idOrMessage)) {
      targetId = idOrMessage;
      targetMsg = undefined;
    } else {
      targetId = this._getDefaultId();
      targetMsg = idOrMessage;
    }

    if (!targetId) {
      warn('error(): No active spinner found');
      return;
    }
    const instance = lookup(targetId);
    if (!instance) {
      warn(`error(): No active spinner found with ID "${targetId}"`);
      return;
    }
    instance.state = 'error';
    instance.element.classList.add('luma-spinner--error');
    if (targetMsg) {
      const textEl = instance.element.querySelector<HTMLElement>('.luma-spinner__text');
      if (textEl) textEl.textContent = targetMsg;
      const srEl = instance.element.querySelector<HTMLElement>('.luma-sr-only');
      if (srEl) srEl.textContent = targetMsg;
    }
    this._emit('error', { id: targetId, instance, message: targetMsg });
    setTimeout(() => this._doStop(targetId), 1500);
  }

  destroy(id?: string): void {
    const targetId = id ?? this._getDefaultId();
    if (!targetId) {
      warn('destroy(): No active spinner found');
      return;
    }
    this._doStop(targetId);
    this._emit('destroy', { id: targetId });
    log(`Destroyed: ${targetId}`);
  }

  stopAll(): void {
    const all = list();
    for (const instance of all) {
      this._doStop(instance.id);
    }
    this.delayTimers.forEach((t) => clearTimeout(t));
    this.delayTimers.clear();
    this.autoDismissTimers.forEach((t) => clearTimeout(t));
    this.autoDismissTimers.clear();
  }

  destroyAll(): void {
    this.stopAll();
    clear();
    log('Destroyed all');
  }

  isActive(id: string): boolean {
    return exists(id);
  }

  active(): SpinnerInstance[] {
    return list();
  }

  async wrap<T>(
    idOrOperation: string | (() => Promise<T>),
    operationOrOptions?: (() => Promise<T>) | SpinnerOptions,
    options: SpinnerOptions = {}
  ): Promise<T> {
    let id: string;
    let op: () => Promise<T>;
    let opts: SpinnerOptions;

    if (typeof idOrOperation === 'function') {
      id = (operationOrOptions as SpinnerOptions)?.id ?? generateId();
      op = idOrOperation;
      opts = (operationOrOptions as SpinnerOptions) ?? {};
    } else {
      id = idOrOperation;
      op = operationOrOptions as () => Promise<T>;
      opts = options;
    }

    this.start({ ...opts, id });
    try {
      const result = await op();
      return result;
    } finally {
      this.stop(id);
    }
  }

  configure(config: GlobalConfig): void {
    setConfig(config);
  }

  getConfig(): Required<GlobalConfig> {
    return getConfig();
  }

  resetConfig(): void {
    resetConfig();
  }

  registerLoader(name: string, definition: LoaderDefinition): void {
    registerLoader(name, definition);
  }

  on(event: SpinnerEvent, callback: SpinnerEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  private _getDefaultId(): string | undefined {
    const all = list();
    if (all.length > 0) return all[all.length - 1].id;
    return undefined;
  }

  private _emit(event: SpinnerEvent, data: SpinnerEventData): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach((cb) => {
        try { cb(data); } catch (_e) { /* silent */ }
      });
    }
  }
}

export const spinner = new SpinnerManager();

