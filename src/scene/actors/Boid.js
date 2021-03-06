// @flow

import type {ThreeMesh, ThreeVector3} from './ThreeTypes.js';

const three = require('three');

const KEYS = {
  MOVE: ' ',
  DIR_UP: 'w',
  DIR_DOWN: 's',
  DIR_LEFT: 'a',
  DIR_RIGHT: 'd',
};

const ANGLE = Math.PI / 256;

const ROTATION_MAP = {
  [KEYS.DIR_LEFT]: {x: ANGLE, y: 0, z: 0},
  [KEYS.DIR_RIGHT]: {x: -ANGLE, y: 0, z: 0},
  [KEYS.DIR_UP]: {x: 0, y: +ANGLE, z: 0},
  [KEYS.DIR_DOWN]: {x: 0, y: -ANGLE, z: 0},
};

type Point = {
  x: number,
  y: number,
  z: number,
};

let CNT = 10;

class Boid {
  _mesh: ThreeMesh;
  _key: number;
  constructor(
    position: Point = {x: 0, y: 0, z: 0},
    rotation: Point = {x: 0, y: 0, z: 0},
  ) {
    this._key = CNT++;
    const material = new three.MeshPhongMaterial({
      color: 0xFFFFcc,
      shading: three.SmoothShading,
    });
    const geo = new three.CylinderGeometry(0, .2, 1, 3);

    geo.applyMatrix(
      new three.Matrix4()
        .makeRotationZ(Math.PI/2)
    );

    geo.applyMatrix(
      new three.Matrix4()
        .makeRotationY(Math.PI/2)
    );

    this._mesh = new three.Mesh(geo, material);
    this._mesh.position.set(position.x, position.y, position.z);
    ['x', 'y', 'z'].forEach(
      dim => this._mesh.rotation[dim] = rotation[dim],
    );
  }

  getMesh(): ThreeMesh {
    return this._mesh;
  }

  equals(boid: Boid): boolean {
    return this._key === boid._key;
  }

  updateFromKeyboard(keyboard: {[key: string]: boolean}): void {
    Object.keys(ROTATION_MAP)
      .filter(label => keyboard[label])
      .forEach(key => this._rotateBoid(ROTATION_MAP[key]));

    if (keyboard[KEYS.MOVE]) {
      this.move();
    }
  }

  getDirection(): ThreeVector3 {
    const origDirection = new three.Vector3(0, 0, 1);
    return origDirection.applyQuaternion(this._mesh.quaternion);
  }

  updateFromVector(vector: ThreeVector3): void {
    const worldDirection = this.getDirection();
    this._mesh.lookAt(
      vector.add(worldDirection).add(this._mesh.position)
    );
  }

  _rotateBoid({x, y, z}: {x: number, y: number, z: number}): void {
    this._mesh.rotation.x += x;
    this._mesh.rotation.y += y;
    this._mesh.rotation.z += z;
  }

  move(): void {
    const {position} = this._mesh;
    const velocity = 1 / 10.0;
    const direction = this.getDirection();
    position.x += velocity * direction.x;
    position.y += velocity * direction.y;
    position.z += velocity * direction.z;
  }
}

module.exports = Boid;
