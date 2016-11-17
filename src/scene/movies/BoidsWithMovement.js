// @flow

import type {TorusType} from '../actors/generateTorus.js';
import type {ParticlesType} from '../actors/generateParticles.js';
import type {LightType} from '../actors/LightType.js';
import type {ThreeMesh} from '../actors/ThreeTypes.js';

const Boid = require('../actors/Boid.js');
const FishTorus = require('../actors/FishTorus.js');

const three = require('three');

const generateParticles = require('../actors/generateParticles.js');
const generateDirectionalLigth = require('../actors/generateDirectionalLigth.js');

type AvailableActors = {
//  sphere: {object: ThreeMesh},
  boids: {
    object: ThreeMesh,
    models: Array<Boid>,
  },
  ambientLight: LightType,
  directionalLight: LightType,
};

type State = {
  actors: AvailableActors,
  environment: {min_time: number, rotation: {x: number, y: number, z:number}},
}

function getRandomRotation(): {x: number, y: number, z: number} {
  return {
    x: 2 * Math.PI * Math.random(),
    y: 2 * Math.PI * Math.random(),
    z: 2 * Math.PI * Math.random(),
  };
}

function generateBoids(): {object: ThreeMesh, models: Array<Boid>} {
  const models: Array<Boid> = [];
  const object = new three.Object3D();
  for (let idx = 0; idx < 1500; idx++) {
    models.push(
      new Boid(
        FishTorus.getRandomPoint(),
        getRandomRotation(),
      ),
    );
  }
  models.forEach(model => object.add(model.getMesh()));
  return {
    object,
    models,
  };
}

function generateSphere(): {object: ThreeMesh} {
  const geometry = new three.SphereGeometry(35, 32, 32);
  const material = new three.MeshPhongMaterial({
    color: 0xFFFFcc,
    wireframe: true,
  });
  return {object: new three.Mesh(geometry, material)}
}

function setup(): State {
  const actors: AvailableActors = {
    // sphere: generateSphere(),
    boids: generateBoids(),
    ambientLight: {
      object: new three.AmbientLight(0xaaaaaa)
    },
    directionalLight: generateDirectionalLigth(),
  };

  return {
    actors,
    environment: {
      min_time: 0,
      rotation: {x: 0, y: 0, z: 0},
    },
  };
}

const ACTIVE_NEIGHBOR_RADIUS = 5;
const SEPARATION_WEIGHT = 90;
const ALIGHTMENT_WEIGHT = 250;
const SURFACE_WEIGHT = 1900;
const COHESION_WEIGHT = 6;

function update(t: number, {actors, environment}: State): void {
  const {models} = actors.boids;
  optimizedFlocking(models);
  models.forEach(model => model.move());
}

function isNeighbor(a: Boid, b: Boid): boolean {
  return !a.equals(b) &&
    a.getMesh().position.distanceTo(
      b.getMesh().position
    ) < ACTIVE_NEIGHBOR_RADIUS;
}

function scale(x): number {
  return Math.floor(x / ACTIVE_NEIGHBOR_RADIUS);
}

function getKey({x, y, z}): number {
  return x * 7901 + 7907 * y + 7919 * z;
}

function optimizedFlocking(models: Array<Boid>): void {
  const cache = new Map();
  for (let idx = 0; idx < models.length; idx++) {
    const model = models[idx];
    const {position} = model.getMesh();
    const key = getKey({
      x: scale(position.x),
      y: scale(position.y),
      z: scale(position.z),
    });
    const list = cache.get(key) || [];
    list.push(model);
    cache.set(key, list);
  }

  for (let idx = 0; idx < models.length; idx++) {
    const model = models[idx];
    const {position} = model.getMesh();
    const scaled = {
      x: scale(position.x),
      y: scale(position.y),
      z: scale(position.z),
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
          const potentialNeighbors = cache.get(key) || [];
          for (let it = 0; it < potentialNeighbors.length; it++) {
            const p = potentialNeighbors[it];
            if (isNeighbor(model, p)) {
              neighbors.push(p);
            }
          }
        }
      }
    }
    applyFlocking(model, neighbors);
  }
}

function naiveFlocking(models: Array<Boid>): void {
  for (let idx = 0; idx < models.length; idx++) {
    const neighbors = [];
    const activePos = models[idx].getMesh().position;
    for (let idy = 0; idy < models.length; idy++) {
      if (idx === idy) {
        continue;
      }
      const neighborPos = models[idy].getMesh().position;
      const distance = neighborPos.distanceTo(activePos);
      if (distance < ACTIVE_NEIGHBOR_RADIUS) {
        neighbors.push(models[idy]);
      }
    }
    applyFlocking(models[idx], neighbors);
  }
}

function applyFlocking(active: Boid, neighbors: Array<Boid>): void {
  if (!neighbors.length) {
    return;
  }

  const activePos = active.getMesh().position;
  const separation = new three.Vector3(0, 0, 0);
  const cohesion = new three.Vector3(0, 0, 0).add(activePos);
  const alignment = new three.Vector3(0, 0, 0);
  for (let idx = 0; idx < neighbors.length; idx++) {
    const boid = neighbors[idx];
    const buffer = new three.Vector3(0, 0, 0);
    const neighborPos = boid.getMesh().position;
    buffer.add(neighborPos).multiplyScalar(-1).add(activePos);
    alignment.add(boid.getMesh().getWorldDirection());
    separation.add(buffer);
    cohesion.add(neighborPos);
  }

  const surface = new three.Vector3(0, 0, 0).add(activePos);
  surface.multiplyScalar(-1.0/SURFACE_WEIGHT);
  cohesion.multiplyScalar(-1.0/(neighbors.length + 1)).add(activePos).multiplyScalar(-1.0);
  separation.multiplyScalar(1.0/SEPARATION_WEIGHT);
  cohesion.multiplyScalar(1.0/COHESION_WEIGHT);
  alignment.multiplyScalar(1.0/ALIGHTMENT_WEIGHT);
  active.updateFromVector(
    separation.add(cohesion).add(alignment).add(surface),
  );
}

const BoidsInTorus = {
  setup,
  update,
};

module.exports = BoidsInTorus;
