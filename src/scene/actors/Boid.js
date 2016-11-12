// @flow

import type {ThreeMesh} from './ThreeTypes.js';

const three = require('three');

class Boid {
  _mesh: ThreeMesh;
  constructor() {
    const material = new three.MeshPhongMaterial({
      color: 0xFFFFcc,
      shading: three.SmoothShading,
    });
    const geo = new three.CylinderGeometry(0, .2, 1, 3);
    this._mesh = new three.Mesh(geo, material);
    this._mesh.position.set(0, 0, 0);
  }

  getMesh(): ThreeMesh {
    return this._mesh;
  }
}

module.exports = Boid;
