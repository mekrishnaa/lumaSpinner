export function getSpeed(speed: string, fast = '0.8s', slow = '1.8s', normal = '1.2s'): string {
  if (speed === 'fast') return fast;
  if (speed === 'slow') return slow;
  return normal;
}

