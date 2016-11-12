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

function setup(): AvailableActors {
  const actors: AvailableActors = {
    torus: generateTorus(),
    particles: generateParticles(),
    ambientLight: {
      object: new three.AmbientLight(0xaaaaaa)
    },
    directionalLight: generateDirectionalLigth(),
  };
  return actors;
}


let MIN_TIME = 0;
const SMOOTH_TIME = 5.0;
let ROTATIONS = {
  x: 0,
  y: 0,
  z: 0,
};

function rotateBoids(t: number, {particles}: AvailableActors): void {
  if (t > MIN_TIME) {
    ROTATIONS = {
      x: (0.5 - Math.random()),
      y: (0.5 - Math.random()),
      z: (0.5 - Math.random()),
    }
    MIN_TIME += SMOOTH_TIME;
  }
  const coordinates = ['x', 'y', 'z'];
  particles.particles.children.forEach(boid =>
    coordinates.forEach(dim => boid.rotation[dim] += ROTATIONS[dim] / 50)
  );
}

const BoidsInTorus = {
  setup,
  update: rotateBoids,
};

module.exports = BoidsInTorus;
