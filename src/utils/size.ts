import type { SpinnerSize } from '../types/index.js';

export function getSizeValue(size: SpinnerSize): number {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'small': return 20;
    case 'medium': return 36;
    case 'large': return 56;
    default: return 36;
  }
}

export function getSizeClass(size: SpinnerSize): string {
  if (typeof size === 'number') return 'luma-spinner--custom-size';
  return `luma-spinner--${size}`;
}

