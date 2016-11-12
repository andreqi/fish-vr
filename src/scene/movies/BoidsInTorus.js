// @flow

import type {TorusType} from '../actors/generateTorus.js';
import type {ParticlesType} from '../actors/generateParticles.js';
import type {LightType} from '../actors/LightType.js';

const three = require('three');

const generateTorus = require('../actors/generateTorus.js');
const generateParticles = require('../actors/generateParticles.js');
const generateDirectionalLigth = require('../actors/generateDirectionalLigth.js');

type AvailableActors = {
  torus: TorusType,
  particles: ParticlesType,
  ambientLight: LightType,
  directionalLight: LightType,
};

type State = {
  actors: AvailableActors,
  environment: {min_time: number, rotation: {x: number, y: number, z:number}},
}

function setup(): State {
  const actors: AvailableActors = {
    torus: generateTorus(),
    particles: generateParticles(),
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

function rotateBoids(t: number, {actors, environment}: State): void {
  const smooth_time = 5.0;

  if (t > environment.min_time) {
    environment.rotation = {
      x: (0.5 - Math.random()),
      y: (0.5 - Math.random()),
      z: (0.5 - Math.random()),
    }
    environment.min_time += smooth_time;
  }
  const coordinates = ['x', 'y', 'z'];
  const {rotation} = environment;
  const {particles} = actors;
  particles.particles.children.forEach(boid =>
    coordinates.forEach(dim => boid.rotation[dim] += rotation[dim] / 50)
  );
}

const BoidsInTorus = {
  setup,
  update: rotateBoids,
};

module.exports = BoidsInTorus;
