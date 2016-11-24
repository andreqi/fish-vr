// @flow

import type Boid from '../actors/Boid.js';

const Finder = require('./Finder.js');

class NaiveFinder extends Finder {
  findNeighbors(boid: Boid, r: number): Array<Boid> {
    const neighbors = [];
    const models = this._boids;
    const activePos = boid.getMesh().position;
    for (let idy = 0; idy < models.length; idy++) {
      if (boid.equals(models[idy])) {
        continue;
      }
      const neighborPos = models[idy].getMesh().position;
      const distance = neighborPos.distanceTo(activePos);
      if (distance < r) {
        neighbors.push(models[idy]);
      }
    }
    return neighbors;
  }
}

module.exports = NaiveFinder;
