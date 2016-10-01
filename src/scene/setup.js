// @flow

import type Scenario from '../Scenario.js';
import type {TorusType} from './actors/generateTorus.js';
import type {ParticlesType} from './actors/generateParticles.js';
import type {LightType} from './actors/LightType.js';

const three = require('three');

const generateTorus = require('./actors/generateTorus.js');
const generateParticles = require('./actors/generateParticles.js');
const generateDirectionalLigth = require('./actors/generateDirectionalLigth.js');

export type AvailableActors = {
  torus: TorusType,
  particles: ParticlesType,
  ambientLight: LightType,
  directionalLight: LightType,
};

function setup(scenario: Scenario): AvailableActors {
  const actors: AvailableActors = {
    torus: generateTorus(),
    particles: generateParticles(),
    ambientLight: {
      object: new three.AmbientLight(0xaaaaaa)
    },
    directionalLight: generateDirectionalLigth(),
  };

  Object.keys(actors).forEach(key => {
    scenario.scene.add(actors[key].object);
    console.log(`Adding ${key} to the scene`);
  });
  return actors;
}

module.exports = setup;
