import type { SpinnerInstance } from '../types/index.js';

let idCounter = 0;

export function generateId(): string {
  return `luma-${++idCounter}`;
}

const registry = new Map<string, SpinnerInstance>();

export function register(instance: SpinnerInstance): void {
  if (registry.has(instance.id)) {
    throw new Error(`[LumaSpinner] Spinner with ID "${instance.id}" already exists. Use spinner.update() to modify it or spinner.stop() before creating a new one.`);
  }
  registry.set(instance.id, instance);
}

export function lookup(id: string): SpinnerInstance | undefined {
  return registry.get(id);
}

export function remove(id: string): boolean {
  return registry.delete(id);
}

export function exists(id: string): boolean {
  return registry.has(id);
}

export function list(): SpinnerInstance[] {
  return Array.from(registry.values());
}

export function clear(): void {
  registry.clear();
}

export function size(): number {
  return registry.size;
}

