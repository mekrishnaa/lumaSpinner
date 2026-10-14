import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spinner } from '../src/core/spinner-manager.js';
import { clear } from '../src/core/spinner-registry.js';

describe('3D Spinners (3d-cube, 3d-sphere, 3d-helix, 3d-pyramid, 3d-torus)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    clear();
  });

  afterEach(() => {
    spinner.destroyAll();
    document.body.innerHTML = '';
  });

  describe('3d-cube', () => {
    it('mounts with 3d-scene, 3d-box, and 6 perspective faces', () => {
      const id = spinner.start({
        id: 'test-cube3d',
        type: '3d-cube',
        scope: 'inline',
        color: '#6366f1',
      });

      const root = document.querySelector('.luma-spinner-loader--3d-cube');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--3d-cube')).toBe(true);

      const scene = root?.querySelector('.luma-spinner-3d-cube__scene');
      expect(scene).toBeTruthy();

      const box = scene?.querySelector('.luma-spinner-3d-cube__box');
      expect(box).toBeTruthy();

      const faces = box?.querySelectorAll('.luma-spinner-3d-cube__face');
      expect(faces?.length).toBe(6);

      spinner.stop(id);
    });

    it('supports aliases "cube-3d" and "cube3d"', () => {
      const id1 = spinner.start({ id: 'c3d-1', type: 'cube-3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-cube')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 'c3d-2', type: 'cube3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-cube')).toBeTruthy();
      spinner.stop(id2);
    });
  });

  describe('3d-sphere', () => {
    it('mounts with 3d-globe, 4 orbital rings, and glowing core', () => {
      const id = spinner.start({
        id: 'test-sphere3d',
        type: '3d-sphere',
        scope: 'inline',
        color: '#3b82f6',
      });

      const root = document.querySelector('.luma-spinner-loader--3d-sphere');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--3d-sphere')).toBe(true);

      const rings = root?.querySelectorAll('.luma-spinner-3d-sphere__ring');
      expect(rings?.length).toBe(4);

      const core = root?.querySelector('.luma-spinner-3d-sphere__core');
      expect(core).toBeTruthy();

      spinner.stop(id);
    });

    it('supports aliases "sphere-3d" and "sphere3d"', () => {
      const id1 = spinner.start({ id: 's3d-1', type: 'sphere-3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-sphere')).toBeTruthy();
      spinner.stop(id1);

      const id2 = spinner.start({ id: 's3d-2', type: 'sphere3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-sphere')).toBeTruthy();
      spinner.stop(id2);
    });
  });

  describe('3d-helix', () => {
    it('mounts with 3d-strand and 8 spatial nodes', () => {
      const id = spinner.start({
        id: 'test-helix3d',
        type: '3d-helix',
        scope: 'inline',
        color: '#10b981',
      });

      const root = document.querySelector('.luma-spinner-loader--3d-helix');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--3d-helix')).toBe(true);

      const nodes = root?.querySelectorAll('.luma-spinner-3d-helix__node');
      expect(nodes?.length).toBe(8);

      spinner.stop(id);
    });

    it('supports aliases "helix-3d" and "helix3d"', () => {
      const id = spinner.start({ id: 'h3d-1', type: 'helix-3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-helix')).toBeTruthy();
      spinner.stop(id);
    });
  });

  describe('3d-pyramid', () => {
    it('mounts with 3d-shape and 5 faces (4 triangular sides + 1 base)', () => {
      const id = spinner.start({
        id: 'test-pyramid3d',
        type: '3d-pyramid',
        scope: 'inline',
        color: '#f59e0b',
      });

      const root = document.querySelector('.luma-spinner-loader--3d-pyramid');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--3d-pyramid')).toBe(true);

      const faces = root?.querySelectorAll('.luma-spinner-3d-pyramid__face');
      expect(faces?.length).toBe(5);

      spinner.stop(id);
    });

    it('supports aliases "pyramid-3d" and "pyramid3d"', () => {
      const id = spinner.start({ id: 'p3d-1', type: 'pyramid-3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-pyramid')).toBeTruthy();
      spinner.stop(id);
    });
  });

  describe('3d-torus', () => {
    it('mounts with 3d-donut and 8 radial cross-section rings', () => {
      const id = spinner.start({
        id: 'test-torus3d',
        type: '3d-torus',
        scope: 'inline',
        color: '#ec4899',
      });

      const root = document.querySelector('.luma-spinner-loader--3d-torus');
      expect(root).toBeTruthy();
      expect(root?.classList.contains('luma-loader--3d-torus')).toBe(true);

      const rings = root?.querySelectorAll('.luma-spinner-3d-torus__ring');
      expect(rings?.length).toBe(8);

      spinner.stop(id);
    });

    it('supports aliases "torus-3d" and "torus3d"', () => {
      const id = spinner.start({ id: 't3d-1', type: 'torus-3d', scope: 'inline' });
      expect(document.querySelector('.luma-spinner-loader--3d-torus')).toBeTruthy();
      spinner.stop(id);
    });
  });
});
