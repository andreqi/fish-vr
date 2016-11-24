// @flow

import type Boid from '../actors/Boid.js';

class Finder {
  _boids: Array<Boid>;
  constructor(boids: Array<Boid>) {
    this._boids = boids;
  }

  findNeighbors(boid: Boid, r: number): Array<Boid> {
    throw new Error('implement this method pls');
  }
}

module.exports = Finder;
