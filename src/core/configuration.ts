import type { GlobalConfig } from '../types/index.js';

const DEFAULT_CONFIG: Required<GlobalConfig> = {
  type: 'ring',
  scope: 'page',
  size: 'medium',
  speed: 'normal',
  theme: 'auto',
  color: 'currentColor',
  text: '',
  textColor: '',
  textPosition: 'bottom',
  position: 'center',
  overlay: false,
  overlayColor: '',
  preventInteraction: false,
  delay: 0,
  duration: 0,
  minDuration: 0,
  zIndex: 9999,
  nonce: '',
  injectStyles: true,
  progress: -1,
  showProgressText: false,
  debug: false,
};

let currentConfig: Required<GlobalConfig> = { ...DEFAULT_CONFIG };

export function getConfig(): Required<GlobalConfig> {
  return { ...currentConfig };
}

export function setConfig(config: GlobalConfig): void {
  currentConfig = { ...currentConfig, ...config };
}

export function resetConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isDebug(): boolean {
  return currentConfig.debug;
}

export function log(message: string, ...args: unknown[]): void {
  if (currentConfig.debug) {
    console.log(`[LumaSpinner] ${message}`, ...args);
  }
}

export function warn(message: string, ...args: unknown[]): void {
  if (currentConfig.debug) {
    console.warn(`[LumaSpinner] ${message}`, ...args);
  }
}

