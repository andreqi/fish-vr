// @flow

import type Boid from '../actors/Boid.js';

const Finder = require('./Finder.js');

// TODO: share the type between BucketFinder and BoidsWithMovement
type Environment = {
  active_neighbor_radius: number,
  separation_weight: number,
  alignment_weight: number,
  surface_weight: number,
  cohesion_weight: number,
};

function isNeighbor(a: Boid, b: Boid, r: number): boolean {
  return !a.equals(b) &&
    a.getMesh().position.distanceTo(b.getMesh().position) < r;
}

function scale(x, r): number {
  return Math.floor(x / r);
}

function getKey({x, y, z}): number {
  return x * 7901 + 7907 * y + 7919 * z;
}

class NaiveFinder extends Finder {
  _cache: Map<number, Array<Boid>>;
  _env: Environment;

  constructor(boids: Array<Boid>, env: Environment) {
    super(boids);
    const models = boids;
    this._env = env;
    this._cache = new Map();
    for (let idx = 0; idx < models.length; idx++) {
      const model = models[idx];
      const {position} = model.getMesh();
      const key = getKey({
        x: scale(position.x, env.active_neighbor_radius),
        y: scale(position.y, env.active_neighbor_radius),
        z: scale(position.z, env.active_neighbor_radius),
      });
      const list = this._cache.get(key) || [];
      list.push(model);
      this._cache.set(key, list);
    }
  }

  findNeighbors(boid: Boid, r: number): Array<Boid> {
    const model = boid;
    const {position} = model.getMesh();
    const env = this._env;
    const scaled = {
      x: scale(position.x, env.active_neighbor_radius),
      y: scale(position.y, env.active_neighbor_radius),
      z: scale(position.z, env.active_neighbor_radius),
    };
    const neighbors = [];
    let empty = 0;
    for (let idx = -1; idx <= 1; idx++) {
      for (let idy = -1; idy <= 1; idy++) {
        for (let idz = -1; idz <= 1; idz++) {
          const key = getKey({
            x: scaled.x + idx,
            y: scaled.y + idy,
            z: scaled.z + idz,
          });
          const potentialNeighbors = this._cache.get(key) || [];
          for (let it = 0; it < potentialNeighbors.length; it++) {
            const p = potentialNeighbors[it];
            if (isNeighbor(model, p, env.active_neighbor_radius)) {
              neighbors.push(p);
            }
          }
        }
      }
    }
    return neighbors;
  }
}

module.exports = NaiveFinder;
