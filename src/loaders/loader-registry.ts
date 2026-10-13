import type { LoaderDefinition, LoaderType } from '../types/index.js';
import { ringLoader } from './ring.js';
import { dotsLoader } from './dots.js';
import { pulseLoader } from './pulse.js';
import { barsLoader } from './bars.js';
import { waveLoader } from './wave.js';
import { orbitLoader } from './orbit.js';
import { squareLoader } from './square.js';
import { skeletonLoader } from './skeleton.js';
import { dualRingLoader } from './dual-ring.js';
import { rippleLoader } from './ripple.js';
import { cubeGridLoader } from './cube-grid.js';
import { rollerLoader } from './roller.js';
import { fadingCircleLoader } from './fading-circle.js';
import { chasingDotsLoader } from './chasing-dots.js';
import { hourglassLoader } from './hourglass.js';
import { heartLoader } from './heart.js';
import { infinityLoader } from './infinity.js';
import { dnaLoader } from './dna.js';
import { wanderingCubesLoader } from './wandering-cubes.js';
import { foldingCubeLoader } from './folding-cube.js';
import { circleLoader } from './circle.js';
import { circularLoader } from './circular.js';
import { atomLoader } from './atom.js';
import { pacmanLoader } from './pacman.js';
import { clockLoader } from './clock.js';
import { rotatingPlaneLoader } from './rotating-plane.js';
import { newtonCradleLoader } from './newton-cradle.js';
import { hashLoader } from './hash.js';
import { interactiveLoader } from './interactive.js';
import { counterRingLoader } from './counter-ring.js';
import { progressBarLoader } from './progress-bar.js';
import { progressRingLoader } from './progress-ring.js';
import { progressStepsLoader } from './progress-steps.js';
import { fidgetSpinnerLoader } from './fidget-spinner.js';
import { pongLoader } from './pong.js';
import { tapBurstLoader } from './tap-burst.js';

const loaderRegistry = new Map<string, LoaderDefinition>([
  ['ring', ringLoader],
  ['dots', dotsLoader],
  ['pulse', pulseLoader],
  ['bars', barsLoader],
  ['wave', waveLoader],
  ['orbit', orbitLoader],
  ['square', squareLoader],
  ['skeleton', skeletonLoader],
  ['dual-ring', dualRingLoader],
  ['ripple', rippleLoader],
  ['cube-grid', cubeGridLoader],
  ['roller', rollerLoader],
  ['fading-circle', fadingCircleLoader],
  ['chasing-dots', chasingDotsLoader],
  ['hourglass', hourglassLoader],
  ['heart', heartLoader],
  ['infinity', infinityLoader],
  ['dna', dnaLoader],
  ['wandering-cubes', wanderingCubesLoader],
  ['folding-cube', foldingCubeLoader],
  ['circle', circleLoader],
  ['circular', circularLoader],
  ['atom', atomLoader],
  ['pacman', pacmanLoader],
  ['clock', clockLoader],
  ['rotating-plane', rotatingPlaneLoader],
  ['newton-cradle', newtonCradleLoader],
  ['hash', hashLoader],
  ['interactive', interactiveLoader],
  ['bubble-pop', interactiveLoader],
  ['counter-ring', counterRingLoader],
  ['concentric-rings', counterRingLoader],
  ['dual-ring-reverse', counterRingLoader],
  ['progress-bar', progressBarLoader],
  ['progress', progressBarLoader],
  ['linear-progress', progressBarLoader],
  ['progress-ring', progressRingLoader],
  ['circular-progress', progressRingLoader],
  ['ring-progress', progressRingLoader],
  ['progress-steps', progressStepsLoader],
  ['steps', progressStepsLoader],
  ['stepped-progress', progressStepsLoader],
  ['fidget-spinner', fidgetSpinnerLoader],
  ['fidget', fidgetSpinnerLoader],
  ['spin-fidget', fidgetSpinnerLoader],
  ['pong', pongLoader],
  ['mini-pong', pongLoader],
  ['bounce-game', pongLoader],
  ['tap-burst', tapBurstLoader],
  ['click-blaster', tapBurstLoader],
  ['energy-orb', tapBurstLoader],
]);

export function getLoader(type: LoaderType | string): LoaderDefinition {
  const loader = loaderRegistry.get(type);
  if (!loader) {
    console.warn(`[LumaSpinner] Unknown loader type "${type}", falling back to "ring"`);
    return loaderRegistry.get('ring')!;
  }
  return loader;
}

export function registerLoader(name: string, definition: LoaderDefinition): void {
  loaderRegistry.set(name, definition);
}

export function hasLoader(type: string): boolean {
  return loaderRegistry.has(type);
}

export function getRegisteredLoaderNames(): string[] {
  return Array.from(loaderRegistry.keys());
}

