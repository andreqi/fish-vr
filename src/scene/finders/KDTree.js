// @flow

import type Boid from '../actors/Boid.js';

const Finder = require('./Finder.js');

type Node = {
  boid: Boid,
  left: ?Node,
  right: ?Node,
};

const nodes: Array<Node> = [];
let nodeIndex = 0;

function getNewNode(boid: Boid): Node {
  if (nodeIndex >= nodes.length) {
    nodeIndex++;
    const node = {
      boid,
      left: null,
      right: null,
    };
    nodes.push(node);
    return node;
  }
  const node = nodes[nodeIndex];
  node.boid = boid;
  node.left = null;
  node.right = null;
  nodeIndex++;
  return node;
}

const X_INDEX = 0;
const Y_INDEX = 1;
const Z_INDEX = 2;

function getCoord(
  position: {x: number, y: number, z: number},
  index: number,
): number {
  switch(index) {
    case X_INDEX:
      return position.x;
    case Y_INDEX:
      return position.y;
    case Z_INDEX:
      return position.z;
  }
  throw 'coordinate out of range';
}

function getCoordFromBoid(boid: Boid, index: number): number {
  const {position} = boid.getMesh();
  return getCoord(position, index);
}

function lessThan(a: Boid, b: Boid, cnt: number): boolean {
  return getCoordFromBoid(a, cnt) < getCoordFromBoid(b, cnt);
}

function insert(root: ?Node, boid: Boid, cnt: number): Node {
  if (!root) {
    return getNewNode(boid);
  }
  if (lessThan(boid, root.boid, cnt)) {
    root.left = insert(root.left, boid, (cnt + 1) % 3);
    return root;
  }
  root.right = insert(root.right, boid, (cnt + 1) % 3);
  return root;
};

type Boundary = {
  top: {x: number, y: number, z: number},
  bottom: {x: number, y: number, z: number},
};

function insideRange(lo: number, hi: number, q: number): boolean {
  return lo <= q && q <= hi;
}

function inside(node: Node, boundary: Boundary): boolean {
  const {position} = node.boid.getMesh();
  return (
    insideRange(boundary.bottom.x, boundary.top.x, position.x) &&
    insideRange(boundary.bottom.y, boundary.top.y, position.y) &&
    insideRange(boundary.bottom.z, boundary.top.z, position.z)
  );
}

function findInBoundary(
  root: ?Node,
  boundary: Boundary,
  cnt: number,
  acum: Array<Boid>,
): void {
  if (!root) {
    return;
  }

  if (inside(root, boundary)) {
    acum.push(root.boid);
  }

  const lo = getCoord(boundary.bottom, cnt);
  const hi = getCoord(boundary.bottom, cnt);
  const q = getCoordFromBoid(root.boid, cnt);
  const nextCnt = (cnt + 1) % 3;

  if (q < lo) {
    findInBoundary(root.right, boundary, nextCnt, acum);
    return;
  } if (q > hi) {
    findInBoundary(root.left, boundary, nextCnt, acum);
    return;
  }

  findInBoundary(root.left, boundary, nextCnt, acum);
  findInBoundary(root.right, boundary, nextCnt, acum);
}

function randomInt(n: number): number {
  return Math.floor(Math.random() * n);
}

class KDTree extends Finder {
  _root: ?Node;

  constructor(boids: Array<Boid>) {
    super(boids);
    this._root = undefined;
    nodeIndex = 0;
    for (let idx = 0; idx < boids.length; idx++) {
      const index = randomInt(boids.length - idx);
      const a = boids[boids.length - 1 - idx];
      const b = boids[index];
      this._root = insert(this._root, b, 0);
      boids[index] = a;
      boids[boids.length - 1 - idx] = b;
    }
  }

  findNeighbors(boid: Boid, r: number): Array<Boid> {
    const acum = [];
    const {position} = boid.getMesh();
    findInBoundary(
      this._root,
      {
        top: {x: position.x + r/2, y: position.y + r/2, z: position.z + r/2},
        bottom: {x: position.x - r/2, y: position.y - r/2, z: position.z - r/2},
      },
      0,
      acum,
    );

    return acum;
  }
}

module.exports = KDTree;
