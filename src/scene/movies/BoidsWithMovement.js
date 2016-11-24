// @flow

import type {TorusType} from '../actors/generateTorus.js';
import type {ParticlesType} from '../actors/generateParticles.js';
import type {LightType} from '../actors/LightType.js';
import type {ThreeMesh} from '../actors/ThreeTypes.js';
import type Finder from '../finders/Finder.js';

const Boid = require('../actors/Boid.js');
const FishTorus = require('../actors/FishTorus.js');
const NaiveFinder = require('../finders/NaiveFinder.js');

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

type Environment = {
  active_neighbor_radius: number,
  separation_weight: number,
  alignment_weight: number,
  surface_weight: number,
  cohesion_weight: number,
};

type State = {
  actors: AvailableActors,
  environment: Environment,
};

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
  for (let idx = 0; idx < 2000; idx++) {
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

function setup(_: any, deps: Environment): State {
  const actors: AvailableActors = {
    boids: generateBoids(),
    ambientLight: {
      object: new three.AmbientLight(0xaaaaaa)
    },
    directionalLight: generateDirectionalLigth(),
  };

  return {
    actors,
    environment: deps,
  };
}


function update(t: number, {actors, environment}: State): void {
  const {models} = actors.boids;
  flocking(models, new NaiveFinder(models), environment);
  for (let idx = 0; idx < models.length; idx++) {
    models[idx].move();
  }
}

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

function optimizedFlocking(models: Array<Boid>, env: Environment): void {
  const cache = new Map();
  for (let idx = 0; idx < models.length; idx++) {
    const model = models[idx];
    const {position} = model.getMesh();
    const key = getKey({
      x: scale(position.x, env.active_neighbor_radius),
      y: scale(position.y, env.active_neighbor_radius),
      z: scale(position.z, env.active_neighbor_radius),
    });
    const list = cache.get(key) || [];
    list.push(model);
    cache.set(key, list);
  }

  for (let idx = 0; idx < models.length; idx++) {
    const model = models[idx];
    const {position} = model.getMesh();
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
          // if (neighbors.length > 50) continue;
          const key = getKey({
            x: scaled.x + idx,
            y: scaled.y + idy,
            z: scaled.z + idz,
          });
          const potentialNeighbors = cache.get(key) || [];
          for (let it = 0; it < potentialNeighbors.length; it++) {
            const p = potentialNeighbors[it];
            if (isNeighbor(model, p, env.active_neighbor_radius)) {
              neighbors.push(p);
            }
          }
        }
      }
    }
    applyFlocking(model, neighbors, env);
  }
}

function flocking(
  models: Array<Boid>,
  finder: Finder,
  env: Environment,
): void {
  for (let idx = 0; idx < models.length; idx++) {
    const neighbors = finder.findNeighbors(
      models[idx],
      env.active_neighbor_radius,
    );
    applyFlocking(models[idx], neighbors, env);
  }
}

function applyFlocking(
  active: Boid,
  neighbors: Array<Boid>,
  {
    alignment_weight,
    cohesion_weight,
    separation_weight,
    surface_weight,
  }: Environment,
): void {
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
    alignment.add(boid.getDirection());
    separation.add(buffer);
    cohesion.add(neighborPos);
  }

  const surface = new three.Vector3(0, 0, 0).add(activePos);
  surface.multiplyScalar(-1.0/surface_weight);
  cohesion.multiplyScalar(-1.0/(neighbors.length + 1)).add(activePos).multiplyScalar(-1.0);
  separation.multiplyScalar(1.0/separation_weight);
  cohesion.multiplyScalar(1.0/cohesion_weight);
  alignment.multiplyScalar(1.0/alignment_weight);
  active.updateFromVector(
    separation.add(cohesion).add(alignment).add(surface),
  );
}

const BoidsInTorus = {
  setup,
  update,
};

module.exports = BoidsInTorus;
